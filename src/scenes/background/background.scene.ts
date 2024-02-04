import { ASSETS, SCENES } from "@constants";
import { SettingsKeys, SettingsService } from "@services";
import Phaser from "phaser";
import { Observable, Subject, takeUntil } from "rxjs";
import { container } from "tsyringe";

/**
 * Represents the background scene of the game.
 */
export class BackgroundScene extends Phaser.Scene {
  private waterSprite!: Phaser.GameObjects.Sprite;
  private waterTileSprite!: Phaser.GameObjects.TileSprite;

  private destroy$ = new Subject<void>();
  private isAnimationsEnabled$: Observable<boolean>;

  /**
   * Initializes the background scene.
   */
  constructor() {
    super(SCENES.BACKGROUND);

    const settingsService = container.resolve(SettingsService);
    this.isAnimationsEnabled$ = settingsService.getSetting$(
      SettingsKeys.Animations
    );
  }

  /**
   * Creates the background scene.
   */
  create() {
    this.createBackground();

    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
      this.destroy$.next();
      this.destroy$.complete();
    });
  }

  /**
   * Updates the water tile sprite frame.
   */
  update() {
    this.waterTileSprite.setFrame(this.waterSprite.frame.name);
  }

  /**
   * Creates the background scene.
   */
  public createBackground() {
    const { width, height } = this.scale;

    this.waterSprite = this.add
      .sprite(0, 0, ASSETS.SPRITESHEETS.WATER)
      .setVisible(false)
      .setActive(false);
    this.waterSprite.anims.create({
      key: ASSETS.SPRITESHEETS.WATER,
      frames: this.waterSprite.anims.generateFrameNumbers(
        ASSETS.SPRITESHEETS.WATER
      ),
      frameRate: 7,
      repeat: -1,
    });
    this.waterSprite.play(ASSETS.SPRITESHEETS.WATER);

    this.waterTileSprite = this.add
      .tileSprite(0, 0, width, height, ASSETS.SPRITESHEETS.WATER)
      .setOrigin(0, 0);

    this.isAnimationsEnabled$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAnimationsEnabled) => {
        this.waterSprite.setActive(isAnimationsEnabled);
      });
  }
}
