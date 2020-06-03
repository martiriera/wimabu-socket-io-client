// JavaScript socket.io code

var io = require("socket.io-client");
var mapAddJSON = require("./jsons/mapClientSubmit.json");
var campaignSubmitJSON = require("../camps/jsons/campaignClientSubmit.json");
var mapUpdateJSON = require("./jsons/mapClientUpdate.json")
var mapDeleteJSON = require("./jsons/mapClientDelete.json")
var { imageToBytea } = require("../../images/imageToBytea");


console.log('Starting connection...');
var socket = io.connect('http://localhost:8080/sendActions');
socket.on('error', function (evData) {
    console.error('Connection Error:', evData);
});

socket.on('connected', async function (data) {
    var mapHasCampaigns = false; //CHANGE IF NECESSARY
    console.log(data);
    setTimeout(() => socket.emit('disconnect'), 30000) //Disconnect from socket in X millis
    await convertImages(mapAddJSON); // Convert images to byteArray and put in on add attrs

    socket.emit('sendMapActions', mapAddJSON); //Send ADD map actions
    // socket.emit('sendMapActions', mapUpdateJSON); //Send an UPDATE map action
    // socket.emit('sendMapActions', mapDeleteJSON); //Send a DELETE map action
    
    socket.on('mapActionResult', result => {
        console.log(JSON.stringify(result, null, 2))
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
    mapAddJSON.actions[0].data.mapImageByteArray = await imageToBytea(__dirname + "/../images/mapImage1.png");
    mapAddJSON.actions[1].data.mapImageByteArray = await imageToBytea(__dirname + "/../images/mapImage2.png");
    mapAddJSON.actions[2].data.mapImageByteArray = await imageToBytea(__dirname + "/../images/mapImage3.png");

}

