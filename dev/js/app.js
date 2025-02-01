
class App {
    constructor() {
      debugOut("app init");
      this.canvasWidth = 400;
      this.canvasHeight = 400;
      this.boardWidth = 20;
      this.boardHeight = 20;
      this.scaleX = this.canvasWidth/this.boardWidth;
      this.scaleY = this.canvasHeight/this.boardHeight;
      this.offsetX = this.scaleX/2;
      this.offsetY = this.scaleY/2;
      
      if (this.isMobile()) {
        debugOut("mobile!");
        this.resizeCanvas();
      }
      debugOut("app init done");
    }

    debugOut(m) {
        console.log(m);
        //debugOut(m);
    }

    isMobile() {
        this.debugOut("isMobile");
        const userAgent = navigator.userAgent.toLowerCase();
        return /android|webos|iphone|ipad|ipod|blackberry|windows phone/.test(userAgent);
        return 1;
      }
      
      
      resizeCanvas() {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
      
        // Adjust canvas size to maintain aspect ratio (optional)
        const aspectRatio = this.canvasWidth / this.canvasHeight;
        if (window.innerWidth / window.innerHeight > aspectRatio) {
          canvas.width = window.innerHeight * aspectRatio;
          canvas.height = window.innerHeight;
        } else {
          canvas.width = window.innerWidth;
          canvas.height = window.innerWidth / aspectRatio;
        }
      
        // Center the canvas on the screen (optional)
        canvas.style.position = 'absolute';
        canvas.style.left = (window.innerWidth - canvas.width) / 2 + 'px';
        canvas.style.top = (window.innerHeight - canvas.height) / 2 + 'px';
      
        // Redraw your canvas content here, adjusting for the new size
        // ..
        this.scaleX = this.canvasWidth/this.boardWidth;
        this.scaleY = this.canvasHeight/this.boardHeight;
        this.offsetX = this.scaleX/2;
        this.offsetY = this.scaleY/2;
        this.debugOut("resize ${this.cavasWidth} ${this.canvasHeight}");
      }
    
    drawLetter(letter) {
                ctx.save(); 
                ctx.translate(this.offsetX, this.offsetY); 
                ctx.scale(this.scaleX, this.scaleY); 
                let px = (letter.x * this.scaleX) + this.offsetX;
                let py = (letter.y * this.scaleY) + this.offsetY;
                ctx.translate(px,py); 
                
                ctx.font = `${letter.fontSize}px Courier New`; 
                ctx.fillStyle = `hsla(${letter.hue}, 70%, ${letter.lightness}%, ${letter.opacity})`; 
                ctx.textAlign = 'center'; 
                ctx.textBaseline = 'middle'; 
                ctx.fillText(letter.letter, 0, 0, 20); 
                ctx.restore(); 
                this.debugOut("draw ${px},${py}");
        }
        clearCanvas() { 
            letters = []; 
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
        } 
        
        
        updateFrame() {
            debugOut("update frame");
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            letters.forEach(letter => { letter.update(); letter.draw(); }); 

        }
        newGame() {
            let numZombies = random(5,10);
            let numHoles = Math.ceil(numZombies/5);
            id = 0;
            done = 0;
            holes=[];
            letters = [];
            addPerson();
            for (let i = 0; i < numHoles; i++) {
                 addHole();
            }
            for (let i = 0; i < numZombies; i++) { 
                addZombie(); 
            }
            theApp.updateFrame(); 
            
            statusMessage.innerHTML = "New Game! " +
                                        "<br>Y - you" +
                                        "<br>Z - zombies" +
                                        "<br>O - holes" +
                                        "<br>Try to get the zombies to fall in the holes before they get you!" +
                                        "<br>A hole can only hold 5 zombies.";
        }
}

/*
function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|windows phone/.test(userAgent);
}

// Example usage:
if (isMobile()) {
  console.log("This is a mobile device.");
} else {
  console.log("This is a desktop device.");
}
    */

    /*
    const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 400;
canvas.height = 300;

// Style the text
ctx.font = '16px Arial';
ctx.fillStyle = 'black';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Draw the title
ctx.fillText('Welcome to the Text Game', canvas.width / 2, 50);

// Draw the instructions
ctx.fillText('Click the button to start', canvas.width / 2, 100);

// Draw the button
ctx.fillStyle = 'blue';
ctx.fillRect(120, 150, 160, 40);
ctx.fillStyle = 'white';
ctx.fillText('Start Game', canvas.width / 2, 170);
*/

/*
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set initial dimensions (adjust as needed)
let canvasWidth = 300;
let canvasHeight = 200;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Adjust canvas size to maintain aspect ratio (optional)
  const aspectRatio = canvasWidth / canvasHeight;
  if (window.innerWidth / window.innerHeight > aspectRatio) {
    canvas.width = window.innerHeight * aspectRatio;
    canvas.height = window.innerHeight;
  } else {
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth / aspectRatio;
  }

  // Center the canvas on the screen (optional)
  canvas.style.position = 'absolute';
  canvas.style.left = (window.innerWidth - canvas.width) / 2 + 'px';
  canvas.style.top = (window.innerHeight - canvas.height) / 2 + 'px';

  // Redraw your canvas content here, adjusting for the new size
  // ...
}

// Initial resize
resizeCanvas();

// Resize on window resize
window.addEventListener('resize', resizeCanvas);
*/