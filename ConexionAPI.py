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
