import { HitType } from "@enums";
import { Ship } from "./ship.interface";

/**
 * Represents the result of a turn.
 */
export interface PlayerTurnSuccessResult {
  /** The point of the turn. */
  point: {
    x: number;
    y: number;
  };
  /** The hit type of the turn. */
  hitType: HitType;
  /** The ship that was sunk. */
  ship?: Ship;
}
