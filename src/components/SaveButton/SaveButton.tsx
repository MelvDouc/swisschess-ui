import { Result } from "$src/helpers/constants.ts";
import roundsObs, { addRound } from "$src/state/rounds.obs.ts";
import cssClasses from "./SaveButton.module.css";
import { obs } from "reactfree-jsx";

export default function SaveButton({ isLastRound }: {
  isLastRound: boolean;
}) {
  const loadingObs = obs(false);

  const save = async (isLastRound: boolean) => {
    if (isLastRound && roundsObs.value.at(-1)?.every(({ result }) => result !== Result.None)) {
      loadingObs.value = true;
      await addRound();
      loadingObs.value = false;
      return;
    }

    roundsObs.notify();
  };

  return (
    <button className="btn btn-primary" onclick={() => save(isLastRound)}>
      <i className={{
        bi: true,
        "bi-floppy-fill": loadingObs.map((value) => !value),
        "bi-arrow-clockwise": loadingObs,
        [cssClasses.loader]: loadingObs
      }}></i>
    </button>
  );
}