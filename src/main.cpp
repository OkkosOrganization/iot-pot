#include <Arduino.h>
#include <Wire.h>
#include <inttypes.h>
#include <WebServer.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <Preferences.h>
#include <HTTPClient.h>

#include "secrets.h"
#include "globals.h"
#include "led.h"
#include "pump.h"
#include "overflow_sensor.h"
#include "water_level_sensor.h"
#include "soil_ph_moisture_temperature_sensor.h"
#include "soil_moisture_sensor.h"
#include "dht22_sensor.h"
#include "LDR_sensor.h"
#include "html/index.h"

// FUNCTION PROTOTYPES
void initWiFiAp();
void initWebServer();
void initWifiClient();
void handleGetIndex();
void handleGetConnectionStatus();
void handleGetDeviceId();
void handleGetEmail();
void handlePostEmail();
void handlePostRouterCredentials();
void handleGetWateringAmount();
void handlePostWateringAmount();
void handleGetWateringThreshold();
void handlePostWateringThreshold();
void handleGetNotificationTriggers();
void handlePostNotificationTriggers();
void getSensorValues();
void waterPlant();
void publishValuesMqtt();
void publishValuesHttps();
void connectMqtt();
void initMqtt();
void convertValues();
void sendNotifications();
void updateLedStates();
void updateMqttConnectionState();

// PREFERENCES
Preferences preferences;

// UNIQUE DEVICE ID
uint64_t deviceId;
String deviceIdHex;
char deviceIdHexCstring[17];

// WIFI ACCESS POINT AND LOCAL WEB SERVER IP
IPAddress local_IP(192,168,0,1);
IPAddress gateway(192,168,0,1);
IPAddress subnet(255,255,255,0);
WebServer* server;
IPAddress apIP;
WiFiClientSecure wifiClientSecure; 
PubSubClient mqttClient;

// SETUP
void setup() {
  Serial.begin(115200);  
  //while (!Serial){ Serial.println("...");}

  if (!preferences.begin("iot-pot", false)) {
    Serial.println("Failed to initialize preferences");
    return;
  }

  // GET UNIQUE DEVICE ID
  deviceId = ESP.getEfuseMac();
  deviceIdHex = String((uint32_t)(deviceId >> 32), HEX) + String((uint32_t)deviceId, HEX);
  deviceIdHex.toUpperCase();
  deviceIdHex.toCharArray(deviceIdHexCstring, sizeof(deviceIdHexCstring));  

  // CREATE MQTT TOPICS: /device/<deviceId>/<sensorValueName>
  sprintf(soilTemperatureTopic, "/device/%s/soilTemperature/", deviceIdHexCstring);
  sprintf(soilPhTopic, "/device/%s/soilPh/", deviceIdHexCstring);
  sprintf(soilMoistureTopic, "/device/%s/soilMoisture/", deviceIdHexCstring);
  sprintf(airTemperatureTopic, "/device/%s/airTemperature/", deviceIdHexCstring);
  sprintf(airHumidityTopic, "/device/%s/airHumidity/", deviceIdHexCstring);
  sprintf(waterOverflowTopic, "/device/%s/waterOverflow/", deviceIdHexCstring);
  sprintf(waterLevelTopic, "/device/%s/waterLevel/",deviceIdHexCstring);
  sprintf(luminosityTopic, "/device/%s/luminosity/",deviceIdHexCstring);

  // INIT PUMP
  initPump();

  // INIT ANALOG SENSORS
  analogSetAttenuation(ADC_11db);

  // WATER LEVEL
  initWaterLevelSensor();

  // SOIL SENSOR
  initSoilSensor();

  // DHT22
  dht_sensor.begin(); 

  // OVERFLOW
  initOverFlowSensor();

  // LEDS
  initLeds();
  led1.setState(OFF);
  led2.setState(OFF);
  led3.setState(OFF);
  led4.setState(OFF);

  // INITIALIZES THE WIFI IN ACCESS POINT AND CLIENT MODE
  WiFi.mode(WIFI_MODE_APSTA);
  initWifiClient();
  initWiFiAp();
  initWebServer();
}

// THE LOOP
void loop() {
  server->handleClient();   
  getSensorValues();
  updateLedStates();
  waterPlant();
  publishValuesMqtt();
  publishValuesHttps();
  sendNotifications();
  updateMqttConnectionState();
}

// UPDATES THE LED STATES
void updateLedStates(){
  led1.update();
  led2.update();
  led3.update();
  led4.update();  
}

// GETS VALUES FROM SENSORS
void getSensorValues(){
  unsigned long currentMillis = millis();
  if (currentMillis - previousReadMillis >= sensorReadInterval) {
    previousReadMillis = currentMillis;
    getAirTemperatureAndHumidity();
    getLdrSensorValue();
    getOverFlowSensorValue();   

    // USE MODBUS SENSOR IF AVAILABLE
    if(soilSensorAvailable())
      getSoilSensorValues();
    else
      getSoilMoistureValue();

    convertValues();
  }  

  // WATER LEVEL SENSOR NEEDS TO BE CHECKED OFTEN
  getWaterLevel();
}

// CONVERTS SENSOR VALUES TO STRINGS
void convertValues(){
  itoa(soilTemperature, soilTemperatureStr, 10);   
  itoa(soilMoisture, soilMoistureStr, 10);
  itoa(soilPh, soilPhStr, 10);
  itoa(luminosity, luminosityStr, 10);
  itoa(airTemperature, airTemperatureStr, 10);
  itoa(airHumidity, airHumidityStr, 10);
  itoa(waterLevel, waterLevelStr, 10);
  itoa(waterOverflow, waterOverflowStr, 10);
}

// INITIALIZE THE MQTT CONNECTION
void initMqtt() {
  wifiClientSecure.setInsecure();
  mqttClient.setClient(wifiClientSecure);
  mqttClient.setServer(MQTT_BROKER_URL, MQTT_BROKER_PORT);
  connectMqtt();
}

// CONNECTS TO MQTT BROKER
void connectMqtt() {
  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("Connecting to MQTT broker: ");
    Serial.println(MQTT_BROKER_URL);
    if (mqttClient.connect(
      deviceIdHexCstring,  // Client ID
      MQTT_USER,            // Username
      MQTT_PASSWORD,        // Password
      NULL,                 // Will topic
      0,                    // Will QoS
      false,                // Will retain
      NULL,                 // Will message
      true                  // Clean session
    )) {
      Serial.println("MQTT connected!");      
    } else {
      Serial.print("MQTT connection failed, rc= ");
      Serial.println(mqttClient.state());
    } 
  }
}

// UPDATE THE MQTT CONNECTION
void updateMqttConnectionState(){
  if(mqttClient.connected())
    mqttClient.loop();
  else
    connectMqtt();
}

// PUBLISH VALUES TO MQTT TOPICS
void publishValuesMqtt() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMqttMillis >= mqttPublishInterval) {
    previousMqttMillis = currentMillis;
    if (mqttClient.connected())
    {
      // PUBLISH TO EACH TOPIC
      if (mqttClient.publish(soilTemperatureTopic, soilTemperatureStr)) {
        Serial.print(soilTemperatureTopic);
        Serial.println(soilTemperatureStr);
      } else {
        Serial.println("MQTT publish failed");
      }

      if (mqttClient.publish(soilPhTopic, soilPhStr)) {
        Serial.print(soilPhTopic);
        Serial.println(soilPhStr);
      } else {
        Serial.println("MQTT publish failed");
      }  
      
      if (mqttClient.publish(soilMoistureTopic, soilMoistureStr)) {
        Serial.print(soilMoistureTopic);
        Serial.println(soilMoistureStr);
      } else {
        Serial.println("MQTT publish failed");
      }      

      if (mqttClient.publish(airTemperatureTopic, airTemperatureStr)) {
        Serial.print(airTemperatureTopic);
        Serial.println(airTemperatureStr);
      } else {
        Serial.println("MQTT publish failed");
      } 
      
      if (mqttClient.publish(airHumidityTopic, airHumidityStr)) {
        Serial.print(airHumidityTopic);
        Serial.println(airHumidityStr);
      } else {
        Serial.println("MQTT publish failed");
      }  
      
      if (mqttClient.publish(luminosityTopic, luminosityStr)) {
        Serial.print(luminosityTopic);
        Serial.println(luminosityStr);
      } else {
        Serial.println("MQTT publish failed");
      }  
      
      if (mqttClient.publish(waterLevelTopic, waterLevelStr)) {
        Serial.print(waterLevelTopic);
        Serial.println(waterLevelStr);
      } else {
        Serial.println("MQTT publish failed");
      }  
      
      if (mqttClient.publish(waterOverflowTopic, waterOverflowStr)) {
        Serial.print(waterOverflowTopic);
        Serial.println(waterOverflowStr);
      } else {
        Serial.println("MQTT publish failed");
      } 
    }    
  }
}

// SEND VALUES AS HTTPS POST
void publishValuesHttps() {

  unsigned long currentMillis = millis();
  if (currentMillis - previousHttpsMillis >= httpsPublishInterval) {
    previousHttpsMillis = currentMillis;

    JsonDocument doc;
    doc["deviceId"] = deviceIdHex;

    JsonObject data = doc["sensorValues"].to<JsonObject>();
    data["airTemperature"] = airTemperature;
    data["airHumidity"] = airHumidity;
    data["soilTemperature"] = soilTemperature;
    data["soilMoisture"] = soilMoisture;
    data["soilPh"] = soilPh / 10;
    data["luminosity"] = luminosity;
    data["waterLevel"] = waterLevel;
    data["waterOverflow"] = waterOverflow;

    String jsonString;
    serializeJson(doc, jsonString);

    WiFiClientSecure client;
    client.setInsecure();

    HTTPClient https;
    if (https.begin(client, MEASUREMENTS_API_URL)) {
      https.addHeader("Content-Type", "application/json");

      int httpResponseCode = https.POST(jsonString);

      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);

      if (httpResponseCode > 0) {
        String response = https.getString();
        Serial.println("Response:");
        Serial.println(response);
      } else {
        Serial.print("POST error: ");
        Serial.println(https.errorToString(httpResponseCode));
      }

      https.end();
    } else {
      Serial.println("Connection to API failed.");
    }
  }
}

// SEND NOTIFICATIONS
void sendNotifications() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousNotificationMillis >= notificationSendInterval) {
    previousNotificationMillis = currentMillis;
    
    Serial.println("Check notifications:");
    Serial.println(NOTIFICATION_API_URL);
    
    // CHECK IF EMAIL IS SET
    String email = preferences.getString("email", "");
    if (sizeof(email) == 0)
      return;
    
    // GET NOTIFICATION SETTINGS, DEFAULT VALUE = FALSE
    bool smt = preferences.getBool("soil-moisture", false);
    bool wte = preferences.getBool("tank-empty", false);
    bool wo = preferences.getBool("overflow", false);
  
    WiFiClientSecure client;
    client.setInsecure();

    // NOTIFICATION FOR SOIL-MOISTURE
    if (smt == true && soilMoisture < preferences.getInt("threshold") && WiFi.status() == WL_CONNECTED) {

      HTTPClient http;
      http.begin(client, NOTIFICATION_API_URL);
      http.addHeader("Content-Type", "application/json");

      JsonDocument jsonDoc;
      jsonDoc["deviceId"] = deviceIdHex;           
      jsonDoc["email"] = email;                
      jsonDoc["type"] = "soil-moisture";

      String jsonData;
      serializeJson(jsonDoc, jsonData);

      int httpResponseCode = http.POST(jsonData);
      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      http.end(); 
    }
    
    // NOTIFICATION FOR WATER TANK LEVEL
    if(wte == true && waterLevel <= WATER_LEVEL_LOW && WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(client, NOTIFICATION_API_URL);
      http.addHeader("Content-Type", "application/json");

      JsonDocument jsonDoc;
      jsonDoc["deviceId"] = deviceIdHex;           
      jsonDoc["email"] = email;                
      jsonDoc["type"] = "soil-moisture";

      String jsonData;
      serializeJson(jsonDoc, jsonData);

      int httpResponseCode = http.POST(jsonData);
      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
      } 
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      http.end(); 
    }
      
    // NOTIFICATION FOR WATER OVERFLOW
    if(wo == true && waterOverflow == 1 && WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(client, NOTIFICATION_API_URL);
      http.addHeader("Content-Type", "application/json");

      JsonDocument jsonDoc;
      jsonDoc["deviceId"] = deviceIdHex;           
      jsonDoc["email"] = email;                
      jsonDoc["type"] = "soil-moisture";

      String jsonData;
      serializeJson(jsonDoc, jsonData);

      int httpResponseCode = http.POST(jsonData);
      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
      } 
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      http.end(); 
    }      
  }
}

// WATERS THE PLANT
void waterPlant(){

  // MAKE SURE THRESHOLD AND WATER AMOUNT ARE SET
  float wateringThreshold = 0;
  float wateringAmount = 0;
  unsigned int wateringTime = 0;

  if(preferences.isKey("watering-amount"))
    wateringAmount = preferences.getInt("watering-amount");
  else
    return;

  if(preferences.isKey("threshold"))
    wateringThreshold = preferences.getInt("threshold");
  else
    return;    

  // TRANSFORM WATER AMOUNT TO WATERING TIME
  wateringTime = pump.getWateringTime(wateringAmount);   

  // CHECK THAT TIME ELAPSED FROM LAST WATERING IS LARGER THAN WATERING INTERVAL
  unsigned long currentMillis = millis();
  if (currentMillis - previousWateringMillis >= wateringInterval) {
    previousWateringMillis = currentMillis;

    Serial.print("Watering time:");
    Serial.println(wateringTime);
    Serial.print("Watering amount:");
    Serial.println(wateringAmount);  
    Serial.print("Watering threshold:");
    Serial.println(wateringThreshold);    
    Serial.print("Soil moisture:");
    Serial.println(soilMoisture);   
    Serial.print("Water level:");
    Serial.println(waterLevel);       
    
    // CHECK SOIL MOISTURE AND TANK LEVEL
    if (soilMoisture <= wateringThreshold && waterLevel >= WATER_LEVEL_TOO_LOW)
    {
      Serial.println("PUMP ON");
      pump.setState(PUMP_ON);
      pumpStartTime = currentMillis;
    } 
  }

  if(pump.getState() == PUMP_ON) {
    unsigned long currentMillis = millis();

    if(currentMillis - pumpStartTime < wateringTime)    
    {
      //Serial.println("PUMPING");
      //Serial.println(currentMillis);
    }
    else {
      //Serial.println("PUMP OFF");
      //Serial.println(currentMillis);
      pumpStartTime = 0;
      pump.setState(PUMP_OFF);
    }    
  }
}

// INITIALIZES WIFI AP
void initWiFiAp() {
  WiFi.softAPConfig(local_IP, gateway, subnet);
  WiFi.softAP(soft_ap_ssid, soft_ap_password);

  Serial.print("IoT-pot access point IP: ");
  apIP = WiFi.softAPIP();
  Serial.println(apIP);
  Serial.print("Access point SSID: ");
  Serial.println(WiFi.softAPSSID()); 
}

// STARTS THE WEB SERVER
void initWebServer(){

  // BIND SERVER TO AP-IP ONLY
  server = new WebServer(apIP);
  
  // SETUP ROUTES
  server->on("/", HTTP_GET, handleGetIndex);
  server->on("/connection-status", HTTP_GET, handleGetConnectionStatus);
  server->on("/device-id", HTTP_GET, handleGetDeviceId);
  server->on("/router-credentials", HTTP_POST, handlePostRouterCredentials);
  server->on("/email-address", HTTP_POST, handlePostEmail);
  server->on("/email-address", HTTP_GET, handleGetEmail);
  server->on("/watering-amount", HTTP_GET, handleGetWateringAmount);
  server->on("/watering-amount", HTTP_POST, handlePostWateringAmount);  
  server->on("/watering-threshold", HTTP_GET, handleGetWateringThreshold);
  server->on("/watering-threshold", HTTP_POST, handlePostWateringThreshold);   
  server->on("/notification-triggers", HTTP_GET, handleGetNotificationTriggers);
  server->on("/notification-triggers", HTTP_POST, handlePostNotificationTriggers);     
  
  // START SERVER
  server->begin();
  Serial.println("Web server started");
}

// WIFI CLIENT
void initWifiClient(){
  Serial.println("WIFI INIT");
  if (preferences.isKey("ssid") && preferences.isKey("pwd"))
  {
    String ssid = preferences.getString("ssid");
    String pwd = preferences.getString("pwd");
    WiFi.begin(ssid, pwd);  
    int reconnectTries = 0;
    int maxReconnectTries = 10;    
    while (WiFi.status() != WL_CONNECTED)
    {
      led2.setState(YELLOW);     
      if(reconnectTries < maxReconnectTries)
      {      
        Serial.println("Connecting to WiFi..");
        reconnectTries +=1;
        delay(1000);
      }
      else
      {
        Serial.println("Could not connect to WiFi");   
        led2.setState(RED);     
        break;
      }
    }      
    if (WiFi.status() == WL_CONNECTED)
    {
      Serial.print("ESP32 IP on the WiFi network: ");
      Serial.println(WiFi.localIP());
      led2.setState(GREEN);
      initMqtt();
      led1.setState(GREEN);
    }
  }  
  else
  {
    Serial.println("No SSID or password");
    led2.setState(RED);     
  }
}

// WEB SERVER ROUTES
void handleGetIndex() {
  Serial.println("GET /");
  //Serial.println(indexHtmlLen);
  server->sendHeader("Content-Encoding", "gzip");
  server->send_P(200, "text/html", (const char*)indexHtml, indexHtmlLen);
}
void handleGetConnectionStatus() {
  Serial.println("GET /connection-status");
  JsonDocument jsonDoc;
  String jsonString;  
  jsonDoc["connection-status"] = WiFi.status();
  jsonDoc["ip"] = WiFi.localIP();
  jsonDoc["gateway"] = WiFi.gatewayIP();
  jsonDoc["ssid"] = WiFi.SSID();
  serializeJson(jsonDoc, jsonString);
  server->sendHeader("Content-Type", "application/json");
  server->send(200, "application/json", jsonString);
}
void handleGetDeviceId() {
  Serial.println("GET /device-id");
  JsonDocument jsonDoc;
  String jsonString;  
  jsonDoc["device-id"] = deviceIdHex;  
  serializeJson(jsonDoc, jsonString);
  server->sendHeader("Content-Type", "application/json");
  server->send(200, "application/json", jsonString);
}
void handleGetEmail() {
  Serial.println("GET /email-address");
  JsonDocument jsonDoc;
  String jsonString; 
  String email = "";
  if (preferences.isKey("email"))
    email = preferences.getString("email");
  jsonDoc["email"] = email;  
  serializeJson(jsonDoc, jsonString);
  server->sendHeader("Content-Type", "application/json");
  server->send(200, "application/json", jsonString);
}
void handlePostRouterCredentials() {
  Serial.println("POST /router-credentials");
  JsonDocument jsonDoc;
  String jsonString;  
  if (server->hasArg("ssid") && server->hasArg("pwd")) {
    String ssid = server->arg("ssid");
    String pwd = server->arg("pwd");
    Serial.print("POST** ssid:");
    Serial.println(ssid);
    Serial.print("POST** pwd:");
    Serial.println(pwd);    
    preferences.putString("ssid", ssid);
    preferences.putString("pwd", pwd);
    jsonDoc["success"] = "1";

    delay(500);
    initWifiClient();
  }
  else {
    jsonDoc["success"] = "0";
  }

  serializeJson(jsonDoc, jsonString);
  server->sendHeader("Content-Type", "application/json");
  server->send(200, "application/json", jsonString);
}
void handlePostEmail() {
  Serial.println("POST /email-address");
  JsonDocument jsonDoc;
  String jsonString;  
  if (server->hasArg("email")) {
    String email = server->arg("email");    
    Serial.print("POST** email:");
    Serial.println(email);  
    preferences.putString("email", email);
    jsonDoc["success"] = "1";
  }
    else {
    jsonDoc["success"] = "0";
  }
    serializeJson(jsonDoc, jsonString);
  server->sendHeader("Content-Type", "application/json");
  server->send(200, "application/json", jsonString);
}
void handlePostWateringAmount() {
  Serial.println("POST /watering-amount");
  JsonDocument jsonDoc;
  String jsonString;  
  if (server->hasArg("watering-amount")) {
    char wa[4];
    String waString = server->arg("watering-amount");
    waString.toCharArray(wa, sizeof(wa));
    int32_t waInt = atoi(wa);    
    Serial.print("POST** watering-amount:");
    Serial.println(wa);  
    preferences.putInt("watering-amount", waInt);
    jsonDoc["success"] = "1";
  }
  else {
    jsonDoc["success"] = "0";
  }
  serializeJson(jsonDoc, jsonString);
  server->sendHeader("Content-Type", "application/json");
  server->send(200, "application/json", jsonString);
}
void handleGetWateringAmount() {
  Serial.println("GET /watering-amount");
  JsonDocument jsonDoc;
  String jsonString; 
  String wa = "";
  if (preferences.isKey("watering-amount"))
    wa = preferences.getInt("watering-amount");
  jsonDoc["watering-amount"] = wa;  
  serializeJson(jsonDoc, jsonString);
  server->sendHeader("Content-Type", "application/json");
  server->send(200, "application/json", jsonString);
}
void handlePostWateringThreshold() {
  Serial.println("POST /watering-threshold");
  JsonDocument jsonDoc;
  String jsonString;  
  if (server->hasArg("watering-threshold")) {
    char wt[4];
    String wtString = server->arg("watering-threshold");
    wtString.toCharArray(wt, sizeof(wt));
    int32_t wtInt = atoi(wt);    
    Serial.print("POST** watering-threshold current:");
    Serial.println(preferences.getInt("threshold"));  
    
    Serial.print("POST** watering-threshold new:");
    Serial.println(wtInt);  
    preferences.putInt("threshold", wtInt);

    jsonDoc["success"] = "1";
  }
  else {
    jsonDoc["success"] = "0";
  }
  serializeJson(jsonDoc, jsonString);
  server->sendHeader("Content-Type", "application/json");
  server->send(200, "application/json", jsonString);
}
void handleGetWateringThreshold() {
  Serial.println("GET /watering-threshold");
  JsonDocument jsonDoc;
  String jsonString; 
  String wt = "";
  if (preferences.isKey("threshold"))
    wt = preferences.getInt("threshold");
  jsonDoc["watering-threshold"] = wt;  
  serializeJson(jsonDoc, jsonString);
  server->sendHeader("Content-Type", "application/json");
  server->send(200, "application/json", jsonString);
}
void handleGetNotificationTriggers() {
  Serial.println("GET /notification-triggers");
  JsonDocument jsonDoc;
  String jsonString; 
  bool smt = false;
  bool wte = false;
  bool wo = false;
  if (preferences.isKey("soil-moisture"))
    smt = preferences.getBool("soil-moisture");
  if (preferences.isKey("tank-empty"))
    wte = preferences.getBool("tank-empty");
  if (preferences.isKey("overflow"))
    wo = preferences.getBool("overflow");        
  jsonDoc["notification-soil-moisture-threshold"] = smt;
  jsonDoc["notification-water-tank-empty"] = wte;
  jsonDoc["notification-water-overflow"] = wo;  
  serializeJson(jsonDoc, jsonString);
  server->sendHeader("Content-Type", "application/json");
  server->send(200, "application/json", jsonString);
}
void handlePostNotificationTriggers() {
  Serial.println("POST /notification-triggers");
  JsonDocument jsonDoc;
  String jsonString;  

  if (server->hasArg("notification-soil-moisture-threshold") && server->hasArg("notification-water-tank-empty") && server->hasArg("notification-water-overflow")) {
    String smt = server->arg("notification-soil-moisture-threshold");
    String wte = server->arg("notification-water-tank-empty");
    String wo = server->arg("notification-water-overflow");
    bool smtBool = (smt == "true") ? true : false;
    bool wteBool = (wte == "true") ? true : false;
    bool woBool = (wo == "true") ? true : false;
    Serial.println("POST** notification-triggers:");
    Serial.println(smtBool);  
    Serial.println(wteBool);  
    Serial.println(woBool);  
    
    preferences.putBool("soil-moisture", smtBool);
    preferences.putBool("tank-empty", wteBool);
    preferences.putBool("overflow", woBool);

    jsonDoc["success"] = "1";
  }
  else
    jsonDoc["success"] = "0";

  serializeJson(jsonDoc, jsonString);
  server->sendHeader("Content-Type", "application/json");
  server->send(200, "application/json", jsonString);  
}