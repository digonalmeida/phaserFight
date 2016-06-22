function Rope(gamestate){
    this.gamestate = gamestate;
    this.game = gamestate.game;
    
    Phaser.Sprite.call(this, this.game, 0,0, "floor a");
    this.game.add.existing(this);
    this.width = 3;
    this.height = 3;
    this.origin = null;
    this.anchor.setTo(0.5,0.5);
    
    this.graphics = this.game.add.graphics(0,0);
    
    this.game.physics.p2.enable(this);
    this.body.setRectangle(3,3);
    this.body.gravity.y = 0;
    this.body.debug = true;

    this.body.setCollisionGroup(this.gamestate.ropeCollisionGroup);
    this.body.collides(this.gamestate.wallCollsionGroup, this.onCollideWall, this);

    this.collided = false;
    this.makeMeAlive = false;
    this.pullImpulseForce = 100; // * deltaTime
    this.maxPullVelocity = 600;
    this.kill();
}


Rope.prototype = Object.create(Phaser.Sprite.prototype);
Rope.prototype.constructor = Rope;

Rope.prototype.throw = function(origin, direction){
    this.makeMeAlive = true;
    this.body.static = false;
    this.collided = false;
    this.origin = origin;
    this.direction = direction;

    this.body.x = origin.body.x;
    this.body.y = origin.body.y;
    this.body.velocity.x = direction.x * 800;
    this.body.velocity.y = direction.y * 800;
    //this.body.applyForce([direction.x * 2000, -direction.y * 2000], 0, 0);
}
Rope.prototype.onCollideWall = function(obj1, obj2){
    
    if(!this.alive){
        return;
    }
    if(this.collided){
        return;
    }
   // console.log("rope hit %o %o", obj1, obj2);
    this.collided = true;
    //this.body.x = obj1.x;
   // this.body.y = obj1.y;
    
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.body.static = true;
}
Rope.prototype.update = function(){
    
    if(this.makeMeAlive){
        this.makeMeAlive = false;
        this.revive();
    }
    
    this.graphics.clear();
    
    if(!this.alive){
        return;
    }
    
    this.graphics.beginFill(0xff3300);
    this.graphics.lineStyle(2, 0xffd900, 1);
    
    if(this.origin == null){
        return;
    }
    // draw a shape
    this.graphics.moveTo(this.body.x,this.body.y);
    this.graphics.lineTo(this.origin.body.x, this.origin.body.y);
    if(this.collided){
        
        var d = Vec.normalized(Vec.sub(this, this.origin));
        
        var deltatime = this.game.time.elapsed/ 1000;
        //
        if(Vec.mod(this.origin.body.velocity) < this.maxPullVelocity){
            var impulseForce = Vec.mult(d, this.pullImpulseForce * deltatime);
            this.origin.body.applyImpulse([-impulseForce.x, -impulseForce.y], 0,0);
        }
    }
    
}