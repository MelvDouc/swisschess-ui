import playersObs from "$src/state/players.obs.ts";
import { Player } from "$src/types.ts";

export default function PlayersTable() {
  const deletePlayer = (player: Player) => {
    playersObs.value = playersObs.value.filter(({ id }) => id !== player.id);
  };

  return (
    <table className="table table-light table-striped table-hover">
      <thead>
        <tr>
          <th>Nom</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {playersObs.map((players) => (
          players.map((player) => (
            <tr>
              <td style={{ width: "90%" }}>{player.name}</td>
              <td>
                <button className="btn btn-danger" onclick={() => deletePlayer(player)}>
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))
        ))}
      </tbody>
    </table>
  );
}