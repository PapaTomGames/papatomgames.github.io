
class App {
  constructor() {
    debugOut("app init");
    this.canvasWidth = 400;
    this.canvasHeight = 400;
    this.boardWidth = 20;
    this.boardHeight = 20;
    this.scaleX = this.canvasWidth / this.boardWidth;
    this.scaleY = this.canvasHeight / this.boardHeight;
    this.offsetX = this.scaleX / 2;
    this.offsetY = this.scaleY / 2;
    this.game = 0;
    this.score = 0;
    this.resetScore();
    this.moveCounter = 0;

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

    // Center the canvas on the screen (optional)
    canvas.style.position = 'absolute';
    canvas.style.left = (window.innerWidth - canvas.width) / 2 + 'px';
    canvas.style.top = (window.innerHeight - canvas.height) / 2 + 'px';

    // Redraw your canvas content here, adjusting for the new size
    // ..
    this.scaleX = this.canvasWidth / this.boardWidth;
    this.scaleY = this.canvasHeight / this.boardHeight;
    this.offsetX = this.scaleX / 2;
    this.offsetY = this.scaleY / 2;
    this.debugOut(`resize ${this.canvasWidth} ${this.canvasHeight} ${this.scaleX} ${canvas.style.left}`);
  }

  drawLetter(letter) {
    const canvas = document.getElementById('letterCanvas');
    const ctx = canvas.getContext('2d');
    ctx.save();
    // ctx.translate(0,0); //this.offsetX, this.offsetY); 
    ctx.scale(1, 1); //this.scaleX, this.scaleY); 
    let px = (letter.x * this.scaleX) + this.offsetX;
    let py = (letter.y * this.scaleY) + this.offsetY;
    ctx.translate(px, py);

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
    let numZombies = random(5, 10);
    let numHoles = Math.ceil(numZombies / 5);
    id = 0;
    done = 0;
    holes = [];
    letters = [];
    this.resetScore();
    this.moveCounter = 0;
    addPerson();
    for (let i = 0; i < numHoles; i++) {
      addHole();
    }
    for (let i = 0; i < numZombies; i++) {
      addZombie(0);
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
  resetScore() {
    this.score = 0;
    this.writeScore();
  }
  addScore(p) {
    this.score += p;
    this.writeScore();
  }
  writeScore() {
    scoreMessage.innerHTML = `Score: ${this.score}`;
  }
}

