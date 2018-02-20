const lib = require('../lib/utility.js');

const serveAvailableGames = function(req, res) {
  let availableGames = req.app.gamesManager.getAvailableGames();
  res.send(availableGames);
};

const serveGameName = (req, res) => res.send(req.cookies.gameName);
const serveUserName = (req, res) => res.send(req.cookies.playerName);

const serveGameStatus = (req, res) => {
  let gameName = req.cookies.gameName;
  let game = req.app.gamesManager.getGame(gameName);
  if (game == undefined) {
    res.statusCode = 400;
    res.send('');
    return;
  }
  res.json(game.getStatus());
};

const getBoardStatus = function(req, res) {
  let game = req.game;
  res.json(game.getBoardStatus());
};

const getBoard = function(req, res) {
  let game = req.game;
  let board = req.app.fs.readFileSync('./public/board.html','utf8');
  let boardStatus = game.getBoardStatus();
  res.setHeader('Content-Type','text/html');
  res.send(setPlayersName(board,boardStatus));
  res.end();
};

const setPlayersName = function(board, boardStatus) {
  return board.replace('{{{GREEN}}}', boardStatus.green)
    .replace('{{{RED}}}', boardStatus.red)
    .replace('{{{BLUE}}}', boardStatus.blue)
    .replace('{{{YELLOW}}}', boardStatus.yellow);
};

const rollDice = function(req,res,next){
  let game = req.game;
  let currentPlayerName = game.getCurrentPlayerName();
  let requestedPlayer = req.cookies.playerName;
  if(currentPlayerName != requestedPlayer){
    res.statusCode = 400;
    res.send('');
    res.end();
    return;
  }
  let move = game.rollDice();
  res.send(lib.toS(move));
  next();
};

const getDiceStatus = function(req,res){
  let game = req.game;
  let isvalidPlayer=game.doesPlayerExist(req.cookies.playerName);
  if(!isvalidPlayer) {
    res.statusCode = 400;
    res.send('');
    return;
  }
  let lastMove = game.currPlayerLastMove;
  res.send(lib.toS(lastMove));
};

module.exports = {
  serveAvailableGames,
  serveGameName,
  serveUserName,
  serveGameStatus,
  getBoardStatus,
  getBoard,
  rollDice,
  getDiceStatus
};