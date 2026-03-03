## 1. State Management Setup

- [ ] 1.1 Add `invalidMoves` state variable (number, initialized to 0) in App component
- [ ] 1.2 Add `isGameOver` state variable (boolean, initialized to false) in App component
- [ ] 1.3 Update `startNewGame()` to reset `invalidMoves` to 0 and `isGameOver` to false

## 2. Move Validation Implementation

- [ ] 2.1 Import `isValid` function from `src/utils/sudoku.ts` (should already be available)
- [ ] 2.2 Update `handleNumberInput()` to validate placement before accepting
- [ ] 2.3 Implement strike increment logic: when `isValid()` returns false, increment `invalidMoves`
- [ ] 2.4 Check if `invalidMoves >= 3` and set `isGameOver = true` and show alert when threshold reached
- [ ] 2.5 Prevent board state update if move is invalid (return early from function)

## 3. Strike Counter UI Display

- [ ] 3.1 Add instruction text in header: "Game ends after 3 invalid moves" (smaller, italic text)
- [ ] 3.2 Create three visual dots (inline circles) to show strike status:
  - [ ] 3.2a Dots are gray empty when no strikes
  - [ ] 3.2b Dots turn red filled as strikes accumulate
  - [ ] 3.2c Update dots reactively as `invalidMoves` state changes
- [ ] 3.3 Add text label "Invalid Moves: X/3" next to the dots
- [ ] 3.4 Place strike counter visually near "Mistakes:" label in header area

## 4. Game Over Modal

- [ ] 4.1 Create game-over modal using AnimatePresence and motion components (match win modal pattern)
- [ ] 4.2 Add error/red styling: red border, red header background, or red icon
- [ ] 4.3 Add ✕ symbol or icon in modal header
- [ ] 4.4 Set modal title to "Game Over!"
- [ ] 4.5 Add explanatory message: "You reached 3 invalid moves. Better luck next time!"
- [ ] 4.6 Add "Try Again" button that calls `startNewGame()`
- [ ] 4.7 Apply same backdrop blur and overlay styling as win modal

## 5. Input Disabling

- [ ] 5.1 Update `handleCellClick()` to return early if `isGameOver === true`
- [ ] 5.2 Update `handleNumberInput()` to return early if `isGameOver === true`
- [ ] 5.3 Update keyboard event listener in useEffect to check `isGameOver` and return if true
- [ ] 5.4 Add `disabled` attribute to number buttons (1-9) when `isGameOver === true`
- [ ] 5.5 Add `disabled` attribute to clear button when `isGameOver === true`
- [ ] 5.6 Apply opacity reduction styling (opacity-50) to disabled buttons via className
- [ ] 5.7 Add cursor-not-allowed styling to disabled buttons

## 6. Testing & Verification

- [ ] 6.1 Test invalid move detection: attempt to place duplicate number in same row → should increment counter
- [ ] 6.2 Test invalid move detection: attempt to place duplicate in same column → should increment counter
- [ ] 6.3 Test invalid move detection: attempt to place duplicate in same 3x3 box → should increment counter
- [ ] 6.4 Test three strikes: make 3 invalid moves → verify Game Over modal appears
- [ ] 6.5 Test input disabling: after game over, verify number buttons don't work
- [ ] 6.6 Test keyboard disabling: after game over, verify keyboard input (1-9, backspace) doesn't work
- [ ] 6.7 Test reset: click "Try Again" → verify counter resets to 0 and game is playable
- [ ] 6.8 Test new game reset: select new difficulty → verify counter resets to 0
- [ ] 6.9 Verify UI updates correctly: dots fill as strikes increase, counter text updates
- [ ] 6.10 Test on different difficulty levels: verify strike system works on Easy/Medium/Hard
