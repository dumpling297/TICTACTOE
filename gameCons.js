
class TicTacToe {

  constructor(p1, p2) {
    this._players = [p1,p2];
    this._turns = [null, null];

    this._sendToPlayer('Game Starts!');
    this._players.forEach((player, idx) => {
      player.on('turn', (turn) => {
        this._onTurn(idx, turn);
      });
    })
  }

  _sendToPlayer(playerIndex, msg) {
    this._players[playerIndex].emit('msg', msg);
  }
  _sendToPlayer(msg) {
    this._players.forEach((player)=> {
      player.emit('msg', msg);
  });
}
  _onTurn(playerIndex,turn) {
    this._turns[playerIndex] = turn;
    this._sendToPlayer(playerIndex, 'You selected ${turn}')
  }
}

module.exports = TicTacToe;
