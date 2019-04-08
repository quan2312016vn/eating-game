let canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
let c = canvas.getContext("2d");
let mouse;
let aniId;
let speed = 3;
let foods = [];
let numberOfFoods = 1600;
let colors = ["pink", "orange", "green", "blue", "gray", "black"];
let player;
let timeout;
let score;

function Circle(x, y, r, color){
  this.x = x;
  this.y = y;
  this.r = r;
  this.dx = 0;
  this.dy = 0;
  this.color = color;
}

Circle.prototype.draw = function(){
  c.beginPath();
  c.fillStyle = this.color;
  c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
  c.fill();
  c.fillStyle= "black";
}

function foodInit(){
  let color, x, y, r;
  for(let i = 0; i < numberOfFoods; i++){
    color = colors[Math.trunc((Math.random()*7))];
    x = Math.random() * (innerWidth + 10000) - 5000;
    y = Math.random() * (innerHeight + 10000) - 5000;
    r;

    if (i > numberOfFoods/1.2) r = Math.random()* (200 - 30) + 30;
    else r = Math.random()* (50 - 5) + 5;
    if (Math.sqrt(Math.pow(x - player.x, 2) +
                  Math.pow(y - player.y, 2)) < player.r + r + 50) {
      i--;
      continue;
    }
    foods[i] = new Circle(x, y, r, color);
  }
}

function drawFoods(){
  for (let i = 0; i < foods.length; i++){
    foods[i].draw();
  }
}

function moveFoods(dx, dy){
  for (let i = 0; i < foods.length; i++){
    foods[i].x += dx;
    foods[i].y += dy
  }
}

function drawFrame(){
  c.clearRect(0, 0, innerWidth, innerHeight);
  player.draw();
  drawFoods();
}

function checkEating(){
  let distanceX, distanceY, distance;
  for(let i = 0; i < foods.length; i++){
    distanceX = foods[i].x - player.x;
    distanceY = foods[i].y - player.y;
    distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

    if (distance < foods[i].r + player.r) {

      if (player.r > foods[i].r){
        player.r += foods[i].r/10;
        foods.splice(i, 1);
        return 1;
      }

      if (player.r < foods[i].r){
        foods[i].r += player.r/10;
        score = player.r - 30;
        player.r = 0;
        return -1;
      }

    }
  }
  return 0;
}

function move(){
  let distanceX = mouse.x - player.x;
  let distanceY = mouse.y - player.y;

  if (Math.abs(distanceX) > 1 || Math.abs(distanceY) > 1) {
    aniId = requestAnimationFrame(move);
  }

  let alpha = Math.atan(distanceY/distanceX);
  player.dx = Math.abs(Math.cos(alpha)) * speed;
  player.dy = Math.abs(Math.sin(alpha)) * speed;

  if (distanceX < 0) player.dx = -player.dx;
  if (distanceY < 0) player.dy = -player.dy;
  moveFoods(-player.dx, - player.dy);

  drawFrame();

  if(checkEating() == -1) {
    drawFrame()
    canvas.removeEventListener("mousemove", handleEvent);
    cancelAnimationFrame(aniId);
    setTimeout(function(){
      clearTimeout(timeout);
      let ans = confirm("OOps!! You have been eaten!! \nYour score is "+ Math.trunc(score) +".\nPlay again ?");
      if (ans == true) startGame();
    }, 1000);
  }

}

function startGame(){
  alert("You have 1 minute to play :3")

  timeout = setTimeout(function(){
    score = player.r - 30;
    canvas.removeEventListener("mousemove", handleEvent);
    cancelAnimationFrame(aniId);
    let ans = confirm("Time is up!!! \nYour score is " + Math.trunc(score) + ".\nPlay again ?");
    if (ans) startGame();
  }, 60000);

  mouse = {x: 10000, x: 10000};
  c.clearRect(0, 0, innerWidth, innerHeight)
  foods = [];
  player = new Circle(innerWidth/2, innerHeight/2, 30, "red");
  player.draw();
  foodInit();
  drawFoods();
  canvas.addEventListener("mousemove", handleEvent);
}

function handleEvent(e){
  cancelAnimationFrame(aniId);
  mouse.x = e.x;
  mouse.y = e.y;
  aniId = requestAnimationFrame(move);
}

startGame();
