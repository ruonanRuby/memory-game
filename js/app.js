
"use strict";

/*
*   Get all the needed elements from html
*   Create an array with necessary icons for the game 
*/
let icons = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt",
    "fa fa-cube", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb"];
icons = icons.concat(icons);
let stars = document.getElementsByClassName('stars')[0];
let deck = document.getElementsByClassName('deck')[0];
let moveCount = document.getElementsByClassName('moves')[0];
let reStart = document.getElementsByClassName('restart')[0];
let minLabel = document.getElementById('min');
let secLabel = document.getElementById('sec');
let container = document.getElementsByClassName('container')[0];
let totalSeconds = 0;



class Game {
    cards;
    moveTracker;
    openedCards;
    matchChecker;
    timeTracker;

    constructor() {
        this.cards = [];
        this.openedCards = [];
        this.matchChecker = 0;
        this.moveTracker = 0;
        this.timeTracker = undefined;
    }

    /*
    *   With game loading shuffle the icon array and implement them 
    *   into the html DOM
    */
    loadingCards() {
        icons = shuffle(icons);

        for (let i = 0; i < icons.length; i++) {
            let newLi = document.createElement("li");
            newLi.setAttribute("class", "card");
            let newIcon = document.createElement("i");
            newIcon.setAttribute("class", icons[i]);
            newLi.appendChild(newIcon);
            this.cards.push(newLi);
            deck.appendChild(newLi);
        }

        this.timeToMemory();

    }

    /*
    *   Give five seconds to remember the cards by changing the class name
    *   then game starts 
    */
    timeToMemory() {

        setTimeout(() => {
            for (let i = 0; i < this.cards.length; i++) {
                this.cards[i].className += " open show";
            }
        }, 1000);

        setTimeout(() => {
            for (let i = 0; i < this.cards.length; i++) {
                this.cards[i].classList.remove("open", "show");
            }
            this.playGame();
        }, 6000);
    }

    playGame() {
        this.timeTracker = setInterval(timeCounter, 1000);
        setInterval(this.starTracker, 1000);

        reStart.addEventListener("click", () => {
            clearTimeout(this.timeTracker);
            this.restartGame();
        });

        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].addEventListener("click", () => {
                if (!this.cards[i].classList.contains("open")) {
                    this.cards[i].className += " open show";
                }
                if (!this.cards[i].classList.contains("match") && 
                !this.openedCards.includes(this.cards[i])) {
                    this.moveTracker += 1;
                    moveCount.innerHTML = this.moveTracker;
                    this.checkMatch(this.cards[i]);
                }
                if (this.matchChecker === 8) setTimeout(() => {this.gameEnd()}, 1500);
            });
        }


    }

    checkMatch(card) {
        this.openedCards.push(card);
        if (this.openedCards.length === 2) {
            let card1 = this.openedCards[0];
            let card2 = this.openedCards[1];
            if (card1.childNodes[0].className === card2.childNodes[0].className) {
                card1.className += " match";
                card2.className += " match";
                this.matchChecker += 1;
            } else {
                card1.className += " unmatch";
                card2.className += " unmatch";
                setTimeout(() => {
                    card1.classList.remove("open", "show", "unmatch");
                    card2.classList.remove("open", "show", "unmatch");
                }, 1000);
            }
            this.openedCards.pop();
            this.openedCards.pop();
        }

    }

    starTracker() {
        let move = parseInt(moveCount.innerHTML);
        if (stars.childElementCount === 3 && (totalSeconds > 120
            || move > 24 )) {
            stars.removeChild(stars.childNodes[0]);
        }
        else if (stars.childElementCount === 2 && (totalSeconds > 240
            || move > 40)) {
            stars.removeChild(stars.childNodes[0]);
        }
    }

    gameEnd() {
        this.createPanel();
        deck.style.opacity = 0.5;
        let close = document.querySelector("div .panel a");
        close.addEventListener("click", () => {
            document.getElementsByClassName("victoryPanel")[0].remove();
            deck.style.opacity = 1;
            reStart.addEventListener("click", () => {
                clearTimeout(this.timeTracker);
                this.restartGame();
            });
        });

        let button = document.querySelector("div .panel button");
        button.addEventListener("click", () => {
            document.getElementsByClassName("victoryPanel")[0].remove();
            deck.style.opacity = 1;
            this.restartGame();
        });

    }

    createPanel() {
        let victoryPanel = document.createElement("div");
        victoryPanel.setAttribute("class", "victoryPanel");
        let panel = document.createElement("div");
        panel.setAttribute("class", "panel");

        let close = document.createElement("a");
        close.setAttribute("id", "close");
        close.innerHTML = "X";

        let vict = document.createElement("h2");
        vict.innerHTML = "VICTORY!"

        let moveDetail = document.createElement("p");
        let timeDetail = document.createElement("p");
        let starDetail = document.createElement("p");
        starDetail.setAttribute("class", "starRating");
        let starRating = stars;
        moveDetail.innerHTML = `Your Moves: ${this.moveTracker}`;
        timeDetail.innerHTML = `Your Time: ${minLabel.outerHTML} mins ${secLabel.outerHTML} secs`;
        starDetail.innerHTML = `Your Rating:  ${starRating.outerHTML}`;

        let restartButton = document.createElement("button");
        restartButton.innerHTML = "Try Again?"
        panel.innerHTML += close.outerHTML + vict.outerHTML + moveDetail.outerHTML
            + timeDetail.outerHTML + starDetail.outerHTML + restartButton.outerHTML;
        victoryPanel.appendChild(panel);
        container.append(victoryPanel);

    }

    restartGame() {
        location.reload();
    }

}


document.body.onload = () => {
    let game = new Game();
    game.loadingCards();
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 *  Create a time count up. 
 */
function timeCounter() {
    ++totalSeconds;
    secLabel.innerHTML = pad(totalSeconds % 60);
    minLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    let valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

