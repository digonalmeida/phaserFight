function Platform(gameplay, x, y){
    this.gameplay = gameplay;
    this.game = this.gameplay.game;
    
    
    Phaser.Sprite.call(this, this.game, x, y, 'floor');
    this.background = this.game.add.tileSprite(x,y+40, 340, 2000, "building");
    console.log(this.y / this.game.world.bounds.height);
    this.background.tint = 0x222222 + (0x111111 * parseInt( 9 * ( (this.y / this.game.world.height))));
    this.tint = 0x00ff00;
  
    this.game.add.existing(this);
    this.bringToTop();
    
    this.width = 340;
    this.height = 40;

    this.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.allowGravity = false;
    this.gameplay.wallGroup.add(this);
    
    
    
    
    this.game.world.bringToTop(this.gameplay.wallGroup);
    //this.addChild(this.background);
}

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;