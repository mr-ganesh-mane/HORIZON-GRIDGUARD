from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Allow the HORIZON GRIDGUARD website
# to communicate with this API.
CORS(app)


# =====================================================
# LATEST SENSOR DATA
# No database is used.
# Data is stored temporarily in server memory.
# =====================================================

latest_data = {
    "temperature": None,
    "humidity": None
}


# =====================================================
# API HOME
# =====================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "project": "HORIZON GRIDGUARD",
        "status": "REST API is running",
        "endpoints": {
            "send_data": "POST /api/data",
            "latest_data": "GET /api/latest"
        }
    })


# =====================================================
# ESP32 → REST API
# POST SENSOR DATA
# =====================================================

@app.route("/api/data", methods=["POST"])
def receive_data():

    global latest_data

    data = request.get_json(silent=True)

    if data is None:

        return jsonify({
            "success": False,
            "error": "JSON data was not received"
        }), 400


    temperature = data.get("temperature")
    humidity = data.get("humidity")


    if temperature is None:

        return jsonify({
            "success": False,
            "error": "Temperature is missing"
        }), 400


    if humidity is None:

        return jsonify({
            "success": False,
            "error": "Humidity is missing"
        }), 400


    try:

        temperature = float(temperature)
        humidity = float(humidity)

    except (TypeError, ValueError):

        return jsonify({
            "success": False,
            "error": "Temperature and humidity must be numbers"
        }), 400


    # Store the newest reading

    latest_data = {

        "temperature": temperature,
        "humidity": humidity

    }


    print("--------------------------------")
    print("HORIZON GRIDGUARD SENSOR DATA")
    print("Temperature:", temperature, "°C")
    print("Humidity:", humidity, "%")
    print("--------------------------------")


    return jsonify({

        "success": True,

        "message": "Sensor data received",

        "data": latest_data

    }), 200


# =====================================================
# WEBSITE → REST API
# GET LATEST SENSOR DATA
# =====================================================

@app.route("/api/latest", methods=["GET"])
def get_latest_data():

    return jsonify({

        "success": True,

        "data": latest_data

    }), 200


# =====================================================
# START SERVER
# =====================================================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True

    )