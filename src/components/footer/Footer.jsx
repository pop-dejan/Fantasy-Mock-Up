import "../footer/Footer.scss";
import "bootstrap/dist/css/bootstrap.min.css";
function Footer() {
  return (
    <>
      <footer>
        <div className="sponsors">
          <a target="_blank" href="https://www.ea.com/en-gb/games/ea-sports-fc">
            <div className="sponsor">
              <img src="src/assets/img/sponsors/eafc.webp" alt="" />
              <p>Lead Partner</p>
            </div>
          </a>
          <a target="_blank" href="https://home.barclays/">
            <div className="sponsor">
              <img src="src/assets/img/sponsors/barclays.webp" alt="" />
              <p>Official Bank</p>
            </div>
          </a>
          <a target="_blank" href="https://www.budweiser.com/en">
            <div className="sponsor">
              <img src="src/assets/img/sponsors/bud.webp" alt="" />
              <p>Official Beer</p>
            </div>
          </a>
          <a
            target="_blank"
            href="https://www.castrol.com/en_gb/united-kingdom/home.html"
          >
            <div className="sponsor">
              <img src="src/assets/img/sponsors/castrol.webp" alt="" />
              <p>Official Engine Oil Partner</p>
            </div>
          </a>
          <a target="_blank" href="https://sport.averydennison.com/">
            <div className="sponsor">
              <img src="src/assets/img/sponsors/ad.webp" alt="" />
              <p>Official Licensee</p>
            </div>
          </a>
          <a target="_blank" href="https://www.hublot.com/en-int?country=RS">
            <div className="sponsor">
              <img src="src/assets/img/sponsors/hublot.webp" alt="" />
              <p>Official Timekeeper</p>
            </div>
          </a>
          <a
            target="_blank"
            href="https://www.nike.com/gb/w/mens-premier-league-accessories-equipment-2spkszawwpwznik1"
          >
            <div className="sponsor">
              <img src="src/assets/img/sponsors/nike.webp" alt="" />
              <p>Official Ball</p>
            </div>
          </a>
          <a target="_blank" href="https://www.oracle.com/premier-league/">
            <div className="sponsor">
              <img src="src/assets/img/sponsors/oracle.webp" alt="" />
              <p>Official Cloud Partner</p>
            </div>
          </a>
        </div>

        <div className="copyright">
          <div className="logo">
            <span>© Premier </span>
            <img src="src/assets/img/pl-main-logo.png" alt="" />
            <span> League 2023</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
