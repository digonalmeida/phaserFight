function GameplayState(game){
    this.game = game;
    this.backgroundColor = 0x555566;
   
    this.maxZombies = 300;
    
    this.wallsRows = 11;
    this.wallsMinX = 0;
    this.wallsMaxX = 800;
    this.wallsPerRow = 3;
    
    this.worldBounds = {
        x: 0,
        y: 0,
        width: 800,
        height: 600
    }
     this.gravityY = 500;
    
    this.playerGroup = null;
    this.wallGroup = null;
    this.shotsGroup = null;
    this.zombieGroup = null;
    this.guiGroup = null;
    
    this.playerCollisionGroup = null;
    this.shotsCollisionGroup = null;
    this.ropeCollisionGroup = null;
    this.wallCollsionGroup = null;
    this.ammoCollisionGroup = null;
    this.inviWallCollisionGroup = null;
    
    this.player = null;
    
    this.pointsGui = null;
    this.ammoGui = null;
    this.highScore = 0;
    this.score = 0;
    
    this.kongregateUserId = 0;
}

GameplayState.prototype.setHighscore = function(callback){
    
    
    this.loadHighscore();
    
    if(this.highScore <= this.score){
        this.highScore = this.score;
        if(this.kongregateUserId != 0){
            window.kongregate.stats.submit("HighScore", this.score);
            return;
        }
        localStorage.setItem("goldenBullets_highscore", this.highScore.toString()); 
        alert(localStorage.getItem("goldenBullets_highscore"));
        
    }
}

GameplayState.prototype.loadHighscore = function(){
    if(this.kongregateUserId != 0){
        $.ajax({
            url: 'http://http://www.kongregate.com/api/high_scores/lifetime/124807.json?user_id=' + this.kongregateUserId,
            success: function (result) {
                if (result.isOk == false) alert(result.message);
            },
            async: false
        });
        return;
    }
    this.highScore = localStorage.getItem("goldenBullets_highscore");
    if(this.highScore == null){
           this.highScore = 0;
    }
    else
    {
        this.highScore = parseInt(this.highScore);  
    }
}

GameplayState.prototype.init = function() {
    this.worldBounds = {
        x: 0,
        y: 0,
        width: 800,
        height: 600
    }
    this.worldBounds = {
        x: 0,
        y: 0,
        width: 800,
        height: 600
    }
    this.playerGroup = null;
    this.wallGroup = null;
    this.shotsGroup = null;
    this.zombieGroup = null;
    this.guiGroup = null;
    
    this.playerCollisionGroup = null;
    this.shotsCollisionGroup = null;
    this.ropeCollisionGroup = null;
    this.wallCollsionGroup = null;
    this.ammoCollisionGroup = null;
    
    this.player = null;
    
    this.pointsGui = null;
    this.ammoGui = null;
    
    
    this.score = 0;
    if(window.kongregate != null){
        this.kongregateUserId = window.kongregate.services.getUserId();
    }
}

GameplayState.prototype.createInviWall = function(x, y, w, h){
    var inviWall = this.game.add.sprite(x,y,'');
    
    inviWall.height = h;
    inviWall.width = w;
    inviWall.anchor.setTo(0,0);
    this.game.physics.p2.enable(inviWall, true);
    inviWall.body.x = x;
    inviWall.body.y = y;
    inviWall.body.static = true;
    inviWall.body.collides([this.playerCollisionGroup,
                           this.ammoCollisionGroup,
                           this.zombieCollisionGroup]);
    inviWall.body.setCollisionGroup(this.inviWallCollisionGroup);
    
}
GameplayState.prototype.createWalls = function(){
    this.createInviWall(-5,0,10, 5000);
    this.createInviWall(this.worldBounds.width+5, 0, 10, 5000);
    this.createInviWall(0,-5,5000, 10);
    this.createInviWall(0,this.worldBounds.height+5,5000, 10);
    for(var i = 0; i < this.wallsRows; i++){
        for(var j = 0; j < this.wallsPerRow; j++){
            this.createWall(this.wallsMinX + (Math.random() * (this.wallsMaxX - this.wallsMinX)), 50 * i, 100, 10);
            
        }
    }
    
}

GameplayState.prototype.createZombies = function(){
    for(var i = 0; i < this.maxZombies; i++){
        var zombie = new Zombie(this);
        zombie.kill();
    }
   // this.game.world.bringToTop(this.zombieGroup);
}

GameplayState.prototype.createWall = function(x, y, w, h){
    new Platform(this, x, y);
    new SpawnPoint(this, x, y-5);
   // this.game.world.bringToTop(this.wallGroup);
}

function goFullScreen(game){
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    game.scale.startFullScreen(false, true);
   // game.scale.setScreenSize(true);
}

GameplayState.prototype.create = function(){
    
   // goFullScreen(this.game);
    this.loadHighscore();

    this.game.stage.backgroundColor = this.backgroundColor;
    
    this.game.world.setBounds(this.worldBounds.x,
                             this.worldBounds.y,
                             this.worldBounds.width,
                             this.worldBounds.height);
    
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    console.log('teste %o', this.player);
    this.game.physics.p2.setBoundsToWorld(true, true, true, true, true);
    this.game.physics.p2.gravity.y = this.gravityY;
    this.game.physics.p2.setImpactEvents(true);
    
    this.wallGroup  = this.game.add.group();
    this.zombieGroup = this.game.add.group();
    this.playerGroup = this.game.add.group();
    this.shotsGroup = this.game.add.group();
    this.guiGroup = this.game.add.group();
    
    this.wallCollsionGroup = this.game.physics.p2.createCollisionGroup();
    this.shotsCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.ammoCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.ropeCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.zombieCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.inviWallCollisionGroup = this.game.physics.p2.createCollisionGroup();
    
    this.game.physics.p2.updateBoundsCollisionGroup();
    
    
    this.createWalls();
    this.createZombies();
    this.player = new Player(this);
    this.game.camera.follow(this.player);
    
    this.game.world.bringToTop(this.zombieGroup);
    this.game.world.bringToTop(this.playerGroup);
    this.game.world.bringToTop(this.shotsGroup);
    
    this.createFullscreenButton();
    
    this.pointsGui = this.game.add.text(200, 0, "Score:" + this.score, {fill:'yellow'});
    this.highScoreGui = this.game.add.text(350,0,"Highscore:" + this.player.gun.ammo, {fill:'yellow'});
    this.ammoGui = this.game.add.text(0,0,"Ammo:" + this.player.gun.ammo, {fill:'yellow'});
    this.ammoGui.anchor.setTo(1,1);
    this.ammoGui.x = this.game.width;
    this.ammoGui.y = this.game.height;
    this.game.world.bringToTop(this.guiGroup);
    this.guiGroup.add(this.pointsGui);
    this.guiGroup.add(this.ammoGui);
    this.guiGroup.add(this.highScoreGui);
    this.guiGroup.fixedToCamera = true;
    console.log("col: " + this.player.body.collideWorldBounds)
}

GameplayState.prototype.createFullscreenButton = function(){
    var fsbutton = this.game.add.text(0, 0, "FullScreen", {fill: 'white'});
    fsbutton.inputEnabled = true;
    fsbutton.events.onInputUp.add(function(){
        goFullScreen(this.game);
    }, this);
    this.guiGroup.add(fsbutton);
    //fsbutton.fixedToCamera = true;
}

GameplayState.prototype.playerFloorCollision = function(player, wall){
    player.collideWithFloor();
}

GameplayState.prototype.playerZombieCollision = function(player, wall){
   // player.collideWithZombie();
}

GameplayState.prototype.shutdown = function(){
    this.game.physics.p2.reset();
    // this.player.destroy();
    console.log('clear');
}

GameplayState.prototype.update = function(){
    
    this.pointsGui.text = "Points: " + this.score;
    this.ammoGui.text = "Ammo: " +this.player.gun.ammo;
    this.highScoreGui.text = "Highscore: " + this.highScore;
   // this.game.debug.text('Living: ' + this.zombieGroup.countLiving() + '   Dead: ' + this.zombieGroup.countDead(), 32, 64);
    
}