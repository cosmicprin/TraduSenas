from flask import Flask, request, jsonify, abort
from werkzeug.exceptions import HTTPException, BadRequest
import numpy as np



app = Flask(__name__)


PATRONES_LETRAS_SIMULADOS = {



    "A": [10, 90 , 90 , 90 , 90 ], 

    # "B": [0.40, 10, 10, 10, 10], 
    # "C": [0.50, 0.50, 0.50, 0.50, 0.50], #Diferenciar entre la C y la E
    # "D": [90 , 10, 90 , 90 , 90 ],

    "E": [50,50,50,50,50],

    # "F": [90 , 90 , 10, 10, 10],
    # "G": [0.20, 10, 90 , 90 , 90 ],
    # "H": [0.20, 10, 10, 90 , 90 ],

    "I": [60, 90 , 90 , 90 , 10],

    # "J": [60, 0.80, 0.80, 0.80, 10], #Giroscopio
    # "K": [0.20, 10, 0.40, 90 , 90 ],
    # "L": [10, 10, 90 , 90 , 90 ],
    # "M": [0.25, 0.25, 0.25, 90 , 90 ], #Desarrollo
    # "N": [0.25, 0.25, 90 , 90 , 90 ], #Desarrollo 
    "O": [90 , 90 , 90 , 90 , 90 ], #Mismo caso que la C
    # "P": [10, 10, 90 , 90 , 90 ], #Se parece 
    # "Q": [10, 10, 90 , 90 , 90 ], #tiene problemas de rango 
    # "R": [90 , 0.40, 0.40, 90 , 90 ], #Apretar indice con el medio
    # "S": [90 , 90 , 90 , 90 , 90 ], 
    # "T": [90 , 90 , 10, 10, 10], 
    "U": [90 , 10, 10, 90 , 90 ], #Misma seña U
    # "V": [90 , 10, 10, 90 , 10], #Misma seña V
    # "W": [90 , 10, 10, 10, 90 ],
    # "X": [90 , 0.70, 90 , 90 , 90 ],
    # "Y": [10, 90 , 90 , 90 , 10],
    # "Z": [0.30, 0.70, 0.30, 0.70, 0.30] #Giroscopio



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

#Un metodo GET para traerse los datos del JSON



@app.route("/reconocer_letra", methods=["GET"])
def reconocer_letra():
    # Usar getlist para obtener todos los valores del parámetro 'sensores'
    valores_sensores_str = request.args.getlist("sensores")
    
    if not valores_sensores_str:
        raise BadRequest("El parámetro 'sensores' es requerido.")
    
    try:
        # Convertir cada valor de la lista a float
        valores_sensores = [float(v) for v in valores_sensores_str]
    except ValueError:
        raise BadRequest("Todos los valores de los sensores deben ser números.")
    
    NUM_SENSORES_ESPERADOS = 5 
    if len(valores_sensores) != NUM_SENSORES_ESPERADOS:
        raise BadRequest(f"Se esperaban {NUM_SENSORES_ESPERADOS} valores de sensores, pero se recibieron {len(valores_sensores)}.")

    # A partir de aquí, tu lógica de reconocimiento debería ser la misma
    try:
        letra_reconocida = simular_reconocimiento_ml(valores_sensores)
        return jsonify({"letra_reconocida": letra_reconocida})
    except Exception as e:
        return jsonify({"error": "Fallo al reconocer la letra", "mensaje": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
    