## Why

The current sudoku game allows unlimited invalid moves without consequence, reducing challenge and game difficulty. Players need meaningful feedback and consequences for rule violations to increase engagement and test their analytical skills. Implementing a strike system (3 invalid moves = game over) creates a challenging, structured game experience similar to professional sudoku games.

## What Changes

- Add strike counter tracking invalid Sudoku rule violations
- Display visual strike counter and instruction text ("Game ends after 3 invalid moves")
- Validate all number inputs against Sudoku rules (row, column, 3x3 box)
- Trigger "Game Over" alert and disable all game inputs when 3 strikes reached
- Reset strike counter on new game start
- Update game state management to include strike count and game-over status

## Capabilities

### New Capabilities

- `strike-system`: Tracks invalid moves, ends game after 3 violations. Includes strike counter UI display, real-time validation, game-over modal, and input locking mechanism.

### Modified Capabilities

- `game-state-management`: Extended to include `invalidMoves` counter and `isGameOver` flag
- `user-input-handling`: Now validates moves against Sudoku rules before accepting placement
- `game-ui`: Added strike counter display, instruction text, and game-over overlay modal

## Impact

- **Code**: Primarily [src/App.tsx](src/App.tsx) - state management, input handlers, UI components
- **Dependencies**: None (uses existing validation utilities from `src/utils/sudoku.ts`)
- **User Experience**: Game becomes more challenging and structured with clear rules and consequences
- **Breaking Changes**: Existing `handleNumberInput()` behavior changes - now rejects invalid moves instead of accepting them
