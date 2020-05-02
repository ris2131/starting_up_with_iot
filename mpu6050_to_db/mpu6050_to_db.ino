#include <MPU6050_tockn.h>
#include <Wire.h>
#include <WiFiManager.h>
#include <HTTPClient.h>
#include <string.h>
#define USE_SERIAL Serial


MPU6050 mpu6050(Wire);

long timer = 0;

char url[1000];
char url_100[1000];

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
float accX;
float accY;
float accZ;
float dog_mass = 10.0;
float calorie;
float sum_100;
void loop(void)
{ 
  mpu6050.update();
  accX = mpu6050.getAccX();
  accY = mpu6050.getAccY();
  accZ = mpu6050.getAccZ();
  calorie = dog_mass * (accX*accX + accY*accY + accZ*accZ) / (200.0 * 4.187);
  sum_100 += calorie;
  if(loop_count%10 == 0){
    sprintf(url, "http://54.146.59.56:8000/data?id=2");  
  }
  sprintf(append_value, "&accX%d=%f&accY%d=%f&accZ%d=%f&cal%d=%f", loop_count%10, accX, loop_count%10, accY, loop_count%10, accZ, loop_count%10, calorie);
  strcat(url, append_value);
  loop_count++;
  if(loop_count%10 == 0){
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
    if(loop_count == 100){
      delay(1000);
      Serial.print(sum_100);
      sprintf(url_100, "http://54.146.59.56:8000/data100?id=2&cal_100=%f", sum_100);
      Serial.print(url_100);
      HTTPClient http;
      http.begin(url_100);
      int httpCode = http.GET();
      // httpCode will be negative on error
      if(httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        USE_SERIAL.printf("[HTTP] 100 GET... code: %d\n", httpCode);
        // file found at server
        if(httpCode == HTTP_CODE_OK) {
            String payload = http.getString();
            USE_SERIAL.println(payload);
        }
      } else {
        USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
      }
      http.end();
      sum_100 = 0;
      loop_count = 0;
    }
  }
  delay(100);
}
