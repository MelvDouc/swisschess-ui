import SaveButton from "$src/components/SaveButton/SaveButton.tsx";
import { Result } from "$src/helpers/constants.ts";
import playersObs from "$src/state/players.obs.ts";
import roundsObs, { addRound } from "$src/state/rounds.obs.ts";
import type { Pairing } from "$src/types.ts";

export default function RoundsPage() {
  if (playersObs.value.length === 0)
    return (
      <p>Veuillez d'abord ajouter des joueurs.</p>
    );

  return (
    <div $init={init}>
      {roundsObs.map((rounds) => (
        rounds.map((pairings, i) => (
          <div className="mb-4" >
            <h2>Ronde {i + 1}</h2>
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
              <SaveButton isLastRound={i === rounds.length - 1} />
              {(i === rounds.length - 1) && (
                <button className="btn btn-danger" onclick={deleteLastRound}>
                  <i className="bi bi-trash"></i>
                </button>
              )}
            </div>
          </div>
        ))
      ))}
    </div>
  );
}

function init() {
  if (roundsObs.value.length === 0)
    addRound();
}

function handleChange(pairing: Pairing) {
  return ({ target }: Event) => {
    pairing.result = (target as HTMLSelectElement).value as Result;
  };
}

function deleteLastRound() {
  roundsObs.value.pop();
  roundsObs.notify();
}