# 🌱 Sistema de Monitoramento Ambiental com IoT

Este projeto tem como objetivo o desenvolvimento de um sistema de monitoramento ambiental baseado em sensores conectados a um microcontrolador ESP32. Ele coleta dados de temperatura, umidade, qualidade do ar e chuva, envia essas informações para um servidor backend em Flask e exibe os dados em um painel web criado com React. Além disso, o sistema envia alertas via bot do Telegram em caso de condições críticas.

## 📷 Visão Geral

![Diagrama do Projeto](./fotos/Diagrama.png)
> Monitoramento em tempo real de variáveis ambientais com sensores de baixo custo.

---

## 🔧 Tecnologias Utilizadas

- **ESP32**: Microcontrolador responsável pela coleta dos dados.
- **MQ-135**: Sensor de qualidade do ar.
- **AM2320**: Sensor de temperatura e umidade.
- **Sensor de chuva resistivo**
- **Arduino IDE**: Utilizado para programar o ESP32.
- **Flask (Python)**: Backend responsável por processar os dados.
- **React.js**: Frontend para visualização em tempo real.
- **Telegram Bot**: Envio automático de alertas para o usuário.

---

## 📊 Funcionalidades

- Coleta e envio de dados ambientais em tempo real.
- Processamento dos dados no backend com categorização de criticidade.
- Visualização dos dados em um painel web responsivo.
- Alertas automáticos via Telegram em caso de:
  - Qualidade do ar inadequada
  - Chuva detectada

---

## 🚀 Como Executar o Projeto

### 1. Backend (Flask)
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 2. Frontend (React)
```bash
cd frontend
npm install
npm start
```

### 3. ESP32
Abra o código esp32_monitor.ino na Arduino IDE
Faça upload para a placa ESP32
Configure a rede Wi-Fi e IP do backend no código

### 4. Configuração do Bot do Telegram
Crie um bot com o @BotFather
Obtenha o TOKEN e o chat_id do destinatário
Configure esses dados no arquivo .env do backend:

TELEGRAM_TOKEN=seu_token_aqui
TELEGRAM_CHAT_ID=seu_chat_id_aqui

### 5. Estrutura de Pastas
    .
├── backend/
│   └── app.py
├── frontend/
│   └── src/
├── esp32/
│   └── esp32_monitor.ino
├── fotos/
│   └── imagens para documentação
└── README.md

### 6. Prova de Conceito
Este projeto foi desenvolvido como uma prova de conceito (PoC), com foco em demonstrar a viabilidade técnica da integração entre sensores, backend e frontend para fins de monitoramento ambiental em tempo real.

