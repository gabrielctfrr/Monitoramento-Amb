#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <AM2320_asukiaaa.h>
#include <MQUnifiedsensor.h>

//Configuração do  Wi-Fi
const char* ssid = "NOME_DA_REDE";
const char* password = "SENHA_DA_REDE";
const char* server = "http://IP_DO_PC:5000/api/dados"; // URL do backend Flask

// Sensor de temperatura e umidade
AM2320_asukiaaa mySensor;

//Sensor de Chuva
const int PINO_CHUVA = 35;

// Sensor MQ-135
#define placa "ESP32"
#define Voltage_Resolution 3.3
#define pinMQ135 34
#define type "MQ-135"
#define ADC_Bit_Resolution 12
#define RatioMQ135CleanAir 3.6

MQUnifiedsensor MQ135(placa, Voltage_Resolution, ADC_Bit_Resolution, pinMQ135, type);

void setup() {
  Serial.begin(115200);

  // Inicializa MQ-135 primeiro
  MQ135.setRegressionMethod(1);
  MQ135.setA(110.47);
  MQ135.setB(-2.862);
  MQ135.init();

  Serial.println("Calibrando MQ-135 (aguarde)...");
  float r0 = 0;
  for (int i = 1; i <= 10; i++) {
    MQ135.update();
    float calib = MQ135.calibrate(RatioMQ135CleanAir);
    Serial.print("Calibração ["); Serial.print(i); Serial.print("]: "); Serial.println(calib);
    r0 += calib;
    delay(500);
  }
  MQ135.setR0(r0 / 10);
  Serial.print("R0 calibrado: ");
  Serial.println(MQ135.getR0());

  if (isnan(MQ135.getR0()) || isinf(MQ135.getR0())) {
    Serial.println("Erro ao calibrar o MQ-135!");
    while (true);
  }

  // Só depois, inicia o Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Conectando ao Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado ao Wi-Fi!");
  Serial.print("IP do ESP32: ");
  Serial.println(WiFi.localIP());

  // Sensor I2C e pino de chuva
  Wire.begin(21, 22);
  mySensor.setWire(&Wire);
  pinMode(PINO_CHUVA, INPUT);
}


void loop() {
  // Atualiza sensores
  mySensor.update();
  float temperatura = mySensor.temperatureC;
  float umidade = mySensor.humidity;
  int chuva = analogRead(PINO_CHUVA);

  // Leitura MQ-135
  MQ135.update();
  MQ135.setA(110.47);
  MQ135.setB(-2.862);
  float co2_ppm = MQ135.readSensor(); // Ajuste típico para incluir CO2 ambiente

  // Monta JSON
  String payload = "{";
  payload += "\"temperatura\": " + String(temperatura, 2) + ",";
  payload += "\"umidade\": " + String(umidade, 2) + ",";
  payload += "\"qualidadeAr\": " + String(co2_ppm, 2) + ",";
  payload += "\"chuva\": " + String(chuva);
  payload += "}";

  Serial.println("Enviando dados:");
  Serial.println(payload);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(server);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(payload);
    Serial.println("Resposta HTTP: " + String(httpResponseCode));
    http.end();
  } else {
    Serial.println("Wi-Fi desconectado. Não foi possível enviar os dados.");
  }

  delay(3000); // Aguarda 30 segundos
}
