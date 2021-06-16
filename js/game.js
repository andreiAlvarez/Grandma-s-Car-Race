// canvas definition
const canvasGame = document.querySelector("#game-canvas");

// context definition
let ctx = canvasGame.getContext("2d");

//adding my road
let road = new Image();
road.src = "./images/roadAndTrees.png"; // navigate to this file as you were in html file

//adding the coordinates of the road
let roadX = 1066;
let roadY = 70;

//adding granma's images
let logo = new Image();
logo.src = "./images/grandmas_Car_Race_Logo.png";

let grandmaOne = new Image();
grandmaOne.src = "./images/grandmaOne.png";

let grandmaTwo = new Image();
grandmaTwo.src = "./images/grandmaTwo.png";

//more images
let arrows = new Image();
arrows.src = "./images/arrows.png";

// Grandma's record
const grandmaR = {
  time: 1000,
  score: 8000,
};

//adding player's score
let score = 0;

//adding the car
let car = new Image();
car.src = "./images/carThreeOkk.png";

let carObject = {
  img: car,
  acceleration: 5,
  maxSpeed: 120,
  y: 155,
  x: 0,
  width: 150,
  height: 80,
};

//adding booleans

let gameover = false;
let menu = true;

//declaring timer and configure it
let timer = 0;
let timerInter = setInterval(() => timer++, 1000);
road.onload = () => {
  requestAnimationFrame(gameLoop);
};

//adding obstacles
const createObs = () => {
  let imgSrcs = ["./images/blueCarTwo.png", "./images/whiteCarTwo.png"];
  let random = Math.floor(Math.random() * imgSrcs.length);
  let yValues = [250, 150];
  let randomY = Math.floor(Math.random() * yValues.length);
  let img = new Image();
  img.src = imgSrcs[random];

  const obstacle = {
    img: img,
    x: canvasGame.width,
    y: yValues[randomY],
    height: 80,
    width: 150,
    acceleration: 5,
  };
  return obstacle;
};

//array of obstacles
let obstacles = [createObs()];

const createObstacle = () => {
  const obstacle = createObs();
  obstacles.push(obstacle);
};

let obstaclesInterval = setInterval(createObstacle, 3000);

//getting game controlls
document.body.onkeydown = function (e) {
  switch (e.keyCode) {
    case 40:
      if (carObject.y <= 255) {
        carObject.y += 5;
        break;
      } else carObject.y -= 5;
      break;
    case 38:
      if (carObject.y >= 150) {
        carObject.y -= 5;
        break;
      } else carObject.y += 5;
    case 39:
      carObject.x += 5;
      break;
    case 37:
      carObject.x -= 5;
      carObject.acceleration -= 1;
      break;
    case 32:
      if (carObject.acceleration < carObject.maxSpeed)
        carObject.acceleration += 1;

      console.log(carObject.acceleration);
      break;
    case 83:
      menu = false;
      break;
    default:
      break;
  }
};

//collision detection settings
function collisionDetection(objOne, objTwo) {
  return (
    objOne.y + objOne.height - 10 >= objTwo.y &&
    objOne.y <= objTwo.y + objTwo.height - 10 &&
    objOne.x + objOne.width - 10 >= objTwo.x &&
    objOne.x <= objTwo.x + objTwo.width - 10
  );
}

//drawing everything
function gameLoop() {
  if (menu === true) {
    const game = requestAnimationFrame(gameLoop);
    ctx.clearRect(0, 0, 1066, 500);
    ctx.drawImage(logo, 20, 25, 500, 450);
    ctx.font = "25px Arial";
    ctx.fillText(`Are you ready to break Grandma's record`, 560, 60);
    ctx.fillText(`of 8000 points in 25 seconds?`, 620, 100);
    ctx.fillText(`Car controls:`, 720, 150);
    ctx.drawImage(arrows, 690, 200, 100, 50);
    ctx.fillText(`- Direction`, 800, 230);
    ctx.fillText(`Space bar - speed`, 700, 300);
    ctx.fillText(`Press S to Start!`, 720, 400);
  }

  if (menu === false) {
    startGame();
  }
}

//start game
function startGame() {
  const game = requestAnimationFrame(gameLoop);
  ctx.clearRect(0, 0, 1066, 500);
  score = Math.round(score);

  ctx.fillText(`Score: ${score}`, 800, 50);
  ctx.fillText(`Time: ${timer}`, 500, 50);
  ctx.fillText(`Speed: ${carObject.acceleration} mph`, 150, 50);
  if (roadX <= 0) roadX = 1066;

  ctx.drawImage(road, roadX, roadY);
  ctx.drawImage(road, roadX - 1066, roadY);

  roadX -= carObject.acceleration;

  ctx.drawImage(
    carObject.img,
    carObject.x,
    carObject.y,
    carObject.width,
    carObject.height
  );
  score++;

  obstacles.forEach((obstacle) => {
    if (collisionDetection(obstacle, carObject)) {
      obstacles = [];
      clearInterval(obstaclesInterval);
      cancelAnimationFrame(game);
      gameOver();
      gameover = true;
    } else if (!gameover) {
      obstacle.x -= 3;
      ctx.drawImage(
        obstacle.img,
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
      );
      if (carObject.acceleration > obstacle.acceleration) {
        obstacle.x -= 3;
        score++;
      }
      console.log(score);
      if (timer === 25) {
        obstacles = [];
        clearInterval(obstaclesInterval);
        cancelAnimationFrame(game);
        ctx.clearRect(0, 0, 1066, 500);
        checkWinner(score, grandmaR.score);
      }
    }
  });
}

// gameover
function gameOver() {
  ctx.clearRect(0, 0, 1066, 500);
  ctx.drawImage(grandmaTwo, 200, 50, 200, 400);
  ctx.fillText("Grandma won!", 600, 200);
  ctx.fillText("Refresh the page to play again!", 600, 250);
  ctx.fillText(`Your score: ${score}`, 600, 350);
  ctx.fillText(`Grandma's record: ${grandmaR.score}`, 600, 400);
  console.log("Game Over!");
}

// checking for new record
function checkWinner(value1, value2) {
  if (value1 > value2) {
    console.log("You broke Grandma's record!");
    ctx.drawImage(grandmaOne, 200, 50, 180, 400);
    ctx.fillText("You broke Grandma's record!", 600, 200);
    ctx.fillText("Refresh the page to play again!", 600, 250);
    ctx.fillText(`Your new record: ${score}`, 600, 350);
    ctx.fillText(`Grandma's broken record: ${grandmaR.score}`, 600, 400);
  } else if (value1 < value2) {
    console.log("Grandma won! Try next time!");
    ctx.drawImage(grandmaTwo, 200, 50, 200, 400);
    ctx.fillText("Grandma won! Please, try next time!", 600, 250);
    ctx.fillText(`Your score: ${score}`, 600, 350);
    ctx.fillText(`Grandma's score: ${grandmaR.score}`, 600, 400);
  }
}
