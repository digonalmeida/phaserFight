function BootState(game){
   
    this.game = game;
    this.playerGroup = null;
    this.wallGroup = null;
    this.player = null;
    this.zombieGroup = null;
}

BootState.prototype.preload = function(){
    this.game.load.image('player', 'sprites/player.png');
    this.game.load.image('gun', 'sprites/gun.png');
    this.game.load.image('shot', 'sprites/shot.png');
    this.game.load.image('floor', 'sprites/floor.png');
}

BootState.prototype.createWalls = function(){
    
    for(var i = 0; i < 10; i ++){
        this.createWall(Math.random() * 1900, 200 * i, 400, 40)
        this.createWall(Math.random() * 1900, 200 * i, 400, 40);
    }
}

BootState.prototype.createZombies = function(){
    for(var i = 0; i < 5; i ++){
        var zombie = new Zombie(this);
        zombie.x = Math.random() * 1900;
        zombie.y = Math.random() * 1900;
        this.zombieGroup.add(zombie);
    }
}

BootState.prototype.createWall = function(x, y, w, h){
    
    var floor = this.game.add.sprite(x, y, 'floor');
    floor.width = w;
    floor.height = h;

    this.game.physics.arcade.enable(floor);
    floor.body.immovable = true;
    floor.body.allowGravity = false;
    this.wallGroup.add(floor);
    
}

BootState.prototype.create = function(){
     this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
    this.playerGroup = this.game.add.group();
    this.wallGroup  = this.game.add.group();
    this.zombieGroup = this.game.add.group();
   
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 400;
    
    this.createWalls();
    //this.createZombies();
    
    this.game.stage.backgroundColor = 0xeeeeff;
    this.player = new Player(this);
    this.playerGroup.add(this.player);
    //this.game = Phaser.Game();
    this.game.world.setBounds(0,0,2048, 2048);
    this.game.camera.follow(this.player);
}

BootState.prototype.playerFloorCollision = function(player, wall){
    player.collideWithFloor();
}


BootState.prototype.update = function(){
    
  //  this.game.camera.x = this.player.x;
//    this.game.camera.y = this.player.y;
    this.game.physics.arcade.collide(this.playerGroup, this.wallGroup, this.playerFloorCollision);
    this.game.physics.arcade.collide(this.zombieGroup, this.zombieGroup);
    this.game.physics.arcade.collide(this.zombieGroup, this.wallGroup, this.playerFloorCollision);
}