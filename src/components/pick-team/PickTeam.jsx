import "../pick-team/PickTeam.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../models/user.ts";
import _ from "lodash";
import getCookie from "../../help-files/getCookie";
import { firebase, database } from "../../help-files/firebase.js";
import { get, ref, set } from "firebase/database";
import ReactLoading from "react-loading";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function PickTeam() {
  const userRef = ref(database, "usersFantasy/" + getCookie("id"));
  const playersRef = ref(database, "players");
  const navigate = useNavigate();

  const [user, setUser] = useState([]);
  const [players, setPlayers] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [show, setShow] = useState(false);

  const [player, setPlayer] = useState();
  const [selectPlayer, setSelectPlayer] = useState();
  const [playerElement, setPlayerElement] = useState();
  const [pickTeam, setPickTeam] = useState(true);
  const [firstSwitch, setfirstSwitch] = useState(false);
  const [showPickTeamButton, setShowPickTeamButton] = useState(true);
  const [showUpdateMessage, setShowUpdateMessage] = useState(false);

  // Functions handling display of modal
  function handleShow(event, player) {
    setPlayer(player);
    setPlayerElement(event.currentTarget);
    setShow(true);
  }
  const handleClose = () => setShow(false);

  // Function handling player to be switched
  function handleSwitch(player) {
    let subsElements = document.querySelectorAll(".subs .player");
    let playersElements = document.querySelectorAll(".player");

    let defenceSubs = [];
    let midfieldSubs = [];
    let attackSubs = [];

    for (let i = 0; i < user.subs.length; i++) {
      if (user.subs[i].position === "def") {
        defenceSubs.push(user.subs[i]);
      } else if (user.subs[i].position === "mid") {
        midfieldSubs.push(user.subs[i]);
      } else if (user.subs[i].position === "att") {
        attackSubs.push(user.subs[i]);
      }
    }

    if (user.goalkeeper.includes(player)) {
      selectedPlayer();
      let subsGoalkeeper;

      for (let i = 0; i < user.subs.length; i++) {
        if (user.subs[i].position === "gkp") {
          subsGoalkeeper = user.subs[i];
        }
      }

      for (let i = 0; i < subsElements.length; i++) {
        if (subsElements[i].id === subsGoalkeeper.name) {
          selectedSub(subsElements[i]);
        }
      }

      subsGoalkeeper.switch2 = true;
    } else if (user.defence.includes(player)) {
      selectedPlayer();

      for (let i = 0; i < subsElements.length; i++) {
        for (let j = 0; j < defenceSubs.length; j++) {
          if (subsElements[i].id === defenceSubs[j].name) {
            selectedSub(subsElements[i]);
          }
        }
      }

      let midfieldFlag = false;
      if (
        (user.defence.length === 4 || user.defence.length === 5) &&
        (user.midfield.length === 4 || user.midfield.length === 3)
      ) {
        midfieldFlag = true;
      } else {
        midfieldFlag = false;
      }

      let attackFlag = false;
      if (
        (user.defence.length === 4 || user.defence.length === 5) &&
        (user.attack.length === 1 || user.attack.length === 2)
      ) {
        attackFlag = true;
      } else {
        attackFlag = false;
      }

      if (midfieldFlag == true) {
        for (let i = 0; i < subsElements.length; i++) {
          for (let j = 0; j < midfieldSubs.length; j++) {
            if (subsElements[i].id === midfieldSubs[j].name) {
              selectedSub(subsElements[i]);
            }
          }
        }

        for (let i = 0; i < midfieldSubs.length; i++) {
          midfieldSubs[i].switch2 = true;
        }
      }

      if (attackFlag == true) {
        for (let i = 0; i < subsElements.length; i++) {
          for (let j = 0; j < attackSubs.length; j++) {
            if (subsElements[i].id === attackSubs[j].name) {
              selectedSub(subsElements[i]);
            }
          }
        }

        for (let i = 0; i < attackSubs.length; i++) {
          attackSubs[i].switch2 = true;
        }
      }

      for (let i = 0; i < defenceSubs.length; i++) {
        defenceSubs[i].switch2 = true;
      }
    } else if (user.midfield.includes(player)) {
      selectedPlayer();

      for (let i = 0; i < subsElements.length; i++) {
        for (let j = 0; j < midfieldSubs.length; j++) {
          if (subsElements[i].id === midfieldSubs[j].name) {
            selectedSub(subsElements[i]);
          }
        }
      }

      let defenceFlag = false;
      if (
        (user.defence.length === 4 || user.defence.length === 3) &&
        (user.midfield.length === 4 || user.midfield.length === 5)
      ) {
        defenceFlag = true;
      } else {
        defenceFlag = false;
      }

      let attackFlag = false;
      if (
        (user.midfield.length === 4 || user.midfield.length === 5) &&
        (user.attack.length === 1 || user.attack.length === 2)
      ) {
        attackFlag = true;
      } else {
        attackFlag = false;
      }

      if (defenceFlag == true) {
        for (let i = 0; i < subsElements.length; i++) {
          for (let j = 0; j < defenceSubs.length; j++) {
            if (subsElements[i].id === defenceSubs[j].name) {
              selectedSub(subsElements[i]);
            }
          }
        }

        for (let i = 0; i < defenceSubs.length; i++) {
          defenceSubs[i].switch2 = true;
        }
      }

      if (attackFlag == true) {
        for (let i = 0; i < subsElements.length; i++) {
          for (let j = 0; j < attackSubs.length; j++) {
            if (subsElements[i].id === attackSubs[j].name) {
              selectedSub(subsElements[i]);
            }
          }
        }

        for (let i = 0; i < attackSubs.length; i++) {
          attackSubs[i].switch2 = true;
        }
      }

      for (let i = 0; i < midfieldSubs.length; i++) {
        midfieldSubs[i].switch2 = true;
      }
    } else if (user.attack.includes(player)) {
      selectedPlayer();
      for (let i = 0; i < subsElements.length; i++) {
        for (let j = 0; j < attackSubs.length; j++) {
          if (subsElements[i].id === attackSubs[j].name) {
            selectedSub(subsElements[i]);
          }
        }
      }

      let defenceFlag = false;
      if (
        (user.defence.length === 4 || user.defence.length === 3) &&
        (user.attack.length === 3 || user.attack.length === 2)
      ) {
        defenceFlag = true;
      } else {
        defenceFlag = false;
      }

      let midfieldFlag = false;
      if (
        (user.midfield.length === 4 || user.midfield.length === 3) &&
        (user.attack.length === 3 || user.attack.length === 2)
      ) {
        midfieldFlag = true;
      } else {
        midfieldFlag = false;
      }

      if (defenceFlag == true) {
        for (let i = 0; i < subsElements.length; i++) {
          for (let j = 0; j < defenceSubs.length; j++) {
            if (subsElements[i].id === defenceSubs[j].name) {
              selectedSub(subsElements[i]);
            }
          }
        }

        for (let i = 0; i < defenceSubs.length; i++) {
          defenceSubs[i].switch2 = true;
        }
      }

      if (midfieldFlag == true) {
        for (let i = 0; i < subsElements.length; i++) {
          for (let j = 0; j < midfieldSubs.length; j++) {
            if (subsElements[i].id === midfieldSubs[j].name) {
              selectedSub(subsElements[i]);
            }
          }
        }

        for (let i = 0; i < midfieldSubs.length; i++) {
          midfieldSubs[i].switch2 = true;
        }
      }

      for (let i = 0; i < attackSubs.length; i++) {
        attackSubs[i].switch2 = true;
      }
    } else if (user.subs.includes(player)) {
      if (player.position === "gkp") {
        selectedPlayer();

        for (let i = 0; i < playersElements.length; i++) {
          if (playersElements[i].id === user.goalkeeper[0].name) {
            selectedSub(playersElements[i]);
          }
        }

        buttonsVisibility(player);
        user.goalkeeper[0].switch2 = true;
        setShowPickTeamButton(true);
        setShowUpdateMessage(false);
        setUser(user);
        setPickTeam(true);
        setShow(false);
      } else if (player.position === "def") {
        selectedPlayer();

        for (let i = 0; i < playersElements.length; i++) {
          for (let j = 0; j < user.defence.length; j++) {
            if (playersElements[i].id === user.defence[j].name) {
              selectedSub(playersElements[i]);
            }
          }
        }

        let midfieldFlag = false;
        if (
          (user.defence.length === 3 || user.defence.length === 4) &&
          (user.midfield.length === 5 || user.midfield.length === 4)
        ) {
          midfieldFlag = true;
        } else {
          midfieldFlag = false;
        }

        let attackFlag = false;
        if (
          (user.defence.length === 3 || user.defence.length === 4) &&
          (user.attack.length === 2 || user.attack.length === 3)
        ) {
          attackFlag = true;
        } else {
          attackFlag = false;
        }

        if (midfieldFlag == true) {
          for (let i = 0; i < playersElements.length; i++) {
            for (let j = 0; j < user.midfield.length; j++) {
              if (playersElements[i].id === user.midfield[j].name) {
                selectedSub(playersElements[i]);
              }
            }
          }

          for (let i = 0; i < user.midfield.length; i++) {
            user.midfield[i].switch2 = true;
          }
        }

        if (attackFlag == true) {
          for (let i = 0; i < playersElements.length; i++) {
            for (let j = 0; j < user.attack.length; j++) {
              if (playersElements[i].id === user.attack[j].name) {
                selectedSub(playersElements[i]);
              }
            }
          }

          for (let i = 0; i < user.attack.length; i++) {
            user.attack[i].switch2 = true;
          }
        }

        for (let i = 0; i < user.defence.length; i++) {
          user.defence[i].switch2 = true;
        }

        for (let i = 1; i < user.subs.length; i++) {
          if (user.subs[i] !== player) {
            user.subs[i].switch2 = true;
          }
        }

        for (let i = 1; i < subsElements.length; i++) {
          if (subsElements[i].id !== player.name) {
            selectedSub(subsElements[i]);
          }
        }

        buttonsVisibility(player);
        setShowPickTeamButton(true);
        setShowUpdateMessage(false);
        setUser(user);
        setPickTeam(true);
        setShow(false);
      } else if (player.position === "mid") {
        selectedPlayer();

        for (let i = 0; i < playersElements.length; i++) {
          for (let j = 0; j < user.midfield.length; j++) {
            if (playersElements[i].id === user.midfield[j].name) {
              selectedSub(playersElements[i]);
            }
          }
        }

        let defenceFlag = false;
        if (
          (user.defence.length === 4 || user.defence.length === 5) &&
          (user.midfield.length === 3 || user.midfield.length === 4)
        ) {
          defenceFlag = true;
        } else {
          defenceFlag = false;
        }

        let attackFlag = false;
        if (
          (user.midfield.length === 3 || user.midfield.length === 4) &&
          (user.attack.length === 2 || user.attack.length === 3)
        ) {
          attackFlag = true;
        } else {
          attackFlag = false;
        }

        if (defenceFlag == true) {
          for (let i = 0; i < playersElements.length; i++) {
            for (let j = 0; j < user.defence.length; j++) {
              if (playersElements[i].id === user.defence[j].name) {
                selectedSub(playersElements[i]);
              }
            }
          }

          for (let i = 0; i < user.defence.length; i++) {
            user.defence[i].switch2 = true;
          }
        }

        if (attackFlag == true) {
          for (let i = 0; i < playersElements.length; i++) {
            for (let j = 0; j < user.attack.length; j++) {
              if (playersElements[i].id === user.attack[j].name) {
                selectedSub(playersElements[i]);
              }
            }
          }

          for (let i = 0; i < user.attack.length; i++) {
            user.attack[i].switch2 = true;
          }
        }

        for (let i = 0; i < user.midfield.length; i++) {
          user.midfield[i].switch2 = true;
        }

        for (let i = 1; i < user.subs.length; i++) {
          if (user.subs[i] !== player) {
            user.subs[i].switch2 = true;
          }
        }

        for (let i = 1; i < subsElements.length; i++) {
          if (subsElements[i].id !== player.name) {
            selectedSub(subsElements[i]);
          }
        }

        buttonsVisibility(player);
        setShowPickTeamButton(true);
        setShowUpdateMessage(false);
        setUser(user);
        setPickTeam(true);
        setShow(false);
      } else if (player.position === "att") {
        selectedPlayer();

        for (let i = 0; i < playersElements.length; i++) {
          for (let j = 0; j < user.attack.length; j++) {
            if (playersElements[i].id === user.attack[j].name) {
              selectedSub(playersElements[i]);
            }
          }
        }

        let defenceFlag = false;
        if (
          (user.defence.length === 4 || user.defence.length === 5) &&
          (user.attack.length === 1 || user.attack.length === 2)
        ) {
          defenceFlag = true;
        } else {
          defenceFlag = false;
        }

        let midfieldFlag = false;
        if (
          (user.midfield.length === 4 || user.midfield.length === 5) &&
          (user.attack.length === 1 || user.attack.length === 2)
        ) {
          midfieldFlag = true;
        } else {
          midfieldFlag = false;
        }

        if (defenceFlag == true) {
          for (let i = 0; i < playersElements.length; i++) {
            for (let j = 0; j < user.defence.length; j++) {
              if (playersElements[i].id === user.defence[j].name) {
                selectedSub(playersElements[i]);
              }
            }
          }

          for (let i = 0; i < user.defence.length; i++) {
            user.defence[i].switch2 = true;
          }
        }

        if (midfieldFlag == true) {
          for (let i = 0; i < playersElements.length; i++) {
            for (let j = 0; j < user.midfield.length; j++) {
              if (playersElements[i].id === user.midfield[j].name) {
                selectedSub(playersElements[i]);
              }
            }
          }

          for (let i = 0; i < user.midfield.length; i++) {
            user.midfield[i].switch2 = true;
          }
        }

        for (let i = 0; i < user.attack.length; i++) {
          user.attack[i].switch2 = true;
        }

        for (let i = 1; i < user.subs.length; i++) {
          if (user.subs[i] !== player) {
            user.subs[i].switch2 = true;
          }
        }

        for (let i = 1; i < subsElements.length; i++) {
          if (subsElements[i].id !== player.name) {
            selectedSub(subsElements[i]);
          }
        }
      }
    }
    setShowPickTeamButton(true);
    setShowUpdateMessage(false);
    setUser(user);
    setPickTeam(true);
    buttonsVisibility(player);
    setSelectPlayer(player);
    setShow(false);
  }

  // Function handling final switch of two players
  function handleSwitchFinal(player) {
    let playersElements = document.querySelectorAll(".player");
    let selectedPlayer;
    let playerToSub;

    for (let i = 0; i < players.length; i++) {
      if (players[i].name === player.name) {
        selectedPlayer = players[i];
      } else if (players[i].name === selectPlayer.name) {
        playerToSub = players[i];
      }
    }

    let isSelectedPlayerInArray = user.subs.some(
      (obj) => obj.name === selectedPlayer.name
    );
    let isPlayerToSubInArray = user.subs.some(
      (obj) => obj.name === playerToSub.name
    );

    if (isSelectedPlayerInArray) {
      if (isPlayerToSubInArray) {
        let indexSelectedPlayer = user.subs.findIndex(
          (obj) => obj.name === selectedPlayer.name
        );
        let indexPlayerToSub = user.subs.findIndex(
          (obj) => obj.name === playerToSub.name
        );
        [user.subs[indexSelectedPlayer], user.subs[indexPlayerToSub]] = [
          user.subs[indexPlayerToSub],
          user.subs[indexSelectedPlayer],
        ];

        playersElements.forEach((player) => {
          player.style.opacity = "1";
          player.style.backgroundColor = "transparent";
        });

        let userTemp = user;
        userTemp = new User(userTemp);
        setUser(userTemp);
        setfirstSwitch(true);
        setPickTeam(false);
        setShow(false);
      } else {
        user.subs = user.subs.filter((obj) => obj.name !== selectedPlayer.name);
        if (playerToSub.position === "gkp") {
          user.subs.unshift(playerToSub);
        } else {
          user.subs.push(playerToSub);
        }

        if (selectedPlayer.position === "gkp") {
          user.goalkeeper.push(selectedPlayer);
        } else if (selectedPlayer.position === "def") {
          user.defence.push(selectedPlayer);
        } else if (selectedPlayer.position === "mid") {
          user.midfield.push(selectedPlayer);
        } else if (selectedPlayer.position === "att") {
          user.attack.push(selectedPlayer);
        }

        if (playerToSub.position === "gkp") {
          user.goalkeeper = user.goalkeeper.filter(
            (obj) => obj.name !== playerToSub.name
          );
        } else if (playerToSub.position === "def") {
          user.defence = user.defence.filter(
            (obj) => obj.name !== playerToSub.name
          );
        } else if (playerToSub.position === "mid") {
          user.midfield = user.midfield.filter(
            (obj) => obj.name !== playerToSub.name
          );
        } else if (playerToSub.position === "att") {
          user.attack = user.attack.filter(
            (obj) => obj.name !== playerToSub.name
          );
        }

        playersElements.forEach((player) => {
          player.style.opacity = "1";
          player.style.backgroundColor = "transparent";
        });

        let userTemp = user;
        userTemp = new User(userTemp);
        setUser(userTemp);
        setfirstSwitch(true);
        setPickTeam(false);
        setShow(false);
      }
    } else {
      user.subs = user.subs.filter((obj) => obj.name !== playerToSub.name);
      if (selectedPlayer.position === "gkp") {
        user.subs.unshift(selectedPlayer);
      } else {
        user.subs.push(selectedPlayer);
      }

      if (playerToSub.position === "gkp") {
        user.goalkeeper.push(playerToSub);
      } else if (playerToSub.position === "def") {
        user.defence.push(playerToSub);
      } else if (playerToSub.position === "mid") {
        user.midfield.push(playerToSub);
      } else if (playerToSub.position === "att") {
        user.attack.push(playerToSub);
      }

      if (selectedPlayer.position === "gkp") {
        user.goalkeeper = user.goalkeeper.filter(
          (obj) => obj.name !== selectedPlayer.name
        );
      } else if (selectedPlayer.position === "def") {
        user.defence = user.defence.filter(
          (obj) => obj.name !== selectedPlayer.name
        );
      } else if (selectedPlayer.position === "mid") {
        user.midfield = user.midfield.filter(
          (obj) => obj.name !== selectedPlayer.name
        );
      } else if (selectedPlayer.position === "att") {
        user.attack = user.attack.filter(
          (obj) => obj.name !== selectedPlayer.name
        );
      }

      playersElements.forEach((player) => {
        player.style.opacity = "1";
        player.style.backgroundColor = "transparent";
      });

      let userTemp = user;
      userTemp = new User(userTemp);
      setUser(userTemp);
      setfirstSwitch(true);
      setPickTeam(false);
      setShow(false);
    }
  }

  // Function that handle canceling selected player to be switched
  function handleCancel(player) {
    const allPlayers = [
      ...user.goalkeeper,
      ...user.defence,
      ...user.midfield,
      ...user.attack,
      ...user.subs,
    ];

    let playersElements = document.querySelectorAll(".player");

    playersElements.forEach((player) => {
      player.style.opacity = "1";
      player.style.backgroundColor = "transparent";
    });

    player.switch = true;
    player.cancel = false;

    for (let i = 0; i < allPlayers.length; i++) {
      allPlayers[i].switch = true;
      allPlayers[i].switch2 = false;
    }

    if (firstSwitch == false) {
      setPickTeam(true);
    } else {
      setPickTeam(false);
    }
    setUser(user);
    setShow(false);
  }

  // Function that determines what buttons will be shown in modal based on parametars
  function buttonsVisibility(player) {
    const allPlayers = [
      ...user.goalkeeper,
      ...user.defence,
      ...user.midfield,
      ...user.attack,
      ...user.subs,
    ];
    player.switch = false;
    player.cancel = true;

    user.goalkeeper[0].switch = false;
    for (let i = 0; i < allPlayers.length; i++) {
      allPlayers[i].switch = false;
    }
    setUser(user);
  }

  // Function highlighting the player that is chosen to be switched
  function selectedPlayer() {
    let playersElements = document.querySelectorAll(".player");
    playersElements.forEach((player) => {
      player.style.opacity = "0.6";
    });

    playerElement.style.opacity = "1";
    playerElement.classList.add("selected");
    playerElement.style.backgroundColor = "rgba(255, 255, 0, 0.6)";
  }

  // Function highlighting substitution to replace selected player
  function selectedSub(element) {
    element.style.opacity = "1";
    element.classList.add("selected");
    element.style.backgroundColor = "rgba(255, 102, 0, 0.6)";
  }

  // Function handling render of switch button
  function switchButton(player) {
    if (player.switch == false) {
      return false;
    } else {
      return true;
    }
  }

  // Function handling render of final switch button
  function switchButtonFinal(player) {
    if (player.switch2 == true) {
      return true;
    } else {
      return false;
    }
  }

  // Function handling render of cancel button
  function cancelButton(player) {
    if (player.cancel == true) {
      return true;
    } else {
      return false;
    }
  }

  // Function handling pick team function
  function handlePickTeam() {
    updateUser();
  }

  // Fetching user and players from database and handling render of loading and error interface
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setIsLoading(true);
      const [snapshot1, snapshot2] = await Promise.all([
        get(userRef),
        get(playersRef),
      ]);

      const data1 = snapshot1.val();
      const data2 = snapshot2.val();

      setUser(data1);
      setPlayers(data2);
    } catch (error) {
      setError(error.message);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  // Updating user in database and handling render of loading and error interface
  function updateUser() {
    setIsLoading(true);
    set(userRef, user)
      .then(() => {
        getData();
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setShowPickTeamButton(false);
        setShowUpdateMessage(true);
        setfirstSwitch(false);
        setPickTeam(true);
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
      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Button
            variant="primary"
            className="btn-close a"
            onClick={handleClose}
          ></Button>
          <Modal.Title>{player && player.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {player && switchButton(player) && (
            <Button
              variant="primary"
              className="btn btn-secondary switch"
              onClick={() => handleSwitch(player)}
            >
              Switch
            </Button>
          )}
          {player && switchButtonFinal(player) && (
            <Button
              variant="primary"
              className="btn btn-secondary switch"
              onClick={() => handleSwitchFinal(player)}
            >
              Switch
            </Button>
          )}
          <Button
            variant="primary"
            className="btn btn-secondary info"
            onClick={handleClose}
          >
            View Informattion
          </Button>
          {player && cancelButton(player) && (
            <Button
              variant="primary"
              className="btn btn-secondary cancel"
              onClick={() => handleCancel(player)}
            >
              Cancel
            </Button>
          )}
        </Modal.Body>
      </Modal>

      <div className="title-pick">
        <p>Pick Team</p>
        <p className="squad-name">- {user && user.squadName}</p>
      </div>
      <div className="down">
        <div className="upper-wrapper">
          <div className="control-wrapper">
            <div className="control-headline">
              <div className="gameweek">Gameweek 25</div>
            </div>
            <div className="timeline">
              <span className="week">Gameweek 25 deadline:</span>
              <span className="time">Sat 17 Feb 12:00</span>
            </div>
          </div>
          <div className="info">
            To change your player use the menu which appears when clicking on a
            player.
          </div>
        </div>
        <div className="pitch-wrapper">
          <div className="goalkepper">
            <div
              className="player"
              id={user.goalkeeper[0].name}
              onClick={(event) => handleShow(event, user.goalkeeper[0])}
            >
              <div className="kit">
                <img
                  src={user ? `src/${user.goalkeeper[0].kit_src}` : ""}
                  alt={user ? `${user.goalkeeper[0].club}.jpg` : ""}
                />
              </div>
              <div className="name">{user && user.goalkeeper[0].name}</div>
              <div className="club">{user && user.goalkeeper[0].club}</div>
            </div>
          </div>
          <div className="defence">
            {user &&
              user.defence.map((player, index) => (
                <div
                  className="player"
                  id={player.name}
                  key={index}
                  onClick={(event) => handleShow(event, player)}
                >
                  <div className="kit">
                    <img
                      src={"src/" + player.kit_src}
                      alt={player.club + ".jpeg"}
                    />
                  </div>
                  <div className="name">{player.name}</div>
                  <div className="club">{player.club}</div>
                </div>
              ))}
          </div>
          <div className="midfield">
            {user &&
              user.midfield.map((player, index) => (
                <div
                  className="player"
                  id={player.name}
                  key={index}
                  onClick={(event) => handleShow(event, player)}
                >
                  <div className="kit">
                    <img
                      src={"src/" + player.kit_src}
                      alt={player.club + ".jpeg"}
                    />
                  </div>
                  <div className="name">{player.name}</div>
                  <div className="club">{player.club}</div>
                </div>
              ))}
          </div>
          <div className="attack">
            {user &&
              user.attack.map((player, index) => (
                <div
                  className="player"
                  id={player.name}
                  key={index}
                  onClick={(event) => handleShow(event, player)}
                >
                  <div className="kit">
                    <img
                      src={"src/" + player.kit_src}
                      alt={player.club + ".jpeg"}
                    />
                  </div>
                  <div className="name">{player.name}</div>
                  <div className="club">{player.club}</div>
                </div>
              ))}
          </div>
          <div className="subs">
            {user &&
              user.subs.map((player, index) => (
                <div
                  id={player.name}
                  className="player"
                  key={index}
                  onClick={(event) => handleShow(event, player)}
                >
                  <div className="position-pick">
                    {player.position.toUpperCase()}
                  </div>
                  <div className="kit">
                    <img
                      src={"src/" + player.kit_src}
                      alt={player.club + ".jpeg"}
                    />
                  </div>
                  <div className="name">{player.name}</div>
                  <div className="club">{player.club}</div>
                </div>
              ))}
          </div>
        </div>
        {showUpdateMessage && (
          <div className="update-message">Your team has been saved.</div>
        )}
        {showPickTeamButton && (
          <button
            className="save-team"
            disabled={pickTeam}
            onClick={() => handlePickTeam()}
          >
            Save Your Team
          </button>
        )}
      </div>
    </>
  );
}

export default PickTeam;
