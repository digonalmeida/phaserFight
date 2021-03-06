function Zombie(gamestate){
    this.gamestate = gamestate;
    this.game = this.gamestate.game;
    
    Phaser.Sprite.call(this, this.game, 20, 100, "zombie");
    //this.tint = 0xff0000;
    this.scale.setTo(1.2,2 );
    this.anchor.setTo(0.5,0.5);
    
    this.game.add.existing(this);
    this.gamestate.zombieGroup.add(this);
    this.direction = {x:0, y:1};
    
    this.canShoot = true;
    this.shotInterval = 0.4;
    this.shouldDie = false;;
    this.game.physics.p2.enable(this);
    this.body.fixedRotation = true;
    this.body.collideWorldBounds = true;
    this.body.setCollisionGroup(this.gamestate.zombieCollisionGroup);
    this.body.collides(this.gamestate.playerCollisionGroup);
    this.body.collides(this.gamestate.wallCollsionGroup);
    this.body.collides(this.gamestate.inviWallCollisionGroup, function(){this.shouldDie = true;}, this);
    this.body.collides(this.gamestate.shotsCollisionGroup);
    this.shots = this.game.add.group();
    
    for(var i = 0; i < 20; i++){
        var shot = this.game.add.sprite(0,0,'shot');
        
        shot.kill();
        this.shots.add(shot, true);
    }

    this.life = 1;
    this.walkSpeed = -1 + (Math.random() * 2) ;
    this.canJump = true;
    this.body.collideWorldBounds = true;
}

Zombie.prototype = Object.create(Phaser.Sprite.prototype);
Zombie.prototype.constructor = Zombie;

Zombie.prototype.shot = function(){
    this.canShoot = false;
    
    var shot = this.shots.getFirstDead(true);
    this.game.physics.enable(shot);
    shot.outOfBoundsKill = true;
    shot.revive();
    shot.x = this.x;
    shot.y = this.y;
    //
    shot.body.velocity.setTo(this.direction.x*1000, this.direction.y*1000);
    
    //shot.rotation = this.gun.rotation;
    
    this.game.time.events.add(Phaser.Timer.SECOND * this.shotInterval, function(){this.canShoot = true}.bind(this), this);
    this.game.time.events.add(Phaser.Timer.SECOND * 2, shot.kill, shot);
    
    shot.tint = 0xffff00; 
}

Zombie.prototype.collideWithFloor = function(){
    this.canJump = true;   
}

Zombie.prototype.update = function(){
    if(this.shouldDie){
        this.kill();
        this.shouldDie = false;
        return;
    }
    if(!this.alive){
        return;
    }
    var player = this.gamestate.player;
    var distance = Math.sqrt(Math.pow((this.x - player.x),2) + Math.pow((this.y - player.y),2));
    
    if(distance < 150 && distance > 3){
        //console.log(distance);
            if(player.x > this.x){
                this.walkSpeed = 100;
                this.scale.x = 1;
            }
            else if(player.x < this.x){
                this.walkSpeed = -100;
                this.scale.x = -1;
            }
            if(player.y > this.y){
                this.flySpeed = 100;
            }
            else if(player.y < this.y){
                this.flySpeed = -100;
            }
    }
    else{
       // this.walkSpeed = 0;
       // this.flySpeed = 0;
    }

    
    if(this.canShoot){
       // this.shot();
    }
    this.body.velocity.x = this.walkSpeed;
    //this.body.velocity.y = this.flySpeed;

    if(player.y< this.y && distance > 10 && distance < 100 && this.canJump){
        this.jump();   
    }
}

Zombie.prototype.jump = function(){
    this.body.applyForce([0, -200], 0, 0);   
    this.canJump = false;
}
