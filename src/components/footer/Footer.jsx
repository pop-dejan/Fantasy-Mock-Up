import "./Footer.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import MainLogo from "../../assets/img/pl-main-logo.png";
import AveryDennison from "../../assets/img/sponsors/ad.webp";
import Barclays from "../../assets/img/sponsors/barclays.webp";
import Budweiser from "../../assets/img/sponsors/bud.webp";
import Castrol from "../../assets/img/sponsors/castrol.webp";
import EASports from "../../assets/img/sponsors/eafc.webp";
import Hublot from "../../assets/img/sponsors/hublot.webp";
import Nike from "../../assets/img/sponsors/nike.webp";
import Oracle from "../../assets/img/sponsors/oracle.webp";

function Footer() {
  return (
    <>
      <footer>
        <div className="sponsors">
          <a target="_blank" href="https://www.ea.com/en-gb/games/ea-sports-fc">
            <div className="sponsor">
              <img src={EASports} alt="EA Sports" />
              <p>Lead Partner</p>
            </div>
          </a>
          <a target="_blank" href="https://home.barclays/">
            <div className="sponsor">
              <img src={Barclays} alt="Barclays" />
              <p>Official Bank</p>
            </div>
          </a>
          <a target="_blank" href="https://www.budweiser.com/en">
            <div className="sponsor">
              <img src={Budweiser} alt="Budweiser" />
              <p>Official Beer</p>
            </div>
          </a>
          <a
            target="_blank"
            href="https://www.castrol.com/en_gb/united-kingdom/home.html"
          >
            <div className="sponsor">
              <img src={Castrol} alt="Castrol" />
              <p>Official Engine Oil Partner</p>
            </div>
          </a>
          <a target="_blank" href="https://sport.averydennison.com/">
            <div className="sponsor">
              <img src={AveryDennison} alt="Avery Dennison" />
              <p>Official Licensee</p>
            </div>
          </a>
          <a target="_blank" href="https://www.hublot.com/en-int?country=RS">
            <div className="sponsor">
              <img src={Hublot} alt="Hublot" />
              <p>Official Timekeeper</p>
            </div>
          </a>
          <a
            target="_blank"
            href="https://www.nike.com/gb/w/mens-premier-league-accessories-equipment-2spkszawwpwznik1"
          >
            <div className="sponsor">
              <img src={Nike} alt="Nike" />
              <p>Official Ball</p>
            </div>
          </a>
          <a target="_blank" href="https://www.oracle.com/premier-league/">
            <div className="sponsor">
              <img src={Oracle} alt="Oracle" />
              <p>Official Cloud Partner</p>
            </div>
          </a>
        </div>

        <div className="copyright">
          <div className="logo">
            <span>© Premier </span>
            <img src={MainLogo} alt="Premier League Logo" />
            <span> League 2023</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
