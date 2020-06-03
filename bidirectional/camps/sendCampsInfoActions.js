// JavaScript socket.io code

var io = require("socket.io-client");
var mapClientInfo = require("./jsons/campaignClientInfo.json");

console.log('Starting connection...');
var socket = io.connect('http://localhost:8080/sendActions');
socket.on('error', function (evData) {
    console.error('Connection Error:', evData);
});

socket.on('connected', (data) => {
    console.log(data);

    socket.emit('sendCampaignActions', mapClientInfo);

    socket.on('infoActionResult', result => {
        console.log(JSON.stringify(result, null, 2))
    })
});
