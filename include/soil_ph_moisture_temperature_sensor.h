#pragma once
#include <ModbusMaster.h>
#include <HardwareSerial.h>
#include <Arduino.h>

ModbusMaster node;  // Create Modbus object
HardwareSerial SensorSerial(1);  // Serial1 for RS485 communication

const int txPin = D0; // TX (to RS485 RX)
const int rxPin = D1; // RX (to RS485 TX)
uint8_t modbusResult;
uint8_t modbusAvailableResult;

// CALIBRATION VALUES
int airValue = 0;         // SENSOR VALUE WHEN IN AIR
int waterValue = 1000;    // SENSOR VALUE WHEN IN WATER
int wetSoilValue = 500;   // SENSOR VALUE WHEN IN WET SOIL

void initSoilSensor();
bool soilSensorAvailable();
void getSoilSensorValues();

float digitalSoilMoistureValue = 0;
float digitalSoilPhValue = 0;

void initSoilSensor() {
  SensorSerial.begin(9600, SERIAL_8N1, rxPin, txPin); // Sensor default baud rate = 4800
  node.begin(1, SensorSerial); // Slave ID = 1
  Serial.println("Modbus communication initialized");
}

bool soilSensorAvailable(){
  modbusAvailableResult = node.readHoldingRegisters(0x0000, 1);
  return modbusAvailableResult == node.ku8MBSuccess;
}

void getSoilSensorValues() {

  if(soilSensorAvailable())
  {  
    // Read Soil pH (0x0003)
    modbusResult = node.readHoldingRegisters(0x0003, 1);
    if (modbusResult == node.ku8MBSuccess) {
      digitalSoilPhValue = node.getResponseBuffer(0);      
      soilPh = digitalSoilPhValue;
    } else {
      Serial.print("Error reading pH, Code: ");
      Serial.println(modbusResult);
    }

    // Read Soil Moisture (0x0000)
    modbusResult = node.readHoldingRegisters(0x0000, 1);
    if (modbusResult == node.ku8MBSuccess) {
      digitalSoilMoistureValue = node.getResponseBuffer(0); // 10.0; // Convert to %

      // CONSTRAIN
      digitalSoilMoistureValue = constrain(digitalSoilMoistureValue, airValue, wetSoilValue);

      // MAP VALUE TO 0–100
      digitalSoilMoistureValue = map(digitalSoilMoistureValue, airValue, wetSoilValue, 0, 100);

      //Serial.print("DIGITAL SOIL SENSOR VALUE: ");
      //Serial.println(digitalSoilMoistureValue);
      soilMoisture = digitalSoilMoistureValue;

    } else {
      Serial.print("Error reading Moisture, Code: ");
      Serial.println(modbusResult);
    }

    // Read Soil Temperature (0x0001)
    modbusResult = node.readHoldingRegisters(0x0001, 1);
    if (modbusResult == node.ku8MBSuccess) {
      soilTemperature = node.getResponseBuffer(0) / 10.0; // Convert to °C        
    } else {
      Serial.print("Error reading Temperature, Code: ");
      Serial.println(modbusResult);
    }  
  }
}
