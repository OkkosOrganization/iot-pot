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
  analogSetAttenuation(ADC_11db);
  pinMode(POWER_PIN, OUTPUT);   // Configure pin as an OUTPUT
  digitalWrite(POWER_PIN, LOW); // turn the sensor OFF
}

void getOverFlowSensorValue(){
  digitalWrite(POWER_PIN, HIGH);  // turn the sensor ON
  waterOverflow = analogRead(SIGNAL_PIN); // read the analog value from sensor
  digitalWrite(POWER_PIN, LOW);    // turn the sensor OFF

  if (waterOverflow > WATER_OVERFLOW_THRESHOLD) { 
    Serial.print("OVERFLOW");
    waterOverflow = 1;
    led4.setState(RED);
  }  
  else{
    waterOverflow = 0;
    led4.setState(OFF);
  }
}
