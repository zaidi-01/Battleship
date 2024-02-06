import { SCENES } from "@constants";
import { Difficulty, GameState, GameType } from "@enums";

export interface GameSceneData {
  difficulty: Difficulty;
  gameType: GameType;
  gameState: GameState;
}

export class GameScene extends Phaser.Scene {
  constructor() {
    super(SCENES.GAME);
  }
  create() {}
}
