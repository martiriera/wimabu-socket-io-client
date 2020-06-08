# wimabu-socket-io-client

This repo contain client simulations to test WifiMapBuilder-server backend. There are separated folders for bidirectional or unidirectional sync mode containing maps/camps actions inside and separated too. All de .js scripts get the data from /jsons folders.

All the simulated SYNCs are using the user data contained on userCredentials.js. Sample users already registered on the server are the following:

{userId: 'ea194633ef15d22a74a94a9ea55bb65ac03a61cbeafa5ec4728989d192277b73', login: 'paul', password: 'f05e15f29033a77a444c43e71d8587ef4f8adf981edab321e9cfc078eede536b', fullName: 'Paul McCartney'},

{userId: '0bb934bdd2b938410a5bf16d893bc119b51cee5a6b854f20ec18e788dbbded6e', login: 'ringo', password: 'f99a930b77a1bee8b579b9714d6b4caff77c30901838e920e99512933fda4dc6', fullName: 'Ringo Starr'},

{userId: '5754383c9bda899805840d165eba0556c3105944825d1aed6bfdc01928cd0b6f', login: 'john', password: '9000dc52e26ff0f102ff20f4e30f18d39326b7392555b00abe618c0694af4862', fullName: 'John Lennon'},

{userId: 'd1e6a04edf474daf73fab76d4a31974ddb4e78bdd7b53773d16db3e2cbb47cc8', login: 'george', password: '734ebd37264fd99c0d3cd159e7378beae6c136bbce0dcc3feb9e953e55ed3751', fullName: 'George Harrison'}

* bidirectional/sendMapActions.js: To test add, delete and update actions on Maps. Comment/uncomment socket.emit at the top of the      script depending on that you need to test. Fill the delete/update jsons with existing ids on the db.

* unidirectional/sendMapActionsUni.js: Same as above but unidirectionally. On the delete/update cases you need to choose what to answer to the server: an 'abort', 'forceAdd', 'forceUpdate'. Notice that a FIN is sent after these forcing events.  

* bidirectional/sendMapInfoActions.js: To test the info action type on Maps. Change "mapClientInfo.json" with desired (and/or existing) ids/versions. The real client should send a similar report at every sync.

* unidirectional/actionMapsInfoUnidirectional.js: Same as avobe but unidirectionally. You will have to answeran 'abort', 'forceAdd', 'forceUpdate' too

Note: Almost all jsons have "values" to be filled before starting any sync. 