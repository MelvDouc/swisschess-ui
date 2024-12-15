import Nav from "$src/components/Nav/Nav.tsx";
import PlayerForm from "$src/components/PlayerForm/PlayerForm.tsx";
import PlayersTable from "$src/components/PlayersTable/PlayersTable.tsx";
import StandingsTable from "$src/components/StandingsTable/StandingsTable.tsx";
import RoundsPage from "$src/components/RoundsPage/RoundsPage.tsx";
import cssClasses from "./App.module.css";

export default function App() {
  return (
    <div className={cssClasses.App}>
      <Nav />
      <main className="overflow-y-auto">
        <section $init={(element) => {
          window.addEventListener("hashchange", () => {
            element.replaceChildren(<MainSection />);
          });
        }}>
          <MainSection />
        </section>
      </main>
    </div>
  );
}

function MainSection() {
  switch (location.hash) {
    case "#joueurs":
      return (
        <div className="d-flex flex-column mx-auto gap-3" style={{ width: "min(100%, 800px)" }}>
          <PlayerForm />
          <PlayersTable />
        </div>
      );
    case "#rondes":
      return (<RoundsPage />);
    case "#classement":
      return (<StandingsTable />);
    default:
      return (<></>);
  }
}