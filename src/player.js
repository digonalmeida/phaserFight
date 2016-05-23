function Player(gamestate){
    
     this.beta = 0;
    
    
    this.gamestate = gamestate;
    this.game = this.gamestate.game;
    
    Phaser.Sprite.call(this, this.game, 100, 100, "player");

    this.gun = new Gun(this);
    //this.addChild(this.gun);
    this.anchor.setTo(0.5,0.5);
    
    this.game.add.existing(this);
    
    this.direction;
    this.aimDirection;
    this.target;
    this.angle = 0;
    
    this.inputEnabled = true;
    
    
    this.shotInterval = 0.1;
    
    this.game.physics.arcade.enable(this);
    this.body.allowGravity = true;
    
    
    this.game.input.keyboard.onDownCallback = this.throwRope.bind(this);
    this.game.input.keyboard.onUpCallback = this.keyUp.bind(this);
     this.game.input.keyboard.onDownCallback = this.keyDown.bind(this);
    this.rope = new Rope(this.game);
    
    this.walkSpeed = 0;
    this.canJump = true;
    this.body.collideWorldBounds = true;
    
   	this.targetDistance = 4000;
    
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.keyDown = function(event){
    if(event.keyCode == Phaser.KeyCode.SPACEBAR){
        this.throwRope();
    }
}
Player.prototype.keyUp = function(event){
    if(event.keyCode == Phaser.KeyCode.SPACEBAR){
        this.killRope();
    }
}
Player.prototype.killRope = function(){
    this.rope.kill();
}
Player.prototype.throwRope = function(){
    if(!this.rope.alive){
        var dir;
        if(this.scale.x < 0){
            dir = {x: -1, y: -1};
        }
        else{
            dir = {x: 1, y: -1};
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

Player.prototype.collideWithFloor = function(){
    this.canJump = true;   
}

Player.prototype.jump = function(){
    this.body.velocity.y = -200;   
    this.canJump = false;
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
   // this.game.debug.spriteInfo(this.target,0,100);
    this.targetDistance = closestDistance;
}
Player.prototype.update = function(){
    //this.game.debug.text(gyroInfo.beta, 0, 200);
    this.updateTarget();
    this.updateAim();
    
    var acceleration = 20;
    
    if(this.walkSpeed < 0){
        this.scale.x = -1;
        this.gun.scale.y = -1;
    }
    else if(this.walkSpeed > 0){
        this.scale.x = 1;
        this.gun.scale.y = 1;
    }
    
    var right = false;
    var left = false;
    
    if(Phaser.Device.desktop){

        left = this.game.input.keyboard.isDown(Phaser.KeyCode.A);
        
        right = this.game.input.keyboard.isDown(Phaser.KeyCode.D);
        

        if(this.game.input.keyboard.isDown(Phaser.KeyCode.W) &&
          this.canJump){

               this.jump();
        }

    }
    else{
        var pointers = [this.game.input.pointer1,
                       this.game.input.pointer2,
                       this.game.input.activePointer];
        for(var i = 0; i < pointers.length; i++){
            
            
            var pointer = pointers[i];//@pointer = new
            if(pointer.isDown){
                console.log("here");
                if(pointer.x > this.game.width/2){
                    right = true;   
                }
                else{
                    left = true;   
                }
            }
            
            
        }
        /*
         if(gyroInfo.beta < 0){
            right = true;  
         }
        else{
            left = true;
        }*/
    }
    if(left && right){
        this.throwRope();   
    }
    else{
        this.killRope();
        if(!left && !right){
            this.walkSpeed = 0;   
        }
        else if(left){
            this.walkSpeed = - 300;   
        }
        else if(right){
            this.walkSpeed = 300;
        }
    }   
   
    
    if(!this.rope.alive || !this.rope.collided){

        if(this.walkSpeed > this.body.velocity.x && this.walkSpeed > -1){
            if(this.body.velocity.x < 300){
                this.body.velocity.x += acceleration;
            }
        }
        if(this.walkSpeed < this.body.velocity.x && this.walkSpeed < 1){
            if(this.body.velocity.x > -300){
                this.body.velocity.x -= acceleration;
            }
            
        }
        
    }

    
    if(this.rope.alive){
        this.game.physics.arcade.collide(this.rope, this.gamestate.wallGroup, this.rope.onCollideWall, null, this.rope);
    }
    
    //if(this.game.input.activePointer.isDown){
    //    this.throwRope();   
    //}
    //else{
    //    this.killRope();   
    //}
    //this.game.debug.cameraInfo(this.game.camera, 32, 32);
   // this.game.debug.spriteCoords(this, 32, 500);
    
}

