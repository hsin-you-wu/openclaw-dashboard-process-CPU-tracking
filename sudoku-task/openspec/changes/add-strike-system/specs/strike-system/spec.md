## ADDED Requirements

### Requirement: Track invalid moves
The system SHALL maintain a count of invalid Sudoku rule violations (strikes) during the current game session. The strike counter SHALL be initialized to 0 at game start and incremented by 1 each time a player attempts to place a number that violates Sudoku rules.

#### Scenario: Counter increments on invalid placement
- **WHEN** player attempts to place a number that conflicts with row/column/3x3 box rules
- **THEN** strike counter increments by 1 and the invalid move is rejected (not placed on board)

#### Scenario: Counter resets on new game
- **WHEN** player starts a new game
- **THEN** strike counter resets to 0

### Requirement: Display strike counter visually
The system SHALL display the strike counter to the player with a visual indicator showing current strikes out of the maximum (3).

#### Scenario: Visual indicator updates
- **WHEN** strike counter changes (increments or resets)
- **THEN** visual indicator (dot display) updates to show 0-3 filled red dots matching current score

#### Scenario: Invalid moves label displays
- **WHEN** game is active
- **THEN** text label "Invalid Moves: X/3" is visible in the game header alongside strike counter dots

### Requirement: Display strike system instruction text
The system SHALL display clear instruction text informing the player that the game will end after 3 invalid moves.

#### Scenario: Instruction text is visible
- **WHEN** game loads or new game starts
- **THEN** text "Game ends after 3 invalid moves" appears in the game header area

### Requirement: End game on three strikes
The system SHALL end the game and disable all player input when the strike counter reaches 3.

#### Scenario: Game over at third strike
- **WHEN** player makes the third invalid move (strike counter reaches 3)
- **THEN** game state becomes "over", all input buttons are disabled, and a "Game Over" modal appears

#### Scenario: Game over modal displays
- **WHEN** game ends due to 3 strikes
- **THEN** a modal overlay appears with: title "Game Over!", message about reaching 3 invalid moves, and "Try Again" button

#### Scenario: Inputs disabled after game over
- **WHEN** game is in "over" state
- **THEN** number buttons, clear button, cell selection, and keyboard input are all disabled and visually appear inactive (reduced opacity, cursor: not-allowed)

### Requirement: Reset strike system on new game
The system SHALL completely reset the strike system when the player initiates a new game.

#### Scenario: New game clears strikes
- **WHEN** player clicks "New Game" button or selects a difficulty level
- **THEN** strike counter resets to 0, isGameOver flag resets to false, UI re-enables, and game becomes playable again
