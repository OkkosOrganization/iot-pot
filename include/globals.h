#pragma once

// GLOBAL VARIABLES

// SENSOR VALUES
unsigned int waterLevel = 0;
float airHumidity = 0;
float airTemperature = 0;
int luminosity = 0;
float soilPh = 0;
float soilMoisture = 0;
float soilTemperature = 0;
int waterOverflow = 0;

// MQTT TOPICS
char soilTemperatureTopic[64];    
char soilPhTopic[64];    
char soilMoistureTopic[64];    
char airTemperatureTopic[64];   
char airHumidityTopic[64];   
char waterLevelTopic[64];
char waterOverflowTopic[64];
char luminosityTopic[64];

// LEDS
uint8_t LED_PIN_1 = D11;
uint8_t LED_PIN_2 = D12;
uint8_t LED_PIN_3 = D10;
uint8_t LED_PIN_4 = D9;
uint8_t LED_PIN_5 = D8;
uint8_t LED_PIN_6 = D5;
uint8_t LED_PIN_7 = D4;
uint8_t LED_PIN_8 = D3;

// WIFI AP CREDENTIALS
const char *soft_ap_ssid = "IoT-pot";
const char *soft_ap_password = "TIES4571";

// INTERVAL FOR SENSOR READINGS
unsigned long previousReadMillis = 0;
const unsigned long sensorReadInterval = 10000;

// INTERVAL FOR MQTT PUBLISH
unsigned long previousMqttMillis = 0;
const unsigned long mqttPublishInterval = 20000;