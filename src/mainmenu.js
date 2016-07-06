function MainMenu(game){
    this.game = game;
    this.playerNameText = null;
    this.playerIdText = null;
    this.playerHighscoreText = null;

    this.playerName = "guest";
    this.playerId = -1;
    this.playerHighscore = 0;
}

MainMenu.prototype.createTextButton = function (x, y, text, callback){
    //this.game = new Phaser.Game();
    var text = this.game.add.text(x, y, text, {fill:'white'});
    text.inputEnabled = true;
    
    text.events.onInputUp.add(callback, this);
}
MainMenu.prototype.create = function(){
    
    this.game.add.sprite(0,0,'menuBackground');
    this.createTextButton(100, 170, 'Play', function(){console.log('play');});
    this.playerNameText = this.game.add.text(100,200, '', {fill:'white'});
    this.playerIdText = this.game.add.text(100, 230, '', {fill:'white'});
    this.playerHighscoreText = this.game.add.text(100, 230, '', {fill:'white'});
    this.updateLabels();
}

MainMenu.prototype.updateLabels = function(){
    this.playerNameText.text = 'Playing as ' + this.playerName;
    this.playerHighscoreText.text = 'Highscore: ' + this.playerHighscore;
}