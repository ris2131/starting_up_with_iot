#include <MPU6050_tockn.h>
#include <Wire.h>
#include <WiFiManager.h>
#include <HTTPClient.h>
#include <string.h>
#define USE_SERIAL Serial


MPU6050 mpu6050(Wire);

long timer = 0;

char url[1000];

void setup(void)
{

  Serial.begin(115200);
     WiFi.mode(WIFI_STA);
    Serial.begin(115200);
    WiFiManager wm;
    bool res;
    res = wm.autoConnect("AutoConnectAP","password");
    if(!res) {
        Serial.println("Failed to connect");
        // ESP.restart();
    } 
    else {
        Serial.println("connected...yeey :)");
    }
  Wire.begin(21, 22);
  mpu6050.begin();
  mpu6050.calcGyroOffsets(true);
}
int loop_count = 0;
char append_value[100];

void loop(void)
{ 
  mpu6050.update();
  //Serial.print("accX : ");Serial.print(mpu6050.getAccX());
  //accx[loop_count] = mpu6050.getAccX();
  //Serial.print("\taccY : ");Serial.print(mpu6050.getAccY());
  //accy[loop_count] = mpu6050.getAccY();
  //Serial.print("\taccZ : ");Serial.println(mpu6050.getAccZ());
  //accz[loop_count] = mpu6050.getAccZ();
  if(loop_count == 0){
    sprintf(url, "http://54.146.59.56:8000/data?id=2");  
  }
  sprintf(append_value, "&accX%d=%f&accY%d=%f&accZ%d=%f", loop_count, mpu6050.getAccX(), loop_count, mpu6050.getAccY(), loop_count, mpu6050.getAccZ());
  strcat(url, append_value);
  loop_count++;
  if(loop_count == 10){
    HTTPClient http;
    http.begin(url);
    int httpCode = http.GET();
    // httpCode will be negative on error
    if(httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        USE_SERIAL.printf("[HTTP] GET... code: %d\n", httpCode);
        // file found at server
        if(httpCode == HTTP_CODE_OK) {
            String payload = http.getString();
            USE_SERIAL.println(payload);
        }
    } else {
        USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();
    loop_count = 0;
  }
  delay(100);
}
