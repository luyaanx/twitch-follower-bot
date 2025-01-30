//primero analizamos que librarias deberemos de instalar para que funcione el codigo
//npm install axios
//npm install dotenv
//npm install fs
//npm install path
//npm install readline
//npm install request
//npm install request-promise
//npm install request-promise-native
//npm install requestretry
//npm install stream
//npm install twitch
//npm install twitch-auth
//npm install twitch-chat-client
//npm install twitch-webhooks
//npm install ws
//npm install xml2js

//ahora procedemos a escribir el codigo
//primero importamos las librerias
const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const request = require('request');
const requestPromise = require('request-promise');
const requestretry = require('requestretry');
const stream = require('stream');
const twitch = require('twitch');
const twitchAuth = require('twitch-auth');
const twitchChatClient = require('twitch-chat-client');
const twitchWebhooks = require('twitch-webhooks');
const ws = require('ws');
const xml2js = require('xml2js');

//segundo creamos una funcion que nos permita obtener el token de twitch de un archivo (tokens.txt)
function getToken(){
    const token = fs.readFileSync('tokens.txt', 'utf8');
    return token;
}

//tercero creamos una funcion que nos permita obtener el id de un canal de twitch
async function getChannelId(channel){
    const token = getToken();
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Client-Id': process.env.CLIENT_ID
    };

    const url = `https://api.twitch.tv/helix/users?login=${channel}`;
    const response = await axios.get(url, {headers: headers});
    const data = response.data.data[0];
    return data.id;
}

//cuarto creamos una funcion que nos permita seguir un canal de twitch
async function followChannel(channel){
    const token = getToken();
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Client-Id': process.env.CLIENT_ID
    };

    const channelId = await getChannelId(channel);
    const url = `https://api.twitch.tv/helix/users/follows?from_id=${process.env.USER_ID}&to_id=${channelId}`;
    const response = await axios.post(url, null, {headers: headers});
    return response.data;
}

//quinto creamos una funcion que nos permita seguir un canal de twitch un numero de veces
async function followChannelMultipleTimes(channel, times){
    for(let i = 0; i < times; i++){
        await followChannel(channel);
    }
}

//sexto creamos una funcion que nos permita leer el archivo .env
dotenv.config();