//koodi https://newbiely.com/tutorials/arduino-nano-esp32/arduino-nano-esp32-water-sensor
//- =GND
//+ = D4
//S = A0
#pragma once
#include <Arduino.h>
#include "led.h"

#define POWER_PIN  D4
#define SIGNAL_PIN A0
#define WATER_OVERFLOW_THRESHOLD 1000 

void initOverFlowSensor();
void getOverFlowSensorValue();

int overflowSensorValue = 0;

void initOverFlowSensor() {  
  pinMode(POWER_PIN, OUTPUT);
  digitalWrite(POWER_PIN, LOW);
}

void getOverFlowSensorValue() {
  digitalWrite(POWER_PIN, HIGH);                // turn the sensor ON
  overflowSensorValue = analogRead(SIGNAL_PIN); // read the analog value from sensor
  digitalWrite(POWER_PIN, LOW);                 // turn the sensor OFF

  if (overflowSensorValue > WATER_OVERFLOW_THRESHOLD) { 
    Serial.print("Water overflow detected");
    waterOverflow = OVERFLOW;
    led3.setState(RED);
  }  
  else {      
    waterOverflow = NO_OVERFLOW;
    led3.setState(GREEN);
  }      
}
