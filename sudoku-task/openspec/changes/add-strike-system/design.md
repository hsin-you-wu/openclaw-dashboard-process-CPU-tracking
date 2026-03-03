## Context

The sudoku application is a React-based puzzle game with state management in App.tsx. Currently, the game tracks `mistakes` (incorrect final answers) but does not validate moves against Sudoku rules in real-time. The app uses `isValid()` utility from `src/utils/sudoku.ts` to validate placements according to row/column/3x3 box constraints. Game state includes: board state, selected cell, game won status, and timer.

## Goals / Non-Goals

**Goals:**
- Implement real-time validation that rejects invalid Sudoku moves
- Track and display invalid move count (strikes) visually 
- End game and disable inputs when 3 invalid moves are reached
- Display clear game-over modal with messaging
- Persist strike count across game session; reset on new game
- Maintain existing game mechanics (selection, win detection, timer)

**Non-Goals:**
- Change difficulty settings or board generation
- Modify win condition logic or final scoring
- Add animations beyond existing motion library
- Create different strike thresholds (always 3)
- Implement online multiplayer or leaderboards

## Decisions

**1. Strike Tracking via React State**
- *Decision*: Use `invalidMoves` state variable (number 0-3) in App component
- *Rationale*: Lightweight, no external dependencies, simple to reset and display
- *Alternative Considered*: Redux store (overkill for single number value)

**2. Validation on Input, Not Placement**
- *Decision*: Validate number against `isValid(board, row, col, num)` BEFORE updating board state
- *Rationale*: Prevents invalid state pollution, clear cause-effect feedback to user
- *Alternative Considered*: Accept move but highlight as error (less strict, doesn't teach rules)

**3. Game-Over as Modal Overlay**
- *Decision*: Display AnimatePresence modal (matching existing win screen pattern) with disabled inputs
- *Rationale*: Consistent UI pattern, clear visual separation, prevents accidental continued play
- *Alternative Considered*: Toast notification (less authoritative, game could continue)

**4. Pre-Move Rejection Over Post-Move Feedback**
- *Decision*: Immediately reject invalid input; do not place number or increment strike on UI attempt
- *Rationale*: Cleaner UX (no need to erase invalid placements), clearer rule feedback
- *Alternative Considered*: Allow placement then show error indicator (more work for user)

## Risks / Trade-offs

**[Risk] Strictness may frustrate new players** 
→ *Mitigation*: Clear instruction text ("Game ends after 3 invalid moves") + visual strike counter helps expectations

**[Risk] Input validation overhead**
→ *Mitigation*: `isValid()` is O(1) operationally (max 27 checks per move); negligible performance cost

**[Risk] Game state complexity**
→ *Mitigation*: Only 2 new state variables (`invalidMoves`, `isGameOver`); no restructuring needed

**[Trade-off] Breaking change to input behavior**
→ Previous behavior silently accepted invalid moves; now they are rejected with strike penalty. Users familiar with prior behavior may need adjustment.
