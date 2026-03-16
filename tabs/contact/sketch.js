let descInput, severityInput, submitBtn, statusMsg;
function preload(){ //load images to be able to be called on later
    mica=loadImage('tmica.png')
    catha=loadImage('tcatha.png')
    eli=loadImage('teli.png')
    gigi=loadImage('tgigi.png')
  }
function setup() { //set up canvas and user interactive portions
    let c = createCanvas(window.innerWidth, window.innerHeight);
    c.parent(document.body);  
    background('rgb(255, 218, 241)');

    //create user input section
    descInput = createInput();
    descInput.position((window.innerWidth/2) + 400,540);
    descInput.size(600,40);
    descInput.style("position", "absolute");
    descInput.style("border-radius","12px");
    descInput.style("z-index", "10");
    descInput.style("background", "rgb(255, 218, 241)");

    //create low/medium/high option
    severityInput = createSelect();
    severityInput.position(1150, 540);
    severityInput.option('Low');
    severityInput.option('Medium');
    severityInput.option('High');
    severityInput.style("background", "(rgb(255, 218, 241)");
    severityInput.style("position", "absolute");
    severityInput.style("z-index", "10");
  
    //create submit button
    submitBtn = createButton('Report Bug');
    submitBtn.position(1230, 540);
    submitBtn.style("background", "rgb(255, 218, 241)");
    submitBtn.mousePressed(sendBugReport);
    submitBtn.style("position", "absolute");
    submitBtn.style("z-index", "10");
    //create status msg
    statusMsg = createP("");
    statusMsg.position(310, 520);
    statusMsg.style("color", "rgb(255, 218, 241)");
    statusMsg.style("font-size", "18px");
    statusMsg.style("font-weight", "bold");
    statusMsg.style("z-index", "10");
    statusMsg.hide();

  }

  //send bug report to google sheet
  function sendBugReport() {
    let formData = new FormData();
    formData.append("description", descInput.value());
    formData.append("severity", severityInput.value());
    formData.append("page", window.location.href);
    formData.append("browser", navigator.userAgent);
  //connect to google app script code
    fetch("https://script.google.com/macros/s/AKfycbzLhPDyHEfr6047HAmy-LN-ih2NTL-dSSd0rnvtrTasQ_sYpEe-itgyewR5EPLBpCQ0MQ/exec", {
      method: "POST",
      body: formData
    })
    .then(text => {
        console.log("Server says:", text);
      
        // clear input
        descInput.value("");
      
        // show success message
        statusMsg.html("✔ Report sent");
        statusMsg.show();
      
        // hide after 3 seconds
        setTimeout(() => {
          statusMsg.hide();
        }, 3000);
      })
      
  }
  
  function draw() {//create designs for graphics and text
  textFont('Archivo Black');
    background('rgb(255, 218, 241)');
    fill("rgb(238, 65, 163)");
    textAlign(LEFT)
  
    //report a bug
    strokeJoin(ROUND);
    stroke('rgb(238, 65, 163)');
    strokeWeight(30);
    fill('rgb(238, 65, 163)');
    rect((window.innerWidth/2) - 570,540,1140,50);
    fill('white');
    noStroke()
    textSize(30)
    text("Report a Bug", (window.innerWidth/2) - 570, 560)
  
    //Meet us squares
    fill('rgb(238, 65, 163)');
    strokeWeight(20);
    stroke('rgb(238, 65, 163)');
    rect((window.innerWidth/5) - 115,80,230,400);
    rect(((2 * window.innerWidth)/5) - 115,80,230,400);
    rect(((3 * window.innerWidth)/5) - 115,80,230,400);
    rect(((4* window.innerWidth)/5) - 115,80,230,400);
    image(eli,(window.innerWidth/5) - 115,140,230,230);
    image(catha,((2 * window.innerWidth)/5) - 300,50,600,350);
    image(mica,((3 * window.innerWidth)/5) - 115,140,230,230);
    image(gigi,((4 * window.innerWidth)/5) - 115,140,230,230)

    fill('white');
    noStroke()
    textSize(30)
    textAlign(CENTER);
    textWrap(WORD)
    text("Eli Martinez",(window.innerWidth/5) - 115,80,230);
    text("Catharina Bomfim",((2 * window.innerWidth)/5) - 115,80,230);
    text("Micaela Mejia",((3 * window.innerWidth)/5) - 115,80,230);
    text("Giselle Iskandarani",((4* window.innerWidth)/5) - 115,80,230);

    textWrap(CHAR)
    textSize(25)
    text("micaelamejiart@gmail.com",((3* window.innerWidth)/5) - 115,400,230);
    text("cathaazebomfim@gmail.com",((2 * window.innerWidth)/5) - 114,400,230);
    text("elikayleenm@gmail.com",(window.innerWidth/5) - 115,400,230);
    text("giselleisk@gmail.com",((4* window.innerWidth)/5) - 115,400,230);
  }
  
  function windowResized() { //make sure graphics show up on top of canvas
    resizeCanvas(window.innerWidth, window.innerHeight); // uses iframe’s full width
  }