import { Ship } from "@interfaces";

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const BOARD_LENGTH = 10;
export const BOARD_CELL_SIZE = 36;
export const BOARD_SIZE = BOARD_LENGTH * BOARD_CELL_SIZE;

export const SHIPS: Ship[] = [
  { x: 0, y: 0, length: 5, direction: "horizontal", hits: 0, sunk: false },
  { x: 0, y: 0, length: 4, direction: "horizontal", hits: 0, sunk: false },
  { x: 0, y: 0, length: 3, direction: "horizontal", hits: 0, sunk: false },
  { x: 0, y: 0, length: 3, direction: "horizontal", hits: 0, sunk: false },
  { x: 0, y: 0, length: 2, direction: "horizontal", hits: 0, sunk: false },
];
