#pragma once
#include <Arduino.h>

class LED {
  private:
    int redPin;
    int greenPin;
    bool blink = false;
    unsigned long lastToggleTime = 0;
    bool redState = false;
    LED_STATE currentState = OFF;
    const int BLINK_INTERVAL_SLOW = 500;
    const int BLINK_INTERVAL_FAST = 200;

  public:
    // Constructor
    LED(int green, int red) {
      redPin = red;
      greenPin = green;
    }

    // Initialize pins
    void begin() {
      pinMode(redPin, OUTPUT);
      pinMode(greenPin, OUTPUT);
      setState(OFF);
    }
    
    LED_STATE getState() {
      return currentState;
    }

    // Set LED state
    void setState(LED_STATE state) {
      currentState = state;
      switch (state) {
        case RED:
          digitalWrite(redPin, LOW);    // Red ON
          digitalWrite(greenPin, HIGH); // Green OFF
          blink = false;
          redState = false;
          break;
        case GREEN:
          digitalWrite(redPin, HIGH);   // Red OFF
          digitalWrite(greenPin, LOW);  // Green ON
          blink = false;
          redState = false;
          break;
        case YELLOW:
          digitalWrite(redPin, LOW);    // Red ON
          digitalWrite(greenPin, LOW);  // Green ON
          blink = false;
          redState = false;
          break;
        case RED_BLINK:
          digitalWrite(greenPin, HIGH); // Green OFF
          digitalWrite(redPin, LOW);    // Red ON
          blink = true;
          redState = true;
          lastToggleTime = millis();
          break;          
        case RED_FAST_BLINK:
          digitalWrite(greenPin, HIGH); // Green OFF
          digitalWrite(redPin, LOW);    // Red ON
          blink = true;
          redState = true;
          lastToggleTime = millis();
          break;
        case OFF:
          digitalWrite(redPin, HIGH);   // Red OFF
          digitalWrite(greenPin, HIGH); // Green OFF
          blink = false;
          redState = false;     
          break;     
        default:
          digitalWrite(redPin, HIGH);   // Red OFF
          digitalWrite(greenPin, HIGH); // Green OFF
          blink = false;
          redState = false;
          break;
      }
    
    }

    void update() {
      if (blink && (currentState == RED_BLINK || currentState == RED_FAST_BLINK)) {
        unsigned long now = millis();
        int interval = (currentState == RED_FAST_BLINK) ? BLINK_INTERVAL_FAST : BLINK_INTERVAL_SLOW;
        if (now - lastToggleTime >= interval) {       
          lastToggleTime = now;
          redState = !redState;
          digitalWrite(redPin, redState ? LOW : HIGH);
        }
      }
    }
};