import "../finances/Finances.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function Finances({ user, players }) {
  // Function calculating total transfers
  function totalTransfers(user) {
    let totalTransfers = 0;

    if (user.gameweeks) {
      user.gameweeks.forEach((gameweek) => {
        totalTransfers += gameweek.gameweekTransfersCount;
      });
    } else {
      totalTransfers = 0;
    }

    return totalTransfers;
  }

  // Function calculating squad value
  function squadValue(user, players) {
    let allPlayers = [
      ...user.goalkeeper,
      ...user.defence,
      ...user.midfield,
      ...user.attack,
      ...user.subs,
    ];

    let squadValue = 0;

    allPlayers.forEach((playerTeam) => {
      players.forEach((player) => {
        if (playerTeam.name === player.name) {
          squadValue += player.price;
        }
      });
    });

    return squadValue.toFixed(1);
  }

  return (
    <>
      <div className="finances">
        <div className="headline-text">Transfers and Finances</div>
        <div className="headline-wrapper">
          <div className="control-headline">
            <div className="gameweek">Transfers</div>
          </div>
        </div>
        <div className="overall">
          <span>Gameweek transfers</span>
          <span>
            {user.gameweeks
              ? user.gameweeks[user.gameweeks.length - 1].gameweekTransfersCount
              : 0}
          </span>
        </div>
        <div className="overall total">
          <span>Total transfers</span>
          <span>{totalTransfers(user)}</span>
        </div>
        {user.gameweeks && user.gameweeks[0].gameweekTransfers && (
          <Link to="/total-transfers" className="transfer-history">
            <span className="history-text">Transfer History</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 32 20"
            >
              <path
                d="M53.6485838,32.0017628 L50.0028805,32.002243 L44.1795487,32.002243 L42.8449352,32.002243 C42.2448392,32.002243 41.6106577,32.2648846 41.1853096,32.6869358 C40.7782045,33.0941023 40.4723956,33.7595891 40.5007201,34.3468117 C40.5285646,34.9508394 40.7258761,35.5807952 41.1853096,36.0066875 C41.6447432,36.4287387 42.2069131,36.6913803 42.8449352,36.6913803 L46.4978397,36.6913803 L47.9851176,36.6913803 L45.4666347,39.209763 C43.6044167,41.0722619 41.7383581,42.9386019 39.8780605,44.7991802 C38.2707633,46.4067198 36.6673068,48.0104182 35.0585694,49.6193983 C34.2803649,50.3977202 33.4867979,51.1722009 32.7181949,51.9601258 L32.6845895,51.9937362 C32.2568411,52.4215492 32,53.0481439 32,53.6536121 C32,54.2317118 32.2530005,54.9140038 32.6845895,55.313488 C33.1305809,55.7206545 33.7157945,56.0265096 34.3442151,55.9981808 C34.9721555,55.9703321 35.5592895,55.7600268 36.0038406,55.313488 L37.931349,53.3856888 L42.5261642,48.7906607 L48.1147384,43.2007634 C49.1805089,42.1348321 50.2462794,41.0689008 51.3115699,40.0034497 L51.3115699,43.8239971 L51.3115699,45.1597723 C51.3115699,45.7599588 51.5741719,46.3937558 51.9961594,46.8196481 C52.4032645,47.2263345 53.068651,47.5321896 53.6557849,47.5038608 C54.2597216,47.4760121 54.8895823,47.279151 55.3154105,46.8196481 C55.7316371,46.3582247 56,45.7954898 56,45.1597723 L56,41.5058366 L56,35.6821067 L56,34.3468117 C56,34.0073461 55.9183869,33.6846859 55.781085,33.3893941 C55.6649064,33.1209907 55.5084013,32.8717932 55.3082093,32.6864556 C54.8617379,32.2792891 54.2770043,31.9739142 53.6485838,32.0017628 Z"
                transform="rotate(45 71.042 -6.799)"
              ></path>
            </svg>
            <div className="transfer-history-hover"></div>
          </Link>
        )}
        <div className="headline-wrapper-second">
          <div className="control-headline">
            <div className="gameweek">Finances</div>
          </div>
        </div>
        <div className="overall">
          <span>Squad value</span>
          <span>{squadValue(user, players)}</span>
        </div>
        <div className="overall">
          <span>In the bank</span>
          <span>{user.money.toFixed(1)}</span>
        </div>
      </div>
    </>
  );
}

export default Finances;
