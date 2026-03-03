/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, CheckCircle2, AlertCircle, Trophy, Eraser, Lightbulb } from 'lucide-react';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

const DIFFICULTY_LEVELS: Record<Difficulty, number> = {
  Easy: 35,
  Medium: 45,
  Hard: 55,
};

type Board = (number | null)[][];

export default function App() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [solution, setSolution] = useState<number[][]>([]);
  const [initialBoard, setInitialBoard] = useState<boolean[][]>(Array(9).fill(false).map(() => Array(9).fill(false)));
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [isWon, setIsWon] = useState(false);
  const [errors, setErrors] = useState<boolean[][]>(Array(9).fill(false).map(() => Array(9).fill(false)));
  const [invalidMoves, setInvalidMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Sudoku Logic
  const isValid = (grid: (number | null)[][], row: number, col: number, num: number) => {
    for (let x = 0; x < 9; x++) if (grid[row][x] === num) return false;
    for (let x = 0; x < 9; x++) if (grid[x][col] === num) return false;
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) return false;
      }
    }
    return true;
  };

  const solveSudoku = (grid: (number | null)[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (solveSudoku(grid)) return true;
              grid[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const generateFullBoard = (): number[][] => {
    const grid: (number | null)[][] = Array(9).fill(null).map(() => Array(9).fill(null));
    // Fill diagonal 3x3 boxes first for faster generation
    for (let i = 0; i < 9; i += 3) {
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
      let idx = 0;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          grid[i + r][i + c] = nums[idx++];
        }
      }
    }
    solveSudoku(grid);
    return grid as number[][];
  };

  const startNewGame = useCallback(() => {
    const fullBoard = generateFullBoard();
    setSolution(fullBoard);
    
    const puzzle: Board = fullBoard.map(row => [...row]);
    const initial: boolean[][] = Array(9).fill(false).map(() => Array(9).fill(false));
    
    let cellsToRemove = DIFFICULTY_LEVELS[difficulty];
    while (cellsToRemove > 0) {
      const r = Math.floor(Math.random() * 9);
      const c = Math.floor(Math.random() * 9);
      if (puzzle[r][c] !== null) {
        puzzle[r][c] = null;
        cellsToRemove--;
      }
    }

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (puzzle[r][c] !== null) initial[r][c] = true;
      }
    }

    setBoard(puzzle);
    setInitialBoard(initial);
    setSelectedCell(null);
    setIsWon(false);
    setErrors(Array(9).fill(false).map(() => Array(9).fill(false)));
    setInvalidMoves(0);
    setIsGameOver(false);
  }, [difficulty]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleCellClick = (r: number, c: number) => {
    if (isWon || isGameOver) return;
    setSelectedCell([r, c]);
  };

  const handleNumberInput = (num: number | null) => {
    if (!selectedCell || isWon || isGameOver) return;
    const [r, c] = selectedCell;
    if (initialBoard[r][c]) return;

    // Validate move against Sudoku rules if placing a number
    if (num !== null) {
      if (!isValid(board, r, c, num)) {
        // Invalid move - increment strike counter
        const newInvalidMoves = invalidMoves + 1;
        setInvalidMoves(newInvalidMoves);
        
        if (newInvalidMoves >= 3) {
          setIsGameOver(true);
          alert('Game Over! You reached 3 invalid moves.');
        }
        return; // Don't place the invalid number
      }
    }

    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = num;
    setBoard(newBoard);

    // Check for errors
    const newErrors = Array(9).fill(false).map(() => Array(9).fill(false));
    let hasError = false;
    if (num !== null && num !== solution[r][c]) {
      newErrors[r][c] = true;
      hasError = true;
    }
    setErrors(newErrors);

    // Check win condition
    const isComplete = newBoard.every((row, ri) => 
      row.every((cell, ci) => cell === solution[ri][ci])
    );
    if (isComplete) setIsWon(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isWon || isGameOver) return;
    if (e.key >= '1' && e.key <= '9') {
      handleNumberInput(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      handleNumberInput(null);
    } else if (e.key.startsWith('Arrow')) {
      if (!selectedCell) {
        setSelectedCell([0, 0]);
        return;
      }
      const [r, c] = selectedCell;
      if (e.key === 'ArrowUp') setSelectedCell([Math.max(0, r - 1), c]);
      if (e.key === 'ArrowDown') setSelectedCell([Math.min(8, r + 1), c]);
      if (e.key === 'ArrowLeft') setSelectedCell([r, Math.max(0, c - 1)]);
      if (e.key === 'ArrowRight') setSelectedCell([r, Math.min(8, c + 1)]);
    }
  };

  const getHint = () => {
    if (!selectedCell || isWon) return;
    const [r, c] = selectedCell;
    if (initialBoard[r][c]) return;
    
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = solution[r][c];
    setBoard(newBoard);
    
    // Mark as initial so it can't be changed
    const newInitial = initialBoard.map(row => [...row]);
    newInitial[r][c] = true;
    setInitialBoard(newInitial);
    
    setErrors(Array(9).fill(false).map(() => Array(9).fill(false)));
    
    // Check win condition
    const isComplete = newBoard.every((row, ri) => 
      row.every((cell, ci) => cell === solution[ri][ci])
    );
    if (isComplete) setIsWon(true);
  };

  return (
    <div 
      className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans flex flex-col items-center justify-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-5xl font-light tracking-tighter text-[#1A1A1A]">Sudoku</h1>
          <div className="flex items-center space-x-4">
            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`text-xs uppercase tracking-widest px-2 py-1 transition-all ${
                  difficulty === level 
                    ? 'border-b-2 border-[#1A1A1A] font-bold' 
                    : 'text-[#9E9E9E] hover:text-[#1A1A1A]'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#9E9E9E] italic mt-2">Game ends after 3 invalid moves</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`inline-block w-2 h-2 rounded-full ${invalidMoves >= 1 ? 'bg-red-500' : 'bg-neutral-300'}`}></span>
            <span className={`inline-block w-2 h-2 rounded-full ${invalidMoves >= 2 ? 'bg-red-500' : 'bg-neutral-300'}`}></span>
            <span className={`inline-block w-2 h-2 rounded-full ${invalidMoves >= 3 ? 'bg-red-500' : 'bg-neutral-300'}`}></span>
            <span className="text-[#9E9E9E] text-xs ml-2">Invalid Moves: {invalidMoves}/3</span>
          </div>
        </div>

        {/* Board */}
        <div className="relative aspect-square bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden p-1">
          <div className="grid grid-cols-9 h-full">
            {board.map((row, r) => (
              row.map((cell, c) => {
                const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
                const isSameSubgrid = selectedCell && 
                  Math.floor(r / 3) === Math.floor(selectedCell[0] / 3) && 
                  Math.floor(c / 3) === Math.floor(selectedCell[1] / 3);
                const isSameRowOrCol = selectedCell && (r === selectedCell[0] || c === selectedCell[1]);
                const isInitial = initialBoard[r][c];
                const isError = errors[r][c];
                const isSameValue = selectedCell && board[selectedCell[0]][selectedCell[1]] !== null && 
                  board[selectedCell[0]][selectedCell[1]] === cell;

                return (
                  <motion.div
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`
                      relative flex items-center justify-center text-2xl cursor-pointer transition-colors
                      ${(c + 1) % 3 === 0 && c !== 8 ? 'border-r-2 border-[#1A1A1A]/10' : 'border-r border-[#F0F0F0]'}
                      ${(r + 1) % 3 === 0 && r !== 8 ? 'border-b-2 border-[#1A1A1A]/10' : 'border-b border-[#F0F0F0]'}
                      ${isSelected ? 'bg-[#1A1A1A] text-white' : 
                        isSameValue ? 'bg-[#1A1A1A]/20' :
                        isSameSubgrid || isSameRowOrCol ? 'bg-[#F9F9F9]' : 'bg-white'}
                      ${isInitial ? 'font-semibold' : 'font-light text-[#4A4A4A]'}
                      ${isError ? 'text-red-500' : ''}
                    `}
                    whileHover={{ scale: 0.98 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {cell}
                    {isError && (
                      <div className="absolute top-1 right-1">
                        <AlertCircle size={10} className="text-red-400" />
                      </div>
                    )}
                  </motion.div>
                );
              })
            ))}
          </div>

          <AnimatePresence>
            {isWon && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 z-10"
              >
                <motion.div
                  initial={{ scale: 0.5, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="bg-[#1A1A1A] text-white p-6 rounded-full"
                >
                  <Trophy size={48} />
                </motion.div>
                <h2 className="text-3xl font-light tracking-tight">Magnificent!</h2>
                <p className="text-[#9E9E9E] text-sm">You've mastered the grid.</p>
                <button
                  onClick={startNewGame}
                  className="mt-4 px-8 py-3 bg-[#1A1A1A] text-white rounded-full text-sm font-medium hover:bg-opacity-90 transition-all flex items-center space-x-2"
                >
                  <RefreshCw size={16} />
                  <span>New Challenge</span>
                </button>
              </motion.div>
            )}
            {isGameOver && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 z-10 border-2 border-red-300 rounded-2xl"
              >
                <motion.div
                  initial={{ scale: 0.5, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="bg-red-100 text-red-600 p-6 rounded-full"
                >
                  <span className="text-5xl font-bold">✕</span>
                </motion.div>
                <h2 className="text-3xl font-light tracking-tight text-red-600">Game Over!</h2>
                <p className="text-[#9E9E9E] text-sm">You reached 3 invalid moves. Better luck next time!</p>
                <button
                  onClick={startNewGame}
                  className="mt-4 px-8 py-3 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-all flex items-center space-x-2"
                >
                  <RefreshCw size={16} />
                  <span>Try Again</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberInput(num)}
              disabled={isGameOver}
              className={`h-12 bg-white rounded-xl border border-[#E5E5E5] flex items-center justify-center text-xl font-light hover:bg-[#1A1A1A] hover:text-white transition-all shadow-sm ${isGameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleNumberInput(null)}
            disabled={isGameOver}
            className={`h-12 bg-white rounded-xl border border-[#E5E5E5] flex items-center justify-center text-[#9E9E9E] hover:bg-red-50 hover:text-red-500 transition-all shadow-sm ${isGameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Clear Cell"
          >
            <Eraser size={20} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={startNewGame}
            className="flex items-center space-x-2 text-[#9E9E9E] hover:text-[#1A1A1A] transition-colors text-sm"
          >
            <RefreshCw size={18} />
            <span>New Game</span>
          </button>
          <div className="flex items-center space-x-6">
            <button
              onClick={getHint}
              className="flex items-center space-x-2 text-[#9E9E9E] hover:text-[#1A1A1A] transition-colors text-sm"
              disabled={!selectedCell || isWon}
            >
              <Lightbulb size={18} />
              <span>Hint</span>
            </button>
            <div className="flex items-center space-x-2 text-[#9E9E9E] text-sm">
              <CheckCircle2 size={18} />
              <span>Auto-Check</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-12 text-[#9E9E9E] text-[10px] uppercase tracking-[0.2em] font-medium">
        Use keyboard 1-9 to input • Arrows to navigate • Backspace to clear
      </div>
    </div>
  );
}
