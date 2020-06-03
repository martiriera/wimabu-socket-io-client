// JavaScript socket.io code

var io = require("socket.io-client");
var campaignClientInfo = require("./jsons/campClientInfoUNI.json");
var forceAddJSON = require("./jsons/campForceAdd.json");

console.log('Starting connection...');
var socket = io.connect('http://localhost:8080/sendActions');
socket.on('error', function (evData) {
    console.error('Connection Error:', evData);
});

socket.on('connected', (data) => {
    console.log(data);

    socket.emit('sendCampaignActions', campaignClientInfo);

    socket.on('infoActionResult', result => {
        console.log(JSON.stringify(result, null, 2))
        if (result.type === 'MISSING'){
            // socket.emit('abort')
            sendForceAdd()
        }

    })

    function sendForceAdd() {
        socket.emit('forceAdd', forceAddJSON);
        console.log(`Force ADD Sent`)
    }

});

