export type Board = number[][];

const BLANK = 0;

export function generateSudoku(difficulty: number = 40): { puzzle: Board, solution: Board } {
  const board = Array(9).fill(null).map(() => Array(9).fill(BLANK));
  fillBoard(board);
  const solution = board.map(row => [...row]);
  
  const puzzle = board.map(row => [...row]);
  let cellsToRemove = difficulty;
  
  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== BLANK) {
      puzzle[row][col] = BLANK;
      cellsToRemove--;
    }
  }
  
  return { puzzle, solution };
}

function fillBoard(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === BLANK) {
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of numbers) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) {
              return true;
            }
            board[row][col] = BLANK;
          }
        }
        return false;
      }
    }
  }
  return true;
}

export function isValid(board: Board, row: number, col: number, num: number): boolean {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num && i !== col) return false;
  }
  // Check col
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num && i !== row) return false;
  }
  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num && (startRow + i !== row || startCol + j !== col)) {
        return false;
      }
    }
  }
  return true;
}

function shuffle(array: number[]): number[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function checkWin(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === BLANK || !isValid(board, row, col, board[row][col])) {
        return false;
      }
    }
  }
  return true;
}

export function findConflicts(board: Board): { row: number, col: number }[] {
  const conflicts: { row: number, col: number }[] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== BLANK && !isValid(board, row, col, board[row][col])) {
        conflicts.push({ row, col });
      }
    }
  }
  return conflicts;
}
