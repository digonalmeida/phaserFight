function BootState(game) {
    
    this.game = game;
    console.log("%o", window.kongregate);
}


BootState.prototype.preload = function() {
    this.game.load.image('player', 'sprites/player.png');
    this.game.load.image('gun', 'sprites/gun.png');
    this.game.load.image('shot', 'sprites/shot.png');
    this.game.load.image('floor', 'sprites/floor.png');
    this.game.load.image('building', 'sprites/platform.png');
    this.game.load.image('zombie', 'sprites/zombie.png');
    this.game.load.image('menuBackground', 'sprites/menuBackground.png')
}

BootState.prototype.create = function() {
    this.game.state.add('gameplay', new GameplayState(this.game));
    this.game.state.add('menu', new MainMenu(this.game));
    this.game.state.start('menu');   
}