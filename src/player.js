function Player(gamestate){
    this.gamestate = gamestate;
    this.game = this.gamestate.game;
    
    Phaser.Sprite.call(this, this.game, 100, 100, "player");
    this.anchor.setTo(0.5,0.5);
    
    this.game.physics.p2.enable(this);
    //this.body.collideWorldBounds = true;
    this.body.setCollisionGroup(this.gamestate.playerCollisionGroup);
    this.body.collides([this.gamestate.wallCollsionGroup, this.gamestate.inviWallCollisionGroup]);
    this.body.collides(this.gamestate.ammoCollisionGroup, this.collideWithAmmo, this);
    this.body.collides(this.gamestate.zombieCollisionGroup, this.collideWithZombie, this);
    
    //this.body.debug = true;
    
    this.game.add.existing(this);
    
    this.shotInterval = 0.1;
    this.targetDistance = 4000;
    this.aimDirection = {x: 1, y :0}; 
    this.target = null;
    this.walkSpeed = 0;
    
    this.inputEnabled = true;
    
    this.rope = new Rope(this.gamestate);
    this.gun = new Gun(this);
    

    this.ammoBox = this.game.add.sprite(10,10,"player");
    this.game.physics.p2.enable(this.ammoBox);
    this.ammoBox.body.setCollisionGroup(this.gamestate.ammoCollisionGroup);
    this.ammoBox.body.collides([this.gamestate.playerCollisionGroup, this.gamestate.wallCollsionGroup, this.gamestate.inviWallCollisionGroup]);
    this.game.physics.p2.enable(this.ammoBox);
    
    this.ammoBox.body.collideWorldBounds = true;
    
    this.walkForce = 3000; // per second
    this.maxWalkVelocity = 300;
    
    this.revive();
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;


Player.prototype.setCollideWithWalls = function(c){
    if(c){
        this.body.removeCollisionGroup(this.gamestate.wallCollsionGroup)
    }
    else{
        this.body.collides(this.gamestate.wallCollsionGroup)
    }
}

Player.prototype.killRope = function(){
    this.rope.kill();
}

Player.prototype.throwRope = function(){
    
    if(!this.rope.alive){
       // this.collideWithZombie();
        var dir;
        if(this.scale.x < 0){
            dir = {x: -0.5, y: -1};
        }
        else{
            dir = {x: 0.5, y: -1};
        }
        this.rope.throw(this, dir);
    }
}


Player.prototype.updateAim = function(){
    if(this.target == null){
        this.aimDirection = {x: 1, y :0};   
    }
    else{
        this.aimDirection = Vec.normalized(Vec.sub(this.target, this));   
    }
}

Player.prototype.collideWithZombie = function(){

    this.game.physics.p2.clear();
    this.game.state.start('boot', true, true);
 

}

Player.prototype.collideWithAmmo = function(){
    console.log("ammo hit");
    this.gun.ammo += 20;
    this.ammoBox.body.x = Math.random() * 500;
    this.ammoBox.body.y = Math.random() * 500;
}

Player.prototype.updateTarget = function(){
    var closestDistance = 4000;
    var closest = null;
    var zombies = this.gamestate.zombieGroup.children;
    for(var i = 0; i < zombies.length; i++){
        
        var zombie = zombies[i];
        
        if(zombie.alive){
            var distance = Vec.distance(this, zombie);
            var found = false;

            if(closest == null){
                found = true;
            }

            else if(distance < closestDistance){
                found = true;
            }

            if(found){
                closest = zombie;
                closestDistance = distance;
            }
        }
        
    }
    this.target = closest;
    this.targetDistance = closestDistance;
}

Player.prototype.update = function(){
    this.updateTarget();
    this.updateAim();
    
    if(this.body.velocity.y > 0){
        this.setCollideWithWalls(false);
    }
    else{
         this.setCollideWithWalls(true);
    }
    
    if(this.walkSpeed < 0){
        this.scale.x = -1;
        this.gun.scale.y = -1;
    }
    else if(this.walkSpeed > 0){
        this.scale.x = 1;
        this.gun.scale.y = 1;
    }
    
    var rightInput = false;
    var leftInput = false;
    
    if(Phaser.Device.desktop){

        leftInput = this.game.input.keyboard.isDown(Phaser.KeyCode.A);
        
        rightInput = this.game.input.keyboard.isDown(Phaser.KeyCode.D);
    }
    else{
        var pointers = [this.game.input.pointer1,
                       this.game.input.pointer2,
                       this.game.input.activePointer];
        for(var i = 0; i < pointers.length; i++){

            var pointer = pointers[i];//@pointer = new
            if(pointer.isDown){
                if(pointer.x > this.game.width/2){
                    rightInput = true;   
                }
                else{
                    leftInput = true;   
                }
            }
        }
    }
    
    
    if(leftInput && rightInput){
        this.throwRope();   
    }
    else{
        this.killRope();
        
        if(!leftInput && !rightInput){
            this.walkSpeed = 0;   
        }
        else if(leftInput){
            this.walkSpeed = - 1;   
        }
        else if(rightInput){
            this.walkSpeed = 1;
        }
    }   
   
    var deltatime = this.game.time.elapsed / 1000;
    
    if(!this.rope.alive || !this.rope.collided){
        
        if((this.body.velocity.x >= -this.maxWalkVelocity && this.walkSpeed < 0) ||
         (this.body.velocity.x <= this.maxWalkVelocity && this.walkSpeed > 0)){
            this.body.applyForce([-this.walkSpeed * deltatime * this.walkForce, 0], 0, 0);
        }  

    }
    
}
