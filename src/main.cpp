#include <Arduino.h>
#include "secrets.h"
#include <WebServer.h>
#include <WiFi.h>
#include "html/index.h"

// FUNCTION PROTOTYPES
void initWifi();
void handleGetIndex();

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
  initWifi();
}

// LOOP
void loop() {
  server->handleClient();    
}

// INITIALIZES THE WIFI AS BOTH ACCESS POINT AND CLIENT
void initWifi(){
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

  // START SERVER
  server->begin();
  Serial.println("Web server started");

  // WIFI CLIENT
  WiFi.begin(ssid, pwd);      
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("Connecting to WiFi..");
    delay(500);
  }
    
  Serial.print("ESP32 IP on the WiFi network: ");
  Serial.println(WiFi.localIP());
}

void handleGetIndex() {
  Serial.println("GET /");
  server->sendHeader("Content-Type", "text/html");
  server->send(200, "text/html", indexHtml);
}