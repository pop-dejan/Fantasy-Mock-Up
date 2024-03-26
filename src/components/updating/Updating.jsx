import "./Updating.scss";
import "bootstrap/dist/css/bootstrap.min.css";
function Updating() {
  return (
    <>
      <div className="updating-wrapper">
        <h3>The game is updating and will be available soon.</h3>
        <h4>While you wait did you know...?</h4>
        <ul>
          <li>
            You can decide the best Premier League comeback ever. 🗳️{" "}
            <a href="https://www.premierleague.com/news/3932838">Vote here</a>
          </li>

          <li>
            Having trouble deciding your next transfer? 🏆{" "}
            <a href="https://www.premierleague.com/awards?at=1&aw=-1&se=578">
              Check out players awards
            </a>
          </li>
          <li>
            How Premier League helped Orient support local youngsters. 📱{" "}
            <a href="https://www.premierleague.com/news/3936990">Read more</a>
          </li>
          <li>
            It's always a good time for a bit of history. 📖{" "}
            <a href="https://www.premierleague.com/history/dashboard">
              See our history section
            </a>
          </li>
          <li>
            You can see ALL the injuries from EVERY club. 🤕{" "}
            <a href="https://www.premierleague.com/latest-player-injuries">
              Get the latest
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Updating;
