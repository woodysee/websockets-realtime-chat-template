require('dotenv').config();
// Importing express and defining server
const express = require("express");
//Importing body-parser
const bodyParser = require("body-parser");
const path = require("path");
const expressWS = require('express-ws')

const server = express();
//Adds express-ws support to express server instance...
const appWs = expressWS(server);

/* Using body-parser... */
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.ws("/chat", (ws, req) => {
    //Four standard events for ws to listen to
    ws.on('message', (message) => {
        appWs.getWss().clients.forEach((chat)=>{
            chat.send(">> " + message);
        });
        //PRINTING IN AS A LOG
        console.log(`>> Incoming message = ${message}`, message);
        //OUT
        // ws.send("Outgoing message: processed in uppercase: " + message.toUpperCase());
    });
    ws.on('open', ()=>{
        console.info("Connection opened");
    });
    ws.on('close', () => {
        console.info("Connection closed");
    });
    ws.on('error', () => {
        console.error("Connection error");
    });
});

server.use(express.static(path.join(__dirname, "../client")));
server.use(express.static(path.join(__dirname, "../client/bower_components")));

const SERVER_PORT = process.env.SERVER_PORT | 3000;

server.listen(
    SERVER_PORT,
    () => {
        console.log(`Listening with server/server.js at port ${SERVER_PORT}`);
    }
);