//main.js
// Canvas
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let interval = null

// Calculate size of canvas from constants.
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;



// Scale blocks
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);


// Pieces
let width = 1;
let height = 1;
ctx.fillStyle = 'red';
ctx.fillRect(5, 7, width, height);
ctx.fillStyle = 'blue';
ctx.fillRect(4, 12, width, height);

var wait = (ms) => {
  const start = Date.now();
  let now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}


function play() {
  board = new Board(ctx);
  console.table(board.grid);
  global_board = board;
  interval = setInterval(board.move.bind(board), wait_time, "d");
  requestAnimationFrame(board.nextBoard.bind(board));
}

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key) {
    case "ArrowDown":
      wait_time = 50;
      break;
    case "ArrowUp":
      global_board.move("u");
      break;
    case "ArrowLeft":
      global_board.move("l");
      break;
    case "ArrowRight":
      global_board.move("r");
      break;
    case "Escape":
      exit = true;
      break;
    case "c":
      global_board.drop();
      break;
    case "q":
      play();


    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);
