//koodi https://newbiely.com/tutorials/arduino-nano-esp32/arduino-nano-esp32-water-sensor
//- =GND
//+ = D4
//S = A0
#pragma once
#include <Arduino.h>
#define POWER_PIN  D4 // Arduino Nano ESP32 pin D4 connected to sensor's VCC pin
#define SIGNAL_PIN A0 // Arduino Nano ESP32 pin A0 connected to sensor's signal pin
//#define THRESHOLD   1000  // koodilla voitaisiin tehdä tarkistus onko vesivuotoa

int smallWaterSensorValue = 0; // variable to store the sensor value

void initSmallWaterSensor();
void getSmallWaterSensorValue();

void initSmallWaterSensor(){
    analogSetAttenuation(ADC_11db);
    //pinMode(LED_PIN, OUTPUT);   // Configure pin as an OUTPUT
    pinMode(POWER_PIN, OUTPUT);   // Configure pin as an OUTPUT
    digitalWrite(POWER_PIN, LOW); // turn the sensor OFF
    //digitalWrite(LED_PIN,   LOW); // turn LED OFF
}

void getSmallWaterSensorValue(){
    digitalWrite(POWER_PIN, HIGH);  // turn the sensor ON
   // delay(10);                      // wait 10 milliseconds
    smallWaterSensorValue = analogRead(SIGNAL_PIN); // read the analog value from sensor
    digitalWrite(POWER_PIN, LOW);    // turn the sensor OFF
 
    //if (smallWaterSensorValue > THRESHOLD) {
    //Serial.print("The water is detected");
    //}
    //digitalWrite(LED_PIN, HIGH);  // turn LED ON
    //} //else {
    //digitalWrite(LED_PIN, LOW);

}