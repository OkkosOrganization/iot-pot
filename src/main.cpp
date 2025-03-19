#include <Arduino.h>
#include <inttypes.h>
#include "secrets.h"
#include "globals.h"
#include "led.h"
#include "pump.h"
#include "overflow_sensor.h"
#include "water_level_sensor.h"
#include "soil_ph_moisture_temperature_sensor.h"
#include "dht22_sensor.h"
#include "LDR_sensor.h"
#include <WebServer.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include "html/index.h"
#include <Preferences.h>

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

// PREFERENCES
Preferences preferences;

// UNIQUE DEVICE ID
uint64_t deviceId;
String deviceIdHex;

// WIFI ACCESS POINT AND LOCAL WEB SERVER IP
IPAddress local_IP(192,168,0,1);
IPAddress gateway(192,168,0,1);
IPAddress subnet(255,255,255,0);
WebServer* server;
IPAddress apIP;

// INTERVAL FOR SENSOR READINGS
unsigned long previousMillis = 0;
const unsigned long sensorReadInterval = 5000; // 5 seconds

// SETUP
void setup() {
  Serial.begin(115200);  
  while (!Serial){ 
    Serial.println("..."); 
  }  

  if (!preferences.begin("iot-pot", false)) {
    Serial.println("Failed to initialize preferences");
    return;
  }
  
  // INITIALIZES THE WIFI IN ACCESS POINT AND CLIENT MODE
  WiFi.mode(WIFI_MODE_APSTA);
  initWifiClient();
  initWiFiAp();
  initWebServer();

  // GET UNIQUE DEVICE ID
  deviceId = ESP.getEfuseMac();
  deviceIdHex = String((uint32_t)(deviceId >> 32), HEX) + String((uint32_t)deviceId, HEX);

  // I2C
  Wire.begin();

  // SOIL SENSOR
  initSoilSensor();

  // DHT22
  dht_sensor.begin(); 

  // LDR
  initLdrSensor();

  // OVERFLOW
  initOverFlowSensor();

  // LEDS
  initLeds();
  led1.setState(OFF);
  led2.setState(OFF);
  led3.setState(OFF);
  
  // PUMP
  initPump();
}

// LOOP
void loop() {
  server->handleClient();   
  getSensorValues();
}

void getSensorValues(){
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= sensorReadInterval) {
    previousMillis = currentMillis;
    digitalWrite(PUMP_PIN, HIGH);
    getWaterLevel(); 
    getAirTemperatureAndHumidity();
    getLdrSensorValue();
    getSoilSensorValues();
    getOverFlowSensorValue();
    Serial.print("WATER LEVEL:");
    Serial.println(waterLevel);
    Serial.print("AIR TEMPERATURE:");
    Serial.println(airTemperature);  
    Serial.print("AIR HUMIDITY:");
    Serial.println(airHumidity); 
    Serial.print("LUMINOSITY:");
    Serial.println(lightSensorValue);     
    Serial.print("OVERFLOW:");
    Serial.println(overflowValue);      
  }  
  digitalWrite(PUMP_PIN, LOW);
}

// INITIALIZES WIFI AP
void initWiFiAp(){
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
  Serial.println("Trying to connect to router");
  if (preferences.isKey("ssid") && preferences.isKey("pwd"))
  {
    
    String ssid = preferences.getString("ssid");
    String pwd = preferences.getString("pwd");
    WiFi.begin(ssid, pwd);  
    int reconnectTries = 0;
    int maxReconnectTries = 10;    
    while (WiFi.status() != WL_CONNECTED)
    {
      if(reconnectTries < maxReconnectTries)
      {      
        Serial.println("Connecting to WiFi..");
        reconnectTries +=1;
        delay(500);
      }
      else
      {
        Serial.println("Could not connect to WiFi");        
        break;
      }
    }
      
    if (WiFi.status() == WL_CONNECTED)
    {
      Serial.print("ESP32 IP on the WiFi network: ");
      Serial.println(WiFi.localIP());
    }
  }  
  else
  {
    Serial.println("No SSID or password");
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