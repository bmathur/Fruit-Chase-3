/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};

var playerID = 0;

Client.socket = io.connect(); // By default to localhost?

// test
Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

// connect to server to add player to game
Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

// receive own player id to follow with game.camera
Client.socket.on('cameraInit', function(id) {
   Game.initCamera(id); 
});

// send click location to server
Client.sendClick = function(x,y){
  Client.socket.emit('click',{x:x,y:y});
};

// receive new player info from server and send to game
Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id,data.x,data.y);
    if (playerID === 0) {
        playerID = data.id;
    }
    
});

// receive berry array from server and reinitialize game's fruit array
Client.socket.on('initFruits', function(data) {
    Game.initFruits(data);
});

// send arrow key movements server 
Client.moveRight =  function() {
    Client.socket.emit('right');
};

Client.moveLeft =  function() {
    Client.socket.emit('left');
};

Client.moveUp =  function() {
    Client.socket.emit('up');
};

Client.moveDown =  function() {
    Client.socket.emit('down');
};

// receive arrow key movement locations from server
Client.socket.on('moveLeft', function(data) {
    Game.movePlayer(data.id,data.x,data.y);
});

Client.socket.on('moveUp', function(data) {
    Game.movePlayer(data.id,data.x,data.y);
});

Client.socket.on('moveRight', function(data) {
    Game.movePlayer(data.id,data.x,data.y);
});

Client.socket.on('moveDown', function(data) {
    Game.movePlayer(data.id,data.x,data.y);
});

// receive timed command to move all enemies to next location in movement pattern
Client.socket.on('moveEnemies', function(move) {
    Game.moveEnemies(move);
});

// recieve all players from server
Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }
});

// receive coordinates to move a player to
Client.socket.on('move',function(data){
    Game.movePlayer(data.id,data.x,data.y);
});

// send hit enemy notification to server
Client.gotHit = function(data) {
    Client.socket.emit('gotHit', data);
};

// send hit berry notification to server
Client.gotFruit = function(data) {
    Client.socket.emit('gotFruit', data);
};

// receive new player location after getting hit
Client.socket.on('playerHit', function(data) {
   Game.playerDie(data); 
});

// remove berry from game after being collected
Client.socket.on('gotFruit', function(id) {
   Game.removeFruit(id); 
});

// remove player after disconnect
Client.socket.on('remove',function(id){
    Game.removePlayer(id);
});

// receive new score from server
Client.socket.on('updateScore', function(score) {
   Game.updateScore(score); 
});