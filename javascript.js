/*
Name: Ethan Kittell
Email: Ethan_Kittell@student.uml.edu

This js file allows for the games mechanics to work
*/
//Some global variables to assist with keeping score
//when the next round is started
var savedScore = 0;
var tempSavedScore = 0;
//Used pieces.json for this data structure
var ScrabbleTiles = [  
  {"letter":"A", "value":1, "amount":9},
    {"letter":"B", "value":3, "amount":2},
    {"letter":"C", "value":3, "amount":2},
    {"letter":"D", "value":2, "amount":4},
    {"letter":"E", "value":1, "amount":12},
    {"letter":"F", "value":4, "amount":2},
    {"letter":"G", "value":2, "amount":3},
    {"letter":"H", "value":4, "amount":2},
    {"letter":"I", "value":1, "amount":9},
    {"letter":"J", "value":8, "amount":1},
    {"letter":"K", "value":5, "amount":1},
    {"letter":"L", "value":1, "amount":4},
    {"letter":"M", "value":3, "amount":2},
    {"letter":"N", "value":1, "amount":5},
    {"letter":"O", "value":1, "amount":8},
    {"letter":"P", "value":3, "amount":2},
    {"letter":"Q", "value":10, "amount":1},
    {"letter":"R", "value":1, "amount":6},
    {"letter":"S", "value":1, "amount":4},
    {"letter":"T", "value":1, "amount":6},
    {"letter":"U", "value":1, "amount":4},
    {"letter":"V", "value":4, "amount":2},
    {"letter":"W", "value":4, "amount":2},
    {"letter":"X", "value":8, "amount":1},
    {"letter":"Y", "value":4, "amount":2},
    {"letter":"Z", "value":10, "amount":1},
  {"letter":"_", "value":0, "amount":2}
]
//Generates 7 tiles on the rack when the game page is first
//loaded
$(document).ready(function(){
  generateTiles();
})

//This is the website where I borrowed some code for helping create the drag and drop system:
// https://stackoverflow.com/questions/50660597/prevent-drop-event-when-its-already-have-child-element-drag-and-drop
let offset = [0, 0]
//This function allows for a letter tile to be dropped on a drag over
//to the "target" which is either a board space or rack space
//that does not contain a tile already
function allowDrop(ev) {
  var t = ev.target;
  while (t !== null && !t.classList.contains("target")) {
    t = t.parentNode;
  }
  if (t && t.childNodes.length > 0) {
    return false;
  }
  ev.preventDefault()
}
//function that allows for dragging the tile over to
//an eligible tile space
function drag(ev) {
  ev.dataTransfer.setData('dragID', ev.target.id)
  offset = [
    ev.target.offsetLeft - ev.clientX,
    ev.target.offsetTop - ev.clientY
  ]
}
//function for dropping a tile onto a tile space and appends the 
//tile to that space
function drop(ev) {
  ev.preventDefault()
  const data = ev.dataTransfer.getData('dragID')
  ev.target.appendChild(document.getElementById(data))
  check_Board();
}

// this is a tile generator function for the first 7 tiles when you start A game
//looking back I could've used the next round function to work for creating the
//starting hand of 7 tiles as well but I instead opted for a seperate function
//to serve this purpose
function generateTiles(){
  for(i = 0; i < 7; i++){
    //create a randomly generated number which is used to get random tiles
      var genFirst = tileGen();
      //checks to make sure the first random number has more than 0 amount of that tile
      if(ScrabbleTiles[genFirst].amount > 0){
        //decriments the amount of that tile from the data structure
        ScrabbleTiles[genFirst].amount--;
        //appends the tile into the rack slot selected by the for loop
        $('#t' + i).append('<div class="element '+ ScrabbleTiles[genFirst].letter +'" id="drag' + i + '" data-value="'+ ScrabbleTiles[genFirst].value +'" draggable="true" ondragstart="drag(event)"></div>');
      }
      else{ //if the randomly selected letter doesnt have an amount above 0 it picks another
        var newGen = tileGen();
        while (ScrabbleTiles[newGen].amount == 0)
        {
          newGen = tileGen();
          
        }
        $('#t' + i).append('<div class="element '+ ScrabbleTiles[newGen].letter +'" id="drag' + i + '" data-value="'+ ScrabbleTiles[newGen].value +'" draggable="true" ondragstart="drag(event)"></div>');
      }
  }
}
//used w3: https://www.w3schools.com/js/js_random.asp
//for this tile generator function
function tileGen(){
  let anyTile = Math.floor(Math.random() * 27);

  return anyTile;
}



//function for updating the score based off of the
//tiles on the board
function check_Board(){
  
  //variable to keep track of if a word doubled space was activated
  var wordDoubled = 0;
  //array to keep track of every board space
  var arrayBoard = [];
  arrayBoard.push(document.querySelector('#b0'));
  arrayBoard.push(document.querySelector('#b1'));
  arrayBoard.push(document.querySelector('#b2'));
  arrayBoard.push(document.querySelector('#b3'));
  arrayBoard.push(document.querySelector('#b4'));
  arrayBoard.push(document.querySelector('#b5'));
  arrayBoard.push(document.querySelector('#b6'));
  arrayBoard.push(document.querySelector('#b7'));
  arrayBoard.push(document.querySelector('#b8'));
  arrayBoard.push(document.querySelector('#b9'));
  arrayBoard.push(document.querySelector('#b10'));
  arrayBoard.push(document.querySelector('#b11'));
  arrayBoard.push(document.querySelector('#b12'));
  arrayBoard.push(document.querySelector('#b13'));
  arrayBoard.push(document.querySelector('#b14'));

  //variable to keep track of the scoreboard
  var scoreBoard = document.querySelector('.scoreBoard');

  //variables for keeping score
  var temp = 0;
  var intTemp = 0;
  var totalScore = 0;
  //for loops for going through every board slot and 
  //checking to see if any of the 7 tiles are there
 for (var i = 0; i < 15; i++)
 {
  for(var j = 0; j < 7; j++)
  {
      //checking to see if a tile is in one of the ith slots
      if (arrayBoard[i].contains(document.querySelector('#drag' + j)))
      {
        if(i == 6 || i == 8){ //if statement for double letter
          //gets the letter value from the tiles data-value and logs it to the score board
          //doubles the score of that letter because of the tile space
          temp = document.querySelector('#drag' + j).getAttribute('data-value');
          intTemp = parseInt(temp);
          totalScore = totalScore + (intTemp * 2);

        }
        else {
          //regular tiles just log the letters value to the current score
          temp = document.querySelector('#drag' + j).getAttribute('data-value');
          intTemp = parseInt(temp);
          totalScore = totalScore + intTemp;

        }
        //if statement for doubling the entire word's score
        if (i == 2 || i == 12)
        {
          wordDoubled = 1;
        }
        
      }
    
    
  }
  
 } //if the word doubled slot was activated it just doubles the entre
 //current score at the end
 if (wordDoubled == 1)
 {
  scoreBoard.innerHTML = "Score: " + (savedScore + totalScore * 2);
  tempSavedScore = savedScore + totalScore * 2;
 }
 else{
 scoreBoard.innerHTML = "Score: " + (savedScore + totalScore);
  tempSavedScore = savedScore + totalScore;
 }
}
//function that calls when the next round button is pressed
$(function(){
  $('#btn').click(function() {
      nextRound();
  });
})
//function that reloads the page when the restart game button is pressed
$(function(){
  $('#btn2').click(function() {
    location.reload();
  });
})
//function that loads the next round when the button is pressed
function nextRound() {
  //sets the current score of whatever was on the board to the saved
  //current score (aka now the score is whatever the saved current score
  //is + the new current score)
savedScore = tempSavedScore;
var arrayBoard = [];
  arrayBoard.push(document.querySelector('#b0'));
  arrayBoard.push(document.querySelector('#b1'));
  arrayBoard.push(document.querySelector('#b2'));
  arrayBoard.push(document.querySelector('#b3'));
  arrayBoard.push(document.querySelector('#b4'));
  arrayBoard.push(document.querySelector('#b5'));
  arrayBoard.push(document.querySelector('#b6'));
  arrayBoard.push(document.querySelector('#b7'));
  arrayBoard.push(document.querySelector('#b8'));
  arrayBoard.push(document.querySelector('#b9'));
  arrayBoard.push(document.querySelector('#b10'));
  arrayBoard.push(document.querySelector('#b11'));
  arrayBoard.push(document.querySelector('#b12'));
  arrayBoard.push(document.querySelector('#b13'));
  arrayBoard.push(document.querySelector('#b14'));
//make this clear the board and also resupply the rack/tile holder

//clears board
for (var i = 0; i < 15; i++){
var parent = document.getElementById("b" + i)
while (parent.firstChild) {
    parent.firstChild.remove();
}
}

//REORGANIZES THE TILES AKA DRAG 1 IS NOW IN SPOT 1 IF IT WAS MOVED
for (var m = 0; m < 7; m++)
{
  $('#drag' + m).appendTo('#t' + m);
  //this is just for design purposes
}

    
//This is a for loop for basically refilling the 
//users rack for whatever tiles he/she placed and it
//replaces those empty spaces with random tiles
for (var j = 0; j < 7; j++) {
  var gen = tileGen();
  //same loop as the generate tiles function just this
  //only generates tiles for the empty spaces
    if (!document.getElementById('t' + j).children.length > 0){
      //checks if the random tile has an amount greater than 0
      if(ScrabbleTiles[gen].amount > 0){
        ScrabbleTiles[gen].amount--;
      $('#t' + j).append('<div class="element '+ ScrabbleTiles[gen].letter +'" id="drag' + j + '" data-value="'+ ScrabbleTiles[gen].value +'" draggable="true" ondragstart="drag(event)"></div>');
      }
      else {
        var newGen = tileGen();
        var genLimit = 500; //limit for if there are no more tiles left
        while (ScrabbleTiles[newGen].amount == 0)
        {
          newGen = tileGen();
          genLimit--;
          if (genLimit == 0)
          {
            break;
          }
          
        }
        //there are tiles so it adds a tile to the rack
        if (genLimit != 0) {
        $('#t' + j).append('<div class="element '+ ScrabbleTiles[newGen].letter +'" id="drag' + j + '" data-value="'+ ScrabbleTiles[newGen].value +'" draggable="true" ondragstart="drag(event)"></div>');
        ScrabbleTiles[newGen].amount--;
        }
        if (genLimit == 0 && j == 0) //no tiles at all so game ends
        {
          //game is over
          document.querySelector("#btn").setAttribute("disabled", "");
          document.querySelector(".scoreBoard").innerHTML += " (This is your FINAL SCORE all tiles used)";
        }
      }
  
  }
}

}

