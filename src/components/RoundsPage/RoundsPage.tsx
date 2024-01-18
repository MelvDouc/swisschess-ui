import { Result } from "$src/helpers/constants.ts";
import roundsObs, { addRound } from "$src/state/rounds.obs.ts";
import type { Pairing } from "$src/types.ts";

export default function RoundsPage() {
  const init = () => {
    if (roundsObs.value.length === 0)
      addRound();
  };

  const handleChange = (pairing: Pairing) => {
    return ({ target }: Event) => {
      pairing.result = (target as HTMLSelectElement).value as Result;
    };
  };

  const save = (isLastRound: boolean) => {
    if (isLastRound && roundsObs.value.at(-1)?.every(({ result }) => result !== Result.None)) {
      addRound();
      return;
    }

    roundsObs.notify();
  };

  const deleteLastRound = () => {
    roundsObs.value.pop();
    roundsObs.notify();
  };

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
                    <td className="text-center">{pairing.whitePlayer.name}</td>
                    <td className="text-center">
                      <select onchange={handleChange(pairing)}>
                        {Object.values(Result).map((result) => (
                          <option value={result} selected={pairing.result === result}>{result}</option>
                        ))}
                      </select>
                    </td>
                    <td className="text-center">{pairing.blackPlayer?.name ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onclick={() => save(i === rounds.length - 1)}>
                <i className="bi bi-floppy-fill"></i>
              </button>
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