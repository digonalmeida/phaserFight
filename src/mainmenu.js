function MainMenu(game){
    this.game = game;
    this.playerNameText = null;
    this.playerIdText = null;
    this.playerHighscoreText = null;

}

MainMenu.prototype.createTextButton = function (x, y, text, callback){
    //this.game = new Phaser.Game();
    var text = this.game.add.text(x, y, text, {fill:'white'});
    text.inputEnabled = true;
    
    text.events.onInputUp.add(callback, this);
}
MainMenu.prototype.create = function(){
    kongregateUser.onChanged.push(this.updateLabels.bind(this));
    this.game.add.sprite(0,0,'menuBackground');
    this.createTextButton(100, 170, 'Play', function(){
        this.game.state.start('gameplay');
    });
    this.createTextButton(100, 260, 'Shop', function(){
        this.game.state.start('shop');
    });
    this.playerNameText = this.game.add.text(100,200, '', {fill:'white'});
    this.playerIdText = this.game.add.text(100, 230, '', {fill:'white'});
    this.playerHighscoreText = this.game.add.text(100, 230, '', {fill:'white'});
    this.updateLabels();
}

MainMenu.prototype.updateLabels = function(){
    loadHighscore();
    this.playerNameText.text = 'Playing as ' + kongregateUser.name;
    this.playerHighscoreText.text = 'Highscore: ' + kongregateUser.highScore;
}