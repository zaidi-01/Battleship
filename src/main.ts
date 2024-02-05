import "reflect-metadata";
import { container } from "tsyringe";
import { GameService } from "./services/game/game.service";

const gameService = container.resolve(GameService);
