import { HitType } from "@enums";
import { Ship } from "./ship.interface";

/**
 * Represents the result of a turn.
 */
export interface TurnSuccessResult {
  /** The point of the turn. */
  point: Phaser.Geom.Point;
  /** The hit type of the turn. */
  hitType: HitType;
  /** The ship that was sunk. */
  ship?: Ship;
}
