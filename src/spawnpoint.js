function SpawnPoint(gamestate, x, y){
    this.gamestate = gamestate;
    this.game = this.gamestate.game;
    this.x = x;
    this.y = y;
    this.game.time.events.add(Phaser.Timer.SECOND * 4, this.spawn, this);
}

SpawnPoint.prototype.spawn = function(){
    var player = this.gamestate.player;
    if(Math.sqrt( Math.pow(this.x - player.x,2) + Math.pow(this.y - player.y, 2)) > 300){
        var zombie = new Zombie(this.gamestate);
        zombie.x =  this.x + (Math.random() * 200);
        zombie.y = this.y - 20;
        this.gamestate.zombieGroup.add(zombie);
    }
    
    this.game.time.events.add(Phaser.Timer.SECOND * 6, this.spawn, this);
    
    
}