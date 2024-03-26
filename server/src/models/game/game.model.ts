import { ExtWebSocket } from "@server/interfaces";
import { gameUtilities } from "@server/utilities";

/**
 * Represents a game.
 */
export class Game {
  /**
   * The game id.
   */
  private id_: string;
  /**
   * The players.
   */
  private players_: ExtWebSocket[] = [];

  /**
   * Gets the game id.
   */
  public get id(): string {
    return this.id_;
  }

  /**
   * Gets the players.
   */
  public get players(): ExtWebSocket[] {
    return [...this.players_];
  }

  /**
   * Initializes a new instance of the Game class.
   */
  constructor() {
    this.id_ = gameUtilities.generateGameId();
  }

  public addPlayer(player: ExtWebSocket) {
    player.game = this;
    this.players_.push(player);
  }
}
