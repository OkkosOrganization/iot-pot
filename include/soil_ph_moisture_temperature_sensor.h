#pragma once
#include <ModbusMaster.h>
#include <HardwareSerial.h>
#include <Arduino.h>
#define MODBUS_TX_PIN D0
#define MODBUS_RX_PIN D1

class ModbusSoilSensor {
  private:
    ModbusMaster node; 
    HardwareSerial SensorSerial;

    uint8_t modbusResult;
    uint8_t modbusAvailableResult;
    
    // CALIBRATION VALUES
    int airValue = 0;         // SENSOR VALUE WHEN IN AIR
    int waterValue = 1000;    // SENSOR VALUE WHEN IN WATER
    int wetSoilValue = 500;   // SENSOR VALUE WHEN IN WET SOIL

    float tempSoilMoistureValue = 0;

  public:
    ModbusSoilSensor(): SensorSerial(1) {      
      SensorSerial.begin(9600, SERIAL_8N1, MODBUS_RX_PIN, MODBUS_TX_PIN);
      node.begin(1, SensorSerial);
      Serial.println("Modbus communication initialized");
    }

    bool soilSensorAvailable(){
      modbusAvailableResult = node.readHoldingRegisters(0x0000, 1);
      return modbusAvailableResult == node.ku8MBSuccess;
    }

    void getSoilSensorValues(float &soilPhValue, float &soilMoisture, float &soilTemperature) {
      if(soilSensorAvailable())
      {  
        // Read Soil pH (0x0003)
        modbusResult = node.readHoldingRegisters(0x0003, 1);
        if (modbusResult == node.ku8MBSuccess) {          
          soilPh = node.getResponseBuffer(0);      
        } else {
          Serial.print("Error reading pH, Code: ");
          Serial.println(modbusResult);
        }

        // Read Soil Moisture (0x0000)
        modbusResult = node.readHoldingRegisters(0x0000, 1);
        if (modbusResult == node.ku8MBSuccess) {
          tempSoilMoistureValue = node.getResponseBuffer(0); // 10.0; // Convert to %

          // CONSTRAIN
          tempSoilMoistureValue = constrain(tempSoilMoistureValue, airValue, wetSoilValue);

          // MAP VALUE TO 0–100
          tempSoilMoistureValue = map(tempSoilMoistureValue, airValue, wetSoilValue, 0, 100);

          //Serial.print("DIGITAL SOIL SENSOR VALUE: ");
          //Serial.println(digitalSoilMoistureValue);
          soilMoisture = tempSoilMoistureValue;

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
};