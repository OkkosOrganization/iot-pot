#include <Arduino.h>
#include "secrets.h"
#include <WebServer.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include "html/index.h"
#include <inttypes.h>
#include <Preferences.h>

// FUNCTION PROTOTYPES
void initWifiApAndWebServer();
void initWifiClient();
void handleGetIndex();
void handleGetInternetStatus();
void handleGetDeviceId();
void handleGetEmail();
void handlePostEmail();
void handlePostRouterCredentials();
void handleGetWateringAmount();
void handlePostWateringAmount();
void handleGetWateringThreshold();
void handlePostWateringThreshold();

// PREFERENCES
Preferences preferences;

// UNIQUE DEVICE ID
uint64_t deviceId;
String deviceIdHex;

// WIFI ACCESS POINT AND LOCAL WEB SERVER IP
IPAddress local_IP(192,168,0,1);
IPAddress gateway(192,168,0,1);
IPAddress subnet(255,255,255,0);
const char *soft_ap_ssid = "IoT-pot";
const char *soft_ap_password = "TIES4571";
WebServer* server;

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

  initWifiApAndWebServer();
  initWifiClient();

  // GET UNIQUE DEVICE ID
  deviceId = ESP.getEfuseMac();
  deviceIdHex = String((uint32_t)(deviceId >> 32), HEX) + String((uint32_t)deviceId, HEX);
}

// LOOP
void loop() {
  server->handleClient();    
}

// INITIALIZES THE WIFI AS BOTH ACCESS POINT AND CLIENT
void initWifiApAndWebServer(){
  WiFi.mode(WIFI_MODE_APSTA);
  WiFi.softAPConfig(local_IP, gateway, subnet);
  WiFi.softAP(soft_ap_ssid, soft_ap_password);

  Serial.print("IoT-pot access point IP: ");
  IPAddress apIP = WiFi.softAPIP();
  Serial.println(apIP);
  Serial.print("Access point SSID: ");
  Serial.println(WiFi.softAPSSID()); 

  // BIND SERVER TO AP-IP ONLY
  server = new WebServer(apIP);
  
  // SETUP ROUTES
  server->on("/", HTTP_GET, handleGetIndex);
  server->on("/internet-status", HTTP_GET, handleGetInternetStatus);
  server->on("/device-id", HTTP_GET, handleGetDeviceId);
  server->on("/router-credentials", HTTP_POST, handlePostRouterCredentials);
  server->on("/email-address", HTTP_POST, handlePostEmail);
  server->on("/email-address", HTTP_GET, handleGetEmail);
  server->on("/watering-amount", HTTP_GET, handleGetWateringAmount);
  server->on("/watering-amount", HTTP_POST, handlePostWateringAmount);  
  server->on("/watering-threshold", HTTP_GET, handleGetWateringThreshold);
  server->on("/watering-threshold", HTTP_POST, handlePostWateringThreshold);   
  
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
        delay(250);
      }
      else
      {
        Serial.println("Could not connect to WiFi");        
        return;
      }
    }
      
    Serial.print("ESP32 IP on the WiFi network: ");
    Serial.println(WiFi.localIP());
  }  
  else
  {
    Serial.println("No SSID or password");
  }
}

// WEB SERVER ROUTES
void handleGetIndex() {
  Serial.println("GET /");
  server->sendHeader("Content-Type", "text/html");
  server->send(200, "text/html", indexHtml);
}
void handleGetInternetStatus() {
  Serial.println("GET /internet-status");
  JsonDocument jsonDoc;
  String jsonString;  
  jsonDoc["internet-status"] = WiFi.status();
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
    int waInt = atoi(wa);    
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
    String waString = server->arg("watering-threshold");
    waString.toCharArray(wt, sizeof(wt));
    int waInt = atoi(wt);    
    Serial.print("POST** watering-amount:");
    Serial.println(wt);  
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
void handleGetWateringThreshold() {
  Serial.println("GET /watering-threshold");
  JsonDocument jsonDoc;
  String jsonString; 
  String wt = "";
  if (preferences.isKey("watering-threshold"))
    wt = preferences.getInt("watering-threshold");
  jsonDoc["watering-amount"] = wt;  
  serializeJson(jsonDoc, jsonString);
  server->sendHeader("Content-Type", "application/json");
  server->send(200, "application/json", jsonString);
}