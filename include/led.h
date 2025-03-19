#pragma once
#include <Arduino.h>

enum LEDState {
  OFF,
  RED,
  GREEN,
  YELLOW
};
class LED {
  private:
    int redPin;
    int greenPin;

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
    void setState(LEDState state) {
      switch (state) {
        case RED:
          digitalWrite(redPin, LOW);   // Red ON
          digitalWrite(greenPin, HIGH); // Green OFF
          break;
        case GREEN:
          digitalWrite(redPin, HIGH);  // Red OFF
          digitalWrite(greenPin, LOW); // Green ON
          break;
        case YELLOW:
          digitalWrite(redPin, LOW);   // Red ON
          digitalWrite(greenPin, LOW); // Green ON
          break;
        case OFF:
        default:
          digitalWrite(redPin, HIGH);  // Red OFF
          digitalWrite(greenPin, HIGH); // Green OFF
          break;
      }
    }
};

LED led1(LED_PIN_1, LED_PIN_2);
LED led2(LED_PIN_3, LED_PIN_4);
LED led3(LED_PIN_6, LED_PIN_5);
//LED led4(LED_PIN_7, LED_PIN_8);
void initLeds();
void initLeds(){
  led1.begin();
  led2.begin();
  led3.begin();
  //led4.begin();
}