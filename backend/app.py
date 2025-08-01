from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilita o CORS para permitir requisições do frontend

# Armazenamento dos últimos dados recebidos do ESP
ultimos_dados = {}

@app.route("/api/dados", methods=["POST"])
def receber_dados():
    """
    Rota para receber dados do ESP32 (POST)
    """
    global ultimos_dados
    try:
        dados = request.get_json()
        if not dados:
            return jsonify({"erro": "JSON ausente ou inválido"}), 400
        ultimos_dados = dados
        return jsonify({"status": "dados recebidos com sucesso"}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@app.route("/api/dados", methods=["GET"])
def enviar_dados():
    """
    Rota para enviar os últimos dados ao frontend (GET)
    """
    if not ultimos_dados:
        return jsonify({"mensagem": "Nenhum dado recebido ainda"}), 204
    return jsonify(ultimos_dados), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
