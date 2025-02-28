// koodin lähde: https://newbiely.com/tutorials/arduino-nano-esp32/arduino-nano-esp32-ldr-module
// valoanturi moduuli Arduinolle 3.3-5V 4 pinniä
// koodissa luetaan arvo A4 pinnistä
// kytkennät VCC =3.3V
// GND= GND
// A0 kytketään pinniin A4
#include <Arduino.h>
#define LIGHT_SENSOR_PIN A4 

void initLdrSensor();
void getLdrSensorValue();

int lightSensorValue = 0;

void initLdrSensor() {
  // set the ADC attenuation to 11 dB (up to ~3.3V input)
  analogSetAttenuation(ADC_11db);
}

void getLdrSensorValue() {
  lightSensorValue = analogRead(LIGHT_SENSOR_PIN);
}