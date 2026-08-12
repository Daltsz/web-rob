
// // import mqtt from 'mqtt';
	
// // import Paho from 'paho-mqtt';

// const Paho = require('paho-mqtt');

// const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
// // let brokerUrl = 'https://0.tcp.sa.ngrok.io:18196'
// // Esse é o endereco relativo a digital ocean
// // let brokerUrl = 'ws://159.223.188.213:8884/'
// const wsUrl  = isLocal ? "ws://localhost:8884/" : "wss://logicaleduc.com.br/mqtt";
// // const port = isLocal ? 8884 : 443;
// // const path = isLocal ? '/' : '/mqtt';
// const clientId = `web-${Math.random().toString(16).slice(2)}`;
// // let brokerUrl = 'wss://logicaleduc.com.br/mqtt'
// // Esse aqui é para rodar localmente
// // let brokerUrl = 'ws://localhost:8884/'
// // let clientId = '17243'

// // console.log(brokerUrl)

// // const clientMQTT = new Paho.Client(brokerUrl,  clientId);
// const clientMQTT = new Paho.Client(wsUrl, clientId);
// let isConnected = false;
// const queue = [];

// clientMQTT.onConnectionLost = (responseObject) => {
//   isConnected = false;
//   console.error('Conexão MQTT perdida:', responseObject?.errorMessage);
// };

// clientMQTT.connect({
//     useSSL: !isLocal,
//     timeout: 10,
//     keepAliveInterval: 30,
//     onSuccess: () => {
//         isConnected = true;
//         console.log('Conectado ao broker MQTT via WebSockets', wsUrl);
//         while (queue.length) {
//             const { topic, message } = queue.shift();
//             try {
//                 const mqttMessage = new Paho.Message(message);
//                 mqttMessage.destinationName = topic;
//                 clientMQTT.send(mqttMessage);
//             } catch (e) {
//                 console.error('Falha ao enviar mensagem da fila:', e);
//             }
//         // Você pode adicionar mais lógica aqui se necessário
//         }
//     },
//     onFailure: (error) => {
//         isConnected = false;
//         console.error('Falha na conexão:', error);
//     },
// });
// // const client_MQTT = mqtt.connect('ws://localhost:8884');

// const getMqttStatus = () => ({
//   isConnected,
//   pahoIsConnected: clientMQTT.isConnected?.() ?? null,
// });


// const publishMessage = (topic, message) => {
//     if (!isConnected) {
//         console.warn('MQTT não conectado ainda, enfileirando mensagem', { topic, len: message.length });
//         queue.push({ topic, message: String(message)});
//         return false;
//     }

//     console.log('[MQTT publish]', { topic, len: message.length });

//     const mqttMessage = new Paho.Message(String(message));
//     mqttMessage.destinationName = topic;
//     mqttMessage.qos = 1;
//     mqttMessage.retained = false;
//     try{
//         clientMQTT.send(mqttMessage);
//         console.log('[MQTT publish] sent');
//         return true;
//     }catch (e) {
//         console.error('[MQTT publish] send failed', e);
//         return false;
//     }
// };


// // const mqttClient = {
// //     publishMessage: (topic, message) => {
// //         client_MQTT.publish(topic, message);
// //     }
// // };

// module.exports = {publishMessage, getMqttStatus};


