import { obs } from "reactfree-jsx";
import { type Player } from "$src/types.ts";

const localStorageKey = "app_players";
const playersObs = obs<Player[]>(init());

playersObs.subscribe((players) => {
  localStorage.setItem(localStorageKey, JSON.stringify(players));
});

function init(): Player[] {
  const data = localStorage.getItem(localStorageKey);
  if (!data)
    return [];
  try {
    const players = JSON.parse(data);
    return Array.isArray(players) ? players : [];
  } catch {
    return [];
  }
}

export default playersObs;