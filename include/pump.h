#pragma once
#include <Arduino.h>

class PUMP {
  private:
    int pin;
    PUMPState state;

  public:
    PUMP() {
      pin = PUMP_PIN;
      state = PUMP_OFF;
    }

    void begin() {
      pinMode(pin, OUTPUT);
      digitalWrite(pin, LOW);      
    }

    void setState(PUMPState newState) {
      if (newState == PUMP_ON) {
        digitalWrite(pin, HIGH);
      } else {
        digitalWrite(pin, LOW);
      }
      this->state = newState;
    }

    PUMPState getState(){
      return this->state;
    }

    unsigned int getWateringTime(int value) {
      if (value < 0) value = 0;
      if (value > 100) value = 100;

      // MAX TIME: 1L = 15S = 15000MS
      // USE MAX: .3L      
      double max_time_ms = (15 * 1000) / 3;

      return (value * max_time_ms) / 100;
    }
};