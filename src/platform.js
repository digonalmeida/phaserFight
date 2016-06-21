function Platform(gameplay, x, y){
    this.gameplay = gameplay;
    this.game = this.gameplay.game;
    
    
    Phaser.Sprite.call(this, this.game, x, y, 'floor');
    this.background = this.game.add.tileSprite(x,y, 80, 2000, "building");
    console.log(this.y / this.game.world.bounds.height);
    var randColor = (((this.y / this.game.world.bounds.height) * 255) * 0.8) +0;
    console.log(randColor);
    this.background.tint = (randColor) + (randColor << 8) + (randColor << 16);
    this.tint = 0x00ff00;
    this.background.anchor.setTo(0.5, 0);
  
    this.game.add.existing(this);
    //this.bringToTop();
    
    this.width = 80;
    this.height = 10;

    this.game.physics.p2.enable(this);
    this.body.static = true;
    this.body.allowGravity = false;
    this.body.setCollisionGroup(this.gameplay.wallCollsionGroup);
    this.body.collides([this.gameplay.wallCollsionGroup, this.gameplay.playerCollisionGroup, this.gameplay.ammoCollisionGroup, this.gameplay.ropeCollisionGroup]);
    
    this.body.debug = true;

}

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;