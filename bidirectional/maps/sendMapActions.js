// JavaScript socket.io code
var fs = require('fs');
var io = require("socket.io-client");
var mapAddJSON = require("./jsons/mapClientAdd.json");
var campaignSubmitJSON = require("../camps/jsons/campaignClientAdd.json");
var mapUpdateJSON = require("./jsons/mapClientUpdate.json")
var mapDeleteJSON = require("./jsons/mapClientDelete.json")
var userCredentials = require("../../userCredentials.json");
var { imageToBytea } = require("../../images/imageToBytea");


console.log('Starting connection...');
// var socket = io.connect('https://localhost:8080/sendActions', { secure: true, reconnect: true, rejectUnauthorized : false });
var socket = io('https://localhost:8080/sendActions', {
    ca: fs.readFileSync('../../selfsigned.crt'),
    rejectUnauthorized: false
});
socket.on('error', function (evData) {
    console.error('Connection Error:', evData);
});

socket.on('connected', async function (data) {
    var mapHasCampaigns = false; //CHANGE IF NECESSARY
    console.log(data);
    setTimeout(() => socket.emit('disconnect'), 30000) //Disconnect from socket in X millis
    await convertImages(mapAddJSON); // Convert images to byteArray and put in on add attrs

    // Before sending any actions, submit user credentials
    socket.emit('sendUserCredentials', userCredentials);

    // When credentials are validated start SYNC sending actions
    socket.on('userAuth', authRes => {
        if (authRes) {
            // socket.emit('sendMapActions', mapAddJSON); //Send ADD map actions
            // socket.emit('sendMapActions', mapUpdateJSON); //Send an UPDATE map action
            // socket.emit('sendMapActions', mapDeleteJSON); //Send a DELETE map action}
        } else {
            console.log('Error authenticating user')
        }
    })

    socket.on('mapActionResult', result => {
        console.log(result)
        if (result.type === "OUTDATED") { // Map outdated on a client UPDATE attempt
            // Update ADB with server attrs
        } else if (result.type && result.status === "ACK") { // Result is a DEL/UPDATE completed 
            setTimeout(sendFin, 5000) //Wait 5 secs and send FIN
            // DEL/UPD client logic
        } else if (result.data.mapServerId && result.status === "ACK" && mapHasCampaigns) { // Map has campaigns to be sended, the FIN will include them
            setTimeout(sendFinPiggy, 5000) //Wait 5 secs and send piggybacked FIN
        } else if (result.data.mapServerId && result.status === "ACK" && !mapHasCampaigns) { // Map doesn't have campaigns, FIN only informs
            setTimeout(sendFin, 5000) //Wait 5 secs and send FIN
        } else {
            console.log('ROLLBACK') //Rollback client transaction
        }
    })

    socket.on('infoActionResult', result => {
        console.log(result)
    })

    function sendFin(clientTID) {
        socket.emit('clientFin',
            {
                clientTID: 'TID',
                actions: null,
            }
        )
        console.log(`FIN Sent`)
    }

    function sendFinPiggy() {
        socket.emit('clientFin',
            {
                clientTID: 'TID',
                actions: campaignSubmitJSON // NOT SIMPLY AS THIS. MUST ADD CLIENT LOGIC TO PUT MAPSERVERIDS HERE
            }
        )
        console.log(`FIN with campaigns sent`)

    }

});

async function convertImages(mapAddJSON) {
    mapAddJSON.actions[0].data.mapImageByteArray = await imageToBytea(__dirname + "/../../images/mapImage1.png");
    mapAddJSON.actions[1].data.mapImageByteArray = await imageToBytea(__dirname + "/../../images/mapImage2.png");
    mapAddJSON.actions[2].data.mapImageByteArray = await imageToBytea(__dirname + "/../../images/mapImage3.png");

}

