 
// The callback function
function onUserItems(result){
  trace("User item list received, success: " + result.success);
  if( result.success ){
    for( var i = 0; i < result.data.length; i++ ){
      var item = result.data[i];
      trace((i+1) + ". " + item.identifier + ", " + item.id + "," + item.data);
    }
  }
}
 
function onItemList(result){
  trace("Item list result, success: " + result.success);
  if( result.success ){
    for( var i = 0; i < result.data.length; i++ ){
      var item = result.data[i];
      trace((i+1) + ". " + item.identifier + ", " + item.id + "," + item.name);
    }
  }
}

function ShopScene(game){
    this.game = game;
}
ShopScene.prototype.createTextButton = function (x, y, text, callback){
    //this.game = new Phaser.Game();
    var text = this.game.add.text(x, y, text, {fill:'white'});
    text.inputEnabled = true;
    
    text.events.onInputUp.add(callback, this);
}
ShopScene.prototype.create = function(){
    if(window.kongregate.services.isGuest()){
      window.kongregate.services.showRegistrationBox();
    }

    this.createTextButton(0,0,"Comprar Kreds", function(){
        window.kongregate.services.showKredPurchaseDialog();

    });
    this.createTextButton(0,30,"Comprar Kreds 2", function(){
        window.kongregate.mtx.showKredPurchaseDialog("offers");
        kongregate.chat.displayMessage("Hi there!","BenV");
    });
    this.createTextButton(0,60,"chat", function(){
        kongregate.chat.displayMessage("Hi there!","BenV");
    });
    this.createTextButton(0,90,"itens", function(){
        kongregate.mtx.requestItemList([], onItemList);
    });
    this.createTextButton(0,120,"userItems", function(){
        // Request the inventory for the current player
        kongregate.mtx.requestUserItemList(null, onUserItems);
    });
    
}
