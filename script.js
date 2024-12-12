const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set up canvas size
canvas.width = 400;
canvas.height = 400;

const boxSize = 20; // Size of each square
let snake = [{ x: 10, y: 10 }]; // Snake starting position
let food = spawnFood();
let direction = { x: 0, y: 0 }; // Snake starts stationary
let gameStarted = false; // Prevent immediate movement
let score = 0;

// Spawn food randomly
function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / boxSize)),
    y: Math.floor(Math.random() * (canvas.height / boxSize)),
  };
}

// Draw everything
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? 'lime' : 'green';
    ctx.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
  });

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);

  // Draw score
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 20);

  // Show "Press to Start" message if game hasn't started
  if (!gameStarted) {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Press Any Arrow Key to Start', 60, canvas.height / 2);
  }
}

// Move the snake
function moveSnake() {
  const head = { ...snake[0] }; // Copy head position
  head.x += direction.x;
  head.y += direction.y;

  // Check collision with walls
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width / boxSize ||
    head.y >= canvas.height / boxSize
  ) {
    alert('Game Over!');
    resetGame();
    return;
  }

  // Check collision with itself
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    alert('Game Over!');
    resetGame();
    return;
  }

  snake.unshift(head); // Add new head position

  // Check if food is eaten
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = spawnFood();
  } else {
    snake.pop(); // Remove tail
  }
}

// Reset the game
function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  food = spawnFood();
  gameStarted = false;
}

// Handle keyboard input
document.addEventListener('keydown', event => {
  if (!gameStarted) gameStarted = true; // Start the game on any key press

  switch (event.key) {
    case 'ArrowUp':
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

// Main game loop
function gameLoop() {
  if (gameStarted) {
    moveSnake();
  }
  drawGame();
  setTimeout(gameLoop, 100); // Control speed
}

// Start the game
gameLoop();
