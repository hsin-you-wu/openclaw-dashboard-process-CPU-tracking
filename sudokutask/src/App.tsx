import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateSudoku, checkWin, findConflicts, Board } from './utils/sudoku';
import { RefreshCw, Delete } from 'lucide-react';

export default function App() {
  const [initialBoard, setInitialBoard] = useState<Board>([]);
  const [board, setBoard] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [conflicts, setConflicts] = useState<{row: number, col: number}[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [invalidMoveCount, setInvalidMoveCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const previousConflictsRef = useRef<Set<string>>(new Set());

  const startNewGame = useCallback(() => {
    const { puzzle } = generateSudoku(45); // Medium difficulty
    setInitialBoard(puzzle.map(row => [...row]));
    setBoard(puzzle.map(row => [...row]));
    setSelectedCell(null);
    setConflicts([]);
    setIsWon(false);
    setInvalidMoveCount(0);
    setIsGameOver(false);
    previousConflictsRef.current = new Set();
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (board.length > 0) {
      const currentConflicts = findConflicts(board);
      const currentConflictsSet = new Set(currentConflicts.map(c => `${c.row},${c.col}`));
      const previousConflicts = previousConflictsRef.current;
      
      // Count new conflicts (invalid moves)
      let newConflictCount = 0;
      for (const conflict of currentConflictsSet) {
        if (!previousConflicts.has(conflict)) {
          newConflictCount++;
        }
      }
      
      // Update invalid move count if there are new conflicts
      if (newConflictCount > 0) {
        setInvalidMoveCount(prev => {
          const newCount = Math.min(prev + newConflictCount, 3);
          if (newCount >= 3) {
            setIsGameOver(true);
          }
          return newCount;
        });
      }
      
      // Update previous conflicts for next comparison
      previousConflictsRef.current = currentConflictsSet;
      setConflicts(currentConflicts);
      
      if (currentConflicts.length === 0 && checkWin(board)) {
        setIsWon(true);
      } else {
        setIsWon(false);
      }
    }
  }, [board]);

  const handleCellClick = (row: number, col: number) => {
    if (isWon) return;
    setSelectedCell([row, col]);
  };

  const handleInput = useCallback((num: number) => {
    if (!selectedCell || isWon || isGameOver) return;
    const [row, col] = selectedCell;
    if (initialBoard[row][col] !== 0) return; // Cannot edit initial cells

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);
  }, [board, initialBoard, selectedCell, isWon, isGameOver]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isWon || isGameOver) return;
    
    if (e.key >= '1' && e.key <= '9') {
      handleInput(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      handleInput(0);
    } else if (selectedCell) {
      let [row, col] = selectedCell;
      if (e.key === 'ArrowUp') row = Math.max(0, row - 1);
      if (e.key === 'ArrowDown') row = Math.min(8, row + 1);
      if (e.key === 'ArrowLeft') col = Math.max(0, col - 1);
      if (e.key === 'ArrowRight') col = Math.min(8, col + 1);
      setSelectedCell([row, col]);
    }
  }, [handleInput, selectedCell, isWon, isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (board.length === 0) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center py-8 px-4 font-sans text-stone-900">
      <div className="max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-800">Sudoku</h1>
            <div className="text-sm text-stone-600 mt-1">
              Invalid Moves: <span className={invalidMoveCount >= 3 ? 'text-red-600 font-semibold' : ''}>{invalidMoveCount}/3</span>
            </div>
          </div>
          <button 
            onClick={startNewGame}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg shadow-sm hover:bg-stone-50 transition-colors text-sm font-medium text-stone-700 cursor-pointer"
          >
            <RefreshCw size={16} />
            New Game
          </button>
        </div>

        <div className="bg-white p-1 sm:p-2 rounded-xl shadow-sm border border-stone-200 mb-6">
          <div className="grid grid-cols-3 gap-0.5 sm:gap-1 bg-stone-800 border-2 border-stone-800">
            {Array(9).fill(null).map((_, boxIndex) => (
              <div key={boxIndex} className="grid grid-cols-3 gap-px bg-stone-300">
                {Array(9).fill(null).map((_, cellIndex) => {
                  const rowIndex = Math.floor(boxIndex / 3) * 3 + Math.floor(cellIndex / 3);
                  const colIndex = (boxIndex % 3) * 3 + (cellIndex % 3);
                  const cell = board[rowIndex][colIndex];
                  const isInitial = initialBoard[rowIndex][colIndex] !== 0;
                  const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
                  const isConflict = conflicts.some(c => c.row === rowIndex && c.col === colIndex);
                  
                  let isHighlighted = false;
                  let isSameNumber = false;
                  if (selectedCell) {
                    const [selRow, selCol] = selectedCell;
                    if (rowIndex === selRow || colIndex === selCol) isHighlighted = true;
                    if (Math.floor(rowIndex / 3) === Math.floor(selRow / 3) && Math.floor(colIndex / 3) === Math.floor(selCol / 3)) isHighlighted = true;
                    if (cell !== 0 && board[selRow][selCol] === cell) isSameNumber = true;
                  }

                  let bgClass = 'bg-white';
                  if (isSelected) bgClass = 'bg-indigo-200';
                  else if (isConflict) bgClass = 'bg-red-200';
                  else if (isSameNumber) bgClass = 'bg-indigo-100';
                  else if (isHighlighted) bgClass = 'bg-stone-100';

                  let textClass = 'text-stone-900';
                  if (isConflict) textClass = 'text-red-600';
                  else if (!isInitial) textClass = 'text-indigo-600';

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className={`
                        aspect-square flex items-center justify-center text-xl sm:text-2xl cursor-pointer select-none transition-colors
                        ${bgClass}
                        ${isInitial ? 'font-semibold' : 'font-medium'}
                        ${textClass}
                      `}
                    >
                      {cell !== 0 ? cell : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {isGameOver && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-800 rounded-lg text-center font-medium">
            Game Over! You've made 3 invalid moves. Click "New Game" to try again.
          </div>
        )}

        {isWon && (
          <div className="mb-6 p-4 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg text-center font-medium">
            Congratulations! You solved the puzzle!
          </div>
        )}

        {/* Number Pad */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleInput(num)}
              disabled={isWon || isGameOver}
              className="aspect-square flex items-center justify-center text-xl font-medium bg-white border border-stone-200 rounded-lg shadow-sm hover:bg-stone-50 active:bg-stone-100 disabled:opacity-50 transition-colors text-stone-700 cursor-pointer"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleInput(0)}
            disabled={isWon || isGameOver}
            className="aspect-square flex items-center justify-center bg-white border border-stone-200 rounded-lg shadow-sm hover:bg-stone-50 active:bg-stone-100 disabled:opacity-50 transition-colors text-stone-700 cursor-pointer"
            aria-label="Delete"
          >
            <Delete size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
