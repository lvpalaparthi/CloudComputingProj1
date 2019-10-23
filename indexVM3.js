const Firestore = require("@google-cloud/firestore")
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const db = new Firestore({
    projectId: "cpeg673proj1",
    keyFilename: "./keyFile.json"
})

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
  });
io.on('connection', function(socket){
//    console.log("hi");
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
      saveMsg(msg)
    });
  });

  function saveMsg(msg){
  //  console.log(msg);
    return db.collection('messages').doc('vm4Doc').set({
      text:msg
    }).catch(function(error){
      console.error('Error writing message to database', error)
    });
  }

 db.collection("messages").doc('vm2Doc').onSnapshot((docSnap) => {
     console.log(`Document data now: ${JSON.stringify(docSnap.data())}`)
 })

 var listener = http.listen(8082, function() {
  console.log('Your app is listening on port ' + 8082);
});
