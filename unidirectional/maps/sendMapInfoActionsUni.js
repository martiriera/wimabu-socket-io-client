// JavaScript socket.io code

var io = require("socket.io-client");
var mapClientInfo = require("./jsons/mapClientInfoUNI.json");
var forceAddJSON = require("./jsons/mapForceAdd.json");
var forceUpdateJSON = require("./jsons/mapForceUpdate.json");
var userCredentials = require("../../userCredentials.json");
var { imageToBytea } = require("../../images/imageToBytea");


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
        console.log(JSON.stringify(result, null, 2))
        if (result.type === 'OUTDATED') {
            socket.emit('abort')
            // sendForceUpdate()
        } else if (result.type === 'MISSING') {
            socket.emit('abort')
            // sendForceAdd()
        }

    })

    async function sendForceAdd() {
        await convertImages(forceAddJSON); // Convert images to byteArray and put in on add attrs
        socket.emit('forceAdd', forceAddJSON);
        console.log(`Force ADD Sent`)
        socket.on('mapActionResult', (forcedAddResult) => {
            console.log(forcedAddResult)
            socket.emit('clientFin', {
                clientTID: 'TID',
                actions: null
            })
            console.log('FIN SENT')

        })
    }

    function sendForceUpdate() {
        socket.emit('forceUpdate', forceUpdateJSON);
        console.log('Force UPDATE Sent')
        socket.on('mapActionResult', (forcedUpdateResult) => {
            console.log(forcedUpdateResult)
            socket.emit('clientFin', {
                clientTID: 'TID',
                actions: null
            })
            console.log('FIN SENT')

        })
    }

    async function convertImages(forceAddJSON) {
        forceAddJSON.data.mapImageByteArray = await imageToBytea(__dirname + "/../../images/mapImageForcedAdd.png");
    }

});

