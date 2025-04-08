#pragma once
#include <Arduino.h>
#include "globals.h"

#define AOUT_PIN A2 // Arduino Nano ESP32 pin A2 that connects to AOUT pin of moisture sensor
//#define THRESHOLD 1500 // CHANGE YOUR THRESHOLD HERE

void initSoilMoistureSensor();
void getSoilMoistureValue();

//int SoilMoistureValue=0;

void initSoilMoistureSensor(){
    analogSetAttenuation(ADC_11db);

}
void getSoilMoistureValue(){
    float value = analogRead(AOUT_PIN); // read the analog value from sensor

  //if (value > THRESHOLD)
    //Serial.print("The soil is DRY (");
  //else
    //Serial.print("The soil is WET (");

  //Serial.print(value);
  //Serial.println(")");


  //delay(500);
  soilMoisture=value;
}