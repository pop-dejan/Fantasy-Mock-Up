import "./Points.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import getCookie from "../../help-files/getCookie.js";
import { firebase, database } from "../../help-files/firebase.js";
import { get, ref } from "firebase/database";
import { useNavigate, Navigate } from "react-router-dom";
import ReactLoading from "react-loading";
import Updating from "../updating/Updating.jsx";

function Points() {
  const navigate = useNavigate();
  const userRef = ref(database, "usersFantasy/" + getCookie("id"));
  const playersRef = ref(database, "players");
  const gameweekRef = ref(database, "currentGameweek");
  const updatingRef = ref(database, "updating");
  const [user, setUser] = useState([]);
  const [players, setPlayers] = useState();
  const [gameweekInfo, setGameweekInfo] = useState();
  const [updating, setUpdating] = useState();
  const [gameweeks, setGameweeks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Variables andling functionality of pagination
  const itemsPerPage = 1;
  const totalPages = Math.ceil(gameweeks.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(0);

  const next = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    if (currentPage == totalPages) {
      navigate("/pick-team");
    }
  };

  const previous = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGameweek = gameweeks.slice(startIndex, endIndex);

  // Function calculating total points
  function totalPoints(currentGameweek) {
    let countPoints = 0;
    countPoints =
      countPoints +
      displayPoints(
        currentGameweek.goalkeeper[0].name,
        currentGameweek.gameweekNumber
      );

    currentGameweek.defence.forEach((player) => {
      countPoints =
        countPoints +
        displayPoints(player.name, currentGameweek.gameweekNumber);
    });

    currentGameweek.midfield.forEach((player) => {
      countPoints =
        countPoints +
        displayPoints(player.name, currentGameweek.gameweekNumber);
    });

    currentGameweek.attack.forEach((player) => {
      countPoints =
        countPoints +
        displayPoints(player.name, currentGameweek.gameweekNumber);
    });

    return countPoints;
  }

  // Function handling display of player's points
  function displayPoints(playerName, gameweekNumber) {
    let playerToDisplay;
    let pointsToDisplay = 0;
    players.forEach((player) => {
      if (player.name === playerName) {
        playerToDisplay = player;
      }
    });

    playerToDisplay.playerGameweeks.forEach((gameweek) => {
      if (gameweek.gameweekNumber == gameweekNumber) {
        pointsToDisplay = gameweek.gameweekPoints;
      }
    });
    return pointsToDisplay;
  }

  // Fetching data from database and handling display of loading and error interface
  useEffect(() => {
    getData();
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const getData = async () => {
    try {
      setIsLoading(true);
      const [snapshot1, snapshot2, snapshot3, snapshot4] = await Promise.all([
        get(userRef),
        get(playersRef),
        get(gameweekRef),
        get(updatingRef),
      ]);

      const data1 = snapshot1.val();
      const data2 = snapshot2.val();
      const data3 = snapshot3.val();
      const data4 = snapshot4.val();

      setGameweekInfo(data3);
      setUpdating(data4);
      setUser(data1);
      setPlayers(data2);
      setGameweeks(data1.gameweeks);
      setCurrentPage(data1.gameweeks.length);
    } catch (error) {
      setError("Something went wrong. Please try again.");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  // Function displaying average points of gameweek
  function displayAverage(currentGameweek) {
    let average = 0;
    gameweekInfo.gameweeks.forEach((gameweek) => {
      if (gameweek.gameweekNumber == currentGameweek.gameweekNumber) {
        average = gameweek.average;
      }
    });
    return average;
  }

  // Function displaying highest points of gameweek
  function displayHighest(currentGameweek) {
    let highest = 0;
    gameweekInfo.gameweeks.forEach((gameweek) => {
      if (gameweek.gameweekNumber == currentGameweek.gameweekNumber) {
        highest = gameweek.highest;
      }
    });
    return highest;
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

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (updating.isUpdating) {
    return <Updating></Updating>;
  }

  return (
    <>
      <div className="title-pts">
        <p>Points</p>
        <p className="squad-name">- {user && user.squadName}</p>
      </div>
      <div className="down">
        <div className="upper-wrapper-points">
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
              Gameweek {currentGameweek[0].gameweekNumber}
            </span>
            <div className="paginate-buttons" onClick={next}>
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

          <div className="points-stats">
            <div className="left-stats">
              <div className="average">
                <p className="average-up">Average Points</p>
                <p className="average-down">
                  {displayAverage(currentGameweek[0]) == 0
                    ? "-"
                    : Math.floor(displayAverage(currentGameweek[0]))}
                </p>
              </div>
              <div className="highest">
                <p className="highest-up">Highest Points</p>
                <p className="highest-down">
                  {displayHighest(currentGameweek[0]) == 0
                    ? "-"
                    : displayHighest(currentGameweek[0])}
                </p>
              </div>
            </div>
            <div className="points-counter">
              <p className="counter-text">Final Points</p>
              <p className="points-final">
                {totalPoints(
                  currentGameweek[0],
                  currentGameweek.gameweekNumber
                )}
              </p>
            </div>
            <div className="right-stats">
              <div className="gw-rank">
                <p className="gw-rank-up">GW Rank</p>
                <p className="gw-rank-down">
                  {currentGameweek[0].gameweekRank == 0
                    ? "-"
                    : currentGameweek[0].gameweekRank}
                </p>
              </div>
              <div className="transfers">
                <p className="transfers-up">Transfers</p>
                <p className="transfers-down">
                  {currentGameweek[0].gameweekTransfersCount}{" "}
                  {currentGameweek[0].gameweekCostCount > 0 && (
                    <span className="gameweek-cost">
                      (-
                      {currentGameweek[0].gameweekCostCount} pts)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="pitch-wrapper">
          {currentGameweek.map((gameweek, index) => (
            <div className="goalkepper" key={index}>
              <div className="player-points" id={gameweek.goalkeeper[0].name}>
                <div className="kit">
                  <img
                    src={gameweek ? `${gameweek.goalkeeper[0].kit_src}` : ""}
                    alt={gameweek ? `${gameweek.goalkeeper[0].club}.jpg` : ""}
                  />
                </div>
                <div className="name">
                  {gameweek && gameweek.goalkeeper[0].name}
                </div>
                <div className="point">
                  {displayPoints(
                    gameweek.goalkeeper[0].name,
                    currentGameweek[0].gameweekNumber
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="defence">
            {currentGameweek[0].defence.map((player, index) => (
              <div className="player-points" id={player.name} key={index}>
                <div className="kit">
                  <img src={player.kit_src} alt={player.club + ".jpeg"} />
                </div>
                <div className="name">{player.name}</div>
                <div className="point">
                  {displayPoints(
                    player.name,
                    currentGameweek[0].gameweekNumber
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="midfield">
            {currentGameweek[0].midfield.map((player, index) => (
              <div className="player-points" id={player.name} key={index}>
                <div className="kit">
                  <img src={player.kit_src} alt={player.club + ".jpeg"} />
                </div>
                <div className="name">{player.name}</div>
                <div className="point">
                  {displayPoints(
                    player.name,
                    currentGameweek[0].gameweekNumber
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="attack">
            {currentGameweek[0].attack.map((player, index) => (
              <div className="player-points" id={player.name} key={index}>
                <div className="kit">
                  <img src={player.kit_src} alt={player.club + ".jpeg"} />
                </div>
                <div className="name">{player.name}</div>
                <div className="point">
                  {displayPoints(
                    player.name,
                    currentGameweek[0].gameweekNumber
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="subs">
            {currentGameweek[0].subs.map((player, index) => (
              <div id={player.name} className="player-points" key={index}>
                <div className="position-points">
                  {player.position.toUpperCase()}
                </div>
                <div className="kit">
                  <img src={player.kit_src} alt={player.club + ".jpeg"} />
                </div>
                <div className="name">{player.name}</div>
                <div className="point">
                  {displayPoints(
                    player.name,
                    currentGameweek[0].gameweekNumber
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Points;
