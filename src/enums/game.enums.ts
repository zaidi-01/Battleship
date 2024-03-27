/**
 * Represents the difficulty of the game.
 */
export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

/**
 * Represents the type of game.
 */
export enum GameType {
  Local = "Local",
  Online = "Online",
}

/**
 * Represents the hit type of a turn.
 */
export enum HitType {
  /**
   * The shot missed.
   */
  Miss = "Miss",
  /**
   * The shot hit a ship.
   */
  Hit = "Hit",
  /**
   * The shot sunk a ship.
   */
  Sunk = "Sunk",
}

/**
 * The possible states of a game.
 */
export enum GameState {
  /**
   * The game is in the setup phase.
   */
  SETUP = "SETUP",
  /**
   * The game is in the play phase.
   */
  PLAY = "PLAY",
  /**
   * The game is in the end phase.
   */
  END = "END",
}
