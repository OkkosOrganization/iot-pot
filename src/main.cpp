#include <Arduino.h>
#include <WebServer.h>
#include <WiFi.h>

void setup() {
  Serial.begin(115200);  
  while (!Serial){ 
    Serial.println("..."); 
  }  
}

void loop() {
  Serial.println("Hello World");
}