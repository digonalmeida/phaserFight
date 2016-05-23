function Gun(player){
    
    this.player = player;
    this.gamestate = this.player.gamestate;
    this.game = this.gamestate.game;
    
    Phaser.Sprite.call(this, this.game, 0, 0, 'gun');
    
    this.anchor.setTo(0.5, 0.5);
    
    this.game.add.existing(this);
    
    this.shots = this.game.add.group();
    
    for(var i = 0; i < 50; i++){
        var shot = this.game.add.sprite(0,0,'shot');
        
        shot.kill();
        this.shots.add(shot, true);
    }
    this.shotInterval = 0.1;
    this.canShoot = true;
    
}


Gun.prototype = Object.create(Phaser.Sprite.prototype);
Gun.prototype.constructor = Gun;

Gun.prototype.shot = function(){
    this.canShoot = false;
    
    var shot = this.shots.getFirstDead(false);
    this.game.physics.enable(shot);
    shot.outOfBoundsKill = true;
    shot.revive();
    shot.x = this.x;
    shot.y = this.y;
    //
    shot.body.velocity.setTo(this.direction.x*1000, this.direction.y*1000);
    
    shot.rotation = this.rotation;
    
    this.game.time.events.add(Phaser.Timer.SECOND * this.shotInterval, function(){this.canShoot = true}.bind(this), this);
    this.game.time.events.add(Phaser.Timer.SECOND * 2, shot.kill, shot);
    
    shot.tint = 0xffff00; 
    
}

Gun.prototype.update = function(){
   //var g = new Phaser.Game;
    //this.game.debug.text("teste", 0, 100);
    //console.log(mx + ", " + my);
    this.direction = this.player.aimDirection;
    
    var angle = Math.acos(this.direction.x);
    if(this.direction.y < 0){
     angle = -angle;   
    }
    if(this.direction.x < 0){
        this.scale.y = -1;   
    }
    else{
        this.scale.y = 1;   
    }
    
    this.rotation = angle;
    
    this.x = this.player.x + (this.direction.x * 25);
    this.y = this.player.y + (this.direction.y * 25);
    
    var target = this.player.target;
    if(target != null){
        if(this.canShoot){
            //console.log(this.player.targetDistance);
            if(this.player.targetDistance < 200){
                this.shot();   
            }
        }
    }
    
    
    this.game.physics.arcade.overlap(this.shots,            this.gamestate.zombieGroup, this.shotCollideEnemy.bind(this));
}

Gun.prototype.shotCollideEnemy = function(shot, enemy){
    shot.kill();
    enemy.life--;
    if(enemy.life <= 0){
        enemy.kill();
    }
}