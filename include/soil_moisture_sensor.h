#pragma once
#include <Arduino.h>
#define AOUT_PIN A2 

class SoilMoistureSensor {
  private:
    float soilMoistureValue = 0;
    int airReferenceValue = 3800; // SENSOR VALUE WHEN IN AIR
    int wetReferenceValue = 30;   // SENSOR VALUE WHEN IN WATER  

  public:
    void getSoilMoistureValue(float &soilMoisture) {
      soilMoistureValue = analogRead(AOUT_PIN);
      soilMoisture = map(soilMoistureValue, wetReferenceValue, airReferenceValue, 0, 100);
    };    
};