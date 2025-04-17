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

void initOverFlowSensor(){
  pinMode(POWER_PIN, OUTPUT);
  digitalWrite(POWER_PIN, HIGH);
}

void getOverFlowSensorValue(){
  int waterOverflowValue = analogRead(SIGNAL_PIN);

  if (waterOverflowValue >= WATER_OVERFLOW_THRESHOLD) { 
    Serial.print("OVERFLOW");
    waterOverflow = 1;
    led4.setState(RED);
  }  
  else {
    waterOverflow = 0;
    led4.setState(GREEN);
  }
}
