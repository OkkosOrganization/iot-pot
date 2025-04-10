#pragma once
#include <ModbusMaster.h>
#include <HardwareSerial.h>
#include <Arduino.h>

ModbusMaster node;  // Create Modbus object
HardwareSerial SensorSerial(1);  // Serial1 for RS485 communication

const int txPin = 0; // TX (to RS485 RX)
const int rxPin = 1; // RX (to RS485 TX)

void initSoilSensor();
void getSoilSensorValues();

void initSoilSensor() {
    SensorSerial.begin(9600, SERIAL_8N1, rxPin, txPin); // Sensor default baud rate = 4800
    node.begin(1, SensorSerial); // Slave ID = 1
    Serial.println("Modbus communication initialized...");
}

void getSoilSensorValues() {

    uint8_t result;

    // Read Soil pH (Register 0x0003)
    result = node.readHoldingRegisters(0x0003, 1);
    if (result == node.ku8MBSuccess) {
        soilPh = node.getResponseBuffer(0);
    } else {
        Serial.print("Error reading pH, Code: ");
        Serial.println(result);
    }

    // Read Soil Moisture (Register 0x0000)
    result = node.readHoldingRegisters(0x0000, 1);
    if (result == node.ku8MBSuccess) {
        soilMoisture = node.getResponseBuffer(0); // 10.0; // Convert to %
    } else {
        Serial.print("Error reading Moisture, Code: ");
        Serial.println(result);
    }

    // Read Soil Temperature (Register 0x0001)
    result = node.readHoldingRegisters(0x0001, 1);
    if (result == node.ku8MBSuccess) {
        soilTemperature = node.getResponseBuffer(0) / 10.0; // Convert to °C        
    } else {
        Serial.print("Error reading Temperature, Code: ");
        Serial.println(result);
    }
  
}
