#include <MPU6050_tockn.h>
#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#define USE_SERIAL Serial

MPU6050 mpu6050(Wire);

long timer = 0;

const char* ssid     = "와이파이_이름";    // 연결할 SSID
const char* password = "와이파이_비밀번호";     // 연결할 SSID의 비밀번호
char url[100];

void setup(void)
{

  Serial.begin(115200);
    
  WiFi.begin(ssid, password);
 
  // 와이파이망에 연결
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  // Start up the library
  Wire.begin(21, 22);
  mpu6050.begin();
  mpu6050.calcGyroOffsets(true);
}

/*
 * Main function, get and show the temperature
 */
void loop(void)
{ 
  mpu6050.update();
  
  Serial.print("accX : ");Serial.print(mpu6050.getAccX());
  Serial.print("\taccY : ");Serial.print(mpu6050.getAccY());
  Serial.print("\taccZ : ");Serial.println(mpu6050.getAccZ());
  
  HTTPClient http;
  sprintf(url, "http://54.146.59.56:8000/data?id=1&accX=%f&accY=%f&accZ=%f", mpu6050.getAccX(),mpu6050.getAccY(),mpu6050.getAccZ());
  
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
  delay(1000);
}
