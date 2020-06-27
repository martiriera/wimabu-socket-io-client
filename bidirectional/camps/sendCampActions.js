// JavaScript socket.io code
var fs = require('fs');
var io = require("socket.io-client");
var campaignAddJSON = require("./jsons/campaignClientAdd.json");
var campaignDeleteJSON = require("./jsons/campaignClientDelete.json")
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
            // socket.emit('sendCampaignActions', campaignAddJSON);
            // socket.emit('sendCampaignActions', campaignDeleteJSON);
        } else {
            console.log('Error authenticating user')
        }
    })

    socket.on('campaignActionResult', result => {
        console.log(JSON.stringify(result, null, 2))
        if (result.status === "ACK") {
            setTimeout(sendFin, 5000)
        } else {
            console.log('ROLLBACK')
        }
    })

    function sendFin(clientTID) {
        socket.emit('clientFin',
            {
                clientTID: clientTID,
                actions: null,
            }
        )
        console.log(`FIN Sent`)
    }

});

