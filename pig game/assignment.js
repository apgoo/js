


var  scores, roundScore, activePlayer, gamePlaying;
init();
var lastDice;

document.querySelector('.btn-roll').addEventListener('click', function() {

       if(gamePlaying) {
       ////random number   
         var dice1 = Math.floor(Math.random() * 6) + 1;
         var dice2 = Math.floor(Math.random() * 6) + 1;
       
         ////// display the result
         
         document.getElementById('dice-1').style.display = 'block';
         document.getElementById('dice-2').style.display = 'block';
         
         document.getElementById('dice-1').src = 'dice-' + dice1 + '.png';
         document.getElementById('dice-2').src = 'dice-' + dice2 + '.png';

         ///// update the score if the rolled number is 1 
         if (dice1 !== 1 && dice2 !== 1) { //// when math.random number has  1 condtion will move to else statement
            //add score
            roundScore += dice1 + dice2 ; // (if condition true state) stored data from dice saved to roundscore
        
            //  this step is using to diplay the data on current id element
            document.querySelector('#current-'+ activePlayer).textContent = roundScore; 
//                                     id       +     0, 1                  =  2,3,4,5,6 

     } else { 
            nextPlayer();
     }
         
    /*     if(dice === 6 && lastDice === 6) {
             scores[activePlayer]= 0;
             document.querySelector('#score-' + activePlayer).textContent = '0';
            nextPlayer();
        }
       
         ///// update the score if the rolled number is 1 
          else if (dice !== 1) { //// when math.random number has  1 condtion will move to else statement
                 //add score
                 roundScore += dice; // (if condition true state) stored data from dice saved to roundscore
             
                 //  this step is using to diplay the data on current id element
                 document.querySelector('#current-'+ activePlayer).textContent = roundScore; 
   //                                     id       +     0, 1                  =  2,3,4,5,6 
   
          } else { 
                 nextPlayer();
          }
       }

     lastDice =  dice; */

    }
});


document.querySelector('.btn-hold').addEventListener('click', function() {

       if(gamePlaying) {
       //update the GLOBAL score
       scores[activePlayer] += roundScore;

       // update the global score to ui 
       document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
     
        var input = document.querySelector('.final-score').value;
        var winningScore;

        if(input) {
            winningScore = input;
        } else {
            winningScore = 100;
        }

       if (scores[activePlayer] >= winningScore) {
              document.querySelector('#name-' + activePlayer).textContent = 'Winner!';

              document.getElementById('dice-1').style.display = 'none';
              document.getElementById('dice-2').style.display = 'none';
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
   
              document.getElementById('dice-1').style.display = 'none'; 
              document.getElementById('dice-2').style.display = 'none'; 

}

document.querySelector('.btn-new').addEventListener('click', init);

function init() {
scores = [0, 0];
roundScore = 0;
activePlayer = 0;

///state vaiable
gamePlaying = true;


document.getElementById('dice-1').style.display = 'none'; 
document.getElementById('dice-2').style.display = 'none'; 

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