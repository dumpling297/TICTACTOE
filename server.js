var express = require('express');
var app = express();
var serverIndex = require('serve-index');
var http = require('http');
var querys = require('querystring');
var port = process.env.PORT || 11321;   //27222
var server = http.createServer(app).listen(port);
var io = require('socket.io')(server);
var client =0;
var count=0;
var users =[];
var database;
var Ticc = require('./gameCons');
let waitingPlayer=null;
//tech namespace
const gamespc = io.of('/gamespc');
var room = "tictac";
//------------------------------------------------------------------------
//MONGO-DATABASE
var mongoose = require('mongoose');
var MUrl = "mongodb://naina:123@ds011321.mlab.com:11321/gameuser";
var Schema = mongoose.Schema;
var scheme = new Schema({
  FUser: String,
  LUser: String,
  idS: String,
  pass: { type:String, minlength:3 },
  birth: String,
  age: { type:Number, min:[0,'not born yet'], max:120 },
  gender: String,
  email: String,
  games: String,
  gameidS: String,
  Winner: Number,
  Loss: Number,
  Time: String,
})
var gameUser = mongoose.model('gameuser',scheme);

mongoose.connect(MUrl, function(err, db){
  if(!err){
    console.log("Database Connected");
    database = db;
  }
});
//----------------------------------------------------------------------
//GAME
//Test User: N29, Pass: pass
function DateNow() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!

  var yyyy = today.getFullYear();
  if(dd<10){
      dd='0'+dd;
  }
  if(mm<10){
      mm='0'+mm;
  }
  var today = dd+'/'+mm+'/'+yyyy;

return today;
}


var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: "login.html"
}

//------------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
//connection to root file -- first page
app.use("/", function(req,res,next) {
  console.log(req.method, 'request:', req.url, JSON.stringify(req.body));
  next();
})
app.all('/', function(req, res, next) {
  console.log('Root Folder...')
  next();
})
app.use('/', express.static('./files', options));

//connection
io.on('connection', function(socket){
    //console.log('new connection');

    socket.on('PlayerInGame', ()=> {
      console.log("inside PlayerInGame");
      //If no other waitingPlayer, then you are waitingPlayer
      //Else, match with the waitingPlayer
      //Works by checking if waitingPlayer is null
      if (waitingPlayer) {
        //match starts
        notifyMatch(waitingPlayer,socket);
        //new TicTacToe(waitingPlayer, socket);
        //no waiting player once matched.
        waitingPlayer = null;
      } else {
        //when waitingPlayer is null, define waiting player with current socket
        waitingPlayer = socket;
        socket.emit('msg', 'waiting for a second player');
      }
    });

    //Registration_Page
    socket.on('savePerson', (data)=>{
      console.log("saving registrated user...");
      //console.log(data);

      //Check if user exists, on false : add user
      gameUser.findOne({idS: data.idS}, function(err, existingUser){
        console.log("checking if user exists...");
        //console.log(data.idS);
         if(existingUser){
           console.log("UserID in Use!");
           socket.emit("regIDused");
         }
         else {
           var msg = new gameUser({
             FUser:data.FUser,
             LUser:data.LUser,
             idS:data.idS,
             pass:data.pass,
             age:data.age,
             birth:data.birth,
             gender:data.gender,
             games:"123",
             gameidS: data.idS+"123",
             game: 0,
             Win: 0,
             Loss:0,
             Time: "The beginning of time.",
           });
           console.log(msg);
           msg.save(function(err, doc){
             if(err) {console.log("ERROR with saving data."); }
             else{
               console.log("saved!");
               socket.emit("regSaved");
              }
           });
         }
      })

    });

    //From Login : checks user credentials
    //retrieves game stats
    //the main page
    socket.on('gamePage', (data)=>{
      console.log("inside gamePage");
      gameUser.findOne({idS: data.idS}, function(err, existUser){
        console.log("user check");
        if(existUser){
          if (existUser.pass == data.pass) {
            console.log("login passed");
            var name = existUser.FUser;
            var idS = existUser.idS;
            var gameID = existUser.gameidS;
            //console.log(gameID);
            socket.emit('gameStat',{name, idS, gameID});
          } else {
            console.log("not the password");
            socket.emit('IncorrectPass');
          }
        }
        else {
          console.log("not a valid User Id");
          socket.emit('IncorrectPass');
        }
      });
    })

    //spit out all game/player data
    socket.on('spit', (data)=> {
      var Users = [];
      var select = [];
      var c=0;
      var x = DateNow();
      //find each game and spit
      gameUser.find({gameidS: data.gameID}, function(er, exist){
        exist.forEach(function(g){
          //console.log("games:",g);
          var gam = { game: Number,
                       Win: Number,
                       Loss: Number,
                       Time: String,};
          gam.game = c;
          c++;
          gam.Win = g.Win;
          gam.Loss = g.Loss;
          gam.Time = x;
          Users.push(gam);
        });
        var users = JSON.stringify(Users);
        socket.emit('gameHistory', users);
      })
    })

    //want to change X or O depending on which user
    socket.on('changeTic', (data)=> {
      // X or O based on whether client = even or odd (2-players)
      var m = data.m;
      console.log("inside changeTic ",data);
      //socket.emit('ticMarker', data);
      socket.broadcast.emit('ticMarker', data);
    })

    //get the game stats after the game
    socket.on('gameRetrive', (data)=>{
      //console.log("gameRe:",data.win,data.gameID,data.loss);
      //console.log(data.idS);
      var today = DateNow();
        //console.log("HERE:",data.gameID);
    //  var x= dat();
      var msg = new gameUser({
        gameidS: data.gameID,
        game: 0,
        Win: data.win,
        Loss:data.loss,
        Time: today,
      });
      //console.log(msg);
      msg.save(function(err, doc){
        if(err) {console.log("ERROR with saving data."); }
        else{
        //  console.log("saved!");
          socket.emit('doneGame', data);
        }
      })
    });

});

function notifyMatch(socketA, socketB){
  [socketA,socketB].forEach((socket) => socket.emit('msg', 'Match Starts'));
};

console.log('running on port:', port);
