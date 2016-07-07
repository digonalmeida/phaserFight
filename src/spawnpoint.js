function SpawnPoint(gamestate, x, y){
    this.gamestate = gamestate;
    this.game = this.gamestate.game;
    this.x = x;
    this.y = y;
    this.game.time.events.add(Phaser.Timer.SECOND * 0.1, this.spawn, this);
}

SpawnPoint.prototype.spawn = function(){
    var player = this.gamestate.player;
    
    if(Math.sqrt( Math.pow(this.x - player.x,2) + Math.pow(this.y - player.y, 2)) > 300){
        
        var zombie = this.gamestate.zombieGroup.getFirstDead(false);
        //if(zombie == null){
        //    zombie = new Zombie(this.gamestate);   
        //}
        if(zombie != null){
            zombie.revive();
            zombie.body.x =  this.x + (Math.random() * 50);
            zombie.body.y = this.y + 30;
            zombie.life = 1;
            zombie.walkSpeed = -100 + (Math.random() * 200) ;
           // console.log(zombie.walkSpeed);
        }
    }
    
    this.game.time.events.add(Phaser.Timer.SECOND * 3, this.spawn, this);
    
    
}