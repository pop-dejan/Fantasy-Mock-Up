import "../gameweek-history/GameweekHistory.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import { firebase, database } from "../../help-files/firebase.js";
import { get, ref } from "firebase/database";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import Updating from "../updating/Updating.jsx";
import UserInfo from "../user-info/UserInfo.jsx";
import Finances from "../finances/Finances.jsx";

function GameweekHistory() {
  const userRef = ref(database, "usersFantasy/" + localStorage.getItem("id"));
  const playersRef = ref(database, "players");
  const updatingRef = ref(database, "updating");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState([]);
  const [players, setPlayers] = useState();
  const [updating, setUpdating] = useState();
  const navigate = useNavigate();

  // Function for displaying movement icons
  function displayMovement(movement) {
    if (movement === "equal") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          className="equal"
        >
          <rect width="8" height="2" x="4" y="7" fillRule="evenodd"></rect>
        </svg>
      );
    } else if (movement === "up") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          status="up"
          className="up"
        >
          <title>up</title>
          <g fillRule="evenodd">
            <path d="M8,16 C8.85354691,16 9.67587305,15.866328 10.4471863,15.618776 C13.6684789,14.5849062 16,11.5647311 16,8 C16,3.581722 12.418278,0 8,0 C3.581722,0 0,3.581722 0,8 C0,12.418278 3.581722,16 8,16 Z"></path>
            <path
              fillRule="nonzero"
              fill="currentColor"
              d="M4.5,6.27851588 L5.1004646,5.63925794 C5.43077928,5.2876031 5.70475818,5 5.70967916,5 C5.71460014,5 6.23194007,5.54639596 6.85921456,6.2144865 L8,7.428973 L9.14078544,6.2144865 C9.76831893,5.5467015 10.2856309,5 10.2903208,5 C10.2952427,5 10.5695007,5.28761055 10.8995354,5.63925794 L11.5,6.27851588 L9.75217699,8.13925794 C8.79080084,9.16274432 8.00246399,10 8.000014,10 C7.99756401,10 7.20894716,9.16281884 6.24785101,8.13925794 L4.5,6.27851588 Z"
              transform="matrix(1 0 0 -1 0 15)"
            ></path>
          </g>
        </svg>
      );
    } else if (movement === "down") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          status="down"
          className="down"
        >
          <title>down</title>
          <g fillRule="evenodd">
            <path d="M8,16 C8.85354691,16 9.67587305,15.866328 10.4471863,15.618776 C13.6684789,14.5849062 16,11.5647311 16,8 C16,3.581722 12.418278,0 8,0 C3.581722,0 0,3.581722 0,8 C0,12.418278 3.581722,16 8,16 Z"></path>
            <path
              fillRule="nonzero"
              fill="currentColor"
              d="M4.5,6.27851588 L5.1004646,5.63925794 C5.43077928,5.2876031 5.70475818,5 5.70967916,5 C5.71460014,5 6.23194007,5.54639596 6.85921456,6.2144865 L8,7.428973 L9.14078544,6.2144865 C9.76831893,5.5467015 10.2856309,5 10.2903208,5 C10.2952427,5 10.5695007,5.28761055 10.8995354,5.63925794 L11.5,6.27851588 L9.75217699,8.13925794 C8.79080084,9.16274432 8.00246399,10 8.000014,10 C7.99756401,10 7.20894716,9.16281884 6.24785101,8.13925794 L4.5,6.27851588 Z"
              transform="matrix(1 0 0 -1 0 15)"
            ></path>
          </g>
        </svg>
      );
    } else if (movement === "notAdded") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          status="same"
          className="notAdded"
        >
          <title>same</title>
          <g fillRule="evenodd">
            <path d="M8,16 C8.85354691,16 9.67587305,15.866328 10.4471863,15.618776 C13.6684789,14.5849062 16,11.5647311 16,8 C16,3.581722 12.418278,0 8,0 C3.581722,0 0,3.581722 0,8 C0,12.418278 3.581722,16 8,16 Z"></path>
            <path
              fill="currentColor"
              fillRule="nonzero"
              d="M4.5,6.27851588 L5.1004646,5.63925794 C5.43077928,5.2876031 5.70475818,5 5.70967916,5 C5.71460014,5 6.23194007,5.54639596 6.85921456,6.2144865 L8,7.428973 L9.14078544,6.2144865 C9.76831893,5.5467015 10.2856309,5 10.2903208,5 C10.2952427,5 10.5695007,5.28761055 10.8995354,5.63925794 L11.5,6.27851588 L9.75217699,8.13925794 C8.79080084,9.16274432 8.00246399,10 8.000014,10 C7.99756401,10 7.20894716,9.16281884 6.24785101,8.13925794 L4.5,6.27851588 Z"
              transform="matrix(1 0 0 -1 0 15)"
            ></path>
          </g>
        </svg>
      );
    }
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
      const [snapshot1, snapshot2, snapshot3] = await Promise.all([
        get(userRef),
        get(playersRef),
        get(updatingRef),
      ]);

      const data1 = snapshot1.val();
      const data2 = snapshot2.val();
      const data3 = snapshot3.val();

      for (let i = 1; i < data1.gameweeks.length; i++) {
        let currentObject = data1.gameweeks[i];
        let previousObject = data1.gameweeks[i - 1];

        let currentValue = 0;
        if (currentObject.overallRank) {
          currentValue = currentObject.overallRank;
        } else {
          currentValue = 0;
        }

        let previousValue = 0;
        if (previousObject.overallRank) {
          previousValue = previousObject.overallRank;
        } else {
          previousValue = 0;
        }

        if (currentValue == 0) {
          data1.gameweeks[i].movement = "notAdded";
        } else {
          if (currentValue > previousValue) {
            data1.gameweeks[i].movement = "down";
          } else if (currentValue < previousValue) {
            data1.gameweeks[i].movement = "up";
          } else {
            data1.gameweeks[i].movement = "equal";
          }
        }
      }

      setUser(data1);
      setPlayers(data2);
      setUpdating(data3);
      if (data3.isUpdating) {
        navigate("/");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="page-wrapper-history grid gap-3">
        <div className="left-side g-col-12 g-col-lg-9">
          <div className="title-history">
            <p>Entry History</p>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>
                    <Tippy
                      theme="light"
                      content={<span>Gameweek</span>}
                      arrow={true}
                    >
                      <span className="gameweek th-text">GW</span>
                    </Tippy>
                  </th>

                  <th>
                    <Tippy
                      theme="light"
                      content={<span>Overall Rank</span>}
                      arrow={true}
                    >
                      <span className="overall-rank th-text">OR</span>
                    </Tippy>
                  </th>
                  <th>
                    <Tippy
                      theme="light"
                      content={<span>Movement</span>}
                      arrow={true}
                    >
                      <span className="movement th-text">#</span>
                    </Tippy>
                  </th>
                  <th>
                    <Tippy
                      theme="light"
                      content={<span>Overall Points</span>}
                      arrow={true}
                    >
                      <span className="overall-points th-text">OP</span>
                    </Tippy>
                  </th>
                  <th>
                    <Tippy
                      theme="light"
                      content={<span>Gameweek Rank</span>}
                      arrow={true}
                    >
                      <span className="gameweek-rank th-text">GWR</span>
                    </Tippy>
                  </th>
                  <th>
                    <Tippy
                      theme="light"
                      content={<span>Gameweek Points</span>}
                      arrow={true}
                    >
                      <span className="gameweek-points th-text">GWP</span>
                    </Tippy>
                  </th>
                  <th>
                    <Tippy
                      theme="light"
                      content={<span>Points on Bench</span>}
                      arrow={true}
                    >
                      <span className="bench-points th-text">PB</span>
                    </Tippy>
                  </th>
                  <th>
                    <Tippy
                      theme="light"
                      content={<span>Transfers Made</span>}
                      arrow={true}
                    >
                      <span className="transfers-made th-text">TM</span>
                    </Tippy>
                  </th>
                  <th>
                    <Tippy
                      theme="light"
                      content={<span>Transfers Cost</span>}
                      arrow={true}
                    >
                      <span className="transfers-cost th-text">TC</span>
                    </Tippy>
                  </th>
                  <th>
                    <Tippy
                      theme="light"
                      content={<span>Squad Value</span>}
                      arrow={true}
                    >
                      <span className="squad-value th-text">£</span>
                    </Tippy>
                  </th>
                </tr>
              </thead>
              <tbody>
                {user.gameweeks
                  .slice()
                  .reverse()
                  .map((gameweek, index) => (
                    <tr key={index}>
                      <td className="gw-number">GW{gameweek.gameweekNumber}</td>
                      <td>
                        {gameweek.overallRank
                          ? gameweek.overallRank
                          : user.gameweeks[user.gameweeks.length - 2]
                              .overallRank}
                      </td>
                      <td>
                        {index == user.gameweeks.length - 1 ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            className="Movement__NewIcon-sc-1c1p7cw-0 fRjETA"
                          >
                            <rect
                              width="8"
                              height="2"
                              x="4"
                              y="7"
                              fillRule="evenodd"
                            ></rect>
                          </svg>
                        ) : (
                          displayMovement(gameweek.movement)
                        )}
                      </td>
                      <td>
                        {gameweek.overallPoints
                          ? gameweek.overallPoints
                          : user.gameweeks[user.gameweeks.length - 2]
                              .overallPoints}
                      </td>
                      <td>
                        {gameweek.gameweekRank ? gameweek.gameweekRank : "-"}
                      </td>
                      <td>{gameweek.finalPoints ? gameweek.finalPoints : 0}</td>
                      <td>{gameweek.benchPoints ? gameweek.benchPoints : 0}</td>
                      <td>
                        {gameweek.gameweekTransfersCount
                          ? gameweek.gameweekTransfersCount
                          : 0}
                      </td>
                      <td>
                        {gameweek.gameweekCostCount
                          ? gameweek.gameweekCostCount
                          : 0}
                      </td>
                      <td>
                        {gameweek.squadValue
                          ? Number(gameweek.squadValue).toFixed(1)
                          : "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="right-side g-col-12 g-col-lg-3">
          <UserInfo user={user}></UserInfo>
          <Finances user={user} players={players}></Finances>
        </div>
      </div>
    </>
  );
}

export default GameweekHistory;
