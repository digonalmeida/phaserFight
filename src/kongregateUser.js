kongregateUser = {
    name: 'guest',
    id: -1,
    highscore:0,
    lifetimeScores:[],
    sendScore: function(score)
    {
        kongregate.stats.submit('Highscore', score);
    },
    testUpdateFields: function(){
      kongregateUser.name = 'test';  
    kongregateUser.changed.bind(this)();
    },
    updateFields: function(){
        kongregateUser.name = kongregate.services.getUsername();
        kongregateUser.id = kongregate.services.getUserId();
        //http://www.kongregate.com/api/high_scores/lifetime/124807.json
        $.ajax({
            url: 'http://www.kongregate.com/api/high_scores/lifetime/124807.json?user_id=' + kongregateUser.id,
            success: function (result) {
                console.log("%o", result);
                if (result.isOk == false) alert(result.message);
                var resultObj = JSON.parse(result);
                kongregateUser.lifetimeScores = resultObj.lifetime_scores;
            },
            async: false
        });
        console.log("%o", kongregateUser);
        kongregateUser.changed();
    },
    onChanged: [], //array of callbacks.
    changed: function(){
     for(var i = 0; i < this.onChanged.length; i++){
        this.onChanged[i]();   
     }
    }
};

if(kongregateAPI != 'undefined'){
    kongregateAPI.loadAPI(function(){
        window.kongregate = kongregateAPI.getAPI();
        kongregateUser.updateFields();
        kongregate.addEventListener('login', function(){
            console.log('Kongregate username changed to: ' + kongregate.services.getUsername());
        kongregateUser.updateFields();
        });
        }
    );
}
