function setup() {
    let c = createCanvas(window.innerWidth, window.innerHeight);
    c.parent(document.body);
    background('rgb(255, 218, 241)');
  }
  
  function preload() {
    fish=loadImage('fish.png');
  }

  
  function draw() {
    background('rgb(255, 218, 241)');
    translate(0, -200);
    fill("rgb(237, 147, 204)")
    textFont('Inter, -apple-system, BlinkMacSystemFont, sans-serif');
    textSize(30);
    strokeWeight(0);
    textAlign(LEFT);
    text("Thank You Coral City Camera!", 50, 270);
    textSize(20);
    textAlign(CENTER);
    text('"The Coral City Camera provides a fish-eye view into the urban marine ecosystem that has developed around the human-made shorelines of Miami. The project was launched with the idea that the incredible biodiversity living just below the waterline in Miami should be a point of civic pride that engages the public to protect what they know and love. It is located along the shoreline at the east end of PortMiami in about 9\' (3m) of water. It was deployed in late 2019 by Coral Morphologic as a hybrid art-science research project."', 60, 290, 500);
    
    // video border
    strokeJoin(ROUND);
    stroke('rgb(237, 147, 204)')
    strokeWeight(20);
    let videoX = (window.innerWidth / 2) - 300; 
    rect(videoX, 250, 600, 400);
    
    // fish images at bottom
    strokeJoin(ROUND);
    fill("rgb(237, 147, 204)")
    stroke('rgb(237, 147, 204)')
    strokeWeight(20);
    
    // responsive fish positioning
    let fishY = 550;
    let fishSpacing = window.innerWidth > 1400 ? 400 : 300;
    let startX = -400;
    
    for(let i = 0; i < 5; i++) {
        image(fish, startX + (i * fishSpacing), fishY, 500, 500);
    }
  }

  function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
  }
  
