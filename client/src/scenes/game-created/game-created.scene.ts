import { SCENES } from "@constants";

/**
 * Represents the game created scene.
 */
export class GameCreatedScene extends Phaser.Scene {
  /**
   * Initializes the game created scene.
   */
  constructor() {
    super(SCENES.GAME_CREATED);
  }

  /**
   * Creates the game created scene.
   * @param gameId The game ID.
   */
  create({ gameId }: { gameId: string }) {
    const { width, height } = this.game.canvas;

    this.add
      .text(width / 2, height / 4, "Game Created", {
        color: "#0f0",
        fontSize: "48px",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2, `Game ID: ${gameId}`, {
        color: "#0f0",
        fontSize: "28px",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, (height / 4) * 3, "Waiting for player to join...", {
        color: "#0f0",
        fontSize: "28px",
      })
      .setOrigin(0.5);
  }
}
