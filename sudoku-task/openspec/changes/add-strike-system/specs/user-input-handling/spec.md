## MODIFIED Requirements

### Requirement: Validate number before placement
The system SHALL validate that a number placement complies with Sudoku row, column, and 3x3 box rules BEFORE accepting the placement.

#### Scenario: Invalid placement is rejected
- **WHEN** player attempts to place a number that conflicts with existing numbers in same row/column/box
- **THEN** system rejects the placement, does not update board state, and increments strike counter

#### Scenario: Valid placement is accepted
- **WHEN** player places a number that complies with all Sudoku rules
- **THEN** system accepts the placement, updates board state with the new number, and does not increment strike counter

### Requirement: Disable input on game over
The system SHALL prevent all game input when the game state is "over" or "won".

#### Scenario: Keyboard input is blocked
- **WHEN** game is in "over" state
- **THEN** pressing number keys (1-9) or backspace/delete does not trigger actions

#### Scenario: Mouse clicks are disabled
- **WHEN** game is in "over" state
- **THEN** clicking number buttons, clear button, or board cells does not register moves or selections
