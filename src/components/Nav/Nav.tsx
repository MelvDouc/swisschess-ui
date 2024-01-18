export default function Nav() {
  return (
    <nav className="navbar navbar-expand-lg bg-primary border-bottom border-body">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a href="#joueurs" className="nav-link text-light">Joueurs</a>
            </li>
            <li className="nav-item">
              <a href="#rondes" className="nav-link text-light">Rondes</a>
            </li>
            <li className="nav-item">
              <a href="#classement" className="nav-link text-light">Classement</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}