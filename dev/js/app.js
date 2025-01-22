class App {
    constructor() {
      this.debugOut("app init");
      this.canvasWidth = 400;
      this.canvasHeight = 400;
      
      if (this.isMobile()) {
        this.debugOut("mobile!");
        this.resizeCanvas();
      }
    }

    debugOut(m) {
        console.log(m);
    }

    isMobile() {
        this.debugOut("isMobile");
        const userAgent = navigator.userAgent.toLowerCase();
        return /android|webos|iphone|ipad|ipod|blackberry|windows phone/.test(userAgent);
      }
      
      
      resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      
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
        // ...
      }
    
    drawLetter(letter) {
                        ctx.save(); 
                ctx.translate(offsetX, offsetY); 
                ctx.scale(scale, scale); 
                let px = (letter.x * 20) + 10;
                let py = (letter.y * 20) + 10;
                ctx.translate(px,py); 
                
                ctx.font = `${letter.fontSize}px Courier New`; 
                ctx.fillStyle = `hsla(${letter.hue}, 70%, ${letter.lightness}%, ${letter.opacity})`; 
                ctx.textAlign = 'center'; 
                ctx.textBaseline = 'middle'; 
                ctx.fillText(letter.letter, 0, 0, 20); 
                ctx.restore(); 
        }
        function clearCanvas() { 
            letters = []; 
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
        } 
        
        
        function updateFrame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            letters.forEach(letter => { letter.update(); letter.draw(); }); 

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