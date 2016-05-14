function Platform(gameplay, x, y){
    this.gameplay = gameplay;
    this.game = this.gameplay.game;
    
    
    Phaser.Sprite.call(this, this.game, x, y, 'floor');
    
    this.tint = 0x00ff00;
    
    this.game.add.existing(this);
    this.bringToTop();
    
    this.width = 400;
    this.height = 40;

    this.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.allowGravity = false;
    this.gameplay.wallGroup.add(this);
    
    //this.background = this.game.add.sprite(x,y,"building");
    //this.background.tint = 0x111111 * (this.y/2000);
    
    
    this.bringToTop();
    //this.addChild(this.background);
}

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;