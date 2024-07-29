



let colors = {
  "bg" : [49, 54, 63], 
  "player" : [128, 181, 190], 
  "white" : [255, 255, 255]
}

let canvas;

let playerX;
let playerR = 30
let playerY;
let started = false
let canSwitch = false
let textAlpha = 255
let textFading = false
let moveSpeed = 60
let moving = "" // "" is not moving, left, right
let side = ""
let obstacleHeight = 30
let obstacleSpeed = 5
let obstacles = []
let obstacleSpawnRate = 100
let framesSinceLastSpawn = 0
let firstChoice = false
let firstChoiceTextFading = false
let firstChoiceBoxFading = false
let firstChoiceTextAlpha = 255
let firstChoiceBoxAlpha = 100
let score = 0
let framesSinceLastSecond = 0
let gameOver = false

let switchSound;
let crashSound; 
let confirmSound;



function preload() {
  switchSound = loadSound("Sounds/switch.mp3")
  crashSound = loadSound("Sounds/crash.mp3")
  confirmSound = loadSound("Sounds/confirm.mp3")
}



function setup() {
  frameRate(120)
  canvas = createCanvas(600, windowHeight);
  canvas.position(windowWidth/2-width/2, windowHeight/2 - height/2);
  playerX = width/2 - playerR/2
  playerY = height-playerR*6
  //sideDiv = createDiv(side)
  //sideDiv.position(100, 500)
}

class Obstacle {
  constructor() {
    this.y = -30
    this.w = random(100, 500)
    this.x = [0, width-this.w][int(random(2))]

  }
  update() {
    this.y += obstacleSpeed
    fill(255)
    rect(this.x, this.y, this.w, obstacleHeight, 4)
    this.checkCollision()
  }
  checkCollision() {
    let playerLeft = playerX - playerR;
    let playerRight = playerX + playerR;
    let playerTop = playerY - playerR;
    let playerBottom = playerY + playerR;
    
    let obstacleLeft = this.x;
    let obstacleRight = this.x + this.w;
    let obstacleTop = this.y;
    let obstacleBottom = this.y + obstacleHeight;
    
    if (playerRight > obstacleLeft && playerLeft < obstacleRight && playerBottom > obstacleTop && playerTop < obstacleBottom) {

      if (!gameOver) {
        crashSound.play()
      }

      setTimeout(function () {
        deathScreen()
      }, 20);
    }
  }
}
function deathScreen() {
  gameOver = true
}

function restart() {
  loop()
  gameOver = false
  playerX = width/2 - playerR/2
  playerY = height-playerR*6
  started = false;
  canSwitch = false;
  textAlpha = 255;
  textFading = false;
  moveSpeed = 60;
  moving = ""; // "" is not moving, left, right
  side = "";
  obstacleHeight = 30;
  obstacleSpeed = 5;
  obstacles = [];
  obstacleSpawnRate = 100;
  framesSinceLastSpawn = 0;
  firstChoice = false;
  firstChoiceTextFading = false;
  firstChoiceBoxFading = false;
  firstChoiceTextAlpha = 255;
  firstChoiceBoxAlpha = 100;
  score = 0;
  framesSinceLastSecond = 0;
}



function draw() {
  canvas.position(windowWidth/2-width/2, windowHeight/2 - height/2);
  background(colors['bg']);
  textFont('Heavitas');
  noStroke();
  fill(colors['player']);
  circle(playerX, playerY, playerR*2);
  fill(255, 0, 0);
  framesSinceLastSecond++
  if (framesSinceLastSecond >= 40 && started && !gameOver) {
    score++
    framesSinceLastSecond = 0
  }
  if (score > 10) {
    obstacleSpawnRate = 90
    obstacleSpeed = 6
  } 
  if (score > 20) {
    obstacleSpawnRate = 70
    obstacleSpeed = 7
  } 
  if (score > 30) {
    obstacleSpawnRate = 60
    obstacleSpeed = 8
  } 
  if (score > 40) {
    obstacleSpawnRate = 50
    obstacleSpeed = 9
  } 
  if (score > 50) {
    obstacleSpawnRate = 40
    obstacleSpeed = 10
  } 

  if (moving == 'left') {
    playerX -= moveSpeed;
    if (playerX < playerR) {
      playerX = playerR;
      moving = "";
      side = 'left';
    }
  } else if (moving == 'right') {
    playerX += moveSpeed;
    if (playerX > width - playerR) {
      playerX = width - playerR;
      moving = "";
      side = 'right';
    }
  }
  textSize(25);
  if (textFading) {
    textAlpha -= 10;
    if (textAlpha <= 0) {
      textAlpha = 0; 
      textFading = false;
      fill(255)
      textSize(50)
      firstChoice = true
    }
  }
  if (firstChoice) {
    fill(255, 255, 255, firstChoiceTextAlpha)
    textSize(80)
    text("A", 120, playerY + playerR/2)
    text("D", width-120, playerY + playerR/2)
    textSize(25)
    text("A, D does not work in game", width/2, 300)
    text("Only here for the starting move", width/2, 350)
    fill(0, 0, 0, 0)
    stroke(255, 255, 255, firstChoiceBoxAlpha)
    strokeWeight(10)
    rect(60, (playerY + playerR/2) - 65, 120, 120, 20)
    rect(420, (playerY + playerR/2) - 65, 120, 120, 20)
  }

  if (firstChoiceBoxFading) {
    firstChoiceBoxAlpha -= 1;
    if (firstChoiceBoxAlpha <= 0) {
      firstChoiceBoxFading = false;
      firstChoiceBoxAlpha = 0;
    }
  }
  if (firstChoiceTextFading) {
    firstChoiceTextAlpha -= 1;
    if (firstChoiceTextAlpha <= 0) {
      firstChoiceTextAlpha = 0;
      firstChoiceTextFading = false;
    }
  }

  fill(colors['white'][0], colors['white'][1], colors['white'][2], textAlpha);
  noStroke()
  textAlign(CENTER, CENTER);
  textSize(25);
  text('Press Enter to start', width / 2, 100);
  text('Left mouse button to switch sides', width / 2, 150);
  text('Dodge the incoming obstacles', width / 2, 200);

  for (let i=0; i < obstacles.length; i++) {
    obstacles[i].update()
    if (obstacles[i].y > height) {
      obstacles.splice(i, 1);
      i--;
    }
  }
  if (started) {
    textAlign(CENTER, CENTER);
    textSize(50)
    fill(255)
    strokeWeight(12)
    stroke(0)
    text(score, width/2, 100)
    noStroke()
    framesSinceLastSpawn++
    if (framesSinceLastSpawn >= obstacleSpawnRate) {
      obstacles.push(new Obstacle())
      framesSinceLastSpawn = 0
    }
  }
  if (gameOver) {
    fill(colors['bg'])
    background(colors['bg'])
    textSize(80)
    fill(colors['white'])
    text("You Died", width/2, height/2 - 50)
    textSize(50)
    text(`Score : ${score}`, width/2, (height/2) + 100 - 50)
    textSize(25)
    text("Press Enter to restart", width/2, (height/2) + 170 - 50)
    textSize(15)
    text("Incase it broke (very high chances) just refresh", width/2, (height/2) + 310 - 50)
  }
}
function mouseReleased() {
  if (canSwitch == false) {
    return
  }
  this.target = '' 
  if (side == 'left') {
    this.target = 'right'
  } else {
    this.target = 'left'
  }
  moving = this.target
  switchSound.play()
}

function keyPressed() {
  if (keyCode === RETURN) {
    if (!started && !textFading) {
      textFading = true;
      confirmSound.play()
    } else if (gameOver) {
      restart();
      confirmSound.play()
    }
  }

  if (keyCode === 65 && firstChoice) { // 'A' key
    moving = 'left';
    firstChoice = false;
    started = true;
    canSwitch = true;
    firstChoiceBoxFading = true;
    firstChoiceTextFading = true;
    confirmSound.play()
  }
  
  if (keyCode === 68 && firstChoice) { // 'D' key
    moving = 'right';
    firstChoice = false;
    started = true;
    canSwitch = true;
    firstChoiceBoxFading = true;
    firstChoiceTextFading = true;
    confirmSound.play()
  }
}