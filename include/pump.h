#pragma once
#include <Arduino.h>

enum PUMPState {
  PUMP_OFF,
  PUMP_ON,
};

class PUMP {
  private:
    int pin;
    PUMPState state;

  public:
    // Constuctor
    PUMP(int pumpPin) {
      pin = pumpPin;
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
      double max_time_ms = 15000;

      return (value * max_time_ms) / 100;
    }
};

PUMP pump(PUMP_PIN);
void initPump();
void initPump(){
  pump.begin();
  pump.setState(PUMP_OFF);
};