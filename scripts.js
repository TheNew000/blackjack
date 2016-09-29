// 1. When the user clicks deal, deal
var theDeck = [];
var playerHand =[];
var dealerHand = [];
var bank = 100;
var betAmount = 0;

$(document).ready(function(){
    // A function that dynamically sets the value of each possible bet
    $('.bet').click(function(){
        var newAmount = Number($(this).attr("value"));
        betAmount += newAmount;
        if (betAmount > bank){
            alert("Sorry bum, you don't have enough cash to make that bet!");
            betAmount = bank;
        }
        $('.bet-amount-number').html(betAmount);
    });

    // Sets what will happen when we click the deal function
    $('.deal-button').on('click', function(e){
        if (betAmount == 0){
            alert('Please Choose A Bet Amount!')
        }else{
        createDeck(); //Run a function that creates an array of 1h-13c
        shuffleDeck();  //Shuffle the deck

        playerHand.push(theDeck[0], theDeck[2]);
        dealerHand.push(theDeck[1], theDeck[3]);
        placeCard('player', 'one', theDeck[0]);
        placeCard('dealer', 'one', theDeck[1]);

        placeCard('player', 'two', theDeck[2]);
        calculateTotal(playerHand, 'player');
        calculateFirstTotal(dealerHand, 'dealer');
        $('.deal-button').off(e);   
        }
    });

    // Button defines the functionality of the "hit"
    $('.hit-button').on('click', function(e){
        if (betAmount == 0){
            alert('Please Choose A Bet Amount!')
        }else{
            var slot = ['three', 'four', 'five', 'six', 'seven'];
            var playerDeckLength = 0;
            for (var i = 0; i < playerHand.length; i++) {
                playerDeckLength++;
                if(playerDeckLength == playerHand.length){ 
                    var placeinDeck = playerDeckLength + 2;
                    console.log(placeinDeck);
                }
            }
            playerHand.push(theDeck[placeinDeck]);
            placeCard('player', slot[playerDeckLength - 2], theDeck[placeinDeck]);
            var newTotal = calculateTotal(playerHand, 'player');
            if(newTotal > 21){
                bust('player');
                $('.hit-button').off(e);
            }
        }
    });

    // Button function tells the computer that you are done playing and are ready for the outcome
    $('.stand-button').click(function(){
        var dealerTotal = calculateTotal(dealerHand, 'dealer');
        var counter = 0;
        var slot = ['three', 'four', 'five', 'six', 'seven'];
        console.log(dealerTotal);
        placeCard('dealer', 'two', theDeck[3]);
        while(dealerTotal < 17){
        console.log(dealerHand);
            for (var i = 0; i < dealerHand.length; i++) {
                counter++;
                if(counter == dealerHand.length){
                    var placeinDeck = counter + 8;
                    placeCard('dealer', slot[counter - 2], theDeck[placeinDeck]);
                }
            }
            dealerHand.push(theDeck[placeinDeck]);
            dealerTotal = calculateTotal(dealerHand, 'dealer'); 
        }
        calculateTotal(dealerHand, 'dealer'); 
        checkWin();
    });
});

// Function that places the random cards and also gets the proper card picture from the spritesheet
function placeCard(who, where, card){
    var classSelector = '.'+who+'-cards .card-'+where;
    var axisX = 0;
    var axisY = 0;
    var suitValue;
    var cardValue = card.slice(0, -1);
    if(card.length == 3){
        suitValue = card.slice(2);
    }else{
        suitValue = card.slice(1);
    }
        if(cardValue == 2){
            axisX = -45;
        }else if(cardValue > 10){
            axisX = -46 - (76 * (cardValue - 2));
        }else if(cardValue > 2){
            axisX = -46 - (76 * (cardValue - 2));
        }else{
            axisX = -958;
        }
            if(suitValue == 'd'){
                axisY = -27;
            }else if(suitValue == 'c'){
                axisY = -133;
            }else if(suitValue == 'h'){
                axisY = -240;
            }else{
                axisY = -348;
            }
    $(classSelector).css("background-image", "url('images/card-deck.jpeg')");
    $(classSelector).css("background-size", "1151px");
    $(classSelector).css("background-position", axisX + "px " + axisY + "px");
}

// Dynamically creates all 52 cards
function createDeck(){
    // Fill the deck with 
    // - 52 cards:
    //     -4 suits:
    //         h, s, d, c
    var suits = ['h', 's', 'd', 'c'];
    for (var s = 0; s < suits.length; s++) {
        for(var c = 1; c <= 13; c++){
            theDeck.push(c+suits[s]);
        }
    }
}

// Shuffles the previously created deck
function shuffleDeck(){
    for (var i = 1; i < 1000; i++) {
        card1 = Math.floor(Math.random() * theDeck.length);
        card2 = Math.floor(Math.random() * theDeck.length);
        var temp = theDeck[card1];
        theDeck[card1] = theDeck[card2];
        theDeck[card2] = temp;
    }
}

// Calculates the total of the inital draw
function calculateFirstTotal(hand, whosTurn){
    var total = 0;
    var cardValue = 0;
    // Total Calculation
    if(whosTurn === 'dealer'){
        cardValue = Number(hand[0].slice(0, -1));
        if(cardValue > 10){
            cardValue = 10;
        }
        total = cardValue;
    }
    var totalId = '.' + whosTurn + '-total-number';
    $(totalId).html(total);
    return total;
}

// continues to calculate the totals for both the player and dealer's hand
function calculateTotal(hand, whosTurn){
    var total = 0;
    var cardValue = 0;
    var hasAce = false;
    // Total Calculation
    for(i=0; i<hand.length; i++){
        cardValue = Number(hand[i].slice(0, -1));
        if(cardValue == 1 && (total + 11) <= 21){
            cardValue = 11;
            hasAce = true;
        }else if(cardValue > 10){
            cardValue = 10;
        }else if((cardValue + total) > 21 && hasAce){
            total -= 10;
            hasAce = false;
        }
        total += cardValue;
    };
    // Update the html
    var totalId = '.' + whosTurn + '-total-number';
    $(totalId).html(total);
    //Instant Win message!
    if(whosTurn === 'player' && total === 21){
        $('#message').html('Blackjack!! You win!<br><button class="reset-button" onclick="location.reload()">Reset</button>');
    };
    return total;
}

// Checks to see who has come out victoriously
function checkWin(){
    var playerHas = Number($('.player-total-number').html());
    var dealerHas = Number($('.dealer-total-number').html());
    if(dealerHas > 21){
        //The dealer has busted
        bust('dealer');
    }else{
        if(playerHas > dealerHas){
            //Player won
            $('#message').html('You have beaten the dealer!<br><button class="reset-button" onclick="restart()">Reset</button>');
            bet('win');
        }else if(dealerHas > playerHas){
            //Dealer won
            $('#message').html('Sorry, the dealer has beaten you!<br><button class="reset-button" onclick="restart()">Reset</button>');
            bet('lose');
        }else{
            //Tie
            $('#message').html('It\'s a push!!<br><button class="reset-button" onclick="restart()">Reset</button>');
            bet('push');
        }
    }
};

// If you overdraw you've busted!  This checks for that
function bust(who){
    if(who === 'player'){
        $('#message').html('You have busted!<br><button class="reset-button" onclick="restart()">Reset</button>');
        bet('lose');
        $('button').one("click", function(){
            
        });
    }else{  // It has to be the dealer
        $('#message').html('The dealer has busted!<br><button class="reset-button" onclick="restart()">Reset</button>');
        bet('win');
        $('button').one("click", function(){
            
        });
    }
};

// restarts the game
function restart(){
    theDeck = [];
    playerHand =[];
    dealerHand = [];
    console.log(bank);
    if (bank == 0) {
        alert('Go home you\'re drunk and out of money');
        bank = 100;
        $('.bank-total-number').html(bank);
    }
    calculateTotal(playerHand, 'player');
    calculateTotal(dealerHand, 'dealer');
    $('.deal-button').one('click', function(){
        createDeck(); //Run a function that creates an array of 1h-13c
        shuffleDeck();  //Shuffle the deck   
        playerHand.push(theDeck[0], theDeck[2]);
        dealerHand.push(theDeck[1], theDeck[3]);
        placeCard('player', 'one', theDeck[0]);
        placeCard('dealer', 'one', theDeck[1]);
        placeCard('player', 'two', theDeck[2]);
        calculateTotal(playerHand, 'player');
        calculateFirstTotal(dealerHand, 'dealer');
    });

    // $('.card').empty();
    $('.card').css('background-image', 'url("images/cardback2.jpg")');
    $('.card').css('background-size', '100%');
    $('.card').css('background-position', '');
    $('#message').html('');
}

//Decides what happens with your bet amount depending on the outcome of the round
function bet(outcome){
    if(outcome == 'lose'){
        bank -= betAmount;
    }else if(outcome == 'win'){
        bank += betAmount;
    }else if(outcome == 'blackjack'){
        var newBet = betAmount * 1.5;
        bank += newBet;
    }else{
        bank = bank;
    }

    $('.bank-total-number').html(bank);
    betAmount = 0;
    $('.bet-amount-number').html(betAmount);
}
