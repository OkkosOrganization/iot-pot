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
    const int BLINK_INTERVAL = 200;

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

    // Set LED state
    void setState(LED_STATE state) {
      currentState = state;
      switch (state) {
        case RED:
          digitalWrite(redPin, LOW);    // Red ON
          digitalWrite(greenPin, HIGH); // Green OFF
          blink = false;
          break;
        case GREEN:
          digitalWrite(redPin, HIGH);   // Red OFF
          digitalWrite(greenPin, LOW);  // Green ON
          blink = false;
          break;
        case YELLOW:
          digitalWrite(redPin, LOW);    // Red ON
          digitalWrite(greenPin, LOW);  // Green ON
          blink = false;
          break;
        case RED_BLINK:
          digitalWrite(greenPin, HIGH); // Green OFF
          blink = true;
          redState = false;
          lastToggleTime = millis();
          break;
        case OFF:
        default:
          digitalWrite(redPin, HIGH);   // Red OFF
          digitalWrite(greenPin, HIGH); // Green OFF
          blink = false;
          break;
      }
    }

    void update() {
      if (blink && currentState == RED_BLINK) {
        unsigned long now = millis();
        if (now - lastToggleTime >= BLINK_INTERVAL) {
          redState = !redState;
          digitalWrite(redPin, redState ? LOW : HIGH);
          lastToggleTime = now;
        }
      }
    }
};

LED led1(LED_PIN_1, LED_PIN_2);
LED led2(LED_PIN_3, LED_PIN_4);
LED led3(LED_PIN_6, LED_PIN_5);
LED led4(LED_PIN_7, LED_PIN_8);
void initLeds();
void initLeds(){
  led1.begin();
  led2.begin();
  led3.begin();
  led4.begin();
}