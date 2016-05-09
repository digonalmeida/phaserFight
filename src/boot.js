function BootState(game){
    this.game = game;
    this.playerGroup = null;
    this.wallGroup = null;
}

BootState.prototype.preload = function(){
    this.game.load.image('player', 'sprites/player.png');
    this.game.load.image('gun', 'sprites/gun.png');
    this.game.load.image('shot', 'sprites/shot.png');
    this.game.load.image('floor', 'sprites/floor.png');
}

BootState.prototype.createWalls = function(){
    var floor = this.game.add.sprite(0, 300, 'floor');
    floor.width = 300;
    floor.height = 100;
    this.game.physics.arcade.enable(floor);
    floor.body.immovable = true;
    floor.body.allowGravity = false;
    this.wallGroup.add(floor);
}

BootState.prototype.create = function(){
    this.playerGroup = this.game.add.group();
    this.wallGroup  = this.game.add.group();
   
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 200;
    
    this.createWalls();
    
    this.game.stage.backgroundColor = 0xeeeeff;

    this.playerGroup.add(new Player(this.game));
}

BootState.prototype.playerFloorCollision = function(player, wall){
    player.collideWithFloor();
}


BootState.prototype.update = function(){
    this.game.physics.arcade.collide(this.playerGroup, this.wallGroup, this.playerFloorCollision);
}