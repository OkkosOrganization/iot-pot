// koodin lähde: https://newbiely.com/tutorials/arduino-nano-esp32/arduino-nano-esp32-ldr-module
// valoanturi moduuli Arduinolle 3.3-5V 4 pinniä
// koodissa luetaan arvo A3 pinnistä
// kytkennät VCC =3.3V
// GND= GND
// A0 kytketään pinniin A3

#pragma once
#include <Arduino.h>
#define LIGHT_SENSOR_PIN A3 

void getLdrSensorValue();
float lookupLux(uint16_t adcValue);

struct LuxLookup {
  uint16_t adcMin;
  uint16_t adcMax;
  float lux;
};
const byte amountOfReadings = 5;

// MAPPED LUX TO ADC VALUES
LuxLookup luxTable[] = {
  {0,    200,    2000.0},
  {201,  300,    1700.0},  
  {301,  400,    1500.0},  
  {401,  500,    1000.0},
  {501,  600,    800.0},
  {601,  700,    600.0},
  {701,  800,    400.0},
  {801,  1000,   300.0},
  {1001, 2000,   100.0},
  {2001, 3000,   50.0},
  {3001, 3700,   20.0},
  {3701, 4095,   0.0},
};

const int tableSize = sizeof(luxTable) / sizeof(luxTable[0]);

float lookupLux(uint16_t adcValue) {
  for (int i = 0; i < tableSize; i++) {
    if (adcValue >= luxTable[i].adcMin && adcValue <= luxTable[i].adcMax) {
      return luxTable[i].lux;
    }
  }
  return 0.0;
}

float getFilteredReading() {
  float readings[amountOfReadings];

  // GET READINGS
  for (int i = 0; i < amountOfReadings; i++) {
    readings[i] = lookupLux(analogRead(LIGHT_SENSOR_PIN));
  }

  // FIND MIN MAX
  int minIndex = 0, maxIndex = 0;
  for (int i = 1; i < amountOfReadings; i++) {
    if (readings[i] < readings[minIndex]) minIndex = i;
    if (readings[i] > readings[maxIndex]) maxIndex = i;
  }

  // SUM REMAINING
  uint32_t sum = 0;
  int amount = 0;
  for (int i = 0; i < amountOfReadings; i++) {
    if (i != minIndex && i != maxIndex) {
      sum += readings[i];
      amount +=1;
    }
  }

  //AVERAGE
  return sum / amount;
}

void getLdrSensorValue() {
  luminosity = getFilteredReading();
}