// valoanturi moduuli Arduinolle 3.3-5V 4 pinniä
// koodissa luetaan arvo A3 pinnistä
// kytkennät VCC =3.3V
// GND= GND
// A0 kytketään pinniin A3

// Mitataan 10 sekunnin välein valoisuutta, 12 kpl.erissä (ts. 2 min. kerallaan).
// Mittausarvoista tiputetaan suurin ja pienin arvo pois, lopuista lasketaan keskiarvo ja palautetaan se.

#pragma once
#include <Arduino.h>
#define LIGHT_SENSOR_PIN A3 

const int minimi = 4095;
const int maksimi = 0;

int luminosity = 0;
const int amountOfMeausrements = 12;
int delayBetweenMeasurements = 10000; //millisekunteina
unsigned long lastRead = 0; //päivitetään millis():in avulla
float values [amountOfMeausrements];
int last = 0;

void getLdrSensorValue2(int amountOfMeasurements, int delayBetweenMeasurements){
  if (millis() - lastRead >= delayBetweenMeasurements) {
    analogSetAttenuation(ADC_11db);
    values[last] = analogRead(LIGHT_SENSOR_PIN);
    last++;
    if (last == amountOfMeausrements){
      last = 0;
      float sum = 0;
      float gr = minimi;
      float sm = maksimi;
      for (int i = 0; i <= amountOfMeausrements; i++){
        sum += values[i];
        if(values[i] > gr){
          gr = values[i];
        }
        if(values[i] < sm) {
          sm = values[i];
        }
      }
      sum = sum - (gr + sm);
      int pros = (int)((sum/(amountOfMeausrements-2)/minimi*100)+0.5);
      luminosity = 100-pros;
    }
    lastRead = millis();
    }
}