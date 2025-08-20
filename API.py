from flask import Flask, request, jsonify, abort
from werkzeug.exceptions import HTTPException, BadRequest
import numpy as np

from flask_cors import CORS #instalar: pip install flask-cors
import time


app = Flask(__name__)
CORS(app) # Permite que el JS se conecte a la API

# Variable para guardar los últimos valores recibidos del guante del sensor
ultimo_valor_sensores = {
    "valores": None,
    "timestamp": 0
}

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
    input_array = np.array(valores_sensores_entrada)
    mejor_letra = "DESCONOCIDA"
    min_distancia = float('inf')
    for letra, patron in PATRONES_LETRAS_SIMULADOS.items():
        patron_array = np.array(patron)
        distancia = np.linalg.norm(input_array - patron_array)
        if distancia < min_distancia:
            min_distancia = distancia
            mejor_letra = letra
    return mejor_letra

# --- RUTA PARA EL GUANTE (IdeaBoard) ---
# El guante debe enviar sus datos a ESTA ruta
@app.route("/actualizar_sensores", methods=["GET"])
def actualizar_sensores():
    valores_str = request.args.getlist("sensores")
    if not valores_str:
        return jsonify({"error": "Parámetro 'sensores' requerido."}), 400
    try:
        valores_float = [float(v) for v in valores_str]
        # Guardamos los valores en nuestra "memoria"
        ultimo_valor_sensores["valores"] = valores_float
        ultimo_valor_sensores["timestamp"] = time.time()
        print(f"Valores de sensores actualizados: {valores_float}")
        return jsonify({"mensaje": "Datos recibidos correctamente"}), 200
    except ValueError:
        return jsonify({"error": "Los valores de los sensores deben ser números."}), 400

# --- RUTA PARA LA PÁGINA WEB (JavaScript) ---
@app.route("/obtener_ultima_letra", methods=["GET"])
def obtener_ultima_letra():
    # Revisamos si hay datos y si no son muy viejos (ej. 5 segundos)
    if ultimo_valor_sensores["valores"] is None or (time.time() - ultimo_valor_sensores["timestamp"] > 10):
        return jsonify({"error": "No hay datos recientes del guante. Verifique la conexión."}), 408
    
    # Si hay datos, los procesamos y devolvemos la letra
    letra_reconocida = simular_reconocimiento_ml(ultimo_valor_sensores["valores"])
    return jsonify({"letra_reconocida": letra_reconocida})


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)