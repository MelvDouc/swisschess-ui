import { obs } from "reactfree-jsx";
import { Result } from "$src/helpers/constants.ts";
import { getNextRound } from "$src/helpers/functions.ts";
import playersObs from "$src/state/players.obs.ts";
import type { Pairing } from "$src/types.ts";

const localStorageKey = "app_rounds";
const roundsObs = obs<Pairing[][]>(init());

roundsObs.subscribe((rounds) => {
  localStorage.setItem(localStorageKey, JSON.stringify(rounds));
});

function init(): Pairing[][] {
  const data = localStorage.getItem(localStorageKey);
  if (!data)
    return [];
  try {
    const pairings = JSON.parse(data);
    return Array.isArray(pairings) ? pairings : [];
  } catch {
    return [];
  }
}

export function getHistoryRecord() {
  const historyRecord = playersObs.value.reduce((acc, { id }) => {
    acc[id] = [];
    return acc;
  }, {} as Record<number, Pairing[]>);

  roundsObs.value.forEach((round) => {
    round.forEach((pairing) => {
      if (pairing.result === Result.None)
        return;
      historyRecord[pairing.whitePlayer.id].push(pairing);
      if (pairing.blackPlayer)
        historyRecord[pairing.blackPlayer.id].push(pairing);
    });
  });

  return historyRecord;
}

export function addRound() {
  return new Promise((resolve, reject) => {
    const round = getNextRound(playersObs.value, getHistoryRecord(), roundsObs.value.length);
    if (round) {
      roundsObs.value.push(round);
      roundsObs.notify();
      resolve(round);
      return;
    }
    reject("Fin des appariements.");
  });
}

export default roundsObs;