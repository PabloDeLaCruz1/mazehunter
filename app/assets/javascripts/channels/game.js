// WORK IN PROGRESS, MULTIPLAYER NOT YET FINALIZED
var channelContainer = document.querySelector("#channel-container")
var clientInfo = {
  channelId: channelContainer.dataset.channelId,
  userId: channelContainer.dataset.userId,
  playerImage: channelContainer.dataset.playerImage
}
var players = {};

App.game = App.cable.subscriptions.create({ // channel name and params:
  channel: "GameChannel",
  id: channelContainer.dataset.channelId,
  user_id: channelContainer.dataset.userId
}, { // callback functions:
  connected: function(){
    // Called when the subscription is ready for use on the server
    console.log("Connected to game channel");
    this.join();
  },
  disconnected: function(){
    // Called when the subscription has been terminated by the server
  },
  received: function(data){
    // the data sent back will consist of a function name, indicating what to do,
    // and a params object, containing the arguments to the function.
    this[data.function](data.params);
  },
  // BEGIN CLIENT FUNCTIONS:
  // these functions are initiated by the client to send data to the server
  join: function(){
    this.userList = document.querySelector("#user-list");
    this.userId = channelContainer.dataset.userId;
    var input = document.querySelector("#input-message");
    var game = this;

    input.addEventListener("input", function(){
      game.sendMessage({
        message: input.value
      });
    });
    this.perform("join");
  },
  updatePlayerPosition: function(id, x, y){
    // this function is called by a client when their player's position changes
    this.perform("update_player_position", {id, x, y});
  },
  startGame: function(){
    this.perform("start_game");
  },
  // END CLIENT FUNCTIONS
  // BEGIN SERVER FUNCTIONS:
  // these functions are initiated by the server, telling the client to do something
  onJoin: function({user_elements: userElements, player_ids}){
    for (let playerId of player_ids){
      players[playerId] = null;
    }
    console.log(players);
    // this function is called only for the newly joining user
    elements = userElements.toElements();
    // convert nodelist to array
    // for (var elementArray = [], i = elements.length; i;) elementArray[--i] = elements[i];
    // // add each user element in array to user list
    // for (elem of elementArray){
    //   this.addUserCard(elem);
    // }
  },
  onUserJoined: function({user_element: userElement, user_id}){
    // This function runs for every user EXCEPT the one who just joined
    // skip for the joining user
    if (user_id == this.userId) return;
    // for all other users, append this userElement to the page
    // this.addUserCard(userElement.toElement());
    // add user_id to players
    players[user_id] = null;
    console.log(players);
  },
  onStartGame: function(){
    startGame();
  },
  onUpdatePlayerPosition: function({id, x, y}){
    players[id].setPosition(x,y);
  },
  onLeave: function({user_id}){
    // this.userList.querySelector(`#output-${userId}`).remove();
    delete players[user_id];
    console.log(players);
  },
  // END SERVER FUNCTIONS
  // BEGIN HELPER FUNCTIONS
  // These functions are used in the other ones above
  
  // END HELPER FUNCTIONS
});