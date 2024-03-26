import "./Fixtures.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import MainLogo from "../../assets/img/pl-main-logo-second.svg";
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
import { useState, useEffect } from "react";
import { firebase, database } from "../../help-files/firebase.js";
import { get, ref } from "firebase/database";
import ReactLoading from "react-loading";

function Fixtures() {
  // Variables andling functionality of pagination
  const fixturesRef = ref(database, "fixtures");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fixtures, setFixtures] = useState([]);
  const itemsPerPage = 1;
  const totalPages = Math.ceil(fixtures.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(0);

  const next = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const previous = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFixtures = fixtures.slice(startIndex, endIndex);

  // Function determining which logo is going to be displayed
  function determineClubLogo(name) {
    if (name === "Arsenal") {
      return ArsenalLogo;
    } else if (name === "Aston Villa") {
      return AstonVillaLogo;
    } else if (name === "Bournemouth") {
      return BournemouthLogo;
    } else if (name === "Brentford") {
      return BrentfordLogo;
    } else if (name === "Brighton") {
      return BrightonLogo;
    } else if (name === "Burnley") {
      return BurnleyLogo;
    } else if (name === "Chelsea") {
      return ChelseaLogo;
    } else if (name === "Crystal Palace") {
      return CrystalPalaceLogo;
    } else if (name === "Everton") {
      return EvertonLogo;
    } else if (name === "Nott'm Forest") {
      return ForestLogo;
    } else if (name === "Fulham") {
      return FulhamLogo;
    } else if (name === "Liverpool") {
      return LiverpoolLogo;
    } else if (name === "Luton") {
      return LutonLogo;
    } else if (name === "Man City") {
      return ManCityLogo;
    } else if (name === "Man Utd") {
      return ManUtdLogo;
    } else if (name === "Newcastle") {
      return NewcastleLogo;
    } else if (name === "Shefield Utd") {
      return ShefieldLogo;
    } else if (name === "Spurs") {
      return SpursLogo;
    } else if (name === "Spurs") {
      return SpursLogo;
    } else if (name === "West Ham") {
      return WestHamLogo;
    } else if (name === "Wolves") {
      return WolvesLogo;
    }
  }

  // Fetching data from database and handling display of loading and error interface
  useEffect(() => {
    getData();
  }, []);

  function getData() {
    get(fixturesRef)
      .then((snapshot) => {
        setIsLoading(true);
        if (snapshot.exists()) {
          setFixtures(snapshot.val().allFixtures);
          setCurrentPage(snapshot.val().currentFixtures);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        setError("Something went wrong. Please try again.");
        navigate("/");
        setIsLoading(false);
      });
  }

  if (isLoading) {
    return (
      <div className="loading">
        <ReactLoading
          className="loading-react"
          type="bubbles"
          color="#37003c"
          height="70px"
          width="30%"
        />
      </div>
    );
  }

  return (
    <>
      <div className="upper-wrapper-fixtures">
        <div className="fixtures-headline">
          <img src={MainLogo} alt="Main Logo" />
          <span className="fixtures-headline-text">Fixtures</span>
        </div>
        <div className="gameweek-points">
          <div
            className="paginate-buttons"
            onClick={previous}
            style={
              currentPage == 1
                ? { visibility: "hidden" }
                : { visibility: "visible" }
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="12"
              viewBox="0 0 8 10"
              className="arrow"
            >
              <path
                d="M21.2213207,17.0021331 L18,14.0039421 L24.4507644,8 L25.2253822,8.72096268 C25.6514749,9.11754135 26,9.44942563 26,9.45832996 C26,9.46723645 24.9050552,10.4938363 23.566861,11.7393744 L21.1337221,14.0039781 L23.566861,16.2685819 C24.905081,17.514108 26,18.540746 26,18.5496263 C26,18.5655641 24.4673455,20 24.4501971,20 C24.4456643,20 22.9920673,18.6509101 21.2202377,17.0018091 L21.2213207,17.0021331 Z"
                transform="translate(-18 -8)"
              ></path>
            </svg>
            <span className="paginate-text">Previous</span>
          </div>
          <span className="gameweek-number">
            Gameweek {currentFixtures[0].fixtureNumber}:{" "}
            <span className="gameweek-number-date">
              {currentFixtures[0].fixtureDate}
            </span>
          </span>

          <div
            className="paginate-buttons"
            onClick={next}
            style={
              currentPage == fixtures.length
                ? { visibility: "hidden" }
                : { visibility: "visible" }
            }
          >
            <span className="paginate-text">Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="12"
              viewBox="0 0 8 10"
              className="arrow"
            >
              <path
                d="M71.2213207,17.0021331 L68,14.0039421 L74.4507644,8 L75.2253822,8.72096268 C75.6514749,9.11754135 76,9.44942563 76,9.45832996 C76,9.46723645 74.9050552,10.4938363 73.566861,11.7393744 L71.1337221,14.0039781 L73.566861,16.2685819 C74.905081,17.514108 76,18.540746 76,18.5496263 C76,18.5655641 74.4673455,20 74.4501971,20 C74.4456643,20 72.9920673,18.6509101 71.2202377,17.0018091 L71.2213207,17.0021331 Z"
                transform="matrix(-1 0 0 1 76 -8)"
              ></path>
            </svg>
          </div>
        </div>
        {currentFixtures[0].fixtureDays.map((fixtureDay, index) => (
          <div className="fixture-day" key={index}>
            <div className="control-headline">
              <div className="gameweek">{fixtureDay.fixtureDayDate}</div>
            </div>
            <div className="fixture-matches">
              {fixtureDay.fixtureMatches.map((match, index) => (
                <div className="fixture-match" key={index}>
                  <div className="team-home">
                    <span className="team-name">{match.homeTeam}</span>
                    <img
                      src={determineClubLogo(match.homeTeam)}
                      alt={match.homeTeam + "Logo"}
                    />
                  </div>
                  {!match.showTime && (
                    <div className="result-holder">
                      <span className="goal-home">{match.homeTeamGoals}</span>
                      <div className="goal-border"></div>
                      <span className="goal-away">{match.awayTeamGoals}</span>
                    </div>
                  )}
                  {match.showTime && (
                    <div className="time-holder">
                      <span className="time-text">{match.matchTime}</span>
                    </div>
                  )}
                  <div className="team-away">
                    <img
                      src={determineClubLogo(match.awayTeam)}
                      alt={match.awayTeam + "Logo"}
                    />
                    <span className="team-name">{match.awayTeam}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Fixtures;
