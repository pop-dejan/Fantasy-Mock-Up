import "./Navbar.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import MainLogo from "../../assets/img/pl-main-logo.png";
import ArsenalLogo from "../../assets/img/club logos/arsenal.svg";
import AstonVillaLogo from "../../assets/img/club logos/aston villa.svg";
import BournemouthLogo from "../../assets/img/club logos/bournemouth.svg";
import BrentfordLogo from "../../assets/img/club logos/brentford.svg";
import BrightonLogo from "../../assets/img/club logos/brighton.svg";
import BurnleyLogo from "../../assets/img/club logos/burnley.svg";
import ChelseaLogo from "../../assets/img/club logos/chelsea.svg";
import CrystalPalaceLogo from "../../assets/img/club logos/crystal palace.svg";
import EvertonLogo from "../../assets/img/club logos/everton.svg";
import ForestLogo from "../../assets/img/club logos/forest.svg";
import FulhamLogo from "../../assets/img/club logos/fulham.svg";
import LiverpoolLogo from "../../assets/img/club logos/liverpool.svg";
import LutonLogo from "../../assets/img/club logos/luton.svg";
import ManCityLogo from "../../assets/img/club logos/man city.svg";
import ManUtdLogo from "../../assets/img/club logos/man utd.png";
import NewcastleLogo from "../../assets/img/club logos/newcastle.png";
import ShefieldLogo from "../../assets/img/club logos/shefield.svg";
import SpursLogo from "../../assets/img/club logos/spurs.svg";
import WestHamLogo from "../../assets/img/club logos/west ham.svg";
import WolvesLogo from "../../assets/img/club logos/wolves.svg";

function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand" id="navbar-brand">
            <img src={MainLogo} alt="Premier League Logo" />
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
                    <img src={ArsenalLogo} alt="ArsenalLogo" />
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
                    <img src={AstonVillaLogo} alt="AstonVillaLogo" />
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
                    <img src={BournemouthLogo} alt="BournemouthLogo" />
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
                    <img src={BrentfordLogo} alt="BrentfordLogo" />
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
                    <img src={BrightonLogo} alt="BrightonLogo" />
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
                    <img src={BurnleyLogo} alt="BurnleyLogo" />
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
                    <img src={ChelseaLogo} alt="ChelseaLogo" />
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
                    <img src={CrystalPalaceLogo} alt="CrystalPalaceLogo" />
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
                    <img src={EvertonLogo} alt="EvertonLogo" />
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
                    <img src={ForestLogo} alt="NottinghamForestLogo" />
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
                    <img src={FulhamLogo} alt="FulhamLogo" />
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
                    <img src={LiverpoolLogo} alt="LiverpoolLogo" />
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
                    <img src={LutonLogo} alt="LutonLogo" />
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
                    <img src={ManCityLogo} alt="ManCityLogo" />
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
                    <img src={ManUtdLogo} alt="ManUtdLogo" />
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
                    <img src={NewcastleLogo} alt="NewcastleUtdLogo" />
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
                    <img src={ShefieldLogo} alt="SheffieldUtdLogo" />
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
                    <img src={SpursLogo} alt="SpursLogo" />
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
                    <img src={WestHamLogo} alt="WestHamLogo" />
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
                    <img src={WolvesLogo} alt="WolvesLogo" />
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
