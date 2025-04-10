#pragma once
#include <Arduino.h>
#include "globals.h"

#define AOUT_PIN A2 

void initSoilMoistureSensor();
void getSoilMoistureValue();

void initSoilMoistureSensor(){
  analogSetAttenuation(ADC_11db);
}
void getSoilMoistureValue(){
  float value = analogRead(AOUT_PIN);
  soilMoisture=value;
}