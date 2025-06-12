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

class OverflowSensor {  
  public:
    OverflowSensor() {
      pinMode(POWER_PIN, OUTPUT);
      digitalWrite(POWER_PIN, HIGH);
    };

    void getOverFlow(byte &waterOverflow) {
      waterOverflow = analogRead(SIGNAL_PIN);
    }
};
