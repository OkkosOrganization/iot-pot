#pragma once
// GLOBAL VARIABLES

// SENSOR VALUES
int waterLevel = 0;
float airHumidity = 0;
float airTemperature = 0;
int luminosity = 0;
float soilPh = 0;
float soilMoisture = 0;
float soilTemperature = 0;
byte waterOverflow = 0;

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
uint8_t LED_PIN_6 = D7;
uint8_t LED_PIN_7 = D6;
uint8_t LED_PIN_8 = D5;

// PUMP CONTROL
uint8_t PUMP_PIN = D3;

// LED STATES
enum LED_STATE {
  OFF,
  RED,
  GREEN,
  YELLOW,
  RED_BLINK,
  RED_FAST_BLINK
};

// WATER LEVEL STATES
enum WATER_LEVEL_STATE {
  WATER_LEVEL_TOO_HIGH = 90,
  WATER_LEVEL_HIGH = 60,
  WATER_LEVEL_MEDIUM = 40,
  WATER_LEVEL_LOW = 20,
  WATER_LEVEL_TOO_LOW = 10
};

// PUMP STATES
enum PUMPState {
  PUMP_OFF,
  PUMP_ON,
};

// API URLS
char MEASUREMENTS_API_URL[60] = "https://iot-pot.com/api/measurements";
char NOTIFICATION_API_URL[31] = "https://iot-pot.com/api/notify";

// WIFI AP CREDENTIALS
const char *soft_ap_ssid = "IoT-pot";
const char *soft_ap_password = "TIES4571";

// INTERVAL FOR WATERING
unsigned long previousWateringMillis = 0;
const unsigned long wateringInterval = 60 * 1000; // 1 minute
long pumpStartTime = 0;
long latestPumpTimeStamp = 0;

// INTERVAL FOR SENSOR READINGS
unsigned long previousReadMillis = 0;
const unsigned long sensorReadInterval = 10000; // 10 SECONDS

// INTERVAL FOR WATER LEVEL SENSOR
unsigned long previousWaterLevelMillis = 0;
const unsigned long waterLevelInterval = 100; // .1 SECONDS

// INTERVAL FOR MQTT PUBLISH
unsigned long previousMqttMillis = 0;
const unsigned long mqttPublishInterval = 20000; // 20 SECONDS

// INTERVAL FOR HTTPS PUBLISH
unsigned long previousHttpsMillis = 0;
const unsigned long httpsPublishInterval = 1 * 60 * 60 * 1000; // 1 HOUR

// INTERVAL FOR NOTIFICATIONS
unsigned long previousNotificationMillis = 0;
const unsigned long notificationSendInterval = 2 * 60 * 60 * 1000; // 2 HOURS