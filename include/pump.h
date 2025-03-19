#pragma once
#include <Arduino.h>

enum PUMPState {
  PUMP_ON,
  PUMP_OFF
};

class PUMP {
  private:
    int pin;

  public:
    // Constuctor
    PUMP(int pin) {
      pin = pin;
    }

    void begin() {
      pinMode(pin, OUTPUT);
    }

    void setState(PUMPState state) {
      switch (state) {
        case PUMP_ON:
          digitalWrite(pin, HIGH);
          break;
        case PUMP_OFF:
          digitalWrite(pin, LOW);
          break;
        default:
          digitalWrite(pin, LOW);
          break;
      }
    }
};

PUMP pump(PUMP_PIN);
void initPump();
void initPump(){
  pump.begin();
  pump.setState(PUMP_OFF);
};