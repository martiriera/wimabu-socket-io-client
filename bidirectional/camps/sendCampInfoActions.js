// JavaScript socket.io code

var io = require("socket.io-client");
var campaignClientInfo = require("./jsons/campaignClientInfo.json");
var userCredentials = require("../../userCredentials.json");

console.log('Starting connection...');
var socket = io.connect('http://localhost:8080/sendActions');
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
            socket.emit('sendCampaignActions', campaignClientInfo);
        } else {
            console.log('Error authenticating user')
        }
    });

    socket.on('infoActionResult', result => {
        console.log(JSON.stringify(result, null, 2))
    })
});

