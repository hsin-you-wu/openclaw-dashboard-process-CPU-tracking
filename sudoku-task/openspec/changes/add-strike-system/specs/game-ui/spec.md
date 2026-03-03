## MODIFIED Requirements

### Requirement: Display strike counter in header
The system SHALL display the strike counter prominently in the game header alongside other game statistics.

#### Scenario: Strike dots appear in header
- **WHEN** game is active
- **THEN** three visual dots appear in the header indicating strike status (filled red = active strike, empty gray = no strike)

#### Scenario: Invalid moves label shows current count
- **WHEN** strike counter updates
- **THEN** text "Invalid Moves: X/3" updates to reflect the current count

### Requirement: Display game over modal
The system SHALL display a clear, prominent modal when the game ends due to 3 invalid moves.

#### Scenario: Game over modal appears
- **WHEN** player reaches 3 invalid moves
- **THEN** a modal overlay appears with: ✕ icon, "Game Over!" title, explanatory message, and "Try Again" button

#### Scenario: Modal has appropriate styling
- **WHEN** game over modal is displayed
- **THEN** modal has red/error color scheme (red border, red icon, red button) to distinguish from win state

### Requirement: Disable input button appearance
The system SHALL visually indicate when input buttons are disabled due to game over.

#### Scenario: Disabled buttons show opacity and disable cursor
- **WHEN** game is in "over" state
- **THEN** number buttons and clear button have reduced opacity (opacity: 0.5) and cursor: not-allowed
