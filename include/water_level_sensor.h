// SDA -> A4
// SCL -> A5

#pragma once
#include <Wire.h>
#define NO_TOUCH            0xFE
#define VALUE_THRESHOLD     100
#define ATTINY1_HIGH_ADDR   0x78
#define ATTINY2_LOW_ADDR    0x77

class WaterLevelSensor {
  private:
    unsigned char low_data[8] = {0};
    unsigned char high_data[12] = {0};

  public:
    WaterLevelSensor() {
      Wire.begin();
    }
    void getHigh12SectionValue(void)
    {
      memset(high_data, 0, sizeof(high_data));
      Wire.requestFrom(ATTINY1_HIGH_ADDR, 12);
      
      unsigned long start = millis();
      while (Wire.available() < 12) {
        if (millis() - start > 100) {
          Serial.println("Timeout waiting for high section data!");
          return;
        }
      }
      for (int i = 0; i < 12; i++)
        high_data[i] = Wire.read();

    }
    void getLow8SectionValue(void)
    {
      memset(low_data, 0, sizeof(low_data));
      Wire.requestFrom(ATTINY2_LOW_ADDR, 8);
      
      unsigned long start = millis();
      while (Wire.available() < 8) {
        if (millis() - start > 100) {
          Serial.println("Timeout waiting for low section data!");
          return;
        }
      }

      for (int i = 0; i < 8 ; i++)
        low_data[i] = Wire.read();

    }
    void getWaterLevel(int &waterLevel) {

      int sensorvalue_min = 250;
      int sensorvalue_max = 255;
      int low_count = 0;
      int high_count = 0;

      uint32_t touch_val = 0;
      uint8_t trig_section = 0;
      low_count = 0;
      high_count = 0;
      getLow8SectionValue();
      getHigh12SectionValue();

      for (int i = 0; i < 8; i++)
      {
        if (low_data[i] >= sensorvalue_min && low_data[i] <= sensorvalue_max)
          low_count++;
      }
      for (int i = 0; i < 12; i++)
      {
        if (high_data[i] >= sensorvalue_min && high_data[i] <= sensorvalue_max)
          high_count++;
      }
      for (int i = 0 ; i < 8; i++) {
        if (low_data[i] > VALUE_THRESHOLD) {
          touch_val |= 1 << i;
        }
      }
      for (int i = 0 ; i < 12; i++) {
        if (high_data[i] > VALUE_THRESHOLD) {
          touch_val |= (uint32_t)1 << (8 + i);
        }
      }
      while (touch_val & 0x01)
      {
        trig_section++;
        touch_val >>= 1;
      }

      /*
      Serial.print("low_data: ");
      for (int i = 0; i < 8; i++) {
        Serial.print(low_data[i]);
        Serial.print(" ");
      }
      Serial.println();

      Serial.print("high_data: ");
      for (int i = 0; i < 12; i++) {
        Serial.print(high_data[i]);
        Serial.print(" ");
      }
      Serial.println();
      */

      // UPDATE THE GLOBAL VAR
      waterLevel = trig_section * 5;
    };
};