function Player(gamestate){
    this.gamestate = gamestate;
    this.game = this.gamestate.game;
    
    Phaser.Sprite.call(this, this.game, 100, 100, "player");

    this.gun = this.game.add.sprite(0,0, "gun");
    //this.addChild(this.gun);
    this.anchor.setTo(0.5,0.5);
    
    this.gun.anchor.setTo(0.5, 0.5);
    this.gun.x = 50;
    this.gun.y = 0;
    
    this.game.add.existing(this);
    
    this.direction;
    this.angle = 0;
    
    this.inputEnabled = true;
    this.canShoot = true;
    
    this.shotInterval = 0.1;
    
    this.game.physics.arcade.enable(this);
    this.body.allowGravity = true;
    
    this.shots = this.game.add.group();
    
    for(var i = 0; i < 20; i++){
        var shot = this.game.add.sprite(0,0,'shot');
        
        shot.kill();
        this.shots.add(shot, true);
    }
    
    this.game.input.keyboard.onDownCallback = this.throwRope.bind(this);
    this.game.input.keyboard.onUpCallback = this.keyUp.bind(this);
     this.game.input.keyboard.onDownCallback = this.keyDown.bind(this);
    this.rope = new Rope(this.game);
    
    this.walkSpeed = 0;
    this.canJump = true;
    this.body.collideWorldBounds = true;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.keyDown = function(event){
    if(event.keyCode == Phaser.KeyCode.SPACEBAR){
        this.throwRope();
    }
}
Player.prototype.keyUp = function(){
    if(event.keyCode == Phaser.KeyCode.SPACEBAR){
        this.killRope();
    }
}
Player.prototype.killRope = function(){
    this.rope.kill();
}
Player.prototype.throwRope = function(){
    if(!this.rope.alive){
        this.rope.throw(this, {x:-1,y:-1});
    }
}
Player.prototype.shot = function(){
    this.canShoot = false;
    
    var shot = this.shots.getFirstDead(false);
    this.game.physics.enable(shot);
    shot.outOfBoundsKill = true;
    shot.revive();
    shot.x = this.gun.x;
    shot.y = this.gun.y;
    //
    shot.body.velocity.setTo(this.direction.x*1000, this.direction.y*1000);
    
    shot.rotation = this.gun.rotation;
    
    this.game.time.events.add(Phaser.Timer.SECOND * this.shotInterval, function(){this.canShoot = true}.bind(this), this);
    this.game.time.events.add(Phaser.Timer.SECOND * 2, shot.kill, shot);
    
    shot.tint = 0xffff00; 
}

Player.prototype.rotateGun = function(){
    var mx = this.game.input.activePointer.worldX - this.x;
    var my = this.game.input.activePointer.worldY - this.y;
    var mmod = Math.sqrt(Math.pow(mx,2) + Math.pow(my,2));
    //console.log(mx + ", " + my);
    this.direction = {
        x: mx / mmod,
        y: my / mmod
    };
    
    var angle = Math.acos(this.direction.x);
    if(this.direction.y < 0){
     angle = -angle;   
    }
    
    this.gun.rotation = angle;
    
    this.gun.x = this.x + (this.direction.x * 50);
    this.gun.y = this.y + (this.direction.y * 50);
}

Player.prototype.collideWithFloor = function(){
    this.canJump = true;   
}

Player.prototype.jump = function(){
    this.body.velocity.y = -200;   
    this.canJump = false;
    
}

Player.prototype.shotCollideEnemy = function(shot, enemy){
    shot.kill();
    enemy.life--;
    if(enemy.life <= 0){
        enemy.kill();
    }
}
Player.prototype.update = function(){
    
    this.game.physics.arcade.collide(this.shots, this.gamestate.zombieGroup, this.shotCollideEnemy.bind(this));
    
    this.rotateGun();
    
    if(this.walkSpeed < 0){
        this.scale.x = -1;
        this.gun.scale.y = -1;
    }
    else if(this.walkSpeed > 0){
        this.scale.x = 1;
        this.gun.scale.y = 1;
    }
    if(this.game.input.activePointer.isDown && this.canShoot){
        this.shot();   
    }
    this.walkSpeed = 0;
    if(this.game.input.keyboard.isDown(Phaser.KeyCode.A)){
           this.walkSpeed = -20;
    }
    if(this.game.input.keyboard.isDown(Phaser.KeyCode.D)){
           this.walkSpeed = 20;
    }
    if(this.game.input.keyboard.isDown(Phaser.KeyCode.W) &&
      this.canJump){
        
           this.jump();
    }
    if(this.game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)){
      //  this.throwRope();
    }
    if(!this.rope.alive || !this.rope.collided){
        if(Math.abs(this.body.velocity.x + this.walkSpeed) <= 300){
            this.body.velocity.x += this.walkSpeed;
        }
        
    }
    else{
      //  this.body.velocity.x += this.walkSpeed / 5;
      //  if(this.body.velocity.x >= 300){
      //      this.body.velocity.x = 300;
      //  }
      //  if(this.body.velocity.x <= -300){
      //      this.body.velocity.x = -300;
      //  }
    }
    
    if(this.rope.alive){
        this.game.physics.arcade.collide(this.rope, this.gamestate.wallGroup, this.rope.onCollideWall, null, this.rope);
    }
    
    //this.game.debug.cameraInfo(this.game.camera, 32, 32);
   // this.game.debug.spriteCoords(this, 32, 500);
    
}

