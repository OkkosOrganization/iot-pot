#pragma once
#include <Arduino.h>
#include "globals.h"

#define AOUT_PIN A2

int analogSoilMoistureValue = 0;
int airReferenceValue = 3800; // SENSOR VALUE WHEN IN AIR
int wetReferenceValue = 30;   // SENSOR VALUE WHEN IN WATER

void getAnalogSoilMoistureValue();
void getAnalogSoilMoistureValue(){
  analogSoilMoistureValue = analogRead(AOUT_PIN);

  // CONSTRAIN VALUE
  analogSoilMoistureValue = constrain(analogSoilMoistureValue, wetReferenceValue, airReferenceValue);

  // MAP VALUE TO 0-100
  analogSoilMoistureValue = map(analogSoilMoistureValue, wetReferenceValue, airReferenceValue, 0, 100);

  Serial.print("ANALOG SOIL SENSOR VALUE: ");
  Serial.println(analogSoilMoistureValue);

  // SET THE GLOBAL VARIABLE VALUE
  soilMoisture = analogSoilMoistureValue;
}