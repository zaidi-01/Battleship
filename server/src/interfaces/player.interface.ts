import { Game } from "@server/models";
import { ExtWebSocket } from "./ext-web-socket.interface";

/**
 * Represents a player.
 */
export interface Player extends ExtWebSocket {
  /**
   * The game.
   */
  game?: Game;
}
