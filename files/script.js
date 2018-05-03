var socket = io("http://localhost:11321");
var win=0;
var loss=0;
//GAME----------------------------------------------------------------------
//Ticked boxes in game are marked with either class "cross" or "unmarked"
//--------------------------------------------------------------------------
socket.on('doneGame', function(data){

})

function check3(x,data) {
  //if 3 boxes in row : WIN
  if (x==3) {
    win++;
    alert(data.idS+" wins!");
    clearInterval(a);
    var gameID = data.gameID;
    var idS = data.idS;
    var name = data.name;
    console.log("check:",data);
    socket.emit('gameRetrive', {idS, gameID, name, win, loss});
    back(data);
  }
}

//----functions help check for game win
function classicGameDiag(data) {
  //for diagonal
  var rm=0, i=0;
  var diago1=0, diago2=0, diago3=0;
  var d1=0, d2=0, d3=0;
    for (var j=2; j>=0; j--){
      var diag1= document.getElementById("table1"+'r'+j+'c'+rm);
      var diag2= document.getElementById("table2"+'r'+j+'c'+rm);
      var diag3= document.getElementById("table3"+'r'+j+'c'+rm);
      var diagonal1= document.getElementById("table1"+'r'+i+'c'+i);
      var diagonal2= document.getElementById("table2"+'r'+i+'c'+i);
      var diagonal3= document.getElementById("table3"+'r'+i+'c'+i);
      if (diagonal1.classList.contains("cross")) {
        //console.log("diag1");
        diago1+=1;
        check3(diago1,data);
      }
      if (diagonal2.classList.contains("cross")) {
        //console.log("diag2");
        diago2+=1;
        check3(diago2,data);
      }
       if (diagonal3.classList.contains("cross")) {
         //console.log("diag3");
         diago3+=1;
         check3(diago3,data);
     }
      if (diag1.classList.contains("cross")) {
        d1+=1;
        check3(d1,data);
      }
      if (diag2.classList.contains("cross")) {
        d2+=1;
        check3(d2,data);
      }
       if (diag3.classList.contains("cross")) {
         d3+=1;
         check3(d3,data);
     }
     rm+=1;
     i=i+1;
   }

}

function classicGameRC(data) {

  //check if a row or col is crossed out
  for (var row=0; row<3; row++){
    var t1row=0,t2row=0,t3row=0;
    var t1col=0,t2col=0,t3col=0;
    for (var col=0; col<3; col++){
      var t1 = document.getElementById("table1"+'r'+row+'c'+col);
      var t2 = document.getElementById("table2"+'r'+row+'c'+col);
      var t3 = document.getElementById("table3"+'r'+row+'c'+col);
      var reverset1 = document.getElementById("table1"+'r'+col+'c'+row);
      var reverset2 = document.getElementById("table2"+'r'+col+'c'+row);
      var reverset3 = document.getElementById("table3"+'r'+col+'c'+row);
      //checking if rows are crossed out
      if (t1.classList.contains("cross")){
        t1row+=1;
        //console.log("t1");
        check3(t1row,data);
      }
      if (t2.classList.contains("cross")) {
      //  console.log("t2");
        t2row+=1;
        check3(t2row,data);
      }
      if (t3.classList.contains("cross")) {
        //console.log("t3");
        t3row+=1;
        check3(t3row,data);
      }
      //checking if cols are crossed out
      if (reverset1.classList.contains("cross")) {
        //console.log("reverse1");
        t1col+=1;
        check3(t1col,data);
      }
      if(reverset2.classList.contains("cross")) {
        //console.log("reverset2");
        t2col+=1;
        check3(t2col,data);
      }
      if(reverset3.classList.contains("cross")) {
        //console.log("reverset3");
        t3col+=1;
        check3(t3col,data);
      }
    }
  }
}

function gameRC3D(data) {
  for (var col=0; col<3; col++) {
    for (var row=0; row<3; row++) {
      var t1= document.getElementById("table1"+"r"+row+"c"+col);
      var t2= document.getElementById("table2"+"r"+row+"c"+col);
      var t3= document.getElementById("table3"+"r"+row+"c"+col);
      if (t1.classList.contains("cross")
      && t2.classList.contains("cross")
      && t3.classList.contains("cross")) {
        check3(3,data);
      }
    }
  }

}

function gameDiag3D(data) {
  var t1 = document.getElementById("table1r0c0");
  var t2 = document.getElementById("table2r1c1");
  var t3 = document.getElementById("table3r2c2");

  var rt1 = document.getElementById("table1r0c2");
  var rt3 = document.getElementById("table3r2c0");

  if (t1.classList.contains("cross")
  && t2.classList.contains("cross")
  && t3.classList.contains("cross")) {
    check3(3,data);
  }
  if (rt1.classList.contains("cross")
  && t2.classList.contains("cross")
  && rt3.classList.contains("cross")) {
    check3(3,data);
  }
}

function gameCheck(data) {
  classicGameRC(data);
  classicGameDiag(data);
  gameRC3D(data);
  gameDiag3D(data);
}

//----make the table for the table
function makeTable(x){
  var section = document.getElementsByTagName("section")[0];
  var table = document.createElement('table');
  table.setAttribute("id", x);
  var tbdy = document.createElement('tbody');
  var tr, row, col;
  for (row=0; row<3; row++) {
    var tr = document.createElement('tr');
    for (col=0; col<3;col++) {
      //each data box of the table
      //need td variables to listen for events within scope
      (function() {
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(""));
        td.classList.add("unmarked");
        td.id = x+'r'+row+'c'+col;
        td.addEventListener("click", function() {
          console.log("tdis:",td.id);
          if(td.classList.contains("unmarked")){
              td.classList.add("cross")
              td.classList.remove("unmarked");
              td.innerHTML = "X";
            }/*else {
              td.classList.add("marked");
              td.classList.remove("unmarked");
              td.textContent = "O";
            }*/
        })
        tr.appendChild(td);
      }());
    }
    tbdy.appendChild(tr);
  };
  table.appendChild(tbdy);
  section.appendChild(table);
  console.log("tables made;")
};

//back button in game page -- simple calling socket.emit in GetGame not working
function back(data) {
  console.log("back button", data);
  clearInterval(a); //clear game-check
  var idS = data.idS;
  var gameID = data.gameID;
  var name = data.name;
  console.log(idS," ",win);
   var d =  {idS,gameID, name, win,loss}
   drawPage(d)
  //socket.emit('gameHello', {id,name,gameID, win,loss});
}

//creates the whole game page
function GetGame(data){
  //naem, ids, gameid
  //head
  console.log("getgame:",data);
  $('body').addClass('GameBody');
  $('body>h1').empty();
  var head = document.createTextNode("BEGIN GAME.");
  $('h1').append(head);
  $('h1').addClass('GameHeader');

  //backbutton
  $('body>button').remove();
  var btn = document.createElement("button");
  var btext = document.createTextNode("BACK");
  btn.appendChild(btext);
  btn.setAttribute("id", "backbtn");

  //gameSection
   $("body>section").empty();
   $("body>section").attr('id','board');
   $('body>section').append(btn);
   $('#backbtn').addClass('backbutton');

   //player
   var ply = document.createTextNode("Player: "+data.idS);
   var h2 = document.createElement('h2');
   h2.appendChild(ply);
   $('section').append(h2);

    makeTable("table1");
    makeTable("table2");
    makeTable("table3");

    document.getElementById('backbtn').onclick = function(){
      console.log("backbutn");
      back(data);
	// re-direct
    }

    console.log("begin game check");
   a=setInterval(gameCheck, 1000, data);
};

//LOGIN---------------------------------------------------------------------
//--------------------------------------------------------------------------
socket.on('IncorrectPass', function(){
  alert("Username or Password is Incorrect. Please try again.")
})

socket.on('gameHistory', function(data){
  console.log("gamehistory",data);
  var text = JSON.parse(data);
  var toPost = document.createTextNode(data);
  $('section').append(document.createTextNode("GAME HISTORY!"));
  $('section').append(document.createElement('br'));
  $('section').append(toPost);
})

function drawPage(data) {
  console.log("gamestat:",data);
  //define the html
  $('body>h1').empty();
  $('body').removeClass('GameBody')
  var head = document.createTextNode("Welcome "+data.name+"!");
  $('h1').addClass('changeheader');
  $('h1').removeClass('GameHeader');
  $('body>h1').append(head);
  $('section').empty();
  $('section').removeAttr("id");
  $('section').addClass('changesection');

  //games within gameSection

  var btn = document.createElement("button");
  var btext = document.createTextNode("NEW GAME");
  btn.appendChild(btext);
  btn.setAttribute("id", "gamebtn");
  $('body').append(btn);
  $('#gamebtn').addClass('changebutton');
  $('#gamebtn').click(function(){
    //name, ids , gameid
    GetGame(data);
  });

  var gameID = data.gameID;
  var name = data.name;
  var idS= data.idS;
  var loss = data.loss;
  //data = id, name, gameID, loss
  socket.emit('spit', {gameID, name,idS,loss});
}

//get game history
socket.on('gameStat', function(data) {
  drawPage(data);
});


function Log(){

  idS=$('#Username').val();
  pass=$('#Password').val();
  socket.emit('gamePage', {idS, pass});
}

//---------------------------------------------------------------------------
//REGISTER EVENT PAGE
//From root page : "REGISTER HERE"
//Each registered member will be saved in database

socket.on('regSaved', function(){
  alert("Registration completed!");
  $("#form").trigger('reset');
})
socket.on('regIDused', function(){
  alert("USER-ID already in use. Please try another.");
  $("#form").trigger('reset');
})
function SaveUser() {
  FUser=$('#FUser').val();
  LUser=$('#LUser').val();
  idS=$('#idS').val();
  pass=$('#pass').val();
  age=$('#age').val();
  birth=$('#birth').val();
  gender=$('#gender').val()
  email=+$('#email').val();
  socket.emit('savePerson', {FUser, LUser,idS, pass, age, birth, gender,email});
}


function RegisterPage() {
  document.location.href = 'RegisterPage.html';
}
