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
        
        var zombie = this.gamestate.zombieGroup.getFirstDead();
        //if(zombie == null){
        //    zombie = new Zombie(this.gamestate);   
        //}
        if(zombie != null){
            zombie.revive();
            zombie.x =  this.x + (Math.random() * 200);
            zombie.y = this.y;
            zombie.life = 1;
        }
    }
    
    this.game.time.events.add(Phaser.Timer.SECOND * 6, this.spawn, this);
    
    
}