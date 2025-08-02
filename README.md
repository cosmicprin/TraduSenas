# Plantilla Avance Preliminar del Proyecto

## 1. Información del Proyecto
- **Nombre del Proyecto:** TraduSeñas
- **Equipo:** Abigail Mora, Melina Soto, Josué Morales, Walky Hernández.
- **Roles:** - 

## 2. Descripción y Justificación
- **Problema que se aborda:**
  El aprendizaje de LESCO en entornos educativos es limitado por la falta de recursos interactivos. TraduSeñas aborda esta necesidad ofreciendo una herramienta tecnológica que facilita la enseñanza y práctica del alfabeto LESCO.
- **Importancia y contexto:**
  La Lengua de Señas Costarricense es el medio de comunicación principal de las personas con capacidad auditiva reducida, sin embargo, su enseñanza formal y aprendizaje autodidacta son poco accesibles. TraduSeñas representa una herramienta innovadora para el aprendizaje del alfabeto LESCO, permitiendo que estudiantes, docentes y cualquier persona interesada puedan interactuar con la lengua de señas de forma accesible y tecnológica, al fomentar la inclusión educativa, el proyecto contribuye a una sociedad más consciente de la diversidad comunicativa.
- **Usuarios/beneficiarios:**
  Bibliotecas, universidades, escuelas de educación especial y hogares con personas sordas o estudiantes de la lengua.

## 3. Objetivos del Proyecto
- **Objetivo General:**
  Promover el aprendizaje del alfabeto de la Lengua de Señas Costarricense (LESCO), facilitando la inclusión educativa mediante un sistema accesible que interpreta letras dactilológicas a texto utilizando sensores, microcontrolador y procesamiento digital.
- **Objetivos Específicos:**
  Diseñar e implementar un guante sensorizado capaz de detectar movimientos correspondientes a las letras del alfabeto LESCO.
  Programar un microcontrolador que procese las señales de los sensores y las traduzca en datos legibles.
  Desarrollar una aplicación móvil conectada a una API que reciba, interprete y visualice las letras detectadas en tiempo real.

## 4. Requisitos Iniciales
- Lista breve de lo que el sistema debe lograr:  
  - Requisito 1
    Detectar correctamente las letras del alfabeto LESCO mediante sensores integrados en el guante.
  - Requisito 2
    Procesar y traducir las señales del guante a texto legible mediante el microcontrolador.
  - Requisito 3
    Visualizar el resultado de la traducción en una aplicación móvil conectada al sistema.

## 5. Diseño Preliminar del Sistema
- **Arquitectura inicial (diagrama):**
   
  ![WhatsApp Image 2025-08-02 at 11 06 43](https://github.com/user-attachments/assets/ae671022-2f4b-4716-9184-d66ed2bdfa96)

- **Componentes previstos:**  
  - Microcontrolador: ESP32/IdeaBoard
  - Sensores/actuadores: Sensores de Flexión 
  - LLM/API: API local para conversión de señas a texto (sin uso de LLM actualmente).

### Librerías y herramientas:
  
  - Librería: IdeaBoard
  - Módulos: socketpool, ssl, wifi
    
  - Librería: adafruit_requests
  - Módulos: json, time, board
    
  - IDE: Visual Studio Code, Thonny


- **Bocetos o esquemas:**
  
  ![435d46ff-e6c8-487b-b2b1-e61f61e1161c](https://github.com/user-attachments/assets/79891ffc-639a-4970-b803-70fa446ac21d)
  
## 6. Plan de Trabajo
- **Cronograma preliminar:**
  
  ![48159d65-4aab-46b7-a6fc-7cadfa701b19](https://github.com/user-attachments/assets/e788e006-088e-44e9-83c3-92dfb425b4fc)

- **Riesgos identificados y mitigaciones:**  
  - Riesgo 1: Mitigación  
  - Riesgo 2: Mitigación  

## 7. Prototipos conceptuales (si aplica)
- **Código mínimo de prueba:**  
  ##Codigo para conectar guante a la API

from ideaboard import IdeaBoard
import socketpool
import ssl
import wifi
import adafruit_requests as requests
import json
import time
import board

ib = IdeaBoard()
# ===== CONFIGURACIÓN DE RED =====
WIFI_SSID = "Via Lactea 2.4"
WIFI_PASSWORD = "HAKIJUBRULU2"

API_URL = "http://192.168.1.23:5000/reconocer_letra"

# ===== CONEXIÓN A WIFI =====
print("Conectando a WiFi...")
wifi.radio.connect(WIFI_SSID, WIFI_PASSWORD)
print("Conectado a WiFi")

socket = socketpool.SocketPool(wifi.radio)
session = requests.Session(socket, ssl.create_default_context())

# ===== CONFIGURACIÓN DE SENSORES =====
sensor_pulgar = ib.AnalogIn(board.IO27)
sensor_indice = ib.AnalogIn(board.IO33)
sensor_medio = ib.AnalogIn(board.IO32)
sensor_anular = ib.AnalogIn(board.IO25)
sensor_meñique = ib.AnalogIn(board.IO26)

# ===== FUNCIÓN PARA NORMALIZAR =====
def normalizar_sensor(lectura):
    return round(0.1 + (lectura / 4095) * 0.9, 2)

# ===== LOOP PRINCIPAL =====
while True:
    try:
        valores = [
            normalizar_sensor(sensor_pulgar.value),
            normalizar_sensor(sensor_indice.value),
            normalizar_sensor(sensor_medio.value),
            normalizar_sensor(sensor_anular.value),
            normalizar_sensor(sensor_meñique.value)           
       ]
        dicto= {"sensores" : valores}
        jsonData = json.dumps(dicto)
        
        print("Valores sensores:", valores)
        
        resp = session.post(API_URL, data = jsonData, headers = {"Content-Type": "application/json"}) 
        print("Respuesta API:", resp.json())
    
    except Exception as e:
        print("Error:", e)
    
    time.sleep(1)

- **Evidencia visual:**  
  
![583c3e04-3d56-40a5-a371-270b7db729d5](https://github.com/user-attachments/assets/7d68055a-564c-4f71-b616-a8f65a55736a)
![e8985b97-9609-4f43-9bd2-f4b0a44ea4e2](https://github.com/user-attachments/assets/0e41be7e-9561-46d0-8281-1df01829a7de)
![b3ac9493-ec70-4a6f-8304-23559420acfc](https://github.com/user-attachments/assets/c890a717-d68e-4b95-8094-4a86f8e209f0)
![0ca2e495-6443-4fd1-8b5c-68149afdd703](https://github.com/user-attachments/assets/1d8c1eaa-1af5-4887-ab7d-d1bbf3e2f373)
