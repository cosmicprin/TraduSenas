from flask import Flask, request, jsonify

app = Flask(__name__)

# Simulación de reconocimiento (ejemplo simple para testear)
def reconocer_letra(valores):
    # Esto se puede reemplazar con lógica o IA real
    if valores == [1.0, 0.0, 0.0, 0.0, 0.0]:
        return "A"
    elif valores[0] < 0.5 and valores[4] > 0.7:
        return "B"
    elif sum(valores) > 4:
        return "C"
    else:
        return "?"

@app.route("/", methods=["POST"])
def recibir_datos():
    data = request.get_json()

    if not data or "sensores" not in data:
        return jsonify({"error": "Faltan datos del sensor"}), 400

    sensores = data["sensores"]

    # Validar que sean exactamente 5 valores entre 0.0 y 1.0
    if (
        not isinstance(sensores, list)
        or len(sensores) != 5
        or not all(isinstance(v, (int, float)) and 0.0 <= v <= 1.0 for v in sensores)
    ):
        return jsonify({"error": "Se requieren 5 valores entre 0.0 y 1.0"}), 400

    letra = reconocer_letra(sensores)
    return jsonify({"letra_reconocida": letra})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
