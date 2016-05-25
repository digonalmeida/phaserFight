function Gun(player){
    
    this.player = player;
    this.gamestate = this.player.gamestate;
    this.game = this.gamestate.game;
    
    Phaser.Sprite.call(this, this.game, 0, 0, 'gun');
    
    this.anchor.setTo(0.5, 0.5);
    
    this.game.add.existing(this);
    
    this.shots = this.game.add.group();
    this.shots.checkWorldBounds = true;
    this.shots.outOfBoundsKill = true;

    for(var i = 0; i < 50; i++){
        var shot = this.game.add.sprite(0,0,'shot');
        //shot.scale.setTo(2,2);
        this.game.physics.enable(shot);
        shot.kill();
        shot.target = null;
        shot.checkWorldBounds = true;
        shot.outOfBoundsKill = true;
        this.shots.add(shot, true);
        shot.body.allowGravity = false;
    }
    this.shotInterval = 0.2;
    this.canShoot = true;
    this.shotSpeed = 800;
    this.direction = {x:1, y:0};
    this.ammo = 50;
}


Gun.prototype = Object.create(Phaser.Sprite.prototype);
Gun.prototype.constructor = Gun;

Gun.prototype.shot = function(){
    this.canShoot = false;
    this.ammo--;
    var shot = this.shots.getFirstDead(false);
    if(shot == null){
        return;
        shot = this.shots.getFirstAlive(false);
    }
    shot.outOfBoundsKill = true;
    shot.x = this.x;
    shot.y = this.y;
    
    
    shot.body.velocity.setTo(this.direction.x*this.shotSpeed, this.direction.y*this.shotSpeed);
    //shot.body.velocity.x += this.player.body.velocity.x;
    //shot.body.velocity.y += this.player.body.velocity.y;
    shot.rotation = this.rotation;
    shot.revive();
    
    this.game.time.events.add(Phaser.Timer.SECOND * this.shotInterval, function(){this.canShoot = true}.bind(this), this);
    //this.game.time.events.add(Phaser.Timer.SECOND * 4, shot.kill, shot);
    
    shot.tint = 0xffff00; 
    
}

Gun.prototype.update = function(){
    this.game.debug.text('shots Living: ' + this.shots.countLiving() + '   Dead: ' + this.shots.countDead(), 32, 50);
    
   // this.game.debug.text('x: ' + this.direction.x + '   y: ' + this.direction.y , 32, 100);
   //var g = new Phaser.Game;
    //this.game.debug.text("teste", 0, 100);
    //console.log(mx + ", " + my);
    this.direction = this.player.aimDirection;
    /*
    if(this.player.target != null){
        this.direction = Vec.aimDirection(this.player, this.shotSpeed,
                                      this.player.target,
                                      this.player.target.body.velocity);
    }    */                          
                                      
    
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
    
    this.x = this.player.x + (this.direction.x * 5);
    this.y = this.player.y + (this.direction.y * 5);
    
    var target = this.player.target;
    if(target != null){
        if(this.canShoot && this.ammo > 0){
            //console.log(this.player.targetDistance);
            if(this.player.targetDistance < 150){
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
    this.player.points++;
}