var diceArr = [];
var score = 0;
var numPlayers = 1;
var winningScore = 5000;
var hasRolled = false;
var isSubmitted = false;
var isFinalRound = false;
var lastTurns = 0;
var turn = 1;

let playerScoreDiv = document.querySelector(".playerScore");
let turnDiv = document.querySelector(".turn");
let rowScore = document.querySelector(".score");
let dark = document.querySelector("darkmode");

const player1 = {
  name: "Player 1",
  score: 0,
  isPlaying: false,
  isTurn: false
};

const player2 = {
  name: "Player 2",
  score: 0,
  isPlaying: false,
  isTurn: false
};

const player3 = {
  name: "Player 3",
  score: 0,
  isPlaying: false,
  isTurn: false
};

const player4 = {
  name: "Player 4",
  score: 0,
  isPlaying: false,
  isTurn: false
};

function initializeDice() {
  for (i = 0; i < 6; i++) {
    diceArr[i] = {};
    diceArr[i].id = "die" + (i + 1);
    diceArr[i].value = i + 1;
    diceArr[i].clicked = 0;
  }
}

function initializeGame() {
  initializeDice();
  document.getElementById("scoreMenu").value = 5000;
  document.getElementById("playerMenu").value = 1;
  score = 0;
  numPlayers = 1;
  turnDiv.innerHTML = "";
  rowScore.innerHTML = "";
  hasRolled = false;
  isSubmitted = false;
}

function rollDice() {
  if(isSubmitted) {
    var clicked = false;

    for(var i = 0; i < 6; i++){
      if (diceArr[i].clicked){
        clicked = true;
      }
    }

    if(hasRolled && !clicked) {
      alert("If you want to roll again, you must select at least one die to keep.")
    }
    else if(!hasRolled && clicked){
      alert("You must roll before selecting dice to keep.")
    }
    else{
      hasRolled = true;
      console.log(diceArr);
      for (var i = 0; i < 6; i++) {
        if (diceArr[i].clicked === 0) {
          diceArr[i].value = Math.floor((Math.random() * 6) + 1);
        }
      }

      var firstscore = calculateScore(diceArr.filter(dice => dice.clicked === 1));
      var nextscore = calculateScore(diceArr.filter(dice => dice.clicked === 0));
      score = firstscore + nextscore;
      rowScore.innerHTML = `${score} points this roll `;

      updateDiceImg();
      checkTurn();
    }
  }
  else{
    alert("Enter Number of Players First");
  }
}

function advanceTurn(){
  if(turn < numPlayers){
      turn++;
    }
    else{
      turn = 1;
    }
}

function bankScore() {
  if(hasRolled) {
    var current = eval("player"+turn);
    var e = document.getElementById("ps"+turn);

    current.score += score;
    e.innerHTML = current.name + " Score : " + current.score;
    score = 0;

    advanceTurn();
    resetDiceTransparency()
    initializeDice();
    updateDiceImg();
  
    if (current.score >= winningScore && !isFinalRound) {
      alert(current.name + " has reached " + document.getElementById("scoreMenu").value + " points.\nEach player will now take a final turn.");
      isFinalRound = true;
      turn = 1;
    }

    var next = eval("player"+turn);

    turnDiv.innerHTML = "Your Turn " + next.name;
    rowScore.innerHTML = `${score} points this roll `;
    hasRolled = false;


    if(isFinalRound && lastTurns == numPlayers){
      finalScore();
    }
    
    if(isFinalRound){ 
      lastTurns++;
    }  
  } 
  else{
    alert("Roll First");
  } 
}

function finalScore(){
  var player;
  var score = 0;
  var winner;

  for(var i = 1; i <= numPlayers; i++){
    player = eval("player"+i);
    if(score < player.score){
      score = player.score;
      winner = player.name;
    }
  }

  alert(winner + " wins with " + score + " points!");
  startOver();
}

function saveHighScores(){
  fs.writeFile('highScores.txt', '\nNAME\t\t\tSCORE', function(err) {
    if (err) {
       return console.error(err);
    }
  });
}

function getHighScores(){

  fs.readFile('highScores.txt', function (err, data) {
    if (err) {
       return console.error(err);
    }
    console.log(data);
  });
}

function resetDiceTransparency()
{
  for(var i = 1; i <= 6; i++) {
    if(document.getElementById("die"+i).classList.toggle("transparent")) {
      document.getElementById("die"+i).classList.toggle("transparent");
    }
  }
}

function checkTurn() {
  clickedDiceArr = diceArr.filter(dice => dice.clicked === 0);
  if (calculateScore(clickedDiceArr) == 0) {
    score = 0;
    hasRolled = false;

    updateDiceImg();
    alert("Farkle!");
    initializeDice();
    updateDiceImg();
    resetDiceTransparency();
    advanceTurn();

    if(isFinalRound){ 
      lastTurns++;
    }  

    var next = eval("player"+turn);
    turnDiv.innerHTML = "Your Turn " + next.name;
    rowScore.innerHTML = `${score} points this roll `;
  }
}

function calculateScore(arr) {
  let points = 0;
  let ones = [];
  let twos = [];
  let threes = [];
  let fours = [];
  let fives = [];
  let sixes = [];

  for (let i = 0; i < arr.length; i++) {
    switch (arr[i].value) {
      case 1: ones.push(1);
        break;
      case 2: twos.push(2);
        break;
      case 3: threes.push(3);
        break;
      case 4: fours.push(4);
        break;
      case 5: fives.push(5);
        break;
      case 6: sixes.push(6);
        break;
    }
  }

  switch (ones.length) {
    case 1:
      points += 100;
      break;
    case 2:
      points += 200;
      break;
    case 3:
      points += 1000;
      break;
    case 4:
      points += 1100
      break;
    case 5:
      points += 2000;
      break;
    case 6:
      points += 3000;
      break;
    default:
      points += 0;
  }

  switch (twos.length) {
    case 3: points += 200;
    break;
    case 4: points += 1000;
    break;
    case 5:
      points += 2000;
      break;
    case 6:
      points += 3000;
      break;
    default:
      points += 0;
  }

  switch (threes.length) {
    case 3: points += 300;
    break;
    case 4: points += 1000;
    break;
    case 5: 
      points += 2000;
      break;
    case 6:
      points += 3000;
      break;
    default:
      points += 0;
  }

  switch (fours.length) {
    case 3: points += 400;
    break;
    case 4: points += 1000;
    break;
    case 5:
      points += 2000;
      break;
    case 6:
      points += 3000;
      break;
    default:
      points += 0;
  }

  switch (fives.length) {
    case 1:
      points += 50;
      break;
    case 2:
      points += 100;
      break;
    case 3:
      points += 500;
      break;
    case 4:
      points += 1000;
      break;
    case 5:
      points += 2000;
      break;
    case 6:
      points += 3000;
      break;
    default:
      points += 0;
  }

  switch (sixes.length) {
    case 3: 
    points += 600;
      break;
    case 4: 
    points += 1000;
      break;
    case 5:
      points += 2000;
      break;
    case 6:
      points += 3000;
      break;
    default:
      points += 0;
  }

  return points;
}

function updateDiceImg() {
  var diceImage;
  for (var i = 0; i < 6; i++) {
    diceImage = "images/" + (diceArr[i].value) + ".png";
    document.getElementById(diceArr[i].id).setAttribute("src", diceImage);
  }
}

function diceClick(img) {
  var i = img.getAttribute("data-number");

  img.classList.toggle("transparent");
  if (diceArr[i].clicked === 0) {
    diceArr[i].clicked = 1;
  }
  else {
    diceArr[i].clicked = 0;
  }
}

function startOver() {
  resetPlayers();
  initializeGame()
  updateDiceImg();
  resetDiceTransparency();
  hidePlayersForm();
}

function resetPlayers() {
  for(var i = 1; i <= numPlayers; i++) {
    var e = document.getElementById("p"+i);
    var d = document.getElementById("ps"+i);
    var p = eval("player"+i);
    
    p.name = "Player " + i 
    p.isPlaying = false;
    p.isTurn = false;
    p.score = 0; 
    e.value = "";
    d.innerHTML = "";
  }
}

function darkMode() {
  var element = document.body;
  var dark = document.getElementById("dark");

  if(dark.innerHTML == "Dark Mode On") {
    dark.innerHTML = "Dark Mode Off";
    element.classList.toggle("dark-mode");
  }
  else {
    dark.innerHTML = "Dark Mode On";
    element.classList.toggle("dark-mode");
  }
}

function toggleRules() {
  var popup = document.getElementById("rulesPopup");
  popup.classList.toggle("show");
}

function hideRules() {
  var popup = document.getElementById("rulesPopup");
    if(popup.classList.toggle("show")) {
      popup.classList.toggle("show");
    }
}

function toggleScores() {
  var popup = document.getElementById("scoresPopup");
  popup.classList.toggle("show");
}

function hideScores() {
  var popup = document.getElementById("scoresPopup");
    if(popup.classList.toggle("show")) {
      popup.classList.toggle("show");
    }
}

function submitPlayers() {
  for(var i = 1; i <= numPlayers; i++) {   
    
    var e = document.getElementById("p"+i);
    var d = document.getElementById("ps"+i);
    var p = eval("player"+i);

    setPlayerName(e,p);
    p.isPlaying = true;
    d.innerHTML = p.name + " Score : " + p.score;
  }
    turnDiv.innerHTML = "Your Turn " + player1.name;

  hidePlayersForm();

  isSubmitted = true;
}

function setPlayerName(element,player) {
  if(element.value === "") { 
    player.name = element.getAttribute("placeholder"); 
    element.value = player.name;
  }
  else {
    player.name = element.value;
  }
}

function hidePlayersForm() {
  var d = document.getElementById("playerPopup");
  d.style.visibility="hidden";

  for(var i = 1; i <= 4; i++) {
    var e = document.getElementById("p"+i);
    e.style.visibility="hidden";
  }
}

function showPlayersForm() {
  numPlayers = document.getElementById("playerMenu").value;

  var d = document.getElementById("playerPopup");
  d.style.visibility="visible";

  for(var i = 1; i <= 4; i++) {
    var e = document.getElementById("p"+i);
    e.style.visibility="visible";
  }

  for(var i = 4; i > numPlayers; i--) {
    var e = document.getElementById("p"+i);
    e.style.visibility="hidden";
  }

  for(var i = 1; i <= 4; i++) {
    var e = document.getElementById("ps"+i);
    e.style.visibility="hidden";
  }

  for(var i = 1; i <= numPlayers; i++) {
    var e = document.getElementById("ps"+i);
    e.style.visibility="visible";
  }
}

function setWinningScore(){
  winningScore = document.getElementById("scoreMenu").value;
}
