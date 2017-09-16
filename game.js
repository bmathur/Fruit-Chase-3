
var Game = {};
var cursors;
var timeToMove = 0;
var playerID = 0;
var text;
var music;

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    // load background
    game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);
    // load sprites
    game.load.image('sprite','assets/sprites/georgeDown.png');
    game.load.image('evilFruit','assets/sprites/EvilFruit.png');
    game.load.image('berry','assets/sprites/berry.png');
    game.load.image('music', 'assets/sprites/MUSIC.png');
    //load audio
    game.load.audio('audio', 'assets/audio/ff4ow.mp3');
};

Game.create = function(){
    // init game physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // initialize containers for players,enemies, and berries
    Game.playerMap = {};
    Game.enemyMap = {};
    Game.fruitMap = {};
    
    //var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    //testKey.onDown.add(Client.sendTest, this);
    
    // create background
    var map = game.add.tilemap('map');
    map.addTilesetImage('tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
    var layer;
    for(var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    }
    layer.resizeWorld();
   
   // Create Enemies and place them
   Game.enemyMap[0] = game.add.sprite( 238,988,'evilFruit');
   game.physics.arcade.enable(Game.enemyMap[0]);
   Game.enemyMap[1] = game.add.sprite( 1445,820,'evilFruit');
   game.physics.arcade.enable(Game.enemyMap[1]);
   Game.enemyMap[2] = game.add.sprite( 1400,238,'evilFruit');
   game.physics.arcade.enable(Game.enemyMap[2]);
   
   // arrow key detection and click detection
    cursors = game.input.keyboard.createCursorKeys();
    
    layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    layer.events.onInputUp.add(Game.getCoordinates, this);
    
    //create score text and set to follow camera
  text = game.add.text(0, 0, "Score: 0", { font: "65px Arial", fill: "#ff0044", align: "center" });
  text.fixedToCamera = true;
    
    
    //create music element and music mute button
    music = game.add.audio('audio');
    music.loopFull();
    
    musicb = game.add.button(0,60,'music',musicf,this,2,1,0);
    musicb.inputEnabled = true;
    musicb.fixedToCamera = true;
    musicb.scale.setTo(.075);
    
    // connect to server
    Client.askNewPlayer();
};

// call all enemy movement functions
Game.moveEnemies = function(move) {
  moveEnemy0(move);
  moveEnemy1(move);
  moveEnemy2(move);
};

// mute/play music
function musicf(){
        if(music.mute !=true){
            music.mute =true;
        }
        else {music.mute = false;}
    }

// enemy movement patterns
function moveEnemy0(move) {
    
    var enemy = Game.enemyMap[0];

    if (move == 0) {

        var tween = game.add.tween(enemy);
        var duration = 2000;
        tween.to({x:220,y:770}, duration);
        tween.start();
    }

    if (move == 1) {

        var tween = game.add.tween(enemy);
        var duration = 2000;
        tween.to({x:487,y:770}, duration);
        tween.start();
    }

    if (move == 2) {

        var tween = game.add.tween(enemy);
        var duration = 2000;
        tween.to({x:487,y:948}, duration);
        tween.start();
    }

    if (move == 3) {

        var tween = game.add.tween(enemy);
        var duration = 2000;
        tween.to({x:220,y:948}, duration);
        tween.start();
    }
}

function moveEnemy1(move) {
    var enemy = Game.enemyMap[1];

    if (move == 0) {

        var tween = game.add.tween(enemy);
        var duration = 2000;
        tween.to({x:1050,y:600}, duration);
        tween.start();
    }

    if (move == 1) {

        var tween = game.add.tween(enemy);
        var duration = 2000;
        tween.to({x:965,y:815}, duration);
        tween.start();
    }

    if (move == 2) {

        var tween = game.add.tween(enemy);
        var duration = 2000;
        tween.to({x:1260,y:1025}, duration);
        tween.start();
    }

    if (move == 3) {

        var tween = game.add.tween(enemy);
        var duration = 2000;
        tween.to({x:1445,y:820}, duration);
        tween.start();
    }
}

function moveEnemy2(move) {
    var enemy = Game.enemyMap[2];

    if (move == 0) {

        var tween = game.add.tween(enemy);
        var duration = 2000;
        tween.to({x:1163,y:238}, duration);
        tween.start();
    }

    if (move == 1) {

        var tween = game.add.tween(enemy);
        var duration = 2000;
        tween.to({x:1130,y:360}, duration);
        tween.start();
    }

    if (move == 2) {

        var tween = game.add.tween(enemy);
        var duration = 2000;
        tween.to({x:1300,y:273}, duration);
        tween.start();
    }

    if (move == 3) {

        var tween = game.add.tween(enemy);
        var duration = 2000;
        tween.to({x:1400,y:238}, duration);
        tween.start();
    }
}

// check for arrow key presses
Game.update = function() {
    if (timeToMove == 7) {
        if(cursors.right.isDown) {
            Client.moveRight();
        }  

        if(cursors.left.isDown) {
            Client.moveLeft();
        }

        if(cursors.up.isDown) {
            Client.moveUp();
        }  

        if(cursors.down.isDown) {
            Client.moveDown();
        }  
    }
    timeToMove = (timeToMove + 1) % 8;
};

// send coordinates of click to server to move character
Game.getCoordinates = function(layer,pointer){
    Client.sendClick(pointer.worldX,pointer.worldY);
};

// when a player joins, add them to playerMap
Game.addNewPlayer = function(id,x,y){
    if (playerID === 0) {
        playerID = id;
    }
        Game.playerMap[id] = game.add.sprite(x,y,'sprite');
        game.physics.arcade.enable(Game.playerMap[id]);
        Game.playerMap[id].body.collideWorldBounds = true;;
      //  game.camera.follow(Game.playerMap[id]);
};

// after joining game, center camera on your character
Game.initCamera = function(id) {
    game.camera.follow(Game.playerMap[id]);
};

// after receiving updated coordinates of a character, use a tween to move in a line to those coordinates
// after moving, if touching an evil fruit, send notification to server to move player back to start and update score
// after moving, if touching a berry, send notification to server to erase the berry and update score
Game.movePlayer = function(id,x,y){

        var player = Game.playerMap[id];

        var distance = Phaser.Math.distance(player.x,player.y,x,y);

     //   player.x += 5;
        var tween = game.add.tween(player);
        var duration = 500;
        tween.to({x:x,y:y}, duration);
        tween.start();
     //   console.log(id + ": x: " + player.x + " y: " + player.y);
        for (i = 0; i < 3; i++) {
            var enemy = Game.enemyMap[i];
            if (player.x > enemy.x  && 
                   player.x < enemy.x + 60  &&
                   player.y < enemy.y + 90 &&
                   player.y > enemy.y) 
            {
//                console.log("hit\n");
                Client.gotHit(id);
            }
        }
        
        for (i = 0; i < Object.keys(Game.fruitMap).length; i++) {
 //       console.log('map '+i+': '+ Game.fruitMap[i]);    
        var fruit = Game.fruitMap[i];
            if (fruit !== null) {
                if (player.x > fruit.x  && 
                       player.x < fruit.x + 60  &&
                       player.y < fruit.y + 60 &&
                       player.y > fruit.y) 
                {
                    console.log("hitFruit\n");
                    Client.gotFruit(i);
                }
            }
        }
};

// return to start if hit by an evil fruit
Game.playerDie = function (data) {
    var player = Game.playerMap[data.id];
    
    player.x = data.x;
    player.y = data.y;
};

// receive a the current or new set of berry locations from the server
Game.initFruits = function (data) {
    for (var i = 0; i < 10; i++) {
        if(Game.fruitMap[i]) {
            Game.fruitMap[i].destroy();
            delete Game.fruitMap[i];
        }
    }
    
  for (var i = 0; i < data.length; i++) {
     
        if (data[i] != null) {
      Game.fruitMap[i] = game.add.sprite(data[i].x, data[i].y, 'berry');
      //console.log(Game.fruitMap[i].x + ',' + Game.fruitMap[i].y);
      }
      else {
          Game.fruitMap[i] = game.add.sprite(-10,-10);
      }
       console.log(i + '' + Game.fruitMap[i].x + ',' + Game.fruitMap[i].y);
  }  
};

// despawn a berry after collecting it
Game.removeFruit = function(id) {
     console.log(id);
     Game.fruitMap[id].destroy();
   console.log('destroyed: ' + id);
   // delete Game.fruitMap[id];
};
// receive an updated score from the server and print on the screen
Game.updateScore = function (score) {
    text.text = 'Score: ' + score;
};

// after a play disconnects, remove their character from the game
Game.removePlayer = function(id){
    Game.playerMap[id].kill();
    delete Game.playerMap[id];
};