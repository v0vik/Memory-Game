window.addEventListener('DOMContentLoaded', function () {

    let CARDS_NUMBER = 12;
    const CARDS_SUITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const PICTURES = [
        'img/apple.svg',
        'img/banana.svg',
        'img/broccoli.svg',
        'img/carrot.svg',
        'img/cherry.svg',
        'img/orange.svg',
        'img/pear.svg',
        'img/tomato.svg',
        'img/watermelon.svg'
    ];

    const BACKS = [
        'img/logo_rs_text.svg',
        'img/rs-logo-white.svg'
    ];
    let currCardsBack = 0;
    let currCardsNumber = CARDS_NUMBER;
    let cardsArr = [];
    let prevFlippedCard = null;
    let timer = 0;


    class Card {
        constructor(suitNumber, id) {
            this.suitNumber = suitNumber;
            this.id = id;
        }

        flip() {

            let card = document.getElementById(this.id);

            card.classList.toggle('flipped');
        }

        hide() {

            let card = document.getElementById(this.id);

            setTimeout(function () {
                card.lastChild.style.visibility = 'hidden';
                card.classList.toggle('hide');
            }, 500);

        }

        addToBoard() {
            let board = document.getElementById('board');
            let card = document.createElement('div');
            card.innerHTML =

                `<div class="front" style="background-image: url(${PICTURES[this.suitNumber]}) ">   
                 </div>
                 <div class="back" style="background-image: url(${BACKS[currCardsBack]})">
                 </div>`;

            card.id = this.id;
            board.appendChild(card);
            card.addEventListener('click', flipCard);
            card.classList.toggle('card');
        }
    }


    function flipCard() {

        let currCard = cardsArr[parseInt(this.id.slice(1))];

        currCard.flip();

        if (prevFlippedCard === null) {
            prevFlippedCard = currCard;

        } else if (prevFlippedCard.suitNumber === currCard.suitNumber &&
            prevFlippedCard.id !== currCard.id) {

            let currId = currCard.id;
            let prevId = prevFlippedCard.id;

            setTimeout((function (id1, id2) {
                cardsArr[parseInt(id1.slice(1))].hide();
                cardsArr[parseInt(id2.slice(1))].hide();
            })(currId, prevId), 1000);


            prevFlippedCard = null;
            currCardsNumber = currCardsNumber - 2;

            if (currCardsNumber === 0) {
                setTimeout(() => {
                    alert('You WIN !');
                    clearInterval(timer);
                    document.querySelector('.rules').style.display = "block";
                    document.getElementById('board').style.display = "none";
                }, 1000);
            };

        } else {

            setTimeout(function () {
                currCard.flip()
            }, 1000);
            prevFlippedCard.flip();
            prevFlippedCard = null;

        }
    }

    function setDifficulty() {
        console.log(this.id);
        switch (this.id) {
            case 'easy':
                CARDS_NUMBER = 12;
                break;
            case 'medium':
                CARDS_NUMBER = 18;
                break;
            case 'hard':
                CARDS_NUMBER = 24;
                break;
        }
        //  console.log(CARDS_NUMBER);
        currCardsNumber = CARDS_NUMBER;
        document.querySelectorAll('.diffButtons').forEach(el => el.classList.remove('diffButton--selected'));
        this.classList.add('diffButton--selected');
    }

    function setCardsBack() {
        console.log(this.id);
        switch (this.id) {
            case 'back0':
                currCardsBack = 0;
                break;
            case 'back1':
                currCardsBack = 1;
                break;

        }

        document.querySelectorAll('.card-back').forEach(el => el.classList.remove('card-back--selected'));
        this.classList.add('card-back--selected');
    }

    function newGame() {
        document.querySelector('.rules').style.display = "none";
        document.getElementById('board').style.display = "grid";

        clearBoard();
        cardsArr = [];
        clearInterval(timer);
        startTimer();
        let suits = new Array(CARDS_NUMBER / 2);

        for (let i = 0; i < suits.length; i++) {
            suits[i] = Math.floor(Math.random() * (CARDS_SUITS.length - 1)) + 1;
        }

        suits = suits.concat(suits).sort(() => Math.random() - 0.5);

        for (let i = 0; i < CARDS_NUMBER; i++) {

            cardsArr[i] = new Card(suits[i], 'c' + i);
        }

        cardsArr.forEach((el, i) => setTimeout(function () {
            el.addToBoard()
        }, (i * 40)));
    }

    function clearBoard() {
        let board = document.getElementById('board');
        board.innerHTML = '';
    }

    function startTimer() {
        let timerField = document.getElementById('timer');

        let startTime = parseInt(Date.now());
        timer = setInterval(function () {
            let minutes = 0;
            let seconds = parseInt((Date.now() - startTime) / 1000);
            if (seconds > 60) {
                minutes = Math.floor(seconds / 60);
                seconds = seconds - minutes * 60;
            }
            if (seconds < 10) seconds = '0' + seconds;
            timerField.innerHTML = `<p>${minutes}:${seconds}</p>`;
        }, 1000);
    }

    document.querySelectorAll('.diffButtons').forEach(el => el.addEventListener('click', setDifficulty));
    document.querySelectorAll('.card-back').forEach(el => el.addEventListener('click', setCardsBack));
    document.getElementById('new-game').addEventListener('click', newGame);

});
