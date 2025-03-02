//kytkennät
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
  // read humidity
  float humi  = dht_sensor.readHumidity();
  // read temperature in Celsius
  float temperature_C = dht_sensor.readTemperature();
  // check whether the reading is successful or not
  if ( isnan(temperature_C) || isnan(humi)) {
    Serial.println("Failed to read from DHT sensor!");
  } else {
    /*
    Serial.print("Humidity: ");
    Serial.print(humi);
    Serial.print("%");
    Serial.print("  |  ");
    Serial.print("Temperature: ");
    Serial.print(temperature_C);
    Serial.print("°C  ~  ");
    */
    airHumidity = humi;
    airTemperature = temperature_C;
  }
}