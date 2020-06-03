# wimabu-socket-io-client

This repo contain client simulations to test WifiMapBuilder-server backend. There are separated folders for bidirectional or unidirectional sync mode containing maps/camps actions inside and separated too. All de .js scripts get the data from /jsons folders.

* bidirectional/sendMapActions.js: To test add, delete and update actions on Maps. Comment/uncomment socket.emit at the top of the      script depending on that you need to test. Fill the delete/update jsons with existing ids on the db.

* unidirectional/sendMapActionsUni.js: Same as above but unidirectionally. On the delete/update cases you need to choose what to answer to the server: an 'abort', 'forceAdd', 'forceUpdate'. Notice that a FIN is sent after these forcing events.  

* bidirectional/sendMapInfoActions.js: To test the info action type on Maps. Change "mapClientInfo.json" with desired (and/or existing) ids/versions. The real client should send a similar report at every sync.

* unidirectional/actionMapsInfoUnidirectional.js: Same as avobe but unidirectionally. You will have to answeran 'abort', 'forceAdd', 'forceUpdate' too

Note: Almost all jsons have "values" to be filled before starting any sync. 