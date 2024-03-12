import "../points/Points.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import getCookie from "../../help-files/getCookie";
import { firebase, database } from "../../help-files/firebase.js";
import { get, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";

function Points() {
  const navigate = useNavigate();
  const userRef = ref(database, "usersFantasy/" + getCookie("id"));
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function calculating total points
  function totalPoints() {
    let totalPointsVar = 0;
    const allPlayers = [
      ...user.goalkeeper,
      ...user.defence,
      ...user.midfield,
      ...user.attack,
    ];

    for (let i = 0; i < allPlayers.length; i++) {
      totalPointsVar = totalPointsVar + allPlayers[i].points;
    }

    return totalPointsVar;
  }

  // Fetching data from database and handling display of loading and error interface
  useEffect(() => {
    getUser();
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  function getUser() {
    get(userRef)
      .then((snapshot) => {
        setIsLoading(true);
        if (snapshot.exists()) {
          setUser(snapshot.val());
        } else {
          setError("No data available for this user.");
        }
      })
      .catch((error) => {
        setError(error.message);
        navigate("/");
      })
      .finally(() => {
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

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <>
      <div className="title-pts">
        <p>Points</p>
        <p className="squad-name">- {user && user.squadName}</p>
      </div>
      <div className="down">
        <div className="upper-wrapper-points">
          <div className="gameweek-points">Gameweek 25</div>
          <div className="points-stats">
            <div className="average">
              <p className="average-up">Average Points</p>
              <p className="average-down">62</p>
            </div>
            <div className="points-counter">
              <p className="counter-text">Final Points</p>
              <p className="points-final">{user && totalPoints()}</p>
            </div>
            <div className="rank">
              <p className="rank-up">GW Rank</p>
              <p className="rank-down">6,558,990</p>
            </div>
          </div>
        </div>
        <div className="pitch-wrapper">
          <div className="goalkepper">
            <div className="player-points" id={user.goalkeeper[0].name}>
              <div className="kit">
                <img
                  src={user ? `src/${user.goalkeeper[0].kit_src}` : ""}
                  alt={user ? `${user.goalkeeper[0].club}.jpg` : ""}
                />
              </div>
              <div className="name">{user && user.goalkeeper[0].name}</div>
              <div className="point">{user && user.goalkeeper[0].points}</div>
            </div>
          </div>
          <div className="defence">
            {user &&
              user.defence.map((player, index) => (
                <div className="player-points" id={player.name} key={index}>
                  <div className="kit">
                    <img
                      src={"src/" + player.kit_src}
                      alt={player.club + ".jpeg"}
                    />
                  </div>
                  <div className="name">{player.name}</div>
                  <div className="point">{player.points}</div>
                </div>
              ))}
          </div>
          <div className="midfield">
            {user &&
              user.midfield.map((player, index) => (
                <div className="player-points" id={player.name} key={index}>
                  <div className="kit">
                    <img
                      src={"src/" + player.kit_src}
                      alt={player.club + ".jpeg"}
                    />
                  </div>
                  <div className="name">{player.name}</div>
                  <div className="point">{player.points}</div>
                </div>
              ))}
          </div>
          <div className="attack">
            {user &&
              user.attack.map((player, index) => (
                <div className="player-points" id={player.name} key={index}>
                  <div className="kit">
                    <img
                      src={"src/" + player.kit_src}
                      alt={player.club + ".jpeg"}
                    />
                  </div>
                  <div className="name">{player.name}</div>
                  <div className="point">{player.points}</div>
                </div>
              ))}
          </div>
          <div className="subs">
            {user &&
              user.subs.map((player, index) => (
                <div id={player.name} className="player-points" key={index}>
                  <div className="position-points">
                    {player.position.toUpperCase()}
                  </div>
                  <div className="kit">
                    <img
                      src={"src/" + player.kit_src}
                      alt={player.club + ".jpeg"}
                    />
                  </div>
                  <div className="name">{player.name}</div>
                  <div className="point">{player.points}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Points;
