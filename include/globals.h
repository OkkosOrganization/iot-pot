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

// STRING VERSIONS
char soilTemperatureStr[12], soilMoistureStr[12], soilPhStr[12];
char luminosityStr[12], presStr[12], waterLevelStr[12];
char overflowStr[12], airTemperatureStr[12], airHumidityStr[12];
char waterOverflowStr[12];

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

// API URLS
char MEASUREMENTS_API_URL[60] = "https://iot-pot.com/api/measurements";
char NOTIFICATION_API_URL[31] = "https://iot-pot.com/api/notify";

// WIFI AP CREDENTIALS
const char *soft_ap_ssid = "IoT-pot";
const char *soft_ap_password = "TIES4571";

// INTERVAL FOR SENSOR READINGS
unsigned long previousReadMillis = 0;
const unsigned long sensorReadInterval = 10000; // 10 SECONDS

// INTERVAL FOR MQTT PUBLISH
unsigned long previousMqttMillis = 0;
const unsigned long mqttPublishInterval = 20000; // 20 SECONDS

// INTERVAL FOR HTTPS PUBLISH
unsigned long previousHttpsMillis = 0;
const unsigned long httpsPublishInterval = 1 * 60 * 1000; // 60 SECONDS

// INTERVAL FOR NOTIFICATIONS
unsigned long previousNotificationMillis = 0;
const unsigned long notificationSendInterval = 1 * 60 * 1000; // 60 SECONDS

//smt
bool smt=false;