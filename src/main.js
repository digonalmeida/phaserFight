window.onload = function(){
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'Phaser Fighter');
    game.state.add('boot', new BootState(game));
    game.state.start('boot');
}