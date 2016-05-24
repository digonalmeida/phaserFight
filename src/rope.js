function Rope(game){
    this.game = game;
    
    Phaser.Sprite.call(this, game, 0,0, "floor a");
    this.game.add.existing(this);
    this.width = 3;
    this.height = 3;
    this.origin = null;
    this.anchor.setTo(0.5,0.5);
    
    this.graphics = this.game.add.graphics(0,0);
    
    this.game.physics.arcade.enable(this);
    this.body.allowGravity = false;
    
    
    //this.onKilled.add(function(this.graphics.kill()).bind(this));
    this.collided = false;
    this.makeMeAlive = false;
    this.forceAcceleration = 30;
    this.kill();
}


Rope.prototype = Object.create(Phaser.Sprite.prototype);
Rope.prototype.constructor = Rope;

Rope.prototype.throw = function(origin, direction){
    this.makeMeAlive = true;
    this.collided = false;
    this.origin = origin;
    this.direction = direction;
    this.x = origin.x;
    this.y = origin.y;
    
    this.body.velocity.x = direction.x * 800;
    this.body.velocity.y = direction.y * 800;
}
Rope.prototype.onCollideWall = function(me, other){

    if(!this.alive){
        return;
    }
    if(this.collided){
        return;
    }
    
    this.collided = true;
    this.body.velocity.setTo(0,0);
    
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
    this.graphics.moveTo(this.x,this.y);
    this.graphics.lineTo(this.origin.x, this.origin.y);
    if(this.collided){
        var d = {x: this.x - this.origin.x,
                y: this.y - this.origin.y};
        var mod = Math.sqrt(Math.pow(d.x,2) + Math.pow(d.y,2));
        var d = {x: d.x/mod, y: d.y/mod};
        this.origin.body.velocity.x += (d.x * 1000)*(this.game.time.elapsed/1000);
        this.origin.body.velocity.y += (d.y * 1000)*(this.game.time.elapsed/ 1000);
    }
    
}