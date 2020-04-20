// JavaScript socket.io code

var io = require("socket.io-client");
var campaignSubmitJSON = require("./campaignClientSubmit.json");
var campaignDeleteJSON = require("./campaignClientDelete.json")

console.log('Starting connection...');
var socket = io.connect('http://localhost:8080/sendActions');
socket.on('error', function (evData) {
    console.error('Connection Error:', evData);
});

socket.on('connected', (data) => {
    console.log(data);

    // socket.emit('sendCampaignActions', campaignSubmitJSON);
    socket.emit('sendCampaignActions', campaignDeleteJSON);

    socket.on('campaignActionResult', result => {
        console.log(JSON.stringify(result, null, 2))
        if (result.status === "ACK") {
            setTimeout(sendFin, 5000)
        } else {
            console.log('ROLLBACK')
        }
    })

    function sendFin() {
        socket.emit('clientFin',
            {
                mapIdRecievedByClient: true,
                actions: null,
            }
        )
        console.log(`FIN sent`)

    }

});

