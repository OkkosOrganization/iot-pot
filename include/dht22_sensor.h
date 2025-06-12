// - GND
// + virta vcc 3.3V tai 5V
// out D2

#pragma once
#include <DHT.h>
#define DHT_SENSOR_PIN  D2
#define DHT_SENSOR_TYPE DHT22

class DHTSensor {
  private:
    DHT* sensor;
    float humidity;
    float temperature;

  public: 
    DHTSensor() {   
      sensor = new DHT(DHT_SENSOR_PIN, DHT_SENSOR_TYPE);   
      sensor->begin();
    }

    void getAirTemperatureAndHumidity(float &airTemperature, float &airHumidity) {
      humidity  = sensor->readHumidity();
      temperature = sensor->readTemperature();
      if ( isnan(temperature) || isnan(humidity)) {
        Serial.println("Failed to read from DHT sensor!");
      } else {
        airHumidity = humidity;
        airTemperature = temperature;
      }
    }
};