function setup() {
    let c = createCanvas(window.innerWidth, 3072); // <--- changed from windowWidth
    c.parent(document.body);  // explicitly attach to iframe's body
    background('rgb(255, 218, 241)');
  }
  
function preload() {
  pufferfish=loadImage('pufferfish.png');
  shark=loadImage('shark.png');
  fish=loadImage('fish.png')
  }

function draw() {
    background('rgb(255, 218, 241)');
  
  textAlign(LEFT);
    textFont('Archivo Black');
    image(pufferfish, 100,100,450,450);
    push();
    rotate(0.6);
    translate(850,-600)
    image(shark, 0,0,500,500);
  pop();
  fill("rgb(237, 147, 204)")
  textSize(20);
  push();
  rotate(-0.2);
  text("Start collecting data now.",800, 500);
  pop();
function fishy(x,y) {
   push();
  translate(x,y);
   rotate(89.75);
  image(fish,500,-1000,800,800);
   pop();

 }
  fishy(-260,200);
  fishy(0,200);
  fishy(260,200);
  fishy(520,200)
  fishy(780,200);
  fishy(1040,200);
  fill("rgb(250,250,250))")
  textSize(80);
  stroke('rgb(196, 42, 223)');
  strokeWeight(5);
  textAlign(CENTER);
  text("FACT", window.innerWidth / 2,1000);
  text("FACT", window.innerWidth / 4,1000);
  text("FACT", 3 * (window.innerWidth) / 4,1000);
  
  textSize(30);
textWrap(WORD)
  text("Our website allows you to view 220+ fish species through the Coral City Camera (a live-streaming underwater camera) and identify them, therefore helping us out in tracking these !", (window.innerWidth / 2) - 200,1060, 400);
  text("Algae growth in Miami is harming sea life, endangering fish populations.", (window.innerWidth / 4) - 150,1060, 300);
  text("Rising sea temperatures are destroying coral reefs and alongside them, different fish species.", (3 * (window.innerWidth) / 4) - 150,1060, 300);
  
  textSize(80);
  fill('rgb(238, 65, 163)');
  noStroke();
  text("🪸 ReefWatch Miami's", window.innerWidth / 2,1800);
  text("Mission Statement", window.innerWidth / 2 ,1890);
  textSize(50);
  textWrap(WORD)
  text("Through our “fintastic” website, we aim to further identify and research the various fish species in the Miami coral reefs, sharing with the community our findings and engaging the public by inciting change through awareness and small actions.", (window.innerWidth / 2) - 500,1980, 1000);
}


function windowResized() {
    resizeCanvas(window.innerWidth, 1536); // uses iframe’s full width
  }
