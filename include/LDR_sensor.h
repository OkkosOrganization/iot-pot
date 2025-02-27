// koodin lähde: https://newbiely.com/tutorials/arduino-nano-esp32/arduino-nano-esp32-ldr-module
//valoanturi moduuli Arduinolle 3.3-5V 4 pinniä
// koodissa luetaan arvo A4 pinnistä
//kytkennät VCC =3.3V
//GND= GND
//A0 kytketään pinniin A4
#include <Arduino.h>
#define AO_PIN A4  // The Arduino Nano ESP32's pin connected to AO pin of the ldr module

void setup() {
  // Initialize the Serial to communicate with the Serial Monitor.
  Serial.begin(9600);

  // set the ADC attenuation to 11 dB (up to ~3.3V input)
  analogSetAttenuation(ADC_11db);
}

void loop() {
  int light_value = analogRead(AO_PIN);

  Serial.print("The AO value: ");
  Serial.println(light_value);
  delay(5000);
}