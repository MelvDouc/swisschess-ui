import SaveButton from "$src/components/SaveButton/SaveButton.tsx";
import { Result } from "$src/helpers/constants.ts";
import roundIndexObs from "$src/state/round-index.obs.ts";
import roundsObs from "$src/state/rounds.obs.ts";
import type { Pairing } from "$src/types.ts";

export default function RoundTable({ roundIndex, pairings, deleteLastRound }: {
  roundIndex: number;
  pairings: Pairing[];
  deleteLastRound: VoidFunction;
}) {
  const isLastRound = roundIndex === roundsObs.value.length - 1;
  const hiddenObs = roundIndexObs.map((value) => value !== roundIndex);

  return (
    <div className={{ ["d-none"]: hiddenObs }}>
      <h2>Ronde {roundIndex + 1}</h2>
      <table className="table table-dark table-striped table-hover mb-2">
        <thead>
          <tr>
            <th>Éch.</th>
            <th className="text-center" style={{ width: "40%" }}>Blancs</th>
            <th className="text-center">Résultat</th>
            <th className="text-center" style={{ width: "40%" }}>Noirs</th>
          </tr>
        </thead>
        <tbody>
          {pairings.map((pairing, i) => (
            <tr>
              <td>{i + 1}</td>
              <td className="text-center">{pairing.whitePlayer.name} ({pairing.whitePoints})</td>
              <td className="text-center">
                <select onchange={handleChange(pairing)}>
                  {Object.values(Result).map((result) => (
                    <option value={result} selected={pairing.result === result}>{result}</option>
                  ))}
                </select>
              </td>
              <td className="text-center">
                {pairing.blackPlayer
                  ? `${pairing.blackPlayer.name} (${pairing.blackPoints})`
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex gap-2">
        <SaveButton isLastRound={isLastRound} onRoundAdded={() => roundIndexObs.value = roundsObs.value.length - 1} />
        {isLastRound && (
          <button className="btn btn-danger" onclick={deleteLastRound}>
            <i className="bi bi-trash"></i>
          </button>
        )}
      </div>
    </div>
  );
}

function handleChange(pairing: Pairing) {
  return ({ target }: Event) => {
    pairing.result = (target as HTMLSelectElement).value as Result;
  };
}