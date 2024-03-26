import { Game } from "@server/models";
import { ExtWebSocket } from "./ext-web-socket.interface";
import { Ship } from "./ship.interface";

/**
 * Represents a player.
 */
export interface Player extends ExtWebSocket {
  /**
   * The game.
   */
  game?: Game;
  /**
   * The ships.
   */
  ships?: Ship[];
  /**
   * The opponent.
   */
  opponent?: Player;
}
