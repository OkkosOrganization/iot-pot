#pragma once
#include <Arduino.h>

// SENSOR VALUES
extern int waterLevel;
extern float airHumidity;
extern float airTemperature;
extern int luminosity;
extern float soilPh;
extern float soilMoisture;
extern float soilTemperature;
extern byte waterOverflow;

// STRING VERSIONS
extern char soilTemperatureStr[12], soilMoistureStr[12], soilPhStr[12];
extern char luminosityStr[12], presStr[12], waterLevelStr[12];
extern char overflowStr[12], airTemperatureStr[12], airHumidityStr[12];
extern char waterOverflowStr[12];

// MQTT TOPICS
extern char soilTemperatureTopic[64];
extern char soilPhTopic[64];
extern char soilMoistureTopic[64];
extern char airTemperatureTopic[64];
extern char airHumidityTopic[64];
extern char waterLevelTopic[64];
extern char waterOverflowTopic[64];
extern char luminosityTopic[64];

// LEDS
extern uint8_t LED_PIN_1, LED_PIN_2, LED_PIN_3, LED_PIN_4;
extern uint8_t LED_PIN_5, LED_PIN_6, LED_PIN_7, LED_PIN_8;

// PUMP
extern uint8_t PUMP_PIN;

// ENUMS
enum LED_STATE {
  OFF,
  RED,
  GREEN,
  YELLOW,
  RED_BLINK,
  RED_FAST_BLINK
};
enum WATER_LEVEL_STATE {
  WATER_LEVEL_TOO_HIGH = 70,
  WATER_LEVEL_HIGH = 60,
  WATER_LEVEL_MEDIUM = 40,
  WATER_LEVEL_LOW = 20,
  WATER_LEVEL_TOO_LOW = 10
};
enum PUMPState {
  PUMP_OFF,
  PUMP_ON,
};

// API
extern char MEASUREMENTS_API_URL[60];
extern char NOTIFICATION_API_URL[31];

// WIFI AP
extern const char *soft_ap_ssid;
extern const char *soft_ap_password;

// INTERVALS
extern unsigned long previousWateringMillis;
extern const unsigned long wateringInterval;
extern long pumpStartTime;
extern long latestPumpTimeStamp;

extern unsigned long previousReadMillis;
extern const unsigned long sensorReadInterval;

extern unsigned long previousWaterLevelMillis;
extern const unsigned long waterLevelInterval;

extern unsigned long previousMqttMillis;
extern const unsigned long mqttPublishInterval;

extern unsigned long previousHttpsMillis;
extern const unsigned long httpsPublishInterval;

extern unsigned long previousNotificationMillis;
extern const unsigned long notificationSendInterval;
