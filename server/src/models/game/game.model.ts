import { gameUtilities } from "@server/utilities";

/**
 * Represents a game.
 */
export class Game {
  /**
   * The game id.
   */
  id: string;

  /**
   * Initializes a new instance of the Game class.
   */
  constructor() {
    this.id = gameUtilities.generateGameId();
  }
}
