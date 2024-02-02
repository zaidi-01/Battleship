import { SCENES } from "@constants";
import { TextButton } from "@shared";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.MENU });
  }

  create() {
    const localButton = new TextButton(
      this,
      100,
      100,
      "Local Game",
      { color: "#0f0" },
      this.startLocalGame.bind(this)
    );
  }

  startLocalGame() {}
}
