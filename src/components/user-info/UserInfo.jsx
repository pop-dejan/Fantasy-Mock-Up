import "../user-info/UserInfo.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { firebase, database } from "../../help-files/firebase.js";
import { get, ref } from "firebase/database";

function UserInfo({ user }) {
  const gameweekRef = ref(database, "currentGameweek");
  const [gameweeksInfo, setGameweeksInfo] = useState("");

  // Function calculating overall points
  function overallPoints(user) {
    let overallPoints = 0;

    if (user.gameweeks) {
      user.gameweeks.forEach((gameweek) => {
        overallPoints += gameweek.finalPoints;
      });
    } else {
      overallPoints = 0;
    }

    return overallPoints;
  }

  useEffect(() => {
    get(gameweekRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setGameweeksInfo(snapshot.val());
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  return (
    <>
      <div className="user-info">
        <div className="info-wrapper">
          <div className="names-wrapper">
            <p className="user-name">{user.firstName + " " + user.lastName}</p>
            <p className="team-name">{user.squadName}</p>
          </div>
          <img
            src={`https://flagcdn.com/w40/${user.countryCode.toLowerCase()}.jpg`}
            alt={user.countryOfOrigin + " " + "Flag"}
          ></img>
        </div>
        <div className="headline-wrapper">
          <div className="control-headline">
            <div className="gameweek">Points/Ranking</div>
          </div>
        </div>
        <div className="overall">
          <span>Overall points</span>
          <span>{overallPoints(user)}</span>
        </div>
        <div className="overall">
          <span>Overall rank</span>
          <span>{user.overallRank == 0 ? "-" : user.overallRank}</span>
        </div>
        <div className="overall">
          <span>Total players</span>
          <span>{gameweeksInfo.totalUsers}</span>
        </div>
        <div className="overall-gw">
          <span>Gameweek points</span>
          <span>
            {user.gameweeks
              ? user.gameweeks[user.gameweeks.length - 1].finalPoints
              : 0}
          </span>
        </div>
      </div>
    </>
  );
}

export default UserInfo;
