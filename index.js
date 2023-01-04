const gameBoard = document.querySelector("#gameBoard"); //refers to the canvas element on which the game will be drawn
const ctx = gameBoard.getContext("2d"); // 2d rendering context for the canvas
const scoreText = document.querySelector("#scoreText"); // displays the player's current score
const resetBtn = document.querySelector("#resetBtn"); // refers to a button that resets the game
const gameWidth = gameBoard.width; // the width of the canvas
const gameHeight = gameBoard.height; // the height of the canvas
const boardBackground = "white"; // color of the canvas
const snakeColor = "lightgreen"; // color of the snake
const snakeBorder = "black"; // snake's border (the squares' border)
const foodColor = "red"; // color of the food
const unitSize = 25; // size of each unit (snake and food)
let running = false; // boolean that keeps track of whether the game is running or not
let xVelocity = unitSize; // horizontal velocity of the snake
let yVelocity = 0; // vertical velocity of the snake
let foodX; // X cordinates of the food on the game
let foodY; // Y cordinates of the food on the game
let score = 0; // player's current score
let snake = [ // array that stores x and y cordinates of each part of the snake
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];

window.addEventListener("keydown", changeDirection); // keydown event listener for the snake's movement
resetBtn.addEventListener("click", resetGame); // click event on the reset buton to reset the game

gameStart(); // calls the gameStart function

function gameStart(){ //the function sets the running to true. Initializes the score. Calls createFood(), drawFood(), nextTick()
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
};
function nextTick(){ 
    if(running){ // if running is true, the functions below will be executed. 
        setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75); // the function will call itself every 75 milliseconds
    }
    else{ // if the game is over, it calls the displayGameOver() function
        displayGameOver(); 
    }
};
function clearBoard(){ 
    ctx.fillStyle = boardBackground; //sets the color that will be used to fill the rectangle
    ctx.fillRect(0, 0, gameWidth, gameHeight); // Prepares the canvas for a new frame of animation. Draws a rectangle that covers the whole canvas
};
function createFood() {
    function randomFood(min, max) {
      // Generate a random number that is a multiple of unitSize
      const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
      return randNum;
    }
  
    // Generate new random coordinates for the food that are aligned to the grid of the game board
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
  
    // Check if the food is overlapping with the snake
    for (let i = 0; i < snake.length; i++) {
      if (foodX === snake[i].x && foodY === snake[i].y) {
        // If the food is overlapping with the snake, generate new coordinates
        createFood();
        return;
      }
    }
  }

  function drawFood() {
    ctx.fillStyle = foodColor;
    // Set the center of the circle to the coordinates of the food
    const centerX = foodX + unitSize / 2;
    const centerY = foodY + unitSize / 2;
    // Set the radius of the circle to half of the unit size
    const radius = unitSize / 2;
    ctx.beginPath();
    // Draw a full circle with the arc method
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
function moveSnake() {
    // Update the position of the snake
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  
    snake.unshift(head);
  
    // Check if the snake has eaten the food
    if (snake[0].x === foodX && snake[0].y === foodY) {
      score += 1;
      scoreText.textContent = score;
      createFood();
    } else {
      snake.pop();
    }
  }
  function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
      // Set the fill color for the snake body
      ctx.fillStyle = snakeColor;
      // Draw a filled rectangle for each element of the snake
      ctx.fillRect(snake[i].x, snake[i].y, unitSize, unitSize);
      // Set the stroke color for the snake border
      ctx.strokeStyle = snakeBorder;
      // Draw a border around each element of the snake
      ctx.strokeRect(snake[i].x, snake[i].y, unitSize, unitSize);      
    }
  }
function changeDirection(event){
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch(true){ // switch statement to check for various cases in which the direction of the game object should be changed
        case(keyPressed == LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case(keyPressed == RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
};
function checkGameOver(){ // checks if the game should end due to the snake running off the edge of the canvas
    switch(true){
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
                running = false;
                break;
    }
    for(let i = 1; i < snake.length; i+=1){ // a loop to check  if the snake has colided with itself
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }
    }
};
function displayGameOver(){
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;
};
function resetGame(){
    running = false;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [        
        {x:unitSize * 4, y:0},        
        {x:unitSize * 3, y:0},        
        {x:unitSize * 2, y:0},        
        {x:unitSize, y:0},        
        {x:0, y:0}    
    ];
    score = 0;
    scoreText.textContent = score;
    createFood();
    nextTick();
    gameStart();
}


