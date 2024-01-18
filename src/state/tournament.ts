import { getStandings as standings } from "$src/helpers/functions.ts";
import playersObs from "$src/state/players.obs.ts";
import { getHistoryRecord } from "$src/state/rounds.obs.ts";

export function getStandings() {
  return standings(playersObs.value, getHistoryRecord());
}