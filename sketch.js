
let player;
let enemies = [];
let bullets = [];
let score = 0;
let gameOver = false;
let groundImage, playerImage, enemyImage;

function preload() {
  groundImage = loadImage('ground.jpg'); 
  playerImage = loadImage('mario.png'); 
  enemyImage = loadImage('enemy.png');
}

function setup() {
  createCanvas(800, 400);
  player = new Player();
}

function draw() {
  background(groundImage); 

  if (gameOver) {
    fill(0);
    textSize(32);
    textAlign(CENTER);
    text('Game Over', width / 2, height / 2);
    text('Score: ' + score, width / 2, height / 2 + 40);
    noLoop();
    return;
  }

  player.update();
  player.show();
 
  if (random(1) < 0.01) {
    enemies.push(new Enemy());
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    enemies[i].show();

    if (player.hits(enemies[i])) {
      gameOver = true;
    }

    for (let j = bullets.length - 1; j >= 0; j--) {
      if (bullets[j].hits(enemies[i])) {
        score += 100;
        bullets.splice(j, 1);
        enemies.splice(i, 1);
        break; 
      }
    }

    if (enemies[i] && enemies[i].offscreen()) {
      enemies.splice(i, 1);
    }
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].show();

    if (bullets[i] && bullets[i].offscreen()) {
      bullets.splice(i, 1);
    }
  }

  fill(0);
  textSize(16);
  textAlign(LEFT);
  text('Score: ' + score, 10, 20);
}


function keyPressed() {
  if (key === ' ') {
    player.jump();
  } else if (keyCode === RIGHT_ARROW) {
    player.move(1);
  } else if (keyCode === LEFT_ARROW) {
    player.move(-1);
  } else if (key === 'X' || key === 'x') {
    bullets.push(new Bullet(player.x + player.r / 2, player.y + player.r / 2));
  }
}

function keyReleased() {
  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
    player.move(0);
  }
}

class Player {
  constructor() {
    this.r = 50;
    this.x = 50;
    this.y = height - this.r - 50;
    this.vx = 0;
    this.vy = 0;
    this.gravity = 1;
  }

  jump() {
    if (this.y === height - this.r - 50) {
      this.vy = -15;
    }
  }

  move(dir) {
    this.vx = dir * 5;
  }

  hits(enemy) {
    return collideRectRect(this.x, this.y, this.r, this.r, enemy.x, enemy.y, enemy.r, enemy.r);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.y = constrain(this.y, 0, height - this.r - 50);
    this.x = constrain(this.x, 0, width - this.r);
  }

  show() {
    image(playerImage, this.x, this.y, this.r, this.r);
  }
}

class Enemy {
  constructor() {
    this.r = 50;
    this.x = width;
    this.y = random(height - this.r);
    this.vx = random(-3, -1);
  }

  update() {
    this.x += this.vx;
  }

  offscreen() {
    return this.x < -this.r;
  }

  show() {
    image(enemyImage, this.x, this.y, this.r, this.r);
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 8;
    this.vx = 10;
  }

  update() {
    this.x += this.vx;
  }

  offscreen() {
    return this.x > width;
  }

  hits(enemy) {
    return collideRectRect(this.x, this.y, this.r, this.r, enemy.x, enemy.y, enemy.r, enemy.r);
  }

  show() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.r, this.r);
  }
}
