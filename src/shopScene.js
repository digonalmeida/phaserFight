

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

    this.createTextButton(0,30,"Comprar Kreds", function(){
        window.kongregate.mtx.showKredPurchaseDialog("offers");
        kongregate.chat.displayMessage("Hi there!","BenV");
    });
    this.createTextButton(0,60,"chat", function(){
        kongregate.chat.displayMessage("Hi there!","BenV");
    });
    this.createTextButton(0,90,"itens", function(){
        kongregate.mtx.requestItemList([], this.onItemList.bind(this));
    });
    this.createTextButton(180,90,"userItems", function(){
        // Request the inventory for the current player
        kongregate.mtx.requestUserItemList(null, this.onUserItems.bind(this));
    });
    this.createTextButton(0,0,"menu", function(){
        // Request the inventory for the current player
        this.game.state.start('menu');;
    });
    
}
 
// The callback function
ShopScene.prototype.onUserItems = function(result){
    console.log("%o", result);
  if( result.success ){
    for( var i = 0; i < result.data.length; i++ ){
      var item = result.data[i];
    this.createTextButton(180, 180 + (i * 20),item.identifier, function(){
        console.log("teste item");
    })
    }
  }
}
 
ShopScene.prototype.onItemList = function(result){
  if( result.success ){
    for( var i = 0; i < result.data.length; i++ ){
      var item = result.data[i];
      this.createTextButton(0, 180 + (i * 20),item.identifier, function(){
        kongregate.mtx.purchaseItems([item.identifier], onPurchaseResult);
    })
    }
  }
}


 
function onPurchaseResult(result){
  console.log("Purchase success:" + result.success);
}

