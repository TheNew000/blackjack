// 1. When the user clicks deal, deal
var theDeck = [];
var playerHand =[];
var dealerHand = [];

$(document).ready(function(){
    $('.deal-button').click(function(){
        createDeck(); //Run a function that creates an array of 1h-13c
        shuffleDeck();  //Shuffle the deck
        playerHand.push(theDeck[0], theDeck[2]);
        dealerHand.push(theDeck[1], theDeck[3]);
        placeCard('player', 'one', theDeck[0]);
        placeCard('dealer', 'one', theDeck[1]);

        placeCard('player', 'two', theDeck[2]);
        calculateTotal(playerHand, 'player');
        calculateFirstTotal(dealerHand, 'dealer');
        console.log(calculateFirstTotal(dealerHand, 'dealer'));
    });

    $('.hit-button').click(function(){
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
        }
    });



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
                }
            }
            dealerHand.push(theDeck[placeinDeck]);
            placeCard('dealer', slot[counter - 2], theDeck[placeinDeck]);
            dealerTotal = calculateTotal(dealerHand, 'dealer'); 
        }
        calculateTotal(dealerHand, 'dealer'); 
        checkWin();
    });
});

function placeCard(who, where, cardToPlace){
    var classSelector = '.'+who+'-cards .card-'+where
    $(classSelector).html(cardToPlace);

}

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

function shuffleDeck(){
    for (var i = 1; i < 1000; i++) {
        card1 = Math.floor(Math.random() * theDeck.length);
        card2 = Math.floor(Math.random() * theDeck.length);
        var temp = theDeck[card1];
        theDeck[card1] = theDeck[card2];
        theDeck[card2] = temp;
    }
}

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

function calculateTotal(hand, whosTurn){
    var total = 0;
    var cardValue = 0;
    // Total Calculation
    for(i=0; i<hand.length; i++){
        cardValue = Number(hand[i].slice(0, -1));
        if(cardValue > 10 && cardValue < 13){
            cardValue = 10;
        }else if(cardValue == 13){
            cardValue = 0;
            if(total > 21){
                cardValue = 1;
            }else{
                cardValue = 11;
            }
        }
        total += cardValue;
        }
    };
    // Update the html
    var totalId = '.' + whosTurn + '-total-number';
    $(totalId).html(total);
    //Instant Win message!
    if(whosTurn === 'player' && total === 21){
        $('#message').html('Blackjack!! You win!<br><button class="reset-button">Reset</button>');
    };
    return total;
}

function checkWin(){
    var playerHas = Number($('.player-total-number').html());
    var dealerHas = Number($('.dealer-total-number').html());
    if(dealerHas > 21){
        //The dealer has busted
        bust('dealer');
    }else{
        if(playerHas > dealerHas){
            //Player won
            $('#message').html('You have beaten the dealer!<br><button class="reset-button">Reset</button>');
        }else if(dealerHas > playerHas){
            //Dealer won
            $('#message').html('Sorry, the dealer has beaten you!<br><button class="reset-button">Reset</button>');

        }else{
            //Tie
            $('#message').html('It\'s a push!!<br><button class="reset-button">Reset</button>');
        }
    }
};

function bust(who){
    if(who === 'player'){
        $('#message').html('You have busted!<br><button class="reset-button">Reset</button>');
    }else{
        // It has to be the dealer
        $('#message').html('The dealer has busted!<br><button class="reset-button">Reset</button>');
    };
};

