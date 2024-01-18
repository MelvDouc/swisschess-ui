import cssClasses from "$src/components/SaveButton/SaveButton.module.css";
import { Result } from "$src/helpers/constants.ts";
import roundsObs, { addRound } from "$src/state/rounds.obs.ts";
import { obs } from "reactfree-jsx";

export default function SaveButton({ isLastRound, onRoundAdded }: {
  isLastRound: boolean;
  onRoundAdded: VoidFunction;
}) {
  const loadingObs = obs(false);

  const save = async () => {
    try {
      if (isLastRound && roundsObs.value.at(-1)?.every(({ result }) => result !== Result.None)) {
        loadingObs.value = true;
        await addRound();
        onRoundAdded();
        return;
      }

      roundsObs.notify();
    } catch (error) {
      alert(error);
    } finally {
      loadingObs.value = false;
    }
  };

  return (
    <button className="btn btn-primary" onclick={save}>
      <i className={{
        bi: true,
        "bi-floppy-fill": loadingObs.map((value) => !value),
        "bi-arrow-clockwise": loadingObs,
        [cssClasses.loader]: loadingObs
      }}></i>
    </button>
  );
}