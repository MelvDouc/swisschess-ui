import { obs } from "reactfree-jsx";
import playersObs from "$src/state/players.obs.ts";
import type { Player } from "$src/types.ts";

export default function PlayerForm() {
  const nameObs = obs("");

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!nameObs.value)
      return;
    const player: Player = {
      id: Date.now(),
      name: nameObs.value,
      rating: 1199
    };
    playersObs.value.push(player);
    playersObs.notify();
    nameObs.value = "";
  };

  return (
    <form
      onsubmit={handleSubmit}
      className="bg-primary text-light d-flex flex-column gap-3 p-3 rounded"
    >
      <section className="row">
        <article className="col">
          <label htmlFor="player_name" className="form-label">Nom</label>
          <input
            type="text"
            id="player_name"
            className="form-control"
            $init={(element) => {
              element.addEventListener("input", () => {
                nameObs.value = element.value;
              });
              nameObs.subscribe((value) => {
                if (element.value !== value)
                  element.value = value;
              });
            }}
            value={nameObs}
            required
          />
        </article>
      </section>
      <article className="row">
        <article className="col">
          <button className="btn btn-success">Ajouter</button>
        </article>
      </article>
    </form>
  );
}