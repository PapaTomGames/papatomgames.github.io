
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
      this.game = 0;
      
      if (this.isMobile()) {
        debugOut("mobile!");
        this.resizeCanvas();
      }

      // events

      debugOut("app init done");
    }

    debugOut(m) {
        console.log(m);
        //debugOut(m);
    }

    isMobile() {
        this.debugOut("isMobile");
        const userAgent = navigator.userAgent.toLowerCase();
        //return /android|webos|iphone|ipad|ipod|blackberry|windows phone/.test(userAgent);
        return 0;
      }
      
      
      resizeCanvas() {
        const canvas = document.getElementById('letterCanvas'); 
        const ctx = canvas.getContext('2d'); 

        this.scaleX = 20;
        this.scaleY = 20;
        return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
      
        // Adjust canvas size to maintain aspect ratio (optional)
        const aspectRatio = this.canvasWidth / this.canvasHeight;
        /*if (canvas.width / canvas.height > aspectRatio) {
          canvas.width = window.innerHeight * aspectRatio;
          canvas.height = window.innerHeight;
        } else {
          canvas.width = window.innerWidth;
          canvas.height = window.innerWidth / aspectRatio;
        }
          */
      
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
        this.debugOut(`resize ${this.canvasWidth} ${this.canvasHeight} ${this.scaleX} ${canvas.style.left}`);
      }
    
    drawLetter(letter) {
              const canvas = document.getElementById('letterCanvas'); 
              const ctx = canvas.getContext('2d'); 
              ctx.save(); 
                // ctx.translate(0,0); //this.offsetX, this.offsetY); 
                ctx.scale(1,1); //this.scaleX, this.scaleY); 
                let px = (letter.x * this.scaleX) + this.offsetX;
                let py = (letter.y * this.scaleY) + this.offsetY;
                ctx.translate(px,py); 
                
                ctx.font = `${letter.fontSize}px Courier New`; 
                ctx.fillStyle = `hsla(${letter.hue}, 70%, ${letter.lightness}%, ${letter.opacity})`; 
                ctx.textAlign = 'center'; 
                ctx.textBaseline = 'middle'; 
                ctx.fillText(letter.letter, 0, 0, 20); 
                ctx.restore(); 
                this.debugOut(`draw ${px},${py} ${this.scaleX} ${ctx.font} ${letter}`);
        }
        clearCanvas() { 
            letters = []; 
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
        } 
        
        
        updateFrame() {
          const canvas = document.getElementById('letterCanvas'); 
          const ctx = canvas.getContext('2d'); 
          debugOut("update frame");
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            letters.forEach(letter => { letter.update(); letter.draw(); }); 
            //let letter = letters[0];
            //letter.update(); letter.draw();

        }
        selectGame(g) {
          this.debugOut("game selected " + g);

          this.game = g;
          switch (g) {
            case 0:
              document.getElementById('dig').style.visibility = 'hidden';
              //this.newSingleGame();
              break;
            case 1:
              document.getElementById('dig').style.visibility = 'visible';
              //this.newSuperGame();
              break;
          }
          this.newGame();
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

        //newSuperGame() {
        //  theApp.debugOut("newSuperGame");
        //}
}

/*
<!DOCTYPE html>
<html>
<head>
<title>Dropdown Menu with JavaScript Events</title>
<style>
  /* Basic styling for the dropdown 
  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
  }

  .dropdown-content a {
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    color: #333; /* Darker text for better readability 
  }

  .dropdown-content a:hover {background-color: #f1f1f1;}

  .dropdown:hover .dropdown-content {
    display: block;
  }

  .dropbtn {
    background-color: #4CAF50; /* Green 
    color: white;
    padding: 10px 16px;
    font-size: 16px;
    border: none;
    cursor: pointer; /* Make it look clickable 
  }
</style>
</head>
<body>

<div class="dropdown">
  <button class="dropbtn">Dropdown</button>
  <div class="dropdown-content" id="myDropdown">
    <a href="#" onclick="handleItemClick('Item 1')">Item 1</a>
    <a href="#" onclick="handleItemClick('Item 2')">Item 2</a>
    <a href="#" onclick="handleItemClick('Item 3')">Item 3</a>
    <a href="#" onclick="handleItemClick('Item 4')">Item 4</a>
  </div>
</div>

<script>
function handleItemClick(itemName) {
  // Get the dropdown content element to close it after a selection
  const dropdownContent = document.getElementById("myDropdown");
  dropdownContent.style.display = "none"; // Hide the dropdown

  // Option 1: Alert the selected item
  alert("You selected: " + itemName);

  // Option 2:  Update content on the page (more common use case)
  const selectedItemDisplay = document.getElementById("selectedItem"); // You would need to add this element to your HTML
  if (selectedItemDisplay) {
    selectedItemDisplay.textContent = "Selected: " + itemName;
  }

  // Option 3: Redirect to a different page (if your links are actual URLs)
  // window.location.href = "/page/" + itemName; // Example

  // Option 4:  Send data to a server (using fetch or XMLHttpRequest) - More advanced
  // ... your code to send data to server ...

  // Example showing how to get the currently selected item text
  const dropdownButton = document.querySelector('.dropbtn');
  dropdownButton.textContent = itemName; // This sets the button text
}


</script>

<p id="selectedItem"></p>  </body>
</html>

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