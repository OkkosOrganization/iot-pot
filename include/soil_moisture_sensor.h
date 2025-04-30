#pragma once
#include <Arduino.h>

#define AOUT_PIN A2 
void getSoilMoistureValue();

int analogSoilMoistureValue = 0;
int airReferenceValue = 3800; // SENSOR VALUE WHEN IN AIR
int wetReferenceValue = 30;   // SENSOR VALUE WHEN IN WATER

void getSoilMoistureValue(){
  float value = analogRead(AOUT_PIN);
  soilMoisture = map(value, wetReferenceValue, airReferenceValue, 0, 100);
}