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
    
    this.game.physics.p2.enable(this);
    this.body.allowGravity = true;
    this.collisionGroup = this.gamestate.playerCollisionGroup;
    this.boxCollisionGroup = this.gamestate.ammoCollisionGroup;
    
    this.game.input.keyboard.onDownCallback = this.throwRope.bind(this);
    this.game.input.keyboard.onUpCallback = this.keyUp.bind(this);
     this.game.input.keyboard.onDownCallback = this.keyDown.bind(this);
    this.rope = new Rope(this.gamestate);
    this.rope.body.setCollisionGroup(this.gamestate.ropeCollisionGroup);
    this.walkSpeed = 0;
    this.canJump = true;
    this.body.collideWorldBounds = true;
    
   	this.targetDistance = 4000;
    
    this.points = 0;
    this.gui = this.game.add.group();
    
    this.pointsGui = this.game.add.text(200,0,"Points:" + this.points, {fill:'yellow'});

    this.ammoGui = this.game.add.text(350,0,"Ammo:" + this.gun.ammo, {fill:'yellow'});
    this.gui.add(this.pointsGui);
    this.gui.add(this.ammoGui);
    this.gui.fixedToCamera = true;
    this.ammoBox = this.game.add.sprite(10,10,"player");
    this.game.physics.p2.enable(this.ammoBox);
    this.ammoBox.body.setCollisionGroup(this.boxCollisionGroup);
    this.ammoBox.body.collides([this.collisionGroup, this.gamestate.wallCollsionGroup]);
    this.game.physics.p2.enable(this.ammoBox);
    
    this.ammoBox.body.collideWorldBounds = true;
    
    this.body.setCollisionGroup(this.collisionGroup);
    this.body.collides(this.gamestate.wallCollsionGroup);
    this.body.collides(this.boxCollisionGroup, this.collideWithAmmo, this);

    this.rope.body.collides(this.gamestate.wallCollsionGroup, this.rope.onCollideWall, this.rope);
    
    this.body.debug = true;
    this.walkVelocity = 0;
    //this.game.physics.p2.impactCallback();
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



Player.prototype.collideWithFloor = function(){
    this.canJump = true;   
}
Player.prototype.collideWithZombie = function(){
    alert("game over. " + this.points + " points");
    this.game.state.start('boot');
}

Player.prototype.collideWithAmmo = function(){
    console.log("ammo hit");
    this.gun.ammo += 20;
    this.ammoBox.body.x = Math.random() * 500;
    this.ammoBox.body.y = Math.random() * 500;
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
    //this.gui.bringToTop();
    this.pointsGui.text = "Points: " + this.points;
    this.ammoGui.text = "Ammo: " +this.gun.ammo;
    this.game.debug.text(gyroInfo.beta, 0, 200);
    this.updateTarget();
    this.updateAim();
    
    var acceleration = 500;
    
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
            this.walkSpeed = - 1;   
        }
        else if(right){
            this.walkSpeed = 1;
        }
    }   
   
    
    if(!this.rope.alive || !this.rope.collided){

        if(this.body.velocity.x >= -300 && this.walkSpeed < 0){
            this.body.applyForce([-this.walkSpeed *this.game.time.elapsed * 3, 0], 0, 0);
        }  
        if(this.body.velocity.x <= 300 && this.walkSpeed > 0){
            this.body.applyForce([-this.walkSpeed *this.game.time.elapsed * 3, 0], 0, 0);
        }  
    }
    
    

    
    if(this.rope.alive){
    //    this.game.physics.p2.collide(this.rope, this.gamestate.wallGroup, this.rope.onCollideWall, null, this.rope);
    }
   // this.game.physics.p2.collide(this, this.ammoBox, this.collideWithAmmo, null, this);
//    this.game.physics.p2.collide(this.ammoBox, this.gamestate.wallGroup);
    
    //if(this.game.input.activePointer.isDown){
    //    this.throwRope();   
    //}
    //else{
    //    this.killRope();   
    //}
    //this.game.debug.cameraInfo(this.game.camera, 32, 32);
   // this.game.debug.spriteCoords(this, 32, 500);
    
}

