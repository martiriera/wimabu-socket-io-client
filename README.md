# wimabu-socket-io-client

This repo contain client simulations to test WifiMapBuilder-server backend. The folders bi/unidirectional separate the two modes of sync. The executable files are the following:

* bidirectional/actionMaps.js: To test add, delete and update actions on Maps. Comment/uncomment socket.emit that you need to test. Fill the delete/update jsons with existing ids on the db.

* unidirectional/actionMapsUnidirectional.js: Same as above but unidirectionally. On the delete/update cases you need to answer the server with 'forceAdd', 'forceUpdate' or 'abort' events. 

* bidirectional/actionMapInfo.js: To test the info action type on Maps. Change "mapClientInfo.json" with desired (and/or existing) ids/versions. Client should send a similar report at every sync.

* unidirectional/actionMapsInfoUnidirectional.js: Same as avobe but unidirectionally. You will have to answer with forcingAdd/forcingUpdate too. 

Note: Almost all jsons have "values" to be filled before starting any sync