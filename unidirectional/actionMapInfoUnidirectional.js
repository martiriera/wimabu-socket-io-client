// JavaScript socket.io code

var io = require("socket.io-client");
var mapClientInfo = require("./jsons/mapClientInfoUNI.json");
var forceAddJSON = require("./jsons/mapForceAdd.json");
var forceUpdateJSON = require("./jsons/mapForceUpdate.json");

console.log('Starting connection...');
var socket = io.connect('http://localhost:8080/sendActions');
socket.on('error', function (evData) {
    console.error('Connection Error:', evData);
});

socket.on('connected', (data) => {
    console.log(data);

    socket.emit('sendMapActions', mapClientInfo);

    socket.on('infoActionResult', result => {
        console.log(JSON.stringify(result, null, 2))
        if (result.type === 'OUTDATED') {
            socket.emit('abort')
            // sendForceUpdate()
        }else if (result.type === 'MISSING'){
            socket.emit('abort')
            // sendForceAdd()
        }

    })

    function sendForceAdd() {
        socket.emit('forceAdd', forceAddJSON);
        console.log(`Force ADD Sent`)
    }

    function sendForceUpdate() {
        socket.emit('forceUpdate', forceUpdateJSON);
        console.log(`Force UPDATE Sent`)
    }

});

