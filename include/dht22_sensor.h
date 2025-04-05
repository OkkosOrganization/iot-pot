// - GND
// + virta vcc 3.3V tai 5V
// out D2

#pragma once
#include <DHT.h>
#define DHT_SENSOR_PIN  D2
#define DHT_SENSOR_TYPE DHT22

DHT dht_sensor(DHT_SENSOR_PIN, DHT_SENSOR_TYPE);

void getAirTemperatureAndHumidity();
void getAirTemperatureAndHumidity() {
  float humi  = dht_sensor.readHumidity();
  float temperature_C = dht_sensor.readTemperature();
  if ( isnan(temperature_C) || isnan(humi)) {
    Serial.println("Failed to read from DHT sensor!");
  } else {
    airHumidity = humi;
    airTemperature = temperature_C;
  }
}