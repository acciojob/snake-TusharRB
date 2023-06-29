//your code here
document.addEventListener("DOMContentLoaded", function() {
  const gameContainer = document.getElementById("gameContainer");
  const scoreElement = document.getElementById("score");

  const gridSize = 40;
  const pixelSize = 10;
  const initialSnakeLength = 1;
  const speed = 100; // in milliseconds
  let direction = "right";
  let snake = [];
  let food = null;
  let score = 0;

  function createPixel(id, className) {
    const pixel = document.createElement("div");
    pixel.id = `pixel${id}`;
    pixel.className = className;
    return pixel;
  }

  function generateFood() {
    if (food) {
      food.classList.remove("food");
    }

    const emptyPixels = Array.from(document.getElementsByClassName("pixel")).filter(pixel => !pixel.classList.contains("snakeBodyPixel"));
    const randomIndex = Math.floor(Math.random() * emptyPixels.length);
    food = emptyPixels[randomIndex];
    food.classList.add("food");
  }

  function createSnake() {
    const head = createPixel("1", "snakeBodyPixel");
    snake.push(head);
    gameContainer.appendChild(head);
    generateFood();
  }

  function moveSnake() {
    const head = snake[0];
    let newHead;
    let newX = parseInt(head.style.gridColumn) || 1;
    let newY = parseInt(head.style.gridRow) || 20;

    switch (direction) {
      case "up":
        newY -= 1;
        break;
      case "down":
        newY += 1;
        break;
      case "left":
        newX -= 1;
        break;
      case "right":
        newX += 1;
        break;
    }

    // Check collision with walls
    if (newX === 0 || newX > gridSize || newY === 0 || newY > gridSize) {
      gameOver();
      return;
    }

    // Check collision with self
    const collidedPixel = document.getElementById(`pixel${newX}_${newY}`);
    if (collidedPixel && collidedPixel.classList.contains("snakeBodyPixel")) {
      gameOver();
      return;
    }

    newHead = createPixel(`${newX}_${newY}`, "snakeBodyPixel");
    newHead.style.gridColumn = newX;
    newHead.style.gridRow = newY;

    gameContainer.insertBefore(newHead, head);
    snake.unshift(newHead);

    // Check collision with food
    if (food && newHead.id === food.id) {
      food.classList.remove("food");
      score += 1;
      scoreElement.innerText = score;
      generateFood();
    } else {
      const tail = snake.pop();
      gameContainer.removeChild(tail);
    }
  }

  function changeDirection(event) {
    const key = event.key;
    if (key === "ArrowUp" && direction !== "down") {
      direction = "up";
    } else if (key === "ArrowDown" && direction !== "up") {
      direction = "down";
    } else if (key === "ArrowLeft" && direction !== "right") {
      direction = "left";
    } else if (key === "ArrowRight" && direction !== "left") {
      direction = "right";
    }
  }

  function startGame() {
    createSnake();
    setInterval(moveSnake, speed);
    document.addEventListener("keydown", changeDirection);
  }

  function gameOver() {
    alert("Game Over!");
    location.reload();
  }

  startGame();
});
