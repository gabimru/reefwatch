let gallery = [];

let nameInput;
let submitButton;

let koi, tkoi;
let colValue = 'purple';
let fishCanvas;
let refreshButton;
let isLoadingGallery = false;

//let canvas.height = function().height;
// Published CSV URL
const SHEET_READ_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTIoYKHJXiOhcdXk_L0pn-e6hgp7gTfGx90oP91xErOA0rvyjJsdSViM2L-IewtxypPbs95TG5aUFu1/pub?output=csv";
// Apps Script URL for writes
const SHEET_WRITE_URL = "https://script.google.com/macros/s/AKfycbxo1ehqLqUP1lenpGxK6-IUqXWDdkHWQ7gNw-yjVjhR6V5pTLQ9SPQe-FzD1Km0WCnDyw/exec";

async function loadGalleryFromGoogleSheet() {
  isLoadingGallery = true;
  const url = `${SHEET_READ_URL}&t=${Date.now()}`;
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    const csvText = await res.text();
    const rows = parseCSV(csvText);
    const nextGallery = [];
    let pending = 0;
    // reverse() makes newest first
    for (let entry of rows.reverse()) {
      if (!entry.img || typeof entry.img !== 'string') continue;
      const isDataUrl = entry.img.startsWith('data:image/');
      if (!isDataUrl) {
        console.warn('Skipping non-image entry:', entry.img);
        continue;
      }
      pending += 1;
      loadImage(
        entry.img,
        (img) => {
          nextGallery.push({ name: entry.name || 'Untitled', img: img });
          pending -= 1;
          if (pending === 0) {
            gallery = nextGallery;
            isLoadingGallery = false;
          }
        },
        (err) => {
          console.warn('Image failed to load from sheet entry:', err);
          pending -= 1;
          if (pending === 0) {
            gallery = nextGallery;
            isLoadingGallery = false;
          }
        }
      );
    }
    if (pending === 0) {
      gallery = nextGallery;
      isLoadingGallery = false;
    }
  } catch (err) {
    console.error("Error loading gallery:", err);
    isLoadingGallery = false;
  }
}

function parseCSV(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length <= 1) return [];
  const headers = splitCSVLine(lines[0]).map(h => h.trim().toLowerCase());
  const nameIdx = headers.indexOf("name");
  const imgIdx = headers.indexOf("img") !== -1 ? headers.indexOf("img") : headers.indexOf("imagebase64");
  const timestampIdx = headers.indexOf("timestamp");
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i]);
    rows.push({
      name: cols[nameIdx] || "",
      img: cols[imgIdx] || "",
      timestamp: cols[timestampIdx] || ""
    });
  }
  return rows;
}

function splitCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function preload() {
  koi = loadImage('bkoi.png');
  tkoi = loadImage('tkoi (1).png');
}

function setup() {
  let c = createCanvas(window.innerWidth, 10000);
  c.parent(document.body);
  background('rgb(255, 218, 241)');

  // load the shared gallery
 loadGalleryFromGoogleSheet();
 //window.innerHeight = totalImageHeight

  nameInput = createInput();
  nameInput.parent(document.body);
  nameInput.position(550, 760);
  nameInput.size(300);
  nameInput.style('font-size', '20px');
  nameInput.style('z-index', '10');
  nameInput.style('position', 'absolute');

  submitButton = createButton('Submit');
  submitButton.parent(document.body);
  submitButton.position(910, 765);
  submitButton.style('font-size', '20px');
  submitButton.style('z-index', '10');
  submitButton.style('position', 'absolute');
  submitButton.mousePressed(submitFish);

  refreshButton = createButton('Refresh Gallery');
  refreshButton.parent(document.body);
  refreshButton.position(1030, 765);
  refreshButton.style('font-size', '20px');
  refreshButton.style('z-index', '10');
  refreshButton.style('position', 'absolute');
  refreshButton.mousePressed(loadGalleryFromGoogleSheet);

  fishCanvas = createGraphics(400, 400);
  fishCanvas.background(koi);
}


function draw() { 
  background('rgb(255, 218, 241)');
  textAlign(CENTER);
  textSize(50);
  textFont('Archivo Black');
  fill("rgb(255, 255, 255)");
  text('Draw a fish and add to the Gallery!', window.innerWidth / 2, 50);

  noStroke();
  fill('rgb(238, 65, 163)');
  rect((window.innerWidth / 2) - 250, 200, 500, 500);

  image(fishCanvas, (window.innerWidth / 2) - 200, 250, 400, 400);
  
  fill('rgb(238, 65, 163)');
  rect(0, 750, window.innerWidth, 50);
  fill("rgb(255, 255, 255)");
  textSize(30);
  text('Name your fish!:', 300, 785);

  if (isLoadingGallery) {
    textAlign(LEFT);
    textSize(18);
    fill("rgb(255, 255, 255)");
    text('Loading gallery...', 40, 820);
  }


  for (let i = 0; i < gallery.length; i++) {

  let thumbnailWidth = 300;
  let thumbnailHeight = 300;
  let margin = 20;
  let columns = floor(window.innerWidth / (thumbnailWidth + margin));
  let x = margin + (i % columns) * (thumbnailWidth + margin);
  let y = 820 + floor(i / columns) * (thumbnailHeight + 60);

  image(gallery[i].img, x, y, thumbnailWidth, thumbnailHeight);
  fill('black')
  textSize(16);
  textAlign(CENTER);
  text(gallery[i].name, x + thumbnailWidth/2, y + thumbnailHeight + 20);
}
}

function mouseDragged() {//create drawing effect
  if (
    mouseX > (window.innerWidth / 2) - 200 &&
    mouseX < (window.innerWidth / 2) + 200 &&
    mouseY > 250 &&
    mouseY < 650
  ) {
    fishCanvas.fill(colValue);
    fishCanvas.noStroke();
    fishCanvas.rectMode(CENTER);
    fishCanvas.rect(mouseX - ((window.innerWidth / 2) - 200), mouseY - 250, 10, 10);
  }
}


function mousePressed() {
  if (
    mouseY > 635 &&
    mouseY < 650 &&
    mouseX > (window.innerWidth / 2) - 200 &&
    mouseX < (window.innerWidth / 2) + 200
  ) {
    fishCanvas.clear();
    fishCanvas.background(koi);
  }
}

// Color change with arrow keys
function keyPressed() {
  if (keyCode == LEFT_ARROW) colValue = 'blue';
  if (keyCode == RIGHT_ARROW) colValue = '#EB1D5D';
  if (keyCode == UP_ARROW) colValue = '#7DE9E3';
  if (keyCode == DOWN_ARROW) colValue = '#9593D9';
if (keyCode ==BACKSPACE) colValue='white';
 if (keyCode ==DELETE) colValue='white';
 if (keyCode ==SHIFT) colValue='purple';
}

function drawKoiUI() {
  if (!fishCanvas) return;            
  fishCanvas.rectMode(CORNER);
  fishCanvas.noStroke();
  fishCanvas.fill('rgb(240,110,110)');
  fishCanvas.rect(0, 385, 400, 15);
  
  fishCanvas.rectMode(CORNER);
  fishCanvas.noStroke();
  fishCanvas.fill('rgb(240,110,110)');
  fishCanvas.rect(0, 385, 400, 15);

  fishCanvas.fill('white');
  fishCanvas.textSize(10);
  fishCanvas.text('Click Red Bar to Clear', 140, 395);

  fishCanvas.fill('blue');
  fishCanvas.text('Left Arrow=Blue', 10, 10);
  fishCanvas.fill('#EB1D5D');
  fishCanvas.text('Right Arrow=Pink', 10, 20);
  fishCanvas.fill('#5CB4AF');
  fishCanvas.text('Up Arrow=Teal', 10, 30);
  fishCanvas.fill('#9593D9');
  fishCanvas.text('Down Arrow=Light Purple', 10, 40);
  fishCanvas.fill('purple')
  fishCanvas.text('Shift=Purple',10,50)
  fishCanvas.fill('black')
  fishCanvas.text('Backspace/Delete=Eraser',10,60)

  fishCanvas.image(tkoi, 0, 0, 400, 400);
}

function saveGallery() {
    // For now we’ll just save the names and images as Base64 strings
    let galleryData = gallery.map(fish => ({
      name: fish.name,
      img: fish.img.canvas.toDataURL()
    }));
  }  

setInterval(() => {
  drawKoiUI();
}, 30);

function windowResized() {
  resizeCanvas(window.innerWidth, 1536);
}

async function submitFish() {
    const fishName = nameInput.value().trim();
    if (!fishName) {
      alert("Please name your fish first!");
      return;
    }
  
    // Convert fish canvas to a smaller JPEG 
    const thumbSize = 220;
    const thumb = createGraphics(thumbSize, thumbSize);
    thumb.image(fishCanvas, 0, 0, thumbSize, thumbSize);
    const fishImage = thumb.canvas.toDataURL('image/jpeg', 0.75);
  
    const newFish = { name: fishName, img: fishImage };

    // Show locally by loading the data URL into a p5.Image
    loadImage(
      fishImage,
      (img) => {
        gallery.unshift({ name: fishName, img });
      },
      (err) => {
        console.warn("Local preview image failed to load:", err);
      }
    );
    console.log("Fish submitted:", fishName);
  
    // Send to Google Sheet
    try {
      await fetch(SHEET_WRITE_URL, {
        method: "POST",

        mode: "no-cors",
        body: JSON.stringify(newFish)
      });
      alert(`Fish "${fishName}" submitted!`);
      // Refresh gallery 
      setTimeout(loadGalleryFromGoogleSheet, 1500);
    } catch (err) {
      console.error("Error saving to Google Sheet:", err);
      alert("Something went wrong — fish not saved!");
    }
  
    fishCanvas.clear();
    fishCanvas.background(koi);
    nameInput.value("");
  }
  