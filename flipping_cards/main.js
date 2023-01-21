const qs = document.querySelector.bind(document);

const Symbols = [
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

// use state to control game
const GAME_STATE = {
    FirstCardAwaits: "FirstCardAwaits", 
    SecondCardAwaits: "SecondCardAwaits", 
    GameFinished: "GameFinished", 
    CardsMatchFailed: "CardsMatchFailed", 
    CardsMatched: "CardsMatched"
}

// Model-View-Controller: create a namespace and put all related variables and functions inside

// displaying functions in view
const view = {
    transformNumber (number) {
        switch (number) {
            case 1: return 'A'
            case 11: return 'J'
            case 12: return 'Q'
            case 13: return 'K'
            default: return number
        }
    },

    getCardElement(index) { 
    // static
    //     return `<div class="card">
    //   <p>4</p>
    //   <img src="https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png">
    //   <p>4</p>
    // </div>`
    
    // empty content with 
        // class to declare status back
        // and data-index to declare number
    return `<div data-index = '${index}' class="card back"></div>`
    }, 

    getCardContent(index) {
        // dynamic
        // 0-12：黑桃 1-13
        // 13-25：愛心 1-13
        // 26-38：方塊 1-13
        // 39-51：梅花 1-13
        // const number = (index % 13) + 1
        const number = this.transformNumber((index % 13) + 1)
        const symbol = Symbols[Math.floor(index / 13)]
        // front 
        return `
            <p>${number}</p>
            <img src="${symbol}">
            <p>${number}</p>        `
    },

    // simplify here: 
    //     displayCards: function displayCards() { ...  }
    //     -> displayCards() { ...  }
    displayCards(arr) { // restrict arr must be passed in then utility not coupling
        const rootElement = qs('#cards')
        // static
        // rootElement.innerHTML = this.getCardElement(3)

        // dynamic
        // const arr = Array.from(Array(52).keys())
        // let arr be passed in 
        // const arr = utility.getRandomNumberArray(52)
        // Array.from(Array(52).keys()) -> [0, 1, 2, ..., 52] 
        rootElement.innerHTML = arr.map(i => this.getCardElement(i)).join('');
        // [getCardElement(i) for i in arr]
    },

    // spread operator
    // function f(obj) -> function f(... objs) 
    // objs passed to f and be looped in f 
    // if single is passed, it would be turned into arr
    // if arr is passed, 
        // it woulf be turned into single at first
        // and each be passed into
        // then respectively turned into arr so end up working as arr

    // flipCard(card) {
    flipCards(...cards) {     
        // use loop rather than single elm 
        cards.map(card => {
            // if status back  
            if (card.classList.contains('back')) {
                // flip it front
                card.classList.remove('back')
                // static
                // card.innerHTML = this.getCardContent(10)
                // dynamic 
                    // use data-index to give index
                card.innerHTML = this.getCardContent(Number(card.dataset.index))
            }
            // if status front
            else {
                card.classList.add('back')
                card.innerHTML = null
            }
        })
    },

    // pairCard(card) {
    pairCards(...cards) {
        cards.map(card => {
            card.classList.add('paired')
        })
    },

    renderScore (score) {
        qs('.score').textContent = `Score: ${score}`;
    }, 

    renderTriedTimes(times) {
        qs('.tried').textContent = `You've tried: ${times} times`;
    }, 

    appendWrongAnimation(...cards) {
        cards.map(card => {
            card.classList.add('wrong')
            card.addEventListener('animationend', 
                e => e.target.classList.remove('wrong'), { once: true })
        })
    },

    showGameFinished () {
        const div = document.createElement('div')
        div.classList.add('completed')
        div.innerHTML = `
          <p>Complete!</p>
          <p>Score: ${model.score}</p>
          <p>You've tried: ${model.triedTimes} times</p>
        `
        const header = document.querySelector('#header')
        header.before(div)
      }
}

// assigning game state, calling view and model in controller
const controller = {
    currentState: GAME_STATE.FirstCardAwaits, // init
    generateCards () {
        // place view functions here so controller triggers the rest
        view.displayCards(utility.getRandomNumberArray(52))
    }, 

    // check current state and assign work accordingly
    dispatchCardAction (card) {
        // not address front
        if (!card.classList.contains('back')) return;
        // console.log(card, this.currentState)
        switch (this.currentState) {
            // move view.flipCard(card) here
            case GAME_STATE.FirstCardAwaits:
                // flip, push, change state to 2nd                
                view.flipCards(card)
                model.revealedCards.push(card)
                this.currentState = GAME_STATE.SecondCardAwaits
                console.log(model.revealedCards[0])
                break
            case GAME_STATE.SecondCardAwaits:
                // first time tried so increment .tried
                view.renderTriedTimes(++model.triedTimes)
                // flip, push, decide if pair successfully
                view.flipCards(card)
                model.revealedCards.push(card)
                console.log(model.revealedCards[0], model.revealedCards[1])
                // this.currentState = GAME_STATE.SecondCardAwaits
                if (model.isRevealedCardsMatched()) {
                    // score += 10      
                    view.renderScore(model.score += 10) 
                    // check if finishing game
                    if (model.score == 260) {
                        this.currentState = GAME_STATE.GameFinished
                        view.showGameFinished()
                        return
                    }
                    // chage the state   
                    this.currentState = GAME_STATE.CardsMatched  
                    // view.pairCard(model.revealedCards[0])   
                    // view.pairCard(model.revealedCards[1])  
                    view.pairCards(...model.revealedCards) 
                    // clear revealedCards and wait first
                    model.revealedCards = []
                    this.currentState = GAME_STATE.FirstCardAwaits 
                }
                else {
                    // not calling flip directly
                    // call setTimeout to pause 
                    // help memorize and set other data                    
                    this.currentState = GAME_STATE.CardsMatched
                    // seperate statement in setTimeout 
                    // setTimeout(function, time_length_to_pause)
                    view.appendWrongAnimation(...model.revealedCards)
                    setTimeout(this.resetCards, 1000)
                }
                // cannot place here because statement in setTimeout would execute later and revealCards find no element
                // // clear revealedCards and wait first
                // model.revealedCards = []
                // this.currentState = GAME_STATE.FirstCardAwaits
                break
        }
        // console.log('this.currentState', this.currentState)
        // console.log('revealedCards', model.revealedCards.map(card => card.dataset.index))
    }, 

    resetCards () {
        // console.log(this)
        // view.flipCard(model.revealedCards[0])
        // view.flipCard(model.revealedCards[1])
        view.flipCards(...model.revealedCards)
        // clear revealedCards and wait first
        model.revealedCards = []
        // this.currentState = GAME_STATE.FirstCardAwaits
        // since the function would be passed to setTimeout, 
        // this then becomes setTimeout rather than controller
        // so cannot find necessarry elements
        // change this to controller
        controller.currentState = GAME_STATE.FirstCardAwaits
    }
}

// managing data in model
const model = {
    revealedCards: [], // temprary container to fold 1st, 2nd cards then emptied
    // decide if pair successfully
    isRevealedCardsMatched() {
        return Number(this.revealedCards[0].dataset.index) % 13 === Number(this.revealedCards[1].dataset.index) % 13
    }, 
    score: 0,
    triedTimes: 0
}

const utility = {
    // Fisher-Yates Shuffle
    getRandomNumberArray(cnt) {
        // from end loop backward, in each round swap curr with a random one from 0 to curr-1
        const number = Array.from(Array(cnt).keys());
        for (let i = number.length - 1; i > 0; i--) {
            let rdn = Math.floor(Math.random() * (i + 1));
            [number[rdn], number[i]] = [number[i], number[rdn]];
        }
        return number
    }
}

// view.displayCards();
controller.generateCards()

// place listener after targets be listened appear 
// listener to change cards when clicked
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', e => {
        // console.log(card)
        controller.dispatchCardAction(card)
        // view.flipCard(card)
    })
})
// console.log(controller.currentState, model.revealCards)