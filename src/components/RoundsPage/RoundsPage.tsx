import RoundTable from "$src/components/RoundTable/RoundTable.tsx";
import playersObs from "$src/state/players.obs.ts";
import roundsObs, { addRound } from "$src/state/rounds.obs.ts";
import roundIndexObs from "$src/state/round-index.obs.ts";

export default function RoundsPage() {
  if (playersObs.value.length === 0)
    return (
      <p>Veuillez d'abord ajouter des joueurs.</p>
    );


  const selectRound = (roundIndex: number) => {
    return (e: Event) => {
      e.preventDefault();
      roundIndexObs.value = roundIndex;
    };
  };

  const deleteLastRound = () => {
    roundsObs.value.pop();
    roundsObs.notify();
    roundIndexObs.value = roundsObs.value.length - 1;
  };

  return (
    <div $init={init}>
      {roundsObs.map((rounds) => (
        <>
          <ul>
            {Array.from({ length: rounds.length }, (_, i) => (
              <li>
                <a href={location.hash} onclick={selectRound(i)}>Ronde {i + 1}</a>
              </li>
            ))}
          </ul>
          {rounds.map((pairings, roundIndex) => (
            <RoundTable roundIndex={roundIndex} pairings={pairings} deleteLastRound={deleteLastRound} />
          ))}
        </>
      ))}
    </div>
  );
}

function init() {
  if (roundsObs.value.length === 0)
    addRound();
  roundIndexObs.value = roundsObs.value.length - 1;
}