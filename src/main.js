var gyroInfo =   {
    gamma: 0,
    alpha: 0,
    beta: 0
}
window.onload = function(){
    
    // setting gyroscope update frequency
    //  gyro.frequency = 10;
    // start gyroscope detection
     // gyro.startTracking(function(o) {
    //      gyroInfo.gamma = o.gamma;
     //     gyroInfo.alpha = o.alpha;
     //     gyroInfo.beta = o.beta;
    //  });
    
    var game = new Phaser.Game(640, 360, Phaser.AUTO, 'Phaser Fighter');
    game.state.add('boot', new BootState(game));
    game.state.start('boot');
}

