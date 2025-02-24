
// import mqtt from 'mqtt';
	
// import Paho from 'paho-mqtt';

const Paho = require('paho-mqtt');

// let brokerUrl = 'https://0.tcp.sa.ngrok.io:18196'
// Esse é o endereco relativo a digital ocean
let brokerUrl = 'ws://159.223.188.213:8884/'
// Esse aqui é para rodar localmente
// let brokerUrl = 'ws://localhost:8884/'
let clientId = '17243'

console.log(brokerUrl)

const clientMQTT = new Paho.Client(brokerUrl,  clientId);

clientMQTT.connect({
    onSuccess: () => {
        console.log('Conectado ao broker MQTT via WebSockets');
        // Você pode adicionar mais lógica aqui se necessário
    },
    onFailure: (error) => {
        console.error('Falha na conexão:', error);
    },
    useSSL: false // Use SSL se necessário
});
// const client_MQTT = mqtt.connect('ws://localhost:8884');


const publishMessage = (topic, message) => {
    const mqttMessage = new Paho.Message(message);
    mqttMessage.destinationName = topic;
    clientMQTT.send(mqttMessage);
};


// const mqttClient = {
//     publishMessage: (topic, message) => {
//         client_MQTT.publish(topic, message);
//     }
// };

module.exports = {publishMessage};


