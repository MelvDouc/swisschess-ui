import { Color, Result } from "./constants.js";
import type { Pairing, PairingTuple, Player, PlayerData } from "../types.js";

function getWinner(pairing: Pairing) {
  switch (pairing.result) {
    case Result.FirstPlayerWin:
    case Result.FirstPlayerWinByForfeit:
      return pairing.whitePlayer;
    case Result.SecondPlayerWin:
    case Result.SecondPlayerWinByForfeit:
      return pairing.blackPlayer;
    default:
      return null;
  }
}

function getPlayerColor(pairing: Pairing, player: Player) {
  switch (player.id) {
    case pairing.whitePlayer.id:
      return Color.White;
    case pairing.blackPlayer?.id:
      return Color.Black;
    default:
      return Color.None;
  }
}

function getResultAbbreviation(pairing: Pairing, player: Player) {
  if (getWinner(pairing)?.id === player.id)
    return "+";
  if (pairing.result === Result.Draw)
    return "=";
  return "-";
}

function isWinByForfeit(pairing: Pairing) {
  return pairing.result === Result.FirstPlayerWinByForfeit || pairing.result === Result.SecondPlayerWinByForfeit;
}

function getIdealColor(data1: PlayerData, data2: PlayerData) {
  if (data1.opponentIds.has(data2.player.id))
    return Color.None;

  if (data1.mustAlternate) {
    if (data2.mustAlternate && data2.previousColor === data1.previousColor)
      return Color.None;
    return data1.previousColor === Color.Black
      ? Color.White
      : Color.Black;
  }

  if (
    data2.mustAlternate && data2.previousColor === Color.White
    || data1.numberOfWhiteGames < data2.numberOfWhiteGames
    || data1.points < data2.points
  )
    return Color.White;

  return Color.Black;
}

function tryPairings(players: Player[], dataRecord: Record<number, PlayerData>, pairingSet: Set<PairingTuple>) {
  if (players.length === 0)
    return true;

  const topSeed = players[0];

  for (let i = 1; i < players.length; i++) {
    const opponent = players[i];
    const color = getIdealColor(dataRecord[topSeed.id], dataRecord[opponent.id]);

    if (color === Color.None)
      continue;

    const otherPlayers = players.slice(1);
    otherPlayers.splice(i - 1, 1);
    const pairing: PairingTuple = (color === Color.White)
      ? [topSeed, opponent]
      : [opponent, topSeed];
    pairingSet.add(pairing);

    if (tryPairings(otherPlayers, dataRecord, pairingSet))
      return true;

    pairingSet.delete(pairing);
  }

  return false;
}

function getFirstRoundPairings(players: Player[]) {
  players.sort(() => Math.random() - 0.5);
  const bye = (players.length % 2 === 1) ? players.pop() as Player : null;

  const halfLength = players.length / 2;
  const pairings = Array.from({ length: halfLength }, (_, i) => {
    const player1 = players[i];
    const player2 = players[i + halfLength];
    const whitePlayer = (i % 2 === 0) ? player1 : player2;
    const blackPlayer = (i % 2 === 0) ? player2 : player1;
    return {
      whitePlayer,
      whitePoints: 0,
      blackPlayer,
      blackPoints: 0
    };
  });

  bye && players.push(bye);
  return {
    pairings,
    bye,
    byePoints: 0
  };
}

export function getSubsequentRoundPairings(players: Player[], historyRecord: Record<Player["id"], Pairing[]>) {
  const dataRecord = getPlayerDataRecord(players, historyRecord);
  players.sort((a, b) => {
    return compareData(dataRecord[b.id], dataRecord[a.id]);
  });
  let bye: Player | null = null;

  if (players.length % 2 === 1) {
    for (let i = players.length - 1; i >= 0; i--) {
      if (dataRecord[players[i].id].canBeBye) {
        bye = players.splice(i, 1)[0];
        break;
      }
    }
  }

  const pairingSet = new Set<PairingTuple>();
  const success = tryPairings(players, dataRecord, pairingSet);
  bye && players.push(bye);
  return {
    pairings: success
      ? [...pairingSet].map(([whitePlayer, blackPlayer]) => ({
        whitePlayer,
        whitePoints: dataRecord[whitePlayer.id].points,
        blackPlayer,
        blackPoints: dataRecord[blackPlayer.id].points
      }))
      : null,
    bye,
    byePoints: bye ? dataRecord[bye.id].points : 0
  };
}

export function getNextRound(players: Player[], historyRecord: Record<Player["id"], Pairing[]>, roundIndex: number) {
  const attempt = (roundIndex === 0)
    ? getFirstRoundPairings(players)
    : getSubsequentRoundPairings(players, historyRecord);

  if (!attempt.pairings)
    return null;

  const pairings = attempt.pairings as Pairing[];

  if (attempt.bye)
    pairings.push({
      whitePlayer: attempt.bye,
      whitePoints: attempt.byePoints,
      blackPlayer: null,
      blackPoints: 0,
      result: Result.FirstPlayerWin
    });

  return pairings;
}

function compareEncounter(data1: PlayerData, { player: player2 }: PlayerData) {
  for (const pairing of data1.history) {
    if (pairing.whitePlayer.id !== player2.id && pairing.blackPlayer?.id !== player2.id)
      continue;
    if (getWinner(pairing)?.id === data1.player.id)
      return 1;
    return (pairing.result === Result.Draw) ? 0 : -1;
  }

  return 0;
}

function compareData(data1: PlayerData, data2: PlayerData) {
  return data1.points - data2.points
    || data1.opponentPoints - data2.opponentPoints
    || data1.cumulativeScore - data2.cumulativeScore
    || compareEncounter(data1, data2)
    || data1.numberOfWins - data2.numberOfWins;
}

function getIndividualResults(player: Player, history: Pairing[]) {
  return history.map((pairing) => ({
    opponent: (pairing.whitePlayer.id === player.id) ? pairing.blackPlayer : pairing.whitePlayer,
    color: getPlayerColor(pairing, player),
    ownResult: getResultAbbreviation(pairing, player)
  }));
}

function getPlayerData(player: Player, history: Pairing[]): Omit<PlayerData, "opponentPoints"> {
  const opponentIds = new Set<Player["id"]>();
  let points = 0;
  let cumulativeScore = 0;
  let numberOfWhiteGames = 0;
  let numberOfWins = 0;
  let numberOfLosses = 0;
  let opponentRatings = 0;
  let wasBye = false;
  let wonByForfeit = false;

  for (const pairing of history) {
    const isWhite = pairing.whitePlayer.id === player.id;

    if (isWhite)
      numberOfWhiteGames++;

    const opponent = isWhite
      ? pairing.blackPlayer
      : pairing.whitePlayer;

    if (opponent) {
      opponentIds.add(opponent.id);
      opponentRatings += opponent.rating;
    } else {
      wasBye = true;
    }

    if (getWinner(pairing)?.id === player.id) {
      points += 1;
      numberOfWins++;
      if (isWinByForfeit(pairing))
        wonByForfeit = true;
    } else if (pairing.result === Result.Draw) {
      points += 0.5;
    } else {
      numberOfLosses++;
    }

    cumulativeScore += points;
  }

  const lastGame = history.at(-1),
    nextToLastGame = history.at(-2);
  const previousColor = lastGame ? getPlayerColor(lastGame, player) : Color.None;
  const antePreviousColor = nextToLastGame ? getPlayerColor(nextToLastGame, player) : Color.None;
  const numberOfBlackGames = history.length - numberOfWhiteGames;

  return {
    player,
    history,
    opponentIds,
    points,
    cumulativeScore,
    numberOfWhiteGames,
    numberOfWins,
    previousColor,
    mustAlternate: previousColor !== Color.None && previousColor === antePreviousColor
      || Math.abs(numberOfWhiteGames - numberOfBlackGames) >= 2,
    canBeBye: !wasBye && !wonByForfeit,
    performance: (opponentRatings + 400 * (numberOfWins - numberOfLosses)) / opponentIds.size
  };
}

function getPlayerDataRecord(players: Player[], historyRecord: Record<Player["id"], Pairing[]>) {
  const dataRecord = players.reduce((acc, player) => {
    acc[player.id] = {
      ...getPlayerData(player, historyRecord[player.id]),
      opponentPoints: 0
    };
    return acc;
  }, {} as Record<Player["id"], PlayerData>);

  for (const id in dataRecord) {
    const data = dataRecord[id];
    data.opponentIds.forEach((id) => {
      data.opponentPoints += dataRecord[id].points;
    });
    Object.freeze(data);
  }

  return Object.freeze(dataRecord);
}

export function getStandings(players: Player[], historyRecord: Record<Player["id"], Pairing[]>) {
  const dataRecord = getPlayerDataRecord(players, historyRecord);
  players.sort((a, b) => compareData(dataRecord[b.id], dataRecord[a.id]));
  const positions = players.reduce((acc, { id }, i) => {
    acc[id] = i;
    return acc;
  }, {} as Record<number, number>);
  return players.map((player) => {
    const data = dataRecord[player.id];
    return {
      player,
      points: data.points,
      opponentPoints: data.opponentPoints,
      cumulativeScore: data.cumulativeScore,
      numberOfWins: data.numberOfWins,
      numberOfWhiteGames: data.numberOfWhiteGames,
      performance: data.performance,
      results: getIndividualResults(player, data.history).map((item) => {
        const opponentPosition = (item.opponent)
          ? positions[item.opponent.id] + 1
          : 0;
        return { ...item, opponentPosition };
      })
    };
  });
}