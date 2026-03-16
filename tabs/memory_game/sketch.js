let cards = [];
let firstPick = null;
let lock = false;
let gameWon = false;
let images = {};

function preload() {
  images[1] = loadImage('1.png');
  images[2] = loadImage('2.png');
  images[3] = loadImage('3.png');
  images[4] = loadImage('4.png');
  images[5] = loadImage('5.png');
  images[6] = loadImage('6.png');
  images[7] = loadImage('7.png');
  images[8] = loadImage('8.png');
}

function setup() {
    let c = createCanvas(window.innerWidth, 1536); 
    c.parent(document.body);  // explicitly attach to iframe's body
    background('rgb(255, 218, 241)');

    startGame();
}

function startGame() {
  cards = [];
  firstPick = null;
  lock = false;
  gameWon = false;

  let values = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];
  shuffle(values, true);

  let cols = 4;
  let sz = 200;

  for (let i = 0; i < values.length; i++) {
    let x = ((i % cols) * sz) + ((window.innerWidth/2) + 350) ;
    let y = (floor(i / cols) * sz) + 250;


    cards.push({
      x,
      y,
      sz: sz - 20,
      value: values[i],
      flipped: false,
      matched: false
    });
  }
}

function draw() {
    //background('rgb(255, 218, 241)'');
    noStroke()
    fill('rgb(241, 169, 210)')
    rect((window.innerWidth/2) - 437.5 ,200,875,875)
    textWrap(WORD)
    textAlign(CENTER);
    textSize(50);
    textFont('Archivo Black');
    fill("rgb(255, 255, 255)");
    text('Match all the cards to win!', (window.innerWidth/ 2) - 250, 50,500);
  for (let card of cards) {
    drawCard(card);
  }

  if (gameWon) {
    drawWinScreen();
  }
}

function drawCard(card) {
  stroke('white');
  strokeWeight(10)
  fill(card.flipped || card.matched ? 'rgb(238, 65, 163)' : 'purple');
  rect(card.x, card.y, card.sz, card.sz, 10);

  if (card.flipped || card.matched) {
    let img = images[card.value];
    if (img) {
      image(
        img,
        card.x + 10,
        card.y + 10,
        card.sz - 20,
        card.sz - 20
      );
    }
  }
  
}


function mousePressed() {
  if (gameWon) {
    checkRestartClick();
    return;
  }

  if (lock) return;

  for (let card of cards) {
    if (
      mouseX > card.x && mouseX < card.x + card.sz &&
      mouseY > card.y && mouseY < card.y + card.sz &&
      !card.flipped && !card.matched
    ) {
      card.flipped = true;

      if (!firstPick) {
        firstPick = card;
      } else {
        checkMatch(card);
      }
      break;
    }
  }
}

function checkMatch(secondPick) {
  lock = true;

  if (firstPick.value === secondPick.value) {
    firstPick.matched = true;
    secondPick.matched = true;
    resetTurn();
  } else {
    setTimeout(() => {
      firstPick.flipped = false;
      secondPick.flipped = false;
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  firstPick = null;
  lock = false;
  checkWin();
}

function checkWin() {
  for (let card of cards) {
    if (!card.matched) return;
  }
  gameWon = true;
}

function drawWinScreen() {
  fill('white');
  strokeJoin(ROUND);
  strokeWeight(20);
  stroke('Purple')
  rect((width / 2 -250), height / 2 -125 ,500,250)
  textAlign(CENTER, CENTER);
  noStroke();
  fill('rgb(238, 65, 163)')
  textSize(48);
  text('🎉 Congrats! 🎉', width / 2, height / 2 - 40);

  // restart button
  fill('rgb(238, 65, 163)');
  rect(width / 2 - 100, height / 2 + 20, 200, 50, 10);
  fill('white');
  textSize(24);
  text('Play Again', width / 2, height / 2 + 45);
}

function checkRestartClick() {
  if (
    mouseX > width / 2 - 100 &&
    mouseX < width / 2 + 100 &&
    mouseY > height / 2 + 20 &&
    mouseY < height / 2 + 70
  ) {
    startGame();
  }
}

function windowResized() {
    resizeCanvas(window.innerWidth, 1536); // uses iframe’s full width
  }