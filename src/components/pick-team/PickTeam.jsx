import "./PickTeam.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../models/user.ts";
import _ from "lodash";
import { firebase, database } from "../../help-files/firebase.js";
import { get, ref, set } from "firebase/database";
import Fixtures from "../fixtures/Fixtures.jsx";
import ReactLoading from "react-loading";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Updating from "../updating/Updating.jsx";

function PickTeam() {
  const userRef = ref(database, "usersFantasy/" + localStorage.getItem("id"));
  const playersRef = ref(database, "players");
  const gameweekRef = ref(database, "currentGameweek");
  const updatingRef = ref(database, "updating");
  const navigate = useNavigate();

  const [user, setUser] = useState([]);
  const [players, setPlayers] = useState();
  const [gameweekInfo, setGameweekInfo] = useState();
  const [updating, setUpdating] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [show, setShow] = useState(false);

  const [player, setPlayer] = useState();
  const [selectPlayer, setSelectPlayer] = useState();
  const [playerElement, setPlayerElement] = useState();
  const [initialCaptain, setInitialCaptain] = useState("");
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
    let userTemp = user;

    for (let i = 0; i < userTemp.subs.length; i++) {
      if (userTemp.subs[i].position === "def") {
        defenceSubs.push(userTemp.subs[i]);
      } else if (userTemp.subs[i].position === "mid") {
        midfieldSubs.push(userTemp.subs[i]);
      } else if (userTemp.subs[i].position === "att") {
        attackSubs.push(userTemp.subs[i]);
      }
    }

    if (userTemp.goalkeeper.includes(player)) {
      selectedPlayer();
      let subsGoalkeeper;

      for (let i = 0; i < userTemp.subs.length; i++) {
        if (userTemp.subs[i].position === "gkp") {
          subsGoalkeeper = userTemp.subs[i];
        }
      }

      for (let i = 0; i < subsElements.length; i++) {
        if (subsElements[i].id === subsGoalkeeper.name) {
          selectedSub(subsElements[i]);
        }
      }

      subsGoalkeeper.switch2 = true;
    } else if (userTemp.defence.includes(player)) {
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
        (userTemp.defence.length === 4 || userTemp.defence.length === 5) &&
        (userTemp.midfield.length === 4 || userTemp.midfield.length === 3)
      ) {
        midfieldFlag = true;
      } else {
        midfieldFlag = false;
      }

      let attackFlag = false;
      if (
        (userTemp.defence.length === 4 || userTemp.defence.length === 5) &&
        (userTemp.attack.length === 1 || userTemp.attack.length === 2)
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
    } else if (userTemp.midfield.includes(player)) {
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
        (userTemp.defence.length === 4 || userTemp.defence.length === 3) &&
        (userTemp.midfield.length === 4 || userTemp.midfield.length === 5)
      ) {
        defenceFlag = true;
      } else {
        defenceFlag = false;
      }

      let attackFlag = false;
      if (
        (userTemp.midfield.length === 4 || userTemp.midfield.length === 5) &&
        (userTemp.attack.length === 1 || userTemp.attack.length === 2)
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
    } else if (userTemp.attack.includes(player)) {
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
        (userTemp.defence.length === 4 || userTemp.defence.length === 3) &&
        (userTemp.attack.length === 3 || userTemp.attack.length === 2)
      ) {
        defenceFlag = true;
      } else {
        defenceFlag = false;
      }

      let midfieldFlag = false;
      if (
        (userTemp.midfield.length === 4 || userTemp.midfield.length === 3) &&
        (userTemp.attack.length === 3 || userTemp.attack.length === 2)
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
    } else if (userTemp.subs.includes(player)) {
      if (player.position === "gkp") {
        selectedPlayer();

        for (let i = 0; i < playersElements.length; i++) {
          if (playersElements[i].id === userTemp.goalkeeper[0].name) {
            selectedSub(playersElements[i]);
          }
        }

        buttonsVisibility(player);
        userTemp.goalkeeper[0].switch2 = true;
        setShowPickTeamButton(true);
        setShowUpdateMessage(false);
        setUser(userTemp);
        setPickTeam(true);
        setShow(false);
      } else if (player.position === "def") {
        selectedPlayer();

        for (let i = 0; i < playersElements.length; i++) {
          for (let j = 0; j < userTemp.defence.length; j++) {
            if (playersElements[i].id === userTemp.defence[j].name) {
              selectedSub(playersElements[i]);
            }
          }
        }

        let midfieldFlag = false;
        if (
          (userTemp.defence.length === 3 || userTemp.defence.length === 4) &&
          (userTemp.midfield.length === 5 || userTemp.midfield.length === 4)
        ) {
          midfieldFlag = true;
        } else {
          midfieldFlag = false;
        }

        let attackFlag = false;
        if (
          (userTemp.defence.length === 3 || userTemp.defence.length === 4) &&
          (userTemp.attack.length === 2 || userTemp.attack.length === 3)
        ) {
          attackFlag = true;
        } else {
          attackFlag = false;
        }

        if (midfieldFlag == true) {
          for (let i = 0; i < playersElements.length; i++) {
            for (let j = 0; j < userTemp.midfield.length; j++) {
              if (playersElements[i].id === userTemp.midfield[j].name) {
                selectedSub(playersElements[i]);
              }
            }
          }

          for (let i = 0; i < userTemp.midfield.length; i++) {
            userTemp.midfield[i].switch2 = true;
          }
        }

        if (attackFlag == true) {
          for (let i = 0; i < playersElements.length; i++) {
            for (let j = 0; j < userTemp.attack.length; j++) {
              if (playersElements[i].id === userTemp.attack[j].name) {
                selectedSub(playersElements[i]);
              }
            }
          }

          for (let i = 0; i < userTemp.attack.length; i++) {
            userTemp.attack[i].switch2 = true;
          }
        }

        for (let i = 0; i < userTemp.defence.length; i++) {
          userTemp.defence[i].switch2 = true;
        }

        for (let i = 1; i < userTemp.subs.length; i++) {
          if (userTemp.subs[i] !== player) {
            userTemp.subs[i].switch2 = true;
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
        setUser(userTemp);
        setPickTeam(true);
        setShow(false);
      } else if (player.position === "mid") {
        selectedPlayer();

        for (let i = 0; i < playersElements.length; i++) {
          for (let j = 0; j < userTemp.midfield.length; j++) {
            if (playersElements[i].id === userTemp.midfield[j].name) {
              selectedSub(playersElements[i]);
            }
          }
        }

        let defenceFlag = false;
        if (
          (userTemp.defence.length === 4 || userTemp.defence.length === 5) &&
          (userTemp.midfield.length === 3 || userTemp.midfield.length === 4)
        ) {
          defenceFlag = true;
        } else {
          defenceFlag = false;
        }

        let attackFlag = false;
        if (
          (userTemp.midfield.length === 3 || userTemp.midfield.length === 4) &&
          (userTemp.attack.length === 2 || userTemp.attack.length === 3)
        ) {
          attackFlag = true;
        } else {
          attackFlag = false;
        }

        if (defenceFlag == true) {
          for (let i = 0; i < playersElements.length; i++) {
            for (let j = 0; j < userTemp.defence.length; j++) {
              if (playersElements[i].id === userTemp.defence[j].name) {
                selectedSub(playersElements[i]);
              }
            }
          }

          for (let i = 0; i < userTemp.defence.length; i++) {
            userTemp.defence[i].switch2 = true;
          }
        }

        if (attackFlag == true) {
          for (let i = 0; i < playersElements.length; i++) {
            for (let j = 0; j < userTemp.attack.length; j++) {
              if (playersElements[i].id === userTemp.attack[j].name) {
                selectedSub(playersElements[i]);
              }
            }
          }

          for (let i = 0; i < userTemp.attack.length; i++) {
            userTemp.attack[i].switch2 = true;
          }
        }

        for (let i = 0; i < userTemp.midfield.length; i++) {
          userTemp.midfield[i].switch2 = true;
        }

        for (let i = 1; i < userTemp.subs.length; i++) {
          if (userTemp.subs[i] !== player) {
            userTemp.subs[i].switch2 = true;
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
        setUser(userTemp);
        setPickTeam(true);
        setShow(false);
      } else if (player.position === "att") {
        selectedPlayer();

        for (let i = 0; i < playersElements.length; i++) {
          for (let j = 0; j < userTemp.attack.length; j++) {
            if (playersElements[i].id === userTemp.attack[j].name) {
              selectedSub(playersElements[i]);
            }
          }
        }

        let defenceFlag = false;
        if (
          (userTemp.defence.length === 4 || userTemp.defence.length === 5) &&
          (userTemp.attack.length === 1 || userTemp.attack.length === 2)
        ) {
          defenceFlag = true;
        } else {
          defenceFlag = false;
        }

        let midfieldFlag = false;
        if (
          (userTemp.midfield.length === 4 || userTemp.midfield.length === 5) &&
          (userTemp.attack.length === 1 || userTemp.attack.length === 2)
        ) {
          midfieldFlag = true;
        } else {
          midfieldFlag = false;
        }

        if (defenceFlag == true) {
          for (let i = 0; i < playersElements.length; i++) {
            for (let j = 0; j < userTemp.defence.length; j++) {
              if (playersElements[i].id === userTemp.defence[j].name) {
                selectedSub(playersElements[i]);
              }
            }
          }

          for (let i = 0; i < userTemp.defence.length; i++) {
            userTemp.defence[i].switch2 = true;
          }
        }

        if (midfieldFlag == true) {
          for (let i = 0; i < playersElements.length; i++) {
            for (let j = 0; j < userTemp.midfield.length; j++) {
              if (playersElements[i].id === userTemp.midfield[j].name) {
                selectedSub(playersElements[i]);
              }
            }
          }

          for (let i = 0; i < userTemp.midfield.length; i++) {
            userTemp.midfield[i].switch2 = true;
          }
        }

        for (let i = 0; i < userTemp.attack.length; i++) {
          userTemp.attack[i].switch2 = true;
        }

        for (let i = 1; i < userTemp.subs.length; i++) {
          if (userTemp.subs[i] !== player) {
            userTemp.subs[i].switch2 = true;
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
    setUser(userTemp);
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
    let userTemp = user;

    let allPlayers = [
      ...userTemp.goalkeeper,
      ...userTemp.defence,
      ...userTemp.midfield,
      ...userTemp.attack,
      ...userTemp.subs,
    ];

    for (let i = 0; i < allPlayers.length; i++) {
      if (allPlayers[i].name === player.name) {
        selectedPlayer = allPlayers[i];
      } else if (allPlayers[i].name === selectPlayer.name) {
        playerToSub = allPlayers[i];
      }
    }

    let isSelectedPlayerInArray = userTemp.subs.some(
      (obj) => obj.name === selectedPlayer.name
    );
    let isPlayerToSubInArray = userTemp.subs.some(
      (obj) => obj.name === playerToSub.name
    );

    if (isSelectedPlayerInArray) {
      if (isPlayerToSubInArray) {
        let indexSelectedPlayer = userTemp.subs.findIndex(
          (obj) => obj.name === selectedPlayer.name
        );
        let indexPlayerToSub = userTemp.subs.findIndex(
          (obj) => obj.name === playerToSub.name
        );
        [userTemp.subs[indexSelectedPlayer], userTemp.subs[indexPlayerToSub]] =
          [userTemp.subs[indexPlayerToSub], userTemp.subs[indexSelectedPlayer]];

        playersElements.forEach((player) => {
          player.style.opacity = "1";
          player.style.backgroundColor = "transparent";
        });

        userTemp = new User(userTemp);

        setUser(userTemp);
        setfirstSwitch(true);
        setPickTeam(false);
        setShow(false);
      } else {
        userTemp.subs = userTemp.subs.filter(
          (obj) => obj.name !== selectedPlayer.name
        );
        if (playerToSub.position === "gkp") {
          userTemp.subs.unshift(playerToSub);
        } else {
          userTemp.subs.push(playerToSub);
        }

        if (selectedPlayer.position === "gkp") {
          userTemp.goalkeeper.push(selectedPlayer);
        } else if (selectedPlayer.position === "def") {
          userTemp.defence.push(selectedPlayer);
        } else if (selectedPlayer.position === "mid") {
          userTemp.midfield.push(selectedPlayer);
        } else if (selectedPlayer.position === "att") {
          userTemp.attack.push(selectedPlayer);
        }

        if (playerToSub.position === "gkp") {
          userTemp.goalkeeper = userTemp.goalkeeper.filter(
            (obj) => obj.name !== playerToSub.name
          );
        } else if (playerToSub.position === "def") {
          userTemp.defence = userTemp.defence.filter(
            (obj) => obj.name !== playerToSub.name
          );
        } else if (playerToSub.position === "mid") {
          userTemp.midfield = userTemp.midfield.filter(
            (obj) => obj.name !== playerToSub.name
          );
        } else if (playerToSub.position === "att") {
          userTemp.attack = userTemp.attack.filter(
            (obj) => obj.name !== playerToSub.name
          );
        }

        playersElements.forEach((player) => {
          player.style.opacity = "1";
          player.style.backgroundColor = "transparent";
        });

        userTemp.subs.forEach((playerTemp) => {
          if (
            playerToSub.captain == true &&
            playerTemp.name === playerToSub.name
          ) {
            handleMakeCaptain(selectedPlayer);
          }
        });

        userTemp = new User(userTemp);

        setUser(userTemp);
        setfirstSwitch(true);
        setPickTeam(false);
        setShow(false);
      }
    } else {
      userTemp.subs = userTemp.subs.filter(
        (obj) => obj.name !== playerToSub.name
      );
      if (selectedPlayer.position === "gkp") {
        userTemp.subs.unshift(selectedPlayer);
      } else {
        userTemp.subs.push(selectedPlayer);
      }

      if (playerToSub.position === "gkp") {
        userTemp.goalkeeper.push(playerToSub);
      } else if (playerToSub.position === "def") {
        userTemp.defence.push(playerToSub);
      } else if (playerToSub.position === "mid") {
        userTemp.midfield.push(playerToSub);
      } else if (playerToSub.position === "att") {
        userTemp.attack.push(playerToSub);
      }

      if (selectedPlayer.position === "gkp") {
        userTemp.goalkeeper = userTemp.goalkeeper.filter(
          (obj) => obj.name !== selectedPlayer.name
        );
      } else if (selectedPlayer.position === "def") {
        userTemp.defence = userTemp.defence.filter(
          (obj) => obj.name !== selectedPlayer.name
        );
      } else if (selectedPlayer.position === "mid") {
        userTemp.midfield = userTemp.midfield.filter(
          (obj) => obj.name !== selectedPlayer.name
        );
      } else if (selectedPlayer.position === "att") {
        userTemp.attack = userTemp.attack.filter(
          (obj) => obj.name !== selectedPlayer.name
        );
      }

      playersElements.forEach((player) => {
        player.style.opacity = "1";
        player.style.backgroundColor = "transparent";
      });

      userTemp.subs.forEach((playerTemp) => {
        if (
          selectedPlayer.captain == true &&
          playerTemp.name === selectedPlayer.name
        ) {
          handleMakeCaptain(playerToSub);
        }
      });

      userTemp = new User(userTemp);

      setUser(userTemp);
      setfirstSwitch(true);
      setPickTeam(false);
      setShow(false);
    }
  }

  // Function that handle canceling selected player to be switched
  function handleCancel(player) {
    let userTemp = user;
    const allPlayers = [
      ...userTemp.goalkeeper,
      ...userTemp.defence,
      ...userTemp.midfield,
      ...userTemp.attack,
      ...userTemp.subs,
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
    setUser(userTemp);
    setShow(false);
  }

  // Function that determines what buttons will be shown in modal based on parametars
  function buttonsVisibility(player) {
    let userTemp = user;
    const allPlayers = [
      ...userTemp.goalkeeper,
      ...userTemp.defence,
      ...userTemp.midfield,
      ...userTemp.attack,
      ...userTemp.subs,
    ];
    player.switch = false;
    player.cancel = true;

    user.goalkeeper[0].switch = false;
    for (let i = 0; i < allPlayers.length; i++) {
      allPlayers[i].switch = false;
    }
    setUser(userTemp);
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

  // Function handling render of make captain button
  function shouldRenderCaptainButton(player) {
    let retVal = true;
    user.subs.forEach((playerSub) => {
      if (playerSub.name === player.name) {
        retVal = false;
      }
    });
    return retVal;
  }

  // Function handling setting new captain
  function handleMakeCaptain(player) {
    let userTemp = user;
    let allPlayers = [
      ...userTemp.goalkeeper,
      ...userTemp.defence,
      ...userTemp.midfield,
      ...userTemp.attack,
      ...userTemp.subs,
    ];

    let newCaptain = "";
    allPlayers.forEach((playerTemp) => {
      if (playerTemp.name === player.name) {
        playerTemp.captain = true;
        newCaptain = playerTemp.name;
      } else {
        playerTemp.captain = false;
      }
    });

    if (newCaptain !== initialCaptain) {
      setPickTeam(false);
    } else {
      setPickTeam(true);
    }

    setShowPickTeamButton(true);
    setShowUpdateMessage(false);

    setUser(userTemp);
    setShow(false);
  }

  // Function handling pick team function
  function handlePickTeam() {
    let userTemp = user;
    let allPlayers = [
      ...userTemp.goalkeeper,
      ...userTemp.defence,
      ...userTemp.midfield,
      ...userTemp.attack,
      ...userTemp.subs,
    ];

    allPlayers.forEach((player) => {
      delete player.points;
    });

    updateUser(userTemp);
  }

  // Fetching user and players from database and handling render of loading and error interface
  useEffect(() => {
    getData();
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

      if (
        data4.isUpdating &&
        localStorage.getItem("myValueHome") !== "/pick-team"
      ) {
        navigate("/");
      }

      let playersTemp = data2;
      playersTemp.forEach((player) => {
        let count = 0;
        player.playerGameweeks.forEach((gameweek) => {
          count = count + gameweek.gameweekPoints;
        });

        player.points = count;
      });

      let allPlayers = [
        ...data1.goalkeeper,
        ...data1.defence,
        ...data1.midfield,
        ...data1.attack,
      ];

      allPlayers.forEach((playerTemp) => {
        if (playerTemp.captain == true) {
          setInitialCaptain(playerTemp.name);
        }
      });

      setUser(data1);
      setPlayers(playersTemp);
      setGameweekInfo(data3);
      setUpdating(data4);
    } catch (error) {
      setError("Something went wrong. Please try again.");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  // Updating user in database and handling render of loading and error interface
  function updateUser(userTemp) {
    setIsLoading(true);
    set(userRef, userTemp)
      .then(() => {
        getData();
      })
      .catch((error) => {
        setError("Something went wrong. Please try again.");
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

  if (updating.isUpdating) {
    return <Updating></Updating>;
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
          {player &&
            shouldRenderCaptainButton(player) &&
            switchButton(player) && (
              <Button
                variant="primary"
                className="btn btn-secondary btn-captain"
                onClick={() => handleMakeCaptain(player)}
              >
                Make Captain
              </Button>
            )}
          {player && cancelButton(player) && (
            <Button
              variant="primary"
              className="btn btn-secondary cancel"
              onClick={() => handleCancel(player)}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            className="btn btn-secondary info"
            onClick={handleClose}
          >
            View Informattion
          </Button>
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
              <div className="gameweek">
                Gameweek {gameweekInfo.currentGameweekNumber}
              </div>
            </div>
            <div className="timeline">
              <span className="week">
                Gameweek {gameweekInfo.currentGameweekNumber} deadline:
              </span>
              <span className="time">
                {gameweekInfo.currentGameweekDeadline}
              </span>
            </div>
          </div>
          <div className="info">
          To change your captain use the menu which appears when clicking on a player
          </div>
        </div>
        <div className="pitch-wrapper">
          <div className="goalkepper">
            <div
              className="player"
              id={user.goalkeeper[0].name}
              onClick={(event) => handleShow(event, user.goalkeeper[0])}
            >
              {user.goalkeeper[0].captain && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  role="img"
                  focusable="false"
                  className="captain"
                >
                  <title>Captain</title>
                  <circle cx="12" cy="12" r="12" aria-hidden="true"></circle>
                  <path
                    d="M15.0769667,14.370341 C14.4472145,15.2780796 13.4066319,15.8124328 12.3019667,15.795341 C10.4380057,15.795341 8.92696674,14.284302 8.92696674,12.420341 C8.92696674,10.55638 10.4380057,9.045341 12.3019667,9.045341 C13.3988206,9.06061696 14.42546,9.58781014 15.0769667,10.470341 L17.2519667,8.295341 C15.3643505,6.02401882 12.1615491,5.35094208 9.51934028,6.67031017 C6.87713147,7.98967826 5.49079334,10.954309 6.17225952,13.8279136 C6.8537257,16.7015182 9.42367333,18.7279285 12.3769667,18.720341 C14.2708124,18.7262708 16.0646133,17.8707658 17.2519667,16.395341 L15.0769667,14.370341 Z"
                    fill="white"
                    aria-hidden="true"
                  ></path>
                </svg>
              )}
              <div className="kit">
                <img
                  src={user ? `${user.goalkeeper[0].kit_src}` : ""}
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
                  {player.captain && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      role="img"
                      focusable="false"
                      className="captain"
                    >
                      <title>Captain</title>
                      <circle
                        cx="12"
                        cy="12"
                        r="12"
                        aria-hidden="true"
                      ></circle>
                      <path
                        d="M15.0769667,14.370341 C14.4472145,15.2780796 13.4066319,15.8124328 12.3019667,15.795341 C10.4380057,15.795341 8.92696674,14.284302 8.92696674,12.420341 C8.92696674,10.55638 10.4380057,9.045341 12.3019667,9.045341 C13.3988206,9.06061696 14.42546,9.58781014 15.0769667,10.470341 L17.2519667,8.295341 C15.3643505,6.02401882 12.1615491,5.35094208 9.51934028,6.67031017 C6.87713147,7.98967826 5.49079334,10.954309 6.17225952,13.8279136 C6.8537257,16.7015182 9.42367333,18.7279285 12.3769667,18.720341 C14.2708124,18.7262708 16.0646133,17.8707658 17.2519667,16.395341 L15.0769667,14.370341 Z"
                        fill="white"
                        aria-hidden="true"
                      ></path>
                    </svg>
                  )}
                  <div className="kit">
                    <img src={player.kit_src} alt={player.club + ".jpeg"} />
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
                  {player.captain && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      role="img"
                      focusable="false"
                      className="captain"
                    >
                      <title>Captain</title>
                      <circle
                        cx="12"
                        cy="12"
                        r="12"
                        aria-hidden="true"
                      ></circle>
                      <path
                        d="M15.0769667,14.370341 C14.4472145,15.2780796 13.4066319,15.8124328 12.3019667,15.795341 C10.4380057,15.795341 8.92696674,14.284302 8.92696674,12.420341 C8.92696674,10.55638 10.4380057,9.045341 12.3019667,9.045341 C13.3988206,9.06061696 14.42546,9.58781014 15.0769667,10.470341 L17.2519667,8.295341 C15.3643505,6.02401882 12.1615491,5.35094208 9.51934028,6.67031017 C6.87713147,7.98967826 5.49079334,10.954309 6.17225952,13.8279136 C6.8537257,16.7015182 9.42367333,18.7279285 12.3769667,18.720341 C14.2708124,18.7262708 16.0646133,17.8707658 17.2519667,16.395341 L15.0769667,14.370341 Z"
                        fill="white"
                        aria-hidden="true"
                      ></path>
                    </svg>
                  )}
                  <div className="kit">
                    <img src={player.kit_src} alt={player.club + ".jpeg"} />
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
                  {player.captain && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      role="img"
                      focusable="false"
                      className="captain"
                    >
                      <title>Captain</title>
                      <circle
                        cx="12"
                        cy="12"
                        r="12"
                        aria-hidden="true"
                      ></circle>
                      <path
                        d="M15.0769667,14.370341 C14.4472145,15.2780796 13.4066319,15.8124328 12.3019667,15.795341 C10.4380057,15.795341 8.92696674,14.284302 8.92696674,12.420341 C8.92696674,10.55638 10.4380057,9.045341 12.3019667,9.045341 C13.3988206,9.06061696 14.42546,9.58781014 15.0769667,10.470341 L17.2519667,8.295341 C15.3643505,6.02401882 12.1615491,5.35094208 9.51934028,6.67031017 C6.87713147,7.98967826 5.49079334,10.954309 6.17225952,13.8279136 C6.8537257,16.7015182 9.42367333,18.7279285 12.3769667,18.720341 C14.2708124,18.7262708 16.0646133,17.8707658 17.2519667,16.395341 L15.0769667,14.370341 Z"
                        fill="white"
                        aria-hidden="true"
                      ></path>
                    </svg>
                  )}
                  <div className="kit">
                    <img src={player.kit_src} alt={player.club + ".jpeg"} />
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
                    <img src={player.kit_src} alt={player.club + ".jpeg"} />
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

        <Fixtures></Fixtures>
      </div>
    </>
  );
}

export default PickTeam;
