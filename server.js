//TODO: add package.json
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

// init berry array
var fruits= [];
   for (var i=0; i < 10; i++) {
        var x, y;
        do {
       x = Math.random() * 1500;
       y = Math.random() * 1000;
        } while (x + y > 2000 || x + y < 900);
        fruits[i]= {x:x,y:y,id:i};
   }
   
// init score and move counter   
var score = 0;
var move = 0;
// 2 second timer to tell enemies to move to next location
setInterval(moveTimer, 2000);
function moveTimer() {
    move = (move+1) % 4;
}

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.lastPlayderID = 1;
server.playersList = [];

server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
});

io.on('connection',function(socket){

    socket.on('newplayer',function(){
        // init new player
        socket.player = {
            id: server.lastPlayderID++,
            x: randomInt(100,400),
            y: randomInt(100,400)
        };
        
        // send player array, add new player, send own player id to init camera following, init fruit array in games, and init score in games
        socket.emit('allplayers',getAllPlayers());
        socket.broadcast.emit('newplayer',socket.player);
        socket.emit('cameraInit',socket.player.id);
        io.emit('initFruits', fruits);
        io.emit('updateScore', score);
        
        // syncronize all enemy movements across games every 2 seconds
        setInterval(enemyTimer, 2000);
        
        function enemyTimer() {
            socket.emit('moveEnemies', move);
        }
        
        // reinitialize 10 fruits into berry array
        function fillFruits() {
               for (var i=0; i < 10; i++) {
        var x, y;
        do {
       x = Math.random() * 1500;
       y = Math.random() * 1000;
        } while (x + y > 2000 || x + y < 900);
        fruits[i]= {x:x,y:y,id:i};
   }
        };
        
        // after receiving click from a player, send click movement to all clients
        socket.on('click',function(data){
        //    console.log('click to '+data.x+', '+data.y);
            socket.player.x = data.x;
            socket.player.y = data.y;
            io.emit('move',socket.player);
        });
        
        // after receiving arrow key movements from a player, send movement to all clients
        socket.on('right', function() {
            if (socket.player.x <= 1506) {
           //     console.log('move right');
                socket.player.x += 15;
                io.emit('moveRight', socket.player);
            }
        });
        
        socket.on('left', function() {
            if (socket.player.x > 4) {
           //      console.log('move left');
                 socket.player.x -= 15;
                 io.emit('moveLeft', socket.player);
            }
        });
        
        socket.on('up', function() {
            if (socket.player.y > 4) {
             //   console.log('move up');
                socket.player.y -= 15;
                io.emit('moveUp', socket.player);
            }
        });

        socket.on('down', function() {
            if (socket.player.y <= 1068){
              //  console.log('move down');
                socket.player.y += 15;

                io.emit('moveDown', socket.player);
            }
        });
        
        // after receiving player hit enemy, move player to home in all clients
        socket.on('gotHit', function(data) {
            if (socket.player.id == data) {
                socket.player.x = 200;
                socket.player.y = 200;
                score -= 10;
                io.emit('playerHit', socket.player);
                io.emit('updateScore', score);
            }
        });
        
        // after receiving player hit berry, remove berry from fruits[] and all clients
        // if all berries removed, reinit fruits[] and send to all clients
        socket.on('gotFruit', function(id) {
            
            if ( fruits[id] !== null) {    
            //fruits.splice(id,1);
                fruits[id] = null;
                console.log('array:' + fruits);
                score += 10;
                console.log('len: ' +fruits.length + ' score: ' + score);
                io.emit('gotFruit', id);

                io.emit('updateScore', score);
            }
            var flag = 0;
            for (var i = 0; i < 10; i++) {
                if (fruits[i] !== null) {
                    flag = 1;
                }
            }
            if (!flag) {
                fillFruits();
                io.emit('initFruits', fruits);
            }
        });
        
        // after receiving player disconnect, remove player from all games
        socket.on('disconnect',function(){
            io.emit('remove',socket.player.id);
        });
    });
    // test
    socket.on('test',function(){
        console.log('test received');
    });
});

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
