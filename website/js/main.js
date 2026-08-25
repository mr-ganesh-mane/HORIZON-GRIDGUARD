// =====================================================
// HORIZON GRIDGUARD
// MAIN JAVASCRIPT
// =====================================================


// =====================================================
// REST API ADDRESS
// =====================================================
//
// LOCAL TEST:
// http://127.0.0.1:5000/api/latest
//
// Later, when we deploy the API publicly,
// we will change this to the public API address.
// =====================================================

const API_URL = "https://horizon-gridguard-apitest.onrender.com/api/latest";


// =====================================================
// THRESHOLDS
// =====================================================

const TEMPERATURE_WARNING = 30;

const HUMIDITY_WARNING = 70;


// =====================================================
// GET ELEMENTS
// =====================================================

const temperatureElement =
    document.getElementById("temperature");

const humidityElement =
    document.getElementById("humidity");

const temperatureCard =
    document.getElementById("temperatureCard");

const humidityCard =
    document.getElementById("humidityCard");

const temperatureProgress =
    document.getElementById("temperatureProgress");

const humidityProgress =
    document.getElementById("humidityProgress");

const temperatureStatus =
    document.getElementById("temperatureStatus");

const humidityStatus =
    document.getElementById("humidityStatus");

const connectionDot =
    document.getElementById("connectionDot");

const connectionText =
    document.getElementById("connectionText");

const overallStatus =
    document.getElementById("overallStatus");

const lastUpdate =
    document.getElementById("lastUpdate");

const alertOverallStatus =
    document.getElementById("alertOverallStatus");


// =====================================================
// FETCH SENSOR DATA
// =====================================================

async function fetchSensorData() {

    try {

        const response = await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "API request failed"
            );

        }


        const result =
            await response.json();


        if (
            !result.success ||
            !result.data
        ) {

            throw new Error(
                "Invalid API response"
            );

        }


        const temperature =
            result.data.temperature;

        const humidity =
            result.data.humidity;


        if (
            temperature === null ||
            humidity === null
        ) {

            setWaitingState();

            return;

        }


        updateTemperature(
            temperature
        );


        updateHumidity(
            humidity
        );


        updateConnection(
            true
        );


        updateOverallStatus(
            temperature,
            humidity
        );


        updateLastUpdate();


    } catch (error) {

        console.error(
            "HORIZON GRIDGUARD API error:",
            error
        );


        updateConnection(
            false
        );

    }

}


// =====================================================
// TEMPERATURE
// =====================================================

function updateTemperature(
    temperature
) {

    if (!temperatureElement) {
        return;
    }


    temperatureElement.textContent =
        temperature.toFixed(1);


    if (temperatureProgress) {

        const percentage =
            Math.min(
                Math.max(
                    temperature,
                    0
                ),
                50
            ) * 2;


        temperatureProgress.style.width =
            percentage + "%";

    }


    if (
        temperature >=
        TEMPERATURE_WARNING
    ) {

        setTemperatureAlert();

    } else {

        setTemperatureNormal();

    }

}


// =====================================================
// TEMPERATURE NORMAL
// =====================================================

function setTemperatureNormal() {

    if (temperatureCard) {

        temperatureCard.style.borderColor =
            "rgba(34, 197, 94, 0.35)";

        temperatureCard.style.boxShadow =
            "0 0 30px rgba(34, 197, 94, 0.08)";

    }


    if (temperatureProgress) {

        temperatureProgress.style.background =
            "#22c55e";

    }


    if (temperatureStatus) {

        temperatureStatus.textContent =
            "Temperature is normal";

        temperatureStatus.className =
            "sensor-status normal";

    }

}


// =====================================================
// TEMPERATURE ALERT
// =====================================================

function setTemperatureAlert() {

    if (temperatureCard) {

        temperatureCard.style.borderColor =
            "#ef4444";

        temperatureCard.style.boxShadow =
            "0 0 35px rgba(239, 68, 68, 0.25)";

    }


    if (temperatureProgress) {

        temperatureProgress.style.background =
            "#ef4444";

    }


    if (temperatureStatus) {

        temperatureStatus.textContent =
            "High temperature detected";

        temperatureStatus.className =
            "sensor-status alert";

    }

}


// =====================================================
// HUMIDITY
// =====================================================

function updateHumidity(
    humidity
) {

    if (!humidityElement) {
        return;
    }


    humidityElement.textContent =
        humidity.toFixed(1);


    if (humidityProgress) {

        const percentage =
            Math.min(
                Math.max(
                    humidity,
                    0
                ),
                100
            );


        humidityProgress.style.width =
            percentage + "%";

    }


    if (
        humidity >=
        HUMIDITY_WARNING
    ) {

        setHumidityAlert();

    } else {

        setHumidityNormal();

    }

}


// =====================================================
// HUMIDITY NORMAL
// =====================================================

function setHumidityNormal() {

    if (humidityCard) {

        humidityCard.style.borderColor =
            "rgba(34, 197, 94, 0.35)";

        humidityCard.style.boxShadow =
            "0 0 30px rgba(34, 197, 94, 0.08)";

    }


    if (humidityProgress) {

        humidityProgress.style.background =
            "#22c55e";

    }


    if (humidityStatus) {

        humidityStatus.textContent =
            "Humidity is normal";

        humidityStatus.className =
            "sensor-status normal";

    }

}


// =====================================================
// HUMIDITY ALERT
// =====================================================

function setHumidityAlert() {

    if (humidityCard) {

        humidityCard.style.borderColor =
            "#ef4444";

        humidityCard.style.boxShadow =
            "0 0 35px rgba(239, 68, 68, 0.25)";

    }


    if (humidityProgress) {

        humidityProgress.style.background =
            "#ef4444";

    }


    if (humidityStatus) {

        humidityStatus.textContent =
            "High humidity detected";

        humidityStatus.className =
            "sensor-status alert";

    }

}


// =====================================================
// CONNECTION STATUS
// =====================================================

function updateConnection(
    connected
) {

    if (!connectionText) {
        return;
    }


    if (connected) {

        connectionText.textContent =
            "API Connected";


        if (connectionDot) {

            connectionDot.style.background =
                "#22c55e";

            connectionDot.style.boxShadow =
                "0 0 15px rgba(34, 197, 94, 0.7)";

        }

    } else {

        connectionText.textContent =
            "API Offline";


        if (connectionDot) {

            connectionDot.style.background =
                "#ef4444";

            connectionDot.style.boxShadow =
                "0 0 15px rgba(239, 68, 68, 0.7)";

        }

    }

}


// =====================================================
// WAITING STATE
// =====================================================

function setWaitingState() {

    updateConnection(
        true
    );


    if (connectionText) {

        connectionText.textContent =
            "Waiting for sensor";

    }


    if (overallStatus) {

        overallStatus.textContent =
            "Waiting for sensor data...";

    }

}


// =====================================================
// OVERALL STATUS
// =====================================================

function updateOverallStatus(
    temperature,
    humidity
) {

    if (!overallStatus) {
        return;
    }


    const highTemperature =
        temperature >=
        TEMPERATURE_WARNING;


    const highHumidity =
        humidity >=
        HUMIDITY_WARNING;


    if (
        highTemperature &&
        highHumidity
    ) {

        overallStatus.textContent =
            "High temperature and humidity detected";

        overallStatus.style.color =
            "#ef4444";


    } else if (highTemperature) {

        overallStatus.textContent =
            "High temperature detected";

        overallStatus.style.color =
            "#ef4444";


    } else if (highHumidity) {

        overallStatus.textContent =
            "High humidity detected";

        overallStatus.style.color =
            "#ef4444";


    } else {

        overallStatus.textContent =
            "System operating normally";

        overallStatus.style.color =
            "#22c55e";

    }


    updateAlertPage(
        temperature,
        humidity
    );

}


// =====================================================
// ALERT PAGE
// =====================================================

function updateAlertPage(
    temperature,
    humidity
) {

    if (!alertOverallStatus) {
        return;
    }


    const highTemperature =
        temperature >=
        TEMPERATURE_WARNING;


    const highHumidity =
        humidity >=
        HUMIDITY_WARNING;


    if (
        highTemperature &&
        highHumidity
    ) {

        alertOverallStatus.textContent =
            "High temperature and humidity detected";

        alertOverallStatus.style.color =
            "#ef4444";


    } else if (highTemperature) {

        alertOverallStatus.textContent =
            "High temperature alert";

        alertOverallStatus.style.color =
            "#ef4444";


    } else if (highHumidity) {

        alertOverallStatus.textContent =
            "High humidity alert";

        alertOverallStatus.style.color =
            "#ef4444";


    } else {

        alertOverallStatus.textContent =
            "System operating normally";

        alertOverallStatus.style.color =
            "#22c55e";

    }

}


// =====================================================
// LAST UPDATE
// =====================================================

function updateLastUpdate() {

    if (!lastUpdate) {
        return;
    }


    const now =
        new Date();


    lastUpdate.textContent =
        now.toLocaleTimeString();

}


// =====================================================
// START
// =====================================================

fetchSensorData();


// =====================================================
// LIVE UPDATE
// Every 2 seconds
// =====================================================

setInterval(
    fetchSensorData,
    2000
);