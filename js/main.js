var playerArray = JSON.parse(localStorage.getItem('insertPlayersToLS')) || [];
var wordArray = JSON.parse(localStorage.getItem('insertWordsToLS')) || [];
var scoreArray = JSON.parse(localStorage.getItem('insertScoresToLS')) || [];
var guesses = 5;
var seconds = 0;
var score = 0;
var samoglasnici = ['a', 'o', 'e', 'i', 'u'];
var joinWords = [];
var savedWords = [];
var totalTime = 0;
var totalPoints = 0;
var points = 0;
var showListItems = document.getElementById('lista');
var interval = 0;
document.getElementById('secondScreen').style.display = 'none';

//Add players to playerrArray
function addPlayers() {
    insertPlayer = document.getElementById('playersInput').value;
    playerArray.push(insertPlayer);
    localStorage.setItem('insertPlayersToLS', JSON.stringify(playerArray));
    document.getElementById('playersInput').value = '';
};

function selectPlayer() {
    playerValue = playerList.value;
    var i = 0;
    document.getElementById('playersList').innerHTML = '';
    while(i < playerArray.length) {
        document.getElementById('playersList').innerHTML += '<option value="' + playerArray[i] + '"></option>';
        i++;
    }
};

function addWords() {
    insertWord = document.getElementById('wordInput').value;
    wordArray.push(insertWord);
    localStorage.setItem('insertWordsToLS', JSON.stringify(wordArray));
    document.getElementById('wordInput').value = '';
};

function selectWords() {
    wordValue = wordList.value;
    var i = 0;
    document.getElementById('wordsList').innerHTML = '';
    while(i < wordArray.length) {
        document.getElementById('wordsList').innerHTML += '<option value="' + wordArray[i] + '"></option>';
        i++;
    }
};

function deletePlayers() {
    deletePlayer = document.getElementById('playerList').value;
    if(playerArray.indexOf(deletePlayer) > -1) {
        deleteThisPlayer = playerArray.indexOf(deletePlayer);
        playerArray.splice(deleteThisPlayer, 1);
        localStorage.setItem('insertPlayersToLS', JSON.stringify(playerArray));
        document.getElementById('playerList').value = '';
        location.reload();
    }
};

function deleteWords() {
    deleteWord = document.getElementById('wordList').value;
    if(wordArray.indexOf(deleteWord) > -1) {
        deleteThisWord = wordArray.indexOf(deleteWord);
        wordArray.splice(deleteThisWord, 1);
        localStorage.setItem('insertWordsToLS', JSON.stringify(wordArray));
        document.getElementById('wordList').value = '';
        location.reload();
    }
};

function startGame() {
    document.getElementById('firstScreen').style.display = 'none';
    document.getElementById('secondScreen').style.display = 'block';
    document.getElementById('toggleTable').style.display = 'none';
    selectedPlayer = document.getElementById('playerList').value;
    addedWord = document.getElementById('wordList').value;
    if(selectedPlayer < 1) {
        alert('Please select player');
        document.getElementById('firstScreen').style.display = 'block';
        document.getElementById('secondScreen').style.display = 'none';
        return false;
    }else if(addedWord < 1) {
        alert('Please select starting word');
        document.getElementById('firstScreen').style.display = 'block';
        document.getElementById('secondScreen').style.display = 'none';
    }else if(wordArray.indexOf(addedWord) > -1) {
        for (var i = 0; i < addedWord.length; i++) {
            joinWords[i] = '_';
        }
    }
    document.getElementById('showWords').textContent = joinWords.join(' ');
    document.getElementById('lives').innerHTML =  'You have: ' + guesses + ' guesses!';
    interval = setInterval(timer, 1000);
};

function checkLetters() {
    var letter = document.getElementById('enterLetter').value;
    if(letter.length > 0) {
        if(addedWord.indexOf(letter) == -1) {
            guesses--;
            score -= 0.25;
        }else {
            for(var i = 0; i < addedWord.length; i++) {
                if(addedWord[i] === letter) {
                    joinWords[i] = letter;
                        if(samoglasnici.indexOf(letter) == -1) {
                            score += 0.25;
                        }else {
                            score += 0.50;
                        }
                }
            }
        }
        document.getElementById('enterLetter').value = '';
        document.getElementById('showWords').innerHTML = joinWords.join(' ');
        document.getElementById('lives').innerHTML =  'You have: ' + guesses + ' guesses!';
    }
    if(guesses <= 0) {
        alert('Shoot, you have run out of guesses!!');
        document.getElementById('showWords').style.display = 'none';
        document.getElementById('times').style.display = 'none';
        document.getElementById('enterLetter').disabled = 'disabled';
        document.getElementById('toggleTable').style.display = 'block';
        clearInterval(interval);
    }
    if(addedWord === joinWords.join('')) {
        savedWords.push({'word': addedWord,'score': score,'time': seconds});
        totalPoints += score;
        totalTime += seconds;
        points = 0;
        score = 0;
        seconds = 0;
        for(var n = 0; n < savedWords.length; n++) {
            var entry = document.createElement('li');
            entry.appendChild(document.createTextNode(savedWords[n].word + ' - (' + savedWords[n].score + ' scores, ' + savedWords[n].time + ' seconds).'));
        }
        showListItems.appendChild(entry);
        joinWords = [];
        continueGame();
    }
};

function timer() {
    document.getElementById('times').innerHTML = 'Time: ' + seconds;
    seconds++;
};

function continueGame() {
    addedWord = wordArray[Math.floor(Math.random() * wordArray.length)];
    console.log(addedWord);
    checkSavedWords = savedWords.map(function(getWord) {
        return getWord.word;
    })
    if(wordArray.length > savedWords.length) {
        if(~checkSavedWords.indexOf(addedWord)) {
            continueGame();
        }
    }else {
        document.getElementById('showWords').style.display = 'none';
        document.getElementById('continueTheGame').disabled = true;
        document.getElementById('leaderBoard').style.display = 'none';
        document.getElementById('toggleTable').style.display = 'block';
        clearInterval(interval);
        alert('Congratulations ' + selectedPlayer + ' You won!');
        checkSavedPlayers = scoreArray.map(function(getPlayer) {
            return getPlayer.playerArray;
        })
        if(checkSavedPlayers.indexOf(selectedPlayer) == -1) {
            scoreArray.push({'player': selectedPlayer, 'totalPoints': totalPoints, 'totalTime': totalTime});
            localStorage.setItem('insertScoresToLS', JSON.stringify(scoreArray));
        }else {
            for(var i = 0; i < scoreArray.length; i++) {
                if(scoreArray[i].user == selectedPlayer) {
                    scoreArray.splice(i, 1);
                    scoreArray.push({'player': selectedPlayer, 'totalPoints': totalPoints, 'totalTime': totalTime});
                    localStorage.setItem('insertScoresToLS', JSON.stringify(scoreArray));
                }
            }
        }
        for(var i = 0 ; i < scoreArray.length; i++){
            document.getElementById('leaderBoard').innerHTML += '<table><tr><th>Player</th><th>Total score</th><th>Total Time</th></tr><tr><td>'
            + scoreArray[i].player + '</td><td>' + scoreArray[i].totalPoints + '</td><td>' + scoreArray[i].totalTime + '</td></tr></table>';
        }
    }
    for(var i = 0; i < addedWord.length; i++) {
        joinWords[i] = '_';
    }
    document.getElementById('showWords').textContent = joinWords.join(' ');
};

function showHideTable() {
    if (document.getElementById('leaderBoard').style.display == 'none' ) {
       document.getElementById('leaderBoard').style.display = '';

   } else {
      document.getElementById("leaderBoard").style.display = 'none';
   }
};

function restartGame() {
    location.reload();
};