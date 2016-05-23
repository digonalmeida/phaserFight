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

    this.game.load.image('building', 'sprites/platform.png');

    this.game.load.image('zombie', 'sprites/zombie.png');

}

BootState.prototype.createWalls = function(){
    
    for(var i = 0; i < 10; i ++){
        this.createWall(Math.random() * 1900, 200 * i, 400, 40)
        this.createWall(Math.random() * 1900, 200 * i, 400, 40);
    }
  //  var game =new Phaser.Game;
//game.world.bounds.height
    this.createWall(0, 2000, 3000, 30);
}

BootState.prototype.createZombies = function(){
    for(var i = 0; i < 5; i ++){
        var zombie = new Zombie(this);
        zombie.x = Math.random() * 1900;
        zombie.y = Math.random() * 1900;
        this.zombieGroup.add(zombie);
    }
    this.game.world.bringToTop(this.zombieGroup);
}

BootState.prototype.createWall = function(x, y, w, h){
    new Platform(this, x, y);
    new SpawnPoint(this, x, y-20);
    this.game.world.bringToTop(this.wallGroup);
    
    /*
    var floor = this.game.add.sprite(x, y, 'floor');
    floor.width = w;
    floor.height = h;

    this.game.physics.arcade.enable(floor);
    floor.body.immovable = true;
    floor.body.allowGravity = false;
    this.wallGroup.add(floor);
    */
}
function goFullScreen(game){
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.startFullScreen(false, true);
   // game.scale.setScreenSize(true);
}
BootState.prototype.create = function(){
    if(!Phaser.Device.desktop){
        goFullScreen(this.game);
    }
    this.game.world.setBounds(0,0,2048, 2048);
     this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
    this.wallGroup  = this.game.add.group();
    this.playerGroup = this.game.add.group();
    this.zombieGroup = this.game.add.group();
   
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 400;
    
    this.createWalls();
    this.createZombies();
    
    
    this.game.stage.backgroundColor = 0xeeeeff;
    this.game.world.bringToTop(this.playerGroup);
    this.player = new Player(this);
    this.playerGroup.add(this.player);
    this.game.world.bringToTop(this.playerGroup);
    //this.game = Phaser.Game();
    
    this.game.camera.follow(this.player);
    this.game.input.activePointer.onmouse
}

BootState.prototype.playerFloorCollision = function(player, wall){
    player.collideWithFloor();
}


BootState.prototype.update = function(){
    
  //  this.game.camera.x = this.player.x;
//    this.game.camera.y = this.player.y;
    this.game.physics.arcade.collide(this.playerGroup, this.wallGroup, this.playerFloorCollision);
    this.game.physics.arcade.collide(this.zombieGroup, this.wallGroup, this.playerFloorCollision);
    this.game.physics.arcade.collide(this.zombieGroup, this.zombieGroup);
    this.game.physics.arcade.collide(this.zombieGroup, this.wallGroup, this.playerFloorCollision);
}