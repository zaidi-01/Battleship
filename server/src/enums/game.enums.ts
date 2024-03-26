/**
 * The possible states of a game.
 */
export enum GameState {
  /**
   * The game is waiting for players to join.
   */
  WAITING = "WAITING",
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
