import type { Color, Result } from "./helpers/constants.js";

export interface Player {
  id: number;
  name: string;
  rating: number;
}

export interface Pairing {
  roundIndex: number;
  whitePlayer: Player;
  blackPlayer: Player | null;
  result: Result;
}

export type PairingTuple = [Player, Player];

export interface PlayerData {
  player: Player;
  history: Pairing[];
  points: number;
  opponentPoints: number;
  cumulativeScore: number;
  numberOfWhiteGames: number;
  numberOfWins: number;
  previousColor: Color;
  mustAlternate: boolean;
  opponentIds: Set<Player["id"]>;
  canBeBye: boolean;
}