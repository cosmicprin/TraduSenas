import requests

url = "http://127.0.0.1:5000/reconocer_letra"

# Datos de prueba simulados
datos_prueba = {
    "sensores": [0.1, 0.9, 0.9, 0.9, 0.9]  # Se parece a la letra "A"
}

response = requests.post(url, json=datos_prueba)

print("Código de respuesta:", response.status_code)
print("Respuesta JSON:", response.json())
