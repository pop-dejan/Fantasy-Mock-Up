import "../total-transfers/TotalTransfers.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import { firebase, database } from "../../help-files/firebase.js";
import { get, ref } from "firebase/database";
import Updating from "../updating/Updating";
import UserInfo from "../user-info/UserInfo";
import Finances from "../finances/Finances";

function TotalTransfers() {
  const userRef = ref(database, "usersFantasy/" + localStorage.getItem("id"));
  const playersRef = ref(database, "players");
  const updatingRef = ref(database, "updating");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState([]);
  const [players, setPlayers] = useState();
  const [updating, setUpdating] = useState();
  const [transfers, setTransfers] = useState("");
  const navigate = useNavigate();

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
      setUser(data1);
      setPlayers(data2);
      setUpdating(data3);
      if (data3.isUpdating) {
        navigate("/");
      }

      let transfers = [];
      data1.gameweeks.forEach((gameweek) => {
        if (gameweek.gameweekTransfers) {
          gameweek.gameweekTransfers.forEach((transfer) => {
            transfers.unshift(transfer);
          });
        }
      });

      setTransfers(transfers);
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
      <div className="page-wrapper-total grid gap-3">
        <div className="left-side g-col-12 g-col-lg-9">
          <div className="title-total">
            <p>Transfers</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>In</th>
                <th>Out</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((transfer, index) => (
                <tr key={index}>
                  <td className="date">{transfer[1]}</td>
                  <td className="player-in">{transfer[2]}</td>
                  <td className="player-out">{transfer[3]}</td>
                  <td className="active">GW{transfer[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="right-side g-col-12 g-col-lg-3">
          <UserInfo user={user}></UserInfo>
          <Finances user={user} players={players}></Finances>
        </div>
      </div>
    </>
  );
}

export default TotalTransfers;
