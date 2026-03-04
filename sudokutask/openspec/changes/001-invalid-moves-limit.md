# End Game After 3 Invalid Moves

## Proposal ID
001-invalid-moves-limit

## Status
Proposed

## Problem
Currently, players can make unlimited invalid moves without any penalty. This reduces the challenge and engagement of the sudoku game.

## Solution
Implement a 3-strikes system where:
1. Track the number of invalid moves (entries that create conflicts)
2. Display a UI counter showing remaining invalid moves allowed
3. End the game with a "Game Over" alert when 3 invalid moves are reached
4. Reset the invalid move counter when starting a new game

## Implementation Details

### Changes to App.tsx
- Add state for `invalidMoveCount`
- Update `handleInput` to detect invalid moves and increment the counter
- Add condition to check if `invalidMoveCount >= 3` to end the game
- Display the invalid move counter in the UI

### Changes to sudoku.ts
- Add helper function `hasInvalidInput(board, previousBoard, row, col)` to detect if a new entry creates a conflict

## UI Changes
- Show invalid move counter near the score/game header
- Display game-over alert when 3 invalid moves are reached
- Counter displays in format: "Invalid Moves: 0/3"

## Acceptance Criteria
- ✅ Game ends after 3 invalid moves
- ✅ UI displays counter of invalid moves (e.g., "1/3", "2/3", "3/3")
- ✅ Game-over alert displays when invalid move limit is reached
- ✅ Invalid move counter resets on new game
- ✅ Invalid moves only counted when they create actual conflicts

## Non-goals
- Not changing difficulty selection
- Not storing player statistics
- Not implementing different game modes
