// JavaScript socket.io code
var fs = require("fs");
var io = require("socket.io-client");
var campaignClientInfo = require("./jsons/campClientInfoUNI.json");
var forceAddJSON = require("./jsons/campForceAdd.json");
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
            socket.emit('sendCampaignActions', campaignClientInfo);
        } else {
            console.log('Error authenticating user')
        }
    });

    socket.on('infoActionResult', result => {
        console.log(JSON.stringify(result, null, 2))
        if (result.type === 'MISSING') {
            socket.emit('abort')
            // sendForceAdd()
        }
    })

    function sendForceAdd() {
        socket.emit('forceAdd', forceAddJSON);
        console.log(`Force ADD Sent`)
        socket.on('campaignActionResult', (forcedAddResult) => {
            console.log(forcedAddResult)
            socket.emit('clientFin', {
                clientTID: 'TID',
                actions: null
            })
            console.log('FIN SENT')

        })
    }

});

