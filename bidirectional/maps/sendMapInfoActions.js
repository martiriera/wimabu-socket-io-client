// JavaScript socket.io code
var fs = require('fs');
var io = require("socket.io-client");
var mapClientInfo = require("./jsons/mapClientInfo.json");
var userCredentials = require("../../userCredentials.json");


console.log('Starting connection...');
var socket = io('https://localhost:8080/sendActions', {
    ca: fs.readFileSync('../../selfsigned.crt'),
    rejectUnauthorized: false
});
socket.on('error', function (evData) {
    console.error('Connection Error:', evData);
});

socket.on('connected', (data) => {
    console.log(data);


    // Before sending any actions, submit user credentials
    socket.emit('sendUserCredentials', userCredentials);

    // When credentials are validated start SYNC sending actions
    socket.on('userAuth', authRes => {
        if (authRes) {
            socket.emit('sendMapActions', mapClientInfo);
        } else {
            console.log('Error authenticating user')
        }
    })

    socket.on('infoActionResult', result => {
        console.log(result)
    })
});

