#pragma once

// GLOBAL VARIABLES

// SENSOR VALUES
unsigned int waterLevel = 0;
float airHumidity = 0;
float airTemperature = 0;
int lightSensorValue = 0;
float solPh = 0;
float soilMoisture = 0;
float soilTemperature = 0;
int overflowValue = 0;

// LEDS
uint8_t LED_PIN_1 = D11;
uint8_t LED_PIN_2 = D12;
uint8_t LED_PIN_3 = D10;
uint8_t LED_PIN_4 = D9;
uint8_t LED_PIN_5 = D8;
uint8_t LED_PIN_6 = D5;
//uint8_t LED_PIN_7 = D4;
//uint8_t LED_PIN_8 = D3;

// PUMP CONTROL
uint8_t PUMP_PIN = D3;

// WIFI AP CREDENTIALS
const char *soft_ap_ssid = "IoT-pot";
const char *soft_ap_password = "TIES4571";