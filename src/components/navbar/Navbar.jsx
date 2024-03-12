import "../navbar/Navbar.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand" id="navbar-brand">
            <img src="src/assets/img/pl-main-logo.png" alt="main-logo.png" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasDarkNavbar"
            aria-controls="offcanvasDarkNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="offcanvasDarkNavbar"
            aria-labelledby="offcanvasDarkNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
                Menu
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <a className="nav-link club">Club Sites</a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.arsenal.com/?utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img
                      src="src/assets/img/club logos/arsenal.svg"
                      alt="arsenal-kit"
                    />
                    <span>Arsenal</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.avfc.co.uk/?utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img
                      src="src/assets/img/club logos/aston villa.svg"
                      alt="villa-kit"
                    />
                    <span>Aston Villa</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.afcb.co.uk/?utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img
                      src="src/assets/img/club logos/bournemouth.svg"
                      alt=""
                    />
                    <span>Bournemouth</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.brentfordfc.com/en??utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img src="src/assets/img/club logos/brentford.svg" alt="" />
                    <span>Brentford</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.brightonandhovealbion.com/?utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img src="src/assets/img/club logos/brighton.svg" alt="" />
                    <span>Brighton</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.burnleyfootballclub.com/?utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img src="src/assets/img/club logos/burnley.svg" alt="" />
                    <span>Burnley</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.chelseafc.com/en??utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img src="src/assets/img/club logos/chelsea.svg" alt="" />
                    <span>Chelsea</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.cpfc.co.uk/?utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img
                      src="src/assets/img/club logos/crystal palace.svg"
                      alt=""
                    />
                    <span>Crystal Palace</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.evertonfc.com/?utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img src="src/assets/img/club logos/everton.svg" alt="" />
                    <span>Everton</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.nottinghamforest.co.uk/?utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img src="src/assets/img/club logos/forest.svg" alt="" />
                    <span>Nottingham Forest</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.fulhamfc.com/?utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img src="src/assets/img/club logos/fulham.svg" alt="" />
                    <span>Fulham</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.liverpoolfc.com/?utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img src="src/assets/img/club logos/liverpool.svg" alt="" />
                    <span>Liverpool</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.lutontown.co.uk/?utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img src="src/assets/img/club logos/luton.svg" alt="" />
                    <span>Luton</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.mancity.com/?utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img src="src/assets/img/club logos/man city.svg" alt="" />
                    <span>Man City</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.manutd.com/?utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img src="src/assets/img/club logos/man utd.png" alt="" />
                    <span>Man United</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.nufc.co.uk/?utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img src="src/assets/img/club logos/newcastle.png" alt="" />
                    <span>Newcastle</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.sufc.co.uk/?utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img src="src/assets/img/club logos/shefield.svg" alt="" />
                    <span>Sheffield</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.tottenhamhotspur.com/?utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img src="src/assets/img/club logos/spurs.svg" alt="" />
                    <span>Spurs</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.whufc.com/?utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img src="src/assets/img/club logos/west ham.svg" alt="" />
                    <span>West Ham</span>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    target="_blank"
                    tabIndex="0"
                    href="https://www.wolves.co.uk/?utm_source=premier-league-website&utm_campaign=website&utm_medium=link"
                  >
                    <img src="src/assets/img/club logos/wolves.svg" alt="" />
                    <span>Wolves</span>
                  </a>
                </li>

                <li
                  className="nav-item"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                >
                  <Link to="/sign-in" className="btn btn-light navbar-sign-in">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
