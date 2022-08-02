//board.js
let wait_time = 300;
let global_board = null;
let exit = false;
class Board {
  constructor(ctx) {
    this.ctx = ctx;
    this.grid = this.getEmptyBoard();
    this.x = 0;
    this.y = 0;

    this.current_piece = null;
  }

  getEmptyBoard() {
    return Array.from(
      { length: ROWS }, () => Array(COLS).fill(0)); // Array of rows containing array of columns
  }

  nextBoard() {
    const { width, height } = this.ctx.canvas;
    ctx.clearRect(0, 0, width, height);
    if (this.current_piece)
      this.printPiece(this.current_piece);
    this.printGrid();
    // ctx.fillStyle = 'blue';


    if (this.current_piece != null) {
      // this.move("d");
      // setTimeout(this.mover, 1000, "d");
      // setInterval(this.move.bind(this), 1000, "d");
      // setTimeout(function() {move("d")}, 2000);

    } else {
      this.current_piece = generateRandomPiece();
    }

    // Loop
    if (!exit) {
      requestAnimationFrame(this.nextBoard.bind(this));
    }
  }

  move(dir) {
    if (!this.current_piece)
      return;
    switch (dir) {
      case "d":
        this.current_piece.next();
        break;
      case "u":
        if (this.current_piece.index == 3) {
          this.current_piece.index = 0;
        } else {
          this.current_piece.index++;
        }
        this.current_piece.shape = this.current_piece.list[this.current_piece.index];
        break;
      case "l":
        this.current_piece.x--;
        break;
      case "r":
        this.current_piece.x++;
        break;
    }
    // Check collision
    if (this.checkCollision(this.current_piece)) {
      switch (dir) {
        case "d":
          this.current_piece.y--;
          this.updateGrid(this.current_piece);
          if (this.current_piece.y == 0) {
            console.log("Game over");
            return;
          }
          this.current_piece = null;
          break;
        case "u":
          if (this.current_piece.index == 0) {
            this.current_piece.index = 3;
          } else {
            this.current_piece.index--;
          }
          this.current_piece.shape = this.current_piece.list[this.current_piece.index];
          break;
        case "l":
          this.current_piece.x++;
          break;
        case "r":
          this.current_piece.x--;
          break;
      }

    }
  }

  printPiece(piece) {
    for (let i = 0, len = piece.shape.length; i < len; i++) {
      if (piece.shape[i] != 0) {
        // Print
        ctx.fillStyle = Object.values(colors)[piece.shape[i] - 1];
        ctx.fillRect(piece.x + (i % 4), piece.y + (Math.floor(i / 4)), 1, 1);
      }
    }
  }

  checkCollision(piece) {
    for (let i = 0, len = piece.shape.length; i < len; i++) {
      if (piece.shape[i] != 0) {
        if (piece.y + (Math.floor(i / 4)) >= ROWS) {
          return true;
        }
        if (this.grid[piece.y + (Math.floor(i / 4))][piece.x + (i % 4)] != 0) {
          return true;
        }
      }
    }
    return false;
  }

  updateGrid(piece) {
    for (let i = 0, len = piece.shape.length; i < len; i++) {
      if (piece.shape[i] != 0) {
        this.grid[piece.y + (Math.floor(i / 4))][piece.x + (i % 4)] = piece.shape[i];
      }
    }
    // Clean lines
    let full = true;
    for (let i = 0, len = ROWS; i < len; i++) {
      full = true;
      for (let j = 0, len = COLS; j < len; j++) {
        if (this.grid[i][j] == 0) {
          full = false;
        }
      }
      if (full) {
        let c = i - 1;
        while (c >= 0) {
          array_move(this.grid, c, c + 1);
          c--;
        }
        this.grid[0] = new Array(COLS).fill(0);
      }
    }
  }

  printGrid() {
    for (let i = 0, len = this.grid.length; i < len; i++) {
      for (let j = 0, len = this.grid[i].length; j < len; j++) {
        if (this.grid[i][j] != 0) {
          ctx.fillStyle = 'grey';
          ctx.fillRect(j, i, 1, 1);
        }
      }
    }
  }

  drop() {
    while (1) {
      this.current_piece.next();
      // Check collision
      if (this.checkCollision(this.current_piece)) {
        this.current_piece.y--;
        this.updateGrid(this.current_piece);
        if (this.current_piece.y == 0) {
          console.log("Game over");
          return;
        }
        this.current_piece = null;
        break;

      }
    }
  }
}



function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
};