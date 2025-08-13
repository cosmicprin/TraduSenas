from flask import Flask, request, jsonify
from werkzeug.exceptions import HTTPException, BadRequest
import numpy as np

app = Flask(__name__)

PATRONES_LETRAS_SIMULADOS = {
    "A": [0.1, 0.9, 0.9, 0.9, 0.9],
    "B": [0.9, 0.9, 0.9, 0.9, 0.1],
    "C": [0.5, 0.5, 0.5, 0.5, 0.5],
    "D": [0.9, 0.1, 0.9, 0.9, 0.9],
    "E": [0.1, 0.1, 0.1, 0.1, 0.1],
    "F": [0.1, 0.1, 0.9, 0.9, 0.9],
    "G": [0.9, 0.1, 0.1, 0.9, 0.9],
    "H": [0.9, 0.1, 0.1, 0.1, 0.9],
    "I": [0.9, 0.9, 0.9, 0.9, 0.1],
    "J": [0.8, 0.8, 0.8, 0.8, 0.2],
    "K": [0.1, 0.9, 0.1, 0.9, 0.9],
    "L": [0.1, 0.9, 0.9, 0.9, 0.1],
    "M": [0.2, 0.2, 0.2, 0.9, 0.9],
    "N": [0.2, 0.2, 0.9, 0.9, 0.9],
    "O": [0.3, 0.3, 0.3, 0.3, 0.3],
    "P": [0.1, 0.9, 0.1, 0.1, 0.9],
    "Q": [0.1, 0.1, 0.9, 0.1, 0.9],
    "R": [0.1, 0.9, 0.9, 0.1, 0.9],
    "S": [0.2, 0.2, 0.2, 0.2, 0.2],
    "T": [0.1, 0.9, 0.9, 0.1, 0.1],
    "U": [0.9, 0.1, 0.1, 0.9, 0.9],
    "V": [0.9, 0.1, 0.1, 0.9, 0.1],
    "W": [0.9, 0.1, 0.1, 0.1, 0.1],
    "X": [0.1, 0.1, 0.9, 0.9, 0.1],
    "Y": [0.1, 0.9, 0.9, 0.1, 0.1],
    "Z": [0.3, 0.6, 0.3, 0.6, 0.3]
}


def simular_reconocimiento_ml(valores_sensores_entrada):
    if not isinstance(valores_sensores_entrada, list) or not valores_sensores_entrada:
        raise ValueError("Los valores del sensor deben ser una lista no vacía.")

    input_array = np.array(valores_sensores_entrada)
    
    mejor_letra = "DESCONOCIDA"
    min_distancia = float('inf')

    for letra, patron in PATRONES_LETRAS_SIMULADOS.items():
        patron_array = np.array(patron)
        
        if len(input_array) != len(patron_array):
            continue

        distancia = np.linalg.norm(input_array - patron_array)

        if distancia < min_distancia:
            min_distancia = distancia
            mejor_letra = letra

    return mejor_letra

@app.errorhandler(BadRequest)
def handle_bad_request(e):
    return jsonify({"error": "Petición inválida", "mensaje": e.description}), 400

@app.errorhandler(HTTPException)
def handle_http_exception(e):
    return jsonify({"error": e.name, "mensaje": e.description}), e.code

@app.errorhandler(Exception)
def handle_general_exception(e):
    return jsonify({"error": "Error interno del servidor", "mensaje": "Algo salió mal"}), 500

@app.route("/")
def index():
    return jsonify({
        "mensaje": "Bienvenido a la API de Reconocimiento de Letras LESCO",
        "instrucciones": "Envía los valores de los sensores del guante a la ruta /reconocer_letra",
        "ejemplo_post": {
            "URL": "/reconocer_letra",
            "Método": "POST",
            "Body (JSON)": {"sensores": [0.1, 0.9, 0.9, 0.9, 0.9]}
        }
    })

@app.route("/reconocer_letra", methods=["POST"])
def reconocer_letra():
    data = request.get_json()

    if not data:
        raise BadRequest("No se recibieron datos JSON válidos.")
    
    valores_sensores = data.get("sensores")

    if not valores_sensores or not isinstance(valores_sensores, list):
        raise BadRequest("El JSON debe contener una clave 'sensores' con una lista de valores numéricos.")
    
    try:
        valores_sensores = [float(v) for v in valores_sensores]
    except ValueError:
        raise BadRequest("Todos los valores de los sensores deben ser números.")
    
    NUM_SENSORES_ESPERADOS = 5 
    if len(valores_sensores) != NUM_SENSORES_ESPERADOS:
        raise BadRequest(f"Se esperaban {NUM_SENSORES_ESPERADOS} valores de sensores, pero se recibieron {len(valores_sensores)}.")

    try:
        letra_reconocida = simular_reconocimiento_ml(valores_sensores)
        return jsonify({"letra_reconocida": letra_reconocida})
    except Exception as e:
        return jsonify({"error": "Fallo al reconocer la letra", "mensaje": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
