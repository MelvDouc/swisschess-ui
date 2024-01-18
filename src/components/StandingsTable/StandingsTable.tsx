import { getStandings } from "$src/state/tournament.ts";
import { Color } from "../../helpers/constants.ts";

export default function StandingsTable() {
  const standings = getStandings();

  return (
    <table className="table table-dark table-striped table-hover mb-2">
      <thead>
        <tr>
          <th></th>
          <th>Nom</th>
          <th>Points</th>
          <th>Buchholz</th>
          <td>Cumul</td>
          <td>Résultats</td>
        </tr>
      </thead>
      <tbody>
        {standings.map(({ player, points, opponentPoints, cumulativeScore, results }, i) => (
          <tr>
            <td>{i + 1}</td>
            <td>{player.name}</td>
            <td>{points}</td>
            <td>{opponentPoints}</td>
            <td>{cumulativeScore}</td>
            <td>{results.map(({ opponentPosition, color, ownResult }) => opponentPosition + colorAbbreviations[color] + ownResult).join(" ")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const colorAbbreviations = {
  [Color.None]: "",
  [Color.White]: "B",
  [Color.Black]: "N"
};