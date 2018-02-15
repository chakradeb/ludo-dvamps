const Game = require('./game.js')

class GamesManager {
  constructor() {
    this.games = {};
  }

  doesGameExists(gameName) {
    return gameName in this.games;
  }

  addGame(gameName) {
    let game = new Game(gameName);
    this.games[gameName] = game;
    return game;
  }
}
module.exports = GamesManager;
