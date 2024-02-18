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
 * Represents the state of the game.
 */
export enum GameState {
  ShipPlacement = "ShipPlacement",
}

/**
 * Represents the hit type of a turn.
 */
export enum HitType {
  Miss = "Miss",
  Hit = "Hit",
  Sunk = "Sunk",
}
