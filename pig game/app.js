/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game 
*/

var  scores, roundScore, activePlayer, gamePlaying;
init();

document.querySelector('.btn-roll').addEventListener('click', function() {

       if(gamePlaying) {

       
       ////random number   
         var dice = Math.floor(Math.random() * 6) + 1;
       
         ////// display the result
         var diceDOM = document.querySelector('.dice')
         diceDOM.style.display = 'block';
         diceDOM.src = 'dice-' + dice + '.png';
       
         ///// update the score if the rolled number is 1 
          if (dice !== 1) { //// when math.random number has  1 condtion will move to else statement
                 //add score
                 roundScore += dice; // (if condition true state) stored data from dice saved to roundscore
             
                 //  this step is using to diplay the data on current id element
                 document.querySelector('#current-'+ activePlayer).textContent = roundScore; 
   //                                     id       +     0, 1                  =  2,3,4,5,6 
   
          } else { 
                 nextPlayer();
          }

       }
});


document.querySelector('.btn-hold').addEventListener('click', function() {

       if(gamePlaying) {
       //update the GLOBAL score
       scores[activePlayer] += roundScore;

       // update the global score to ui 
       document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
     
       if (scores[activePlayer] >= 20) {
              document.querySelector('#name-' + activePlayer).textContent = 'Winner!';

              document.querySelector('.dice').style.display = 'none';
           ///player add romove class   
              document.querySelector('.player-'+ activePlayer + '-panel').classList.add('winner');
              document.querySelector('.player-'+ activePlayer + '-panel').classList.remove('active');
              gamePlaying = false;
       }
       else {
              nextPlayer();
       }
       ///next player switch
}   
       
});


/// dont repeat your self dry principle apply
function nextPlayer() {

              //  activeplayer 0 === 0 => activeplayer 1,,, 1 === 0 activeplayer = 0
              activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;

              //reset scores = 0
              roundScore = 0;  
              
              //reset player 1 and 2 current score
              document.getElementById('current-0').textContent = '0';
              document.getElementById('current-1').textContent = '0';
              
              //toggle to update the player selection class 
              document.querySelector('.player-0-panel').classList.toggle('active');
              document.querySelector('.player-1-panel').classList.toggle('active');
   
              document.querySelector('.dice').style.display = 'none'; 

}

document.querySelector('.btn-new').addEventListener('click', init);

function init() {
scores = [0, 0];
roundScore = 0;
activePlayer = 0;

///state vaiable
gamePlaying = true;


document.querySelector('.dice').style.display = 'none'; 

///initialiy the 0 for current and score class
document.getElementById('score-0').textContent = '0';
document.getElementById('score-1').textContent = '0';
document.getElementById('current-0').textContent = '0';
document.getElementById('current-1').textContent = '0';

document.getElementById('name-0').textContent = 'Player 1';
document.getElementById('name-1').textContent = 'Player 2';

document.querySelector('.player-0-panel').classList.remove('winner');
document.querySelector('.player-1-panel').classList.remove('winner');
document.querySelector('.player-0-panel').classList.remove('active');
document.querySelector('.player-1-panel').classList.remove('active');

document.querySelector('.player-0-panel').classList.add('active');
}


//document.querySelector('#current-' + activePlayer).textContent = dice;
// document.querySelector('#current-' + activePlayer).innerHTML = '<em>' + dice + '</em>';
// var x = document.querySelector('#score-0').textContent;
// console.log(x);