import "../transfers/Transfers.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import getCookie from "../../help-files/getCookie";
import { firebase, database } from "../../help-files/firebase.js";
import { get, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { User } from "../../models/user.ts";
import { Player } from "../../models/players.ts";
import clubsOnly from "../../assets/clubsOnly.json";
import ReactLoading from "react-loading";
import Button from "react-bootstrap/Button";   
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Pagination from "../pagination/Pagination.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function Transfers() {
  // Variables related to fetching data, error and loading interface and other
  const [user, setUser] = useState([]);
  const [userInitial, setUserInitial] = useState([]);
  const [namesInitial, setNamesInitial] = useState([]);
  const [players, setPlayers] = useState([]);
  const [playersInitial, setPlayersInitial] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userRef = ref(database, "usersFantasy/" + getCookie("id"));
  const playersRef = ref(database, "players");
  const navigate = useNavigate();

  // Variables separting user players into their positions
  const [goalkeepers, setGoalkeepers] = useState([]);
  const [defenders, setDefenders] = useState([]);
  const [midfileders, setMidfielders] = useState([]);
  const [attackers, setAttackers] = useState([]);

  // Variables and function handling functionality of pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPlayers, setTotalPlayers] = useState(11);
  const [playersPerPage, setPlayersPerPage] = useState(3);
  const [playersPerPageGkp, setPlayersPerPageGkp] = useState(2);
  const [disablePrevious, setDisablePrevious] = useState(true);
  const [disableNext, setDisableNext] = useState(false);
  const [shouldSeePagination, setShouldSeePagination] = useState(true);

  // Values for functionality of view and sorted select
  const optionGroups = [
    {
      label: "Global",
      options: ["All Players"],
    },
    {
      label: "By Position",
      options: ["Goalkeepers", "Defenders", "Midfielders", "Attackers"],
    },
    {
      label: "By Team",
      options: clubsOnly,
    },
  ];
  const [selectSortValue, setSelectSortValue] = useState("price-asc");
  const [selectViewValue, setSelectViewValue] = useState(
    optionGroups[0].options[0]
  );

  let indexOfLastPlayer = currentPage * playersPerPage;
  let indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;

  let indexOfLastPlayerGkp = currentPage * playersPerPageGkp;
  let indexOfFirstPlayerGkp = indexOfLastPlayerGkp - playersPerPageGkp;
  let currentGoalkeepers = goalkeepers.slice(
    indexOfFirstPlayerGkp,
    indexOfLastPlayerGkp
  );

  let currentDefenders = defenders.slice(indexOfFirstPlayer, indexOfLastPlayer);

  let indexOfLastPlayerMid = currentPage * playersPerPage;
  let indexOfFirstPlayerMid = indexOfLastPlayerMid - playersPerPage;
  let currentMidfielders = midfileders.slice(
    indexOfFirstPlayerMid,
    indexOfLastPlayerMid
  );

  let currentAttackers = attackers.slice(indexOfFirstPlayer, indexOfLastPlayer);

  const paginatePrevEnd = () => {
    let previous = document.querySelector(".previous");
    let next = document.querySelector(".next");
    let previousEnd = document.querySelector(".previous-end");
    let nextEnd = document.querySelector(".next-end");

    setDisableNext(false);
    setDisablePrevious(true);

    next.classList.remove("my-disabled");
    nextEnd.classList.remove("my-disabled");
    previous.classList.add("my-disabled");
    previousEnd.classList.add("my-disabled");

    setCurrentPage(1);
  };

  const paginatePrev = () => {
    let currentPageTemp = currentPage - 1;
    let previous = document.querySelector(".previous");
    let next = document.querySelector(".next");
    let previousEnd = document.querySelector(".previous-end");
    let nextEnd = document.querySelector(".next-end");

    next.classList.remove("my-disabled");
    nextEnd.classList.remove("my-disabled");
    setDisableNext(false);

    if (currentPage <= 2) {
      previous.classList.add("my-disabled");
      previousEnd.classList.add("my-disabled");
      setDisablePrevious(true);
    }

    if (currentPageTemp == 0) {
    } else {
      setCurrentPage(currentPageTemp);
    }
  };

  const paginateNext = (pageNumbers) => {
    let currentPageTemp = currentPage + 1;
    let previous = document.querySelector(".previous");
    let next = document.querySelector(".next");
    let previousEnd = document.querySelector(".previous-end");
    let nextEnd = document.querySelector(".next-end");

    previous.classList.remove("my-disabled");
    previousEnd.classList.remove("my-disabled");
    setDisablePrevious(false);

    if (currentPage >= pageNumbers - 1) {
      next.classList.add("my-disabled");
      nextEnd.classList.add("my-disabled");
      setDisableNext(true);
    }

    if (currentPageTemp > pageNumbers + 1) {
    } else {
      setCurrentPage(currentPageTemp);
    }
  };

  const paginateNextEnd = (pageNumbers) => {
    let previous = document.querySelector(".previous");
    let next = document.querySelector(".next");
    let previousEnd = document.querySelector(".previous-end");
    let nextEnd = document.querySelector(".next-end");

    next.classList.add("my-disabled");
    nextEnd.classList.add("my-disabled");
    previous.classList.remove("my-disabled");
    previousEnd.classList.remove("my-disabled");
    setDisableNext(true);
    setDisablePrevious(false);

    setCurrentPage(pageNumbers);
  };

  // Variables handling display of players positions
  const [showGoalkeepers, setShowGoalkeepers] = useState(true);
  const [showDefenders, setShowDefenders] = useState(true);
  const [showMidfielders, setShowMidfielders] = useState(true);
  const [showAttackers, setShowAttackers] = useState(true);

  // Variable handling display of modals
  const [show, setShow] = useState(false);
  const [showSecond, setShowSecond] = useState(false);

  // Variables determining selected player and errors
  const [player, setPlayer] = useState();
  const [playerElement, setPlayerElement] = useState();
  const [selectedPlayer, setSelectedPlayer] = useState();
  const [errorClub, setErrorClub] = useState();
  const [errorClubShow, setErrorClubShow] = useState(false);
  const [messageShow, setMessageShow] = useState(false);
  const [errorMoneyShow, setErrorMoneyShow] = useState(false);

  // Variables for handling controler options
  const [playersToAdd, setPlayersToAdd] = useState([]);
  const [freeTransfersInitial, setFreeTransfersInitial] = useState(0);
  const [cost, setCost] = useState(0);
  const [makeTransfers, setMakeTransfers] = useState(true);
  const [reset, setReset] = useState(true);

  // Function displaying goalkeepers
  function seeGoalkeepers() {
    setShowGoalkeepers(true);
    setShowDefenders(false);
    setShowMidfielders(false);
    setShowAttackers(false);
  }

  // Function displaying defenders
  function seeDefence() {
    setShowGoalkeepers(false);
    setShowDefenders(true);
    setShowMidfielders(false);
    setShowAttackers(false);
  }

  // Function displaying midfielders
  function seeMidfield() {
    setShowGoalkeepers(false);
    setShowDefenders(false);
    setShowMidfielders(true);
    setShowAttackers(false);
  }

  // Function displaying attackers
  function seeAttack() {
    setShowGoalkeepers(false);
    setShowDefenders(false);
    setShowMidfielders(false);
    setShowAttackers(true);
  }

  // Function displaying all players
  function seeAllPlayers() {
    setShowGoalkeepers(true);
    setShowDefenders(true);
    setShowMidfielders(true);
    setShowAttackers(true);
  }

  // Functions handling display of modals
  function handleShow(event, player) {
    setPlayer(player);
    setPlayerElement(event.currentTarget);
    setShow(true);
  }

  function handleShowSecond(player) {
    setSelectedPlayer(player);
    setShowSecond(true);
  }
  const handleClose = () => setShow(false);
  const handleCloseSecond = () => setShowSecond(false);

  // Function displaying number of shown players
  function playersShown() {
    let count = 0;
    let retVal = false;
    if (
      selectViewValue === "Goalkeepers" ||
      selectViewValue === "Defenders" ||
      selectViewValue === "Midfielders" ||
      selectViewValue === "Attackers"
    ) {
      retVal = true;
    }

    if (retVal == true) {
      if (selectViewValue === "Goalkeepers") {
        players.forEach((p) => {
          if (p.position === "gkp" && !p.shouldShow == true) {
            count++;
          }
        });
      } else if (selectViewValue === "Defenders") {
        players.forEach((p) => {
          if (p.position === "def" && !p.shouldShow == true) {
            count++;
          }
        });
      } else if (selectViewValue === "Midfielders") {
        players.forEach((p) => {
          if (p.position === "mid" && !p.shouldShow == true) {
            count++;
          }
        });
      } else if (selectViewValue === "Attackers") {
        players.forEach((p) => {
          if (p.position === "att" && !p.shouldShow == true) {
            count++;
          }
        });
      }
    }

    if (retVal == false) {
      players.forEach((p) => {
        if (!p.shouldShow == true) {
          count++;
        }
      });
    }

    return count;
  }

  // Function handling adding player to selected position
  function handleAddFinal(playerTmp) {
    let userTemp = user;
    const allPlayers = [
      ...userTemp.goalkeeper,
      ...userTemp.defence,
      ...userTemp.midfield,
      ...userTemp.attack,
      ...userTemp.subs,
    ];

    for (let i = 0; i < players.length; i++) {
      if (players[i].name === playerTmp.name) {
        players[i].set = true;
      }
    }

    setPlayers(players.map((player) => new Player(player)));
    setGoalkeepers(players.filter((player) => player.position === "gkp"));
    setDefenders(players.filter((player) => player.position === "def"));
    setMidfielders(players.filter((player) => player.position === "mid"));
    setAttackers(players.filter((player) => player.position === "att"));

    let isSame = false;

    for (let i = 0; i < allPlayers.length; i++) {
      if (allPlayers[i].position === playerTmp.position) {
        if (allPlayers[i].nameTmp === playerTmp.name) {
          if (allPlayers[i].name === playerTmp.name) {
            allPlayers[i].add = true;
            allPlayers[i].remove = false;
            allPlayers[i].restore = false;
            allPlayers[i].kit_src = playerTmp.kit_src;
            userTemp.money = userTemp.money - allPlayers[i].price;
            userTemp.clubs.push(allPlayers[i].club);
            isSame = true;
            break;
          } else {
            let player = allPlayers[i];

            for (let i = 0; i < allPlayers.length; i++) {
              if (
                allPlayers[i].position === playerTmp.position &&
                allPlayers[i].remove == true
              ) {
                allPlayers[i].add = true;
                allPlayers[i].remove = false;
                allPlayers[i].restore = false;
                allPlayers[i].club = player.club;
                allPlayers[i].kit_src = player.kit_src;
                allPlayers[i].name = player.name;
                allPlayers[i].points = player.points;
                allPlayers[i].position = player.position;
                allPlayers[i].price = player.price;
                isSame = true;
                break;
              }
            }

            allPlayers[i].add = true;
            allPlayers[i].remove = false;
            allPlayers[i].restore = false;
            allPlayers[i].club = allPlayers[i].clubTmp;
            allPlayers[i].kit_src = allPlayers[i].kit_srcTmp;
            allPlayers[i].name = allPlayers[i].nameTmp;
            allPlayers[i].points = allPlayers[i].pointsTmp;
            allPlayers[i].position = allPlayers[i].positionTmp;
            allPlayers[i].price = allPlayers[i].priceTmp;
            userTemp.money = userTemp.money - allPlayers[i].priceTmp;
            userTemp.clubs.push(allPlayers[i].clubTmp);
            isSame = true;
            break;
          }
        }
      }
    }

    if (isSame == false) {
      for (let i = 0; i < allPlayers.length; i++) {
        if (
          allPlayers[i].position === playerTmp.position &&
          allPlayers[i].remove == true
        ) {
          if (allPlayers[i].nameTmp != playerTmp.name) {
            allPlayers[i].add = true;
            allPlayers[i].remove = false;
            allPlayers[i].restore = false;
            allPlayers[i].club = playerTmp.club;
            allPlayers[i].kit_src = playerTmp.kit_src;
            allPlayers[i].name = playerTmp.name;
            allPlayers[i].points = playerTmp.points;
            allPlayers[i].position = playerTmp.position;
            allPlayers[i].price = playerTmp.price;
            userTemp.money = userTemp.money - playerTmp.price;
            userTemp.clubs.push(playerTmp.club);
            break;
          }
        }
      }
    }

    userTemp.countPlayers++;

    let playersToAddTemp = playersToAdd;
    let indexArr = playersToAddTemp.indexOf(playerTmp.position);
    playersToAddTemp.splice(indexArr, 1);
    setPlayersToAdd(playersToAddTemp);

    checkErrors(userTemp);

    let namesTemp = [];
    allPlayers.forEach((player) => {
      if (player.restore == true) {
        namesTemp.push("different");
      } else {
        namesTemp.push(player.name);
      }
    });

    if (countMismatchedElements(namesInitial, namesTemp) == 0) {
      setReset(true);
    } else if (countMismatchedElements(namesInitial, namesTemp) > 0) {
      setReset(false);
    }

    let countTemp = countMismatchedElements(namesInitial, namesTemp);
    if (countTemp > freeTransfersInitial) {
      let numTemp = (countTemp - freeTransfersInitial) * 4;
      setCost(numTemp);
    } else {
      let numZero = 0;
      setCost(numZero);
    }

    userTemp.freeTransfers = freeTransfersInitial - countTemp;
    if (userTemp.freeTransfers < 0) {
      userTemp.freeTransfers = 0;
    }

    let checkRestoredPlayers = [];
    for (let i = 0; i < allPlayers.length; i++) {
      if (allPlayers[i].restore == true) {
        checkRestoredPlayers.push(allPlayers[i]);
      }
    }

    if (
      countMismatchedElements(namesInitial, namesTemp) > 0 &&
      checkErrors(userTemp) == false &&
      checkRestoredPlayers.length == 0
    ) {
      setMakeTransfers(false);
    }

    if (windowWidth.matches) {
      seePitch();
    }

    setUser(userTemp);
    setShowSecond(false);
  }

  // Function handling removing the player
  function handleRemove(player) {
    let userTemp = user;
    setMessageShow(false);
    const allPlayers = [
      ...userTemp.goalkeeper,
      ...userTemp.defence,
      ...userTemp.midfield,
      ...userTemp.attack,
      ...userTemp.subs,
    ];

    const userInitialTemp = userInitial;
    const allPlayersInitial = [
      ...userInitialTemp.goalkeeper,
      ...userInitialTemp.defence,
      ...userInitialTemp.midfield,
      ...userInitialTemp.attack,
      ...userInitialTemp.subs,
    ];

    for (let i = 0; i < players.length; i++) {
      if (players[i].name === player.name) {
        players[i].set = false;
      }
    }
    setPlayers(players.map((player) => new Player(player)));
    setGoalkeepers(players.filter((player) => player.position === "gkp"));
    setDefenders(players.filter((player) => player.position === "def"));
    setMidfielders(players.filter((player) => player.position === "mid"));
    setAttackers(players.filter((player) => player.position === "att"));

    for (let i = 0; i < allPlayers.length; i++) {
      if (allPlayers[i].name === player.name) {
        if (allPlayers[i].name === allPlayersInitial[i].name) {
          allPlayers[i].add = false;
          allPlayers[i].remove = true;
          allPlayers[i].restore = true;

          allPlayers[i].nameTmp = allPlayers[i].name;
          allPlayers[i].positionTmp = allPlayers[i].position;
          allPlayers[i].priceTmp = allPlayers[i].price;
          allPlayers[i].pointsTmp = allPlayers[i].points;
          allPlayers[i].clubTmp = allPlayers[i].club;
          allPlayers[i].kit_srcTmp = allPlayers[i].kit_src;

          userTemp.money = userTemp.money + allPlayers[i].price;
          let indexArr = userTemp.clubs.indexOf(allPlayers[i].club);
          userTemp.clubs.splice(indexArr, 1);
          allPlayers[i].kit_src = "assets/img/kits/selected-kit.webp";
        } else {
          allPlayers[i].add = false;
          allPlayers[i].remove = true;
          allPlayers[i].restore = true;

          userTemp.money = userTemp.money + allPlayers[i].price;
          let indexArr = userTemp.clubs.indexOf(allPlayers[i].club);
          userTemp.clubs.splice(indexArr, 1);
          allPlayers[i].kit_src = "assets/img/kits/selected-kit.webp";
        }
      }
    }

    let playersToAddTemp = playersToAdd;
    playersToAddTemp.push(player.position);
    setPlayersToAdd(playersToAddTemp);

    userTemp.countPlayers--;

    setPlayer(player);
    checkErrors(userTemp);

    let namesTemp = [];
    allPlayers.forEach((player) => {
      if (player.restore == true) {
        namesTemp.push("different");
      } else {
        namesTemp.push(player.name);
      }
    });

    if (countMismatchedElements(namesInitial, namesTemp) == 0) {
      setReset(true);
    } else if (countMismatchedElements(namesInitial, namesTemp) > 0) {
      setReset(false);
    }

    let countTemp = countMismatchedElements(namesInitial, namesTemp);
    if (countTemp > freeTransfersInitial) {
      let numTemp = (countTemp - freeTransfersInitial) * 4;
      setCost(numTemp);
    } else {
      let numZero = 0;
      setCost(numZero);
    }

    userTemp.freeTransfers = freeTransfersInitial - countTemp;
    if (userTemp.freeTransfers < 0) {
      userTemp.freeTransfers = 0;
    }

    setMakeTransfers(true);
    setUser(userTemp);
    setShow(false);
    setShowSecond(false);
  }

  // Function handling restore of chosen player
  function handleRestore(playerTmp) {
    let userTemp = user;
    const allPlayers = [
      ...userTemp.goalkeeper,
      ...userTemp.defence,
      ...userTemp.midfield,
      ...userTemp.attack,
      ...userTemp.subs,
    ];

    for (let i = 0; i < allPlayers.length; i++) {
      if (allPlayers[i].name === playerTmp.name) {
        allPlayers[i].add = true;
        allPlayers[i].remove = false;
        allPlayers[i].restore = false;

        allPlayers[i].name = allPlayers[i].nameTmp;
        allPlayers[i].position = allPlayers[i].positionTmp;
        allPlayers[i].price = allPlayers[i].priceTmp;
        allPlayers[i].points = allPlayers[i].pointsTmp;
        allPlayers[i].club = allPlayers[i].clubTmp;
        allPlayers[i].kit_src = allPlayers[i].kit_srcTmp;

        userTemp.money = userTemp.money - allPlayers[i].price;
        userTemp.clubs.push(allPlayers[i].club);

        let name = allPlayers[i].name;
        for (let i = 0; i < players.length; i++) {
          if (players[i].name === name) {
            players[i].set = true;
          }
        }
        setPlayers(players.map((player) => new Player(player)));
        setGoalkeepers(players.filter((player) => player.position === "gkp"));
        setDefenders(players.filter((player) => player.position === "def"));
        setMidfielders(players.filter((player) => player.position === "mid"));
        setAttackers(players.filter((player) => player.position === "att"));
      }
    }

    userTemp.countPlayers++;
    checkErrors(userTemp);

    let playersToAddTemp = playersToAdd;
    let indexArr = playersToAddTemp.indexOf(playerTmp.position);
    playersToAddTemp.splice(indexArr, 1);
    setPlayersToAdd(playersToAddTemp);

    let namesTemp = [];
    allPlayers.forEach((player) => {
      if (player.restore == true) {
        namesTemp.push("different");
      } else {
        namesTemp.push(player.name);
      }
    });

    if (countMismatchedElements(namesInitial, namesTemp) == 0) {
      setReset(true);
    } else if (countMismatchedElements(namesInitial, namesTemp) > 0) {
      setReset(false);
    }

    let countTemp = countMismatchedElements(namesInitial, namesTemp);
    if (countTemp > freeTransfersInitial) {
      let numTemp = (countTemp - freeTransfersInitial) * 4;
      setCost(numTemp);
    } else {
      let numZero = 0;
      setCost(numZero);
    }

    userTemp.freeTransfers = freeTransfersInitial - countTemp;
    if (userTemp.freeTransfers <= 0) {
      userTemp.freeTransfers = 0;
    }

    let checkRestoredPlayers = [];
    for (let i = 0; i < allPlayers.length; i++) {
      if (allPlayers[i].restore == true) {
        checkRestoredPlayers.push(allPlayers[i]);
      }
    }

    if (
      countMismatchedElements(namesInitial, namesTemp) > 0 &&
      checkErrors(userTemp) == false &&
      checkRestoredPlayers.length == 0
    ) {
      setMakeTransfers(false);
    }

    setUser(userTemp);
    setShow(false);
  }

  // Function determining display of players based on window width
  function shouldShowPlayers() {
    if (windowWidth.matches) {
      seePlayers();
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  }

  // Function handling replacement button
  function handleReplacement() {
    resetShownPlayers();
    let parentElement = playerElement.parentNode;
    if (parentElement.classList.contains("goalkeepers")) {
      setSelectViewValue("Goalkeepers");
      seeGoalkeepers();
      shouldShowPlayers();
    } else if (parentElement.classList.contains("defence")) {
      setSelectViewValue("Defenders");
      seeDefence();
      shouldShowPlayers();
    } else if (parentElement.classList.contains("midfield")) {
      setSelectViewValue("Midfielders");
      seeMidfield();
      shouldShowPlayers();
    } else if (parentElement.classList.contains("attack")) {
      setSelectViewValue("Attackers");
      seeAttack();
      shouldShowPlayers();
    }

    paginatePrevEnd();
    setShow(false);
  }

  // Function checking for new transfers
  function countMismatchedElements(arr1, arr2) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    const symmetricDifference = new Set([...set1].filter((x) => !set2.has(x)));

    return symmetricDifference.size;
  }

  // Function for checking errors
  function checkErrors(userTemp) {
    let result = findDuplicateValue(userTemp.clubs, 3);
    let flag = false;
    if (result.length > 0) {
      setErrorClub(result[length]);
      flag = true;
      setErrorClubShow(true);
    } else {
      setErrorClubShow(false);
    }

    if (userTemp.money < 0) {
      flag = true;
      setErrorMoneyShow(true);
    } else {
      setErrorMoneyShow(false);
    }

    return flag;
  }

  // Function handling add squad button
  function handleMakeTransfers() {
    let userTemp = user;
    userTemp = new User(userTemp);
    setPlayersToAdd([]);
    setErrorClubShow(false);
    setErrorMoneyShow(false);
    setMakeTransfers(true);
    setMessageShow(true);
    setCost(0);
    setReset(true);
    window.scrollTo({
      top: 350,
      behavior: "instant",
    });
    updateUser(userTemp);
  }

  // Function handling reset squad button
  function handleReset() {
    setPlayersToAdd([]);
    setErrorClubShow(false);
    setErrorMoneyShow(false);
    setMakeTransfers(true);
    setCost(0);
    setReset(true);
    let resetUser = JSON.parse(JSON.stringify(userInitial));
    let resetPlayers = JSON.parse(JSON.stringify(playersInitial));
    setUser(resetUser);

    const playersData = [
      ...resetUser.goalkeeper,
      ...resetUser.defence,
      ...resetUser.midfield,
      ...resetUser.attack,
      ...resetUser.subs,
    ];

    let namesTemp = [];
    let addedPlayers = [];
    playersData.forEach((player) => {
      addedPlayers.push(player);
      namesTemp.push(player.name);
    });
    setNamesInitial(namesTemp);

    resetPlayers.forEach((player) => {
      const smallObj = addedPlayers.find((obj) => obj.name === player.name);
      if (smallObj) {
        player.set = true;
      }
    });

    setPlayers(resetPlayers.map((player) => new Player(player)));
    setGoalkeepers(resetPlayers.filter((player) => player.position === "gkp"));
    setDefenders(resetPlayers.filter((player) => player.position === "def"));
    setMidfielders(resetPlayers.filter((player) => player.position === "mid"));
    setAttackers(resetPlayers.filter((player) => player.position === "att"));
  }

  // Function determining if there are more that two players added that are from the same club
  function findDuplicateValue(arr, iterator) {
    const countMap = {};

    arr.forEach((val) => {
      countMap[val] = (countMap[val] || 0) + 1;
    });

    const duplicateValues = [];
    for (const val in countMap) {
      if (countMap[val] > iterator) {
        duplicateValues.push(val);
      }
    }

    return duplicateValues;
  }

  // Variable and function handling display of elements based on user width
  const [windowWidth, setWindowWidth] = useState(
    window.matchMedia("(max-width: 992px)")
  );

  useEffect(() => {
    function widthChange(event) {
      let width = window.matchMedia("(max-width: 992px)");
      let playerList = document.querySelector(".player-list");
      let playersDiv = document.querySelector(".players");
      let wrapperDiv = document.querySelector(".pitch-wrapper-transfers");
      let upperWrapperDiv = document.querySelector(".upper-wrapper-transfers");
      let titleWrapperDiv = document.querySelector(".title-wrapper");
      let positionsDivs = document.querySelectorAll(".position");
      let makeTransfersButton = document.querySelector(".make-transfers");
      let backToPitchDiv = document.querySelector(".back-to-pitch");

      if (width.matches) {
        positionsDivs.forEach((position) => {
          position.innerText = "Add";
        });
        playerList.style.display = "flex";
        wrapperDiv.style.display = "flex";
        makeTransfersButton.style.display = "block";
        playersDiv.style.display = "none";
        upperWrapperDiv.style.display = "block";

        if (playersDiv.classList.contains("active")) {
          backToPitchDiv.style.display = "flex";
          playerList.style.display = "none";
          wrapperDiv.style.display = "none";
          makeTransfersButton.style.display = "none";
          playersDiv.style.display = "block";
          upperWrapperDiv.style.display = "none";
          titleWrapperDiv.style.display = "none";
        }
      } else {
        positionsDivs.forEach((position) => {
          let className = position.parentElement.parentElement.className;
          if (className === "goalkeepers") {
            position.innerText = "Add goalkeeper";
          } else if (className === "defence") {
            position.innerText = "Add defender";
          } else if (className === "midfield") {
            position.innerText = "Add midfielder";
          } else if (className === "attack") {
            position.innerText = "Add attacker";
          }
        });

        playerList.style.display = "none";
        playersDiv.style.display = "none";
        upperWrapperDiv.style.display = "block";

        if (playersDiv.classList.contains("active")) {
          backToPitchDiv.style.display = "none";
          titleWrapperDiv.style.display = "block";
          playerList.style.display = "none";
          wrapperDiv.style.display = "flex";
          makeTransfersButton.style.display = "block";
          playersDiv.style.display = "block";
        } else {
          playersDiv.style.display = "block";
        }
      }
    }
    windowWidth.addEventListener("change", widthChange);

    return () => {
      windowWidth.removeEventListener("change", widthChange);
    };
  }, [windowWidth]);

  // Function handling display of players div element
  function seePlayers() {
    let element = document.querySelector(".player-list");
    let playersDiv = document.querySelector(".players");
    let wrapperDiv = document.querySelector(".pitch-wrapper-transfers");
    let upperWrapperDiv = document.querySelector(".upper-wrapper-transfers");
    let titleWrapperDiv = document.querySelector(".title-wrapper");
    let makeTransfersButton = document.querySelector(".make-transfers");
    let backToPitchDiv = document.querySelector(".back-to-pitch");

    backToPitchDiv.style.display = "flex";
    makeTransfersButton.style.display = "none";
    element.style.display = "none";
    titleWrapperDiv.style.display = "none";
    wrapperDiv.style.display = "none";
    playersDiv.style.display = "block";
    upperWrapperDiv.style.display = "none";
    playersDiv.classList.add("active");
  }

  // Function handling display of pitch-wrapper div element
  function seePitch() {
    let playersDiv = document.querySelector(".players");
    let wrapperDiv = document.querySelector(".pitch-wrapper-transfers");
    let playerList = document.querySelector(".player-list");
    let upperWrapperDiv = document.querySelector(".upper-wrapper-transfers");
    let titleWrapperDiv = document.querySelector(".title-wrapper");
    let makeTransfersButton = document.querySelector(".make-transfers");
    let backToPitchDiv = document.querySelector(".back-to-pitch");

    titleWrapperDiv.style.display = "block";
    backToPitchDiv.style.display = "none";
    wrapperDiv.style.display = "flex";
    makeTransfersButton.style.display = "block";
    playersDiv.style.display = "none";
    playerList.style.display = "flex";
    upperWrapperDiv.style.display = "block";
    playersDiv.classList.remove("active");
  }

  // Function for updating players in view select
  function updatePlayers(playersTemp) {
    setPlayers(playersTemp);
    setGoalkeepers(playersTemp.filter((player) => player.position === "gkp"));
    setDefenders(playersTemp.filter((player) => player.position === "def"));
    setMidfielders(playersTemp.filter((player) => player.position === "mid"));
    setAttackers(playersTemp.filter((player) => player.position === "att"));
  }

  // Function reseting shown players
  function resetShownPlayers() {
    let playersTemp = players;
    playersTemp.forEach((player) => {
      player.shouldShow = false;
    });
    updatePlayers(playersTemp);

    setTotalPlayers(11);
    setPlayersPerPage(3);
    setPlayersPerPageGkp(2);
    paginatePrevEnd();
    seeAllPlayers();
  }

  // Function handling select-view functionality
  function handleSelectView(event) {
    resetShownPlayers();
    let selectedOption = event.target.value;
    if (selectedOption === "All Players") {
      seeAllPlayers();
      shouldShowPlayers();
      toggleShowVariables(players);
      paginatePrevEnd();
    } else if (selectedOption === "Goalkeepers") {
      seeGoalkeepers();
      shouldShowPlayers();
      paginatePrevEnd();
    } else if (selectedOption === "Defenders") {
      seeDefence();
      shouldShowPlayers();
      paginatePrevEnd();
    } else if (selectedOption === "Midfielders") {
      seeMidfield();
      shouldShowPlayers();
      paginatePrevEnd();
    } else if (selectedOption === "Attackers") {
      seeAttack();
      shouldShowPlayers();
      paginatePrevEnd();
    }
    let retVal = false;
    let optionName = "";
    for (let i = 0; i < clubsOnly.length; i++) {
      if (clubsOnly[i].value === selectedOption) {
        optionName = clubsOnly[i].valuePlayer;
        retVal = true;
        break;
      }
    }
    if (retVal) {
      let playersTemp = players;
      playersTemp.forEach((player) => {
        if (player.club !== optionName) {
          player.shouldShow = true;
        }
      });

      updatePlayers(playersTemp);
      toggleShowVariables(playersTemp);
      let next = document.querySelector(".next");
      let nextEnd = document.querySelector(".next-end");
      shouldShowPlayers();

      setPlayersPerPage(20);
      setPlayersPerPageGkp(20);
      setTotalPlayers(20);

      next.classList.add("my-disabled");
      nextEnd.classList.add("my-disabled");
      setDisablePrevious(true);
      setDisableNext(true);
    }
    setSelectViewValue(event.target.value);
    setInputSeatchValue("");
  }

  // Function handling select-sorted functionality
  function handleSelectSort(event) {
    let selectedOption = event.target.value;
    let playersTemp = players;
    function setPlayersNew() {
      updatePlayers(playersTemp);
      shouldShowPlayers();
      setSelectSortValue(event.target.value);
    }

    if (selectedOption === "price-asc") {
      playersTemp.sort((a, b) => a.price - b.price);
      setPlayersNew();
    } else if (selectedOption === "price-des") {
      playersTemp.sort((a, b) => b.price - a.price);
      setPlayersNew();
    } else if (selectedOption === "points-asc") {
      playersTemp.sort((a, b) => a.points - b.points);
      setPlayersNew();
    } else if (selectedOption === "points-des") {
      playersTemp.sort((a, b) => b.points - a.points);
      setPlayersNew();
    }
  }

  // Function and variable handling search of players
  const [inputSeatchValue, setInputSeatchValue] = useState("");
  function input(event) {
    setCurrentPage(1);
    const searchTerm = event.target.value.toLowerCase();
    setInputSeatchValue(searchTerm);
    let playersTemp = players;
    let optionName = "";
    let retVal = false;

    for (let i = 0; i < clubsOnly.length; i++) {
      if (clubsOnly[i].value === selectViewValue) {
        optionName = clubsOnly[i].valuePlayer;
        retVal = true;
        break;
      }
    }

    if (searchTerm !== "") {
      if (retVal) {
        playersTemp.forEach((player) => {
          if (
            player.name.toLowerCase().startsWith(searchTerm) &&
            player.club === optionName
          ) {
            player.shouldShow = false;
          } else {
            player.shouldShow = true;
          }
        });
      } else {
        playersTemp.forEach((player) => {
          if (player.name.toLowerCase().startsWith(searchTerm)) {
            player.shouldShow = false;
          } else {
            player.shouldShow = true;
          }
        });
      }

      updatePlayers(playersTemp);
      if (selectViewValue === "All Players" || retVal) {
        toggleShowVariables(playersTemp);
      } else {
        toggleShowVariablesPositions();
      }

      setPlayersPerPage(20);
      setPlayersPerPageGkp(20);
      setTotalPlayers(20);

      let next = document.querySelector(".next");
      let nextEnd = document.querySelector(".next-end");
      let previous = document.querySelector(".previous");
      let previousEnd = document.querySelector(".previous-end");
      next.classList.add("my-disabled");
      nextEnd.classList.add("my-disabled");
      previous.classList.add("my-disabled");
      previousEnd.classList.add("my-disabled");

      setDisablePrevious(true);
      setDisableNext(true);
    } else {
      if (retVal) {
        playersTemp.forEach((player) => {
          if (player.club === optionName) {
            player.shouldShow = false;
          } else {
            player.shouldShow = true;
          }
        });
        updatePlayers(playersTemp);
        toggleShowVariables(playersTemp);
      } else {
        let playersTemp = players;
        playersTemp.forEach((player) => {
          player.shouldShow = false;
        });
        updatePlayers(playersTemp);
        if (selectViewValue === "All Players") {
          toggleShowVariables(playersTemp);
        } else {
          toggleShowVariablesPositions();
        }
        setTotalPlayers(11);
        setPlayersPerPage(3);
        setPlayersPerPageGkp(2);

        paginatePrevEnd();
      }
    }
  }

  // Function toggling show variables for specific position
  function toggleShowVariablesPositions() {
    function hideShowVariable(playersTemp) {
      let count = 0;
      playersTemp.forEach((player) => {
        if (player.shouldShow == false) {
          count++;
        }
      });
      return count;
    }

    if (selectViewValue === "Goalkeepers") {
      if (hideShowVariable(goalkeepers) === 0) {
        setShowGoalkeepers(false);
      } else {
        setShowGoalkeepers(true);
      }
    } else if (selectViewValue === "Defenders") {
      if (hideShowVariable(defenders) === 0) {
        setShowDefenders(false);
      } else {
        setShowDefenders(true);
      }
    } else if (selectViewValue === "Midfielders") {
      if (hideShowVariable(midfileders) === 0) {
        setShowMidfielders(false);
      } else {
        setShowMidfielders(true);
      }
    } else if (selectViewValue === "Attackers") {
      if (hideShowVariable(attackers) === 0) {
        setShowAttackers(false);
      } else {
        setShowAttackers(true);
      }
    }
  }

  // Function toggling show variables
  function toggleShowVariables(playersTemp) {
    let retValGkp = 0;
    let retValDef = 0;
    let retValMid = 0;
    let retValAtt = 0;
    let playersGkp = [];
    let playersDef = [];
    let playersMid = [];
    let playersAtt = [];

    playersTemp.forEach((player) => {
      if (player.position == "gkp") {
        playersGkp.push(player);
      } else if (player.position == "def") {
        playersDef.push(player);
      } else if (player.position == "mid") {
        playersMid.push(player);
      } else if (player.position == "att") {
        playersAtt.push(player);
      }
    });

    playersGkp.forEach((player) => {
      if (player.shouldShow == false) {
        retValGkp++;
      }
    });

    playersDef.forEach((player) => {
      if (player.shouldShow == false) {
        retValDef++;
      }
    });

    playersMid.forEach((player) => {
      if (player.shouldShow == false) {
        retValMid++;
      }
    });

    playersAtt.forEach((player) => {
      if (player.shouldShow == false) {
        retValAtt++;
      }
    });

    if (retValGkp === 0) {
      setShowGoalkeepers(false);
    } else {
      setShowGoalkeepers(true);
    }

    if (retValDef === 0) {
      setShowDefenders(false);
    } else {
      setShowDefenders(true);
    }

    if (retValMid === 0) {
      setShowMidfielders(false);
    } else {
      setShowMidfielders(true);
    }

    if (retValAtt === 0) {
      setShowAttackers(false);
    } else {
      setShowAttackers(true);
    }
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

      setUser(JSON.parse(JSON.stringify(data1)));
      setUserInitial(JSON.parse(JSON.stringify(data1)));
      setPlayersInitial(JSON.parse(JSON.stringify(data2)));
      setFreeTransfersInitial(data1.freeTransfers);

      const playersData = [
        ...data1.goalkeeper,
        ...data1.defence,
        ...data1.midfield,
        ...data1.attack,
        ...data1.subs,
      ];

      let namesTemp = [];
      let addedPlayers = [];
      playersData.forEach((player) => {
        addedPlayers.push(player);
        namesTemp.push(player.name);
      });
      setNamesInitial(namesTemp);

      data2.forEach((player) => {
        const smallObj = addedPlayers.find((obj) => obj.name === player.name);
        if (smallObj) {
          player.set = true;
        }
      });

      data2.sort((a, b) => a.price - b.price);
      setPlayers(data2.map((player) => new Player(player)));
      setGoalkeepers(data2.filter((player) => player.position === "gkp"));
      setDefenders(data2.filter((player) => player.position === "def"));
      setMidfielders(data2.filter((player) => player.position === "mid"));
      setAttackers(data2.filter((player) => player.position === "att"));
    } catch (error) {
      setError(error.message);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  // Updating user in database and handling render of loading and error interface
  function updateUser(user) {
    setIsLoading(true);
    set(userRef, user)
      .then(() => {
        getData();
      })
      .catch((error) => {
        setError(error.message);
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
          {player && player.restore && (
            <Button
              variant="primary"
              className="btn btn-secondary restore"
              onClick={() => handleRestore(player)}
            >
              Restore Player
            </Button>
          )}
          {player && player.restore && (
            <Button
              variant="primary"
              className="btn btn-secondary replacement"
              onClick={() => handleReplacement()}
            >
              Select Replacement
            </Button>
          )}
          {player && !player.remove && (
            <Button
              variant="primary"
              className="btn btn-secondary cancel"
              onClick={() => handleRemove(player)}
            >
              Remove Player
            </Button>
          )}
          <Button
            variant="primary"
            className="btn btn-secondary info-transfers"
            onClick={handleClose}
          >
            View Informattion
          </Button>
        </Modal.Body>
      </Modal>
      <Modal
        show={showSecond}
        onHide={handleCloseSecond}
        animation={false}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Button
            variant="primary"
            className="btn-close a"
            onClick={handleCloseSecond}
          ></Button>
          <Modal.Title>{selectedPlayer && selectedPlayer.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlayer &&
            !playersToAdd.includes(selectedPlayer.position) && (
              <div className="max">
                You already hame maximum number of{" "}
                {selectedPlayer.position === "gkp"
                  ? "Goalkeepers"
                  : "" || selectedPlayer.position === "def"
                  ? "Defenders"
                  : "" || selectedPlayer.position === "mid"
                  ? "Midfielders"
                  : "" || selectedPlayer.position === "att"
                  ? "Attackers"
                  : ""}
              </div>
            )}

          {selectedPlayer && !selectedPlayer.set && (
            <Button
              variant="primary"
              className="btn btn-secondary add"
              onClick={() => handleAddFinal(selectedPlayer)}
              disabled={!playersToAdd.includes(selectedPlayer.position)}
            >
              Add Player
            </Button>
          )}

          {selectedPlayer && selectedPlayer.set && (
            <Button
              variant="primary"
              className="btn btn-secondary cancel"
              onClick={() => handleRemove(selectedPlayer)}
            >
              Remove Player
            </Button>
          )}

          <Button
            variant="primary"
            className="btn btn-secondary info-transfers"
            onClick={handleCloseSecond}
          >
            View Informattion
          </Button>
        </Modal.Body>
      </Modal>

      <div className="page-wrapper grid gap-4">
        <div className="left-side g-col-12 g-col-lg-9">
          <div className="title-wrapper">
            <div className="title-select">Transfers</div>
            <div className="player-list" onClick={() => seePlayers()}>
              <span>Player List</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="10"
                viewBox="0 0 32 20"
                color="primary"
                className="Arrows__ArrowRight-sc-7vd5ii-1 Arrows__ControlArrowRight-sc-7vd5ii-2 bVQmUc iGYQlC"
              >
                <path
                  d="M53.6485838,32.0017628 L50.0028805,32.002243 L44.1795487,32.002243 L42.8449352,32.002243 C42.2448392,32.002243 41.6106577,32.2648846 41.1853096,32.6869358 C40.7782045,33.0941023 40.4723956,33.7595891 40.5007201,34.3468117 C40.5285646,34.9508394 40.7258761,35.5807952 41.1853096,36.0066875 C41.6447432,36.4287387 42.2069131,36.6913803 42.8449352,36.6913803 L46.4978397,36.6913803 L47.9851176,36.6913803 L45.4666347,39.209763 C43.6044167,41.0722619 41.7383581,42.9386019 39.8780605,44.7991802 C38.2707633,46.4067198 36.6673068,48.0104182 35.0585694,49.6193983 C34.2803649,50.3977202 33.4867979,51.1722009 32.7181949,51.9601258 L32.6845895,51.9937362 C32.2568411,52.4215492 32,53.0481439 32,53.6536121 C32,54.2317118 32.2530005,54.9140038 32.6845895,55.313488 C33.1305809,55.7206545 33.7157945,56.0265096 34.3442151,55.9981808 C34.9721555,55.9703321 35.5592895,55.7600268 36.0038406,55.313488 L37.931349,53.3856888 L42.5261642,48.7906607 L48.1147384,43.2007634 C49.1805089,42.1348321 50.2462794,41.0689008 51.3115699,40.0034497 L51.3115699,43.8239971 L51.3115699,45.1597723 C51.3115699,45.7599588 51.5741719,46.3937558 51.9961594,46.8196481 C52.4032645,47.2263345 53.068651,47.5321896 53.6557849,47.5038608 C54.2597216,47.4760121 54.8895823,47.279151 55.3154105,46.8196481 C55.7316371,46.3582247 56,45.7954898 56,45.1597723 L56,41.5058366 L56,35.6821067 L56,34.3468117 C56,34.0073461 55.9183869,33.6846859 55.781085,33.3893941 C55.6649064,33.1209907 55.5084013,32.8717932 55.3082093,32.6864556 C54.8617379,32.2792891 54.2770043,31.9739142 53.6485838,32.0017628 Z"
                  transform="rotate(45 71.042 -6.799)"
                ></path>
              </svg>
            </div>
            <div className="sub-title">
              Make transfers but remember that every transfer above number of
              free transfers cost 4 points.
            </div>
          </div>
          <div
            className="upper-wrapper-transfers"
            style={errorClubShow && errorMoneyShow ? { height: "390px" } : {}}
          >
            <div className="control-wrapper">
              <div className="control-headline">
                <div className="gameweek">Gameweek 25</div>
              </div>
              <div className="timeline">
                <span className="week">Gameweek 25 deadline:</span>
                <span className="time">Sat 17 Feb 12:00</span>
              </div>
              <div className="main-controls">
                <div className="free-transfers">
                  <span className="text">Free Transfers</span>
                  <div className="counter">
                    <span className="number">{user && user.freeTransfers}</span>
                  </div>
                </div>

                <div className="cost">
                  <span className="text">Cost</span>
                  <div
                    className="counter"
                    style={
                      cost <= 0
                        ? {
                            backgroundColor: "transparent",
                            color: "#37003c",
                          }
                        : {
                            backgroundColor: "rgb(251, 37, 27)",
                            color: "white",
                          }
                    }
                  >
                    <span className="number">{cost} </span>
                    pts
                  </div>
                </div>

                <div className="money">
                  <span className="text">Money Remaining</span>
                  <div
                    className="counter"
                    style={
                      user.money > 0
                        ? {
                            backgroundColor: "rgb(0, 255, 135)",
                            color: "#37003c",
                          }
                        : {
                            backgroundColor: "rgb(251, 37, 27)",
                            color: "white",
                          }
                    }
                  >
                    {user.money.toFixed(1)}
                  </div>
                </div>
              </div>
              <Button
                variant="primary"
                className="btn btn-secondary my-button-transfer"
                disabled={reset}
                onClick={() => handleReset()}
              >
                Reset
              </Button>
            </div>
            {messageShow && (
              <div className="message-wrapper">
                <div className="message">Your team has been updated.</div>
              </div>
            )}
            {errorClubShow && (
              <div className="error-wrapper">
                <div className="error">
                  Too many players selected from{" "}
                  <span className="error-club-name">{errorClub}</span>
                </div>
              </div>
            )}
            {errorMoneyShow && (
              <div className="error-wrapper">
                <div
                  className="error"
                  style={{ padding: "5px", fontWeight: "700" }}
                >
                  Not enough money!
                </div>
              </div>
            )}
          </div>

          <div className="pitch-wrapper-transfers">
            <div className="goalkeepers">
              <div
                className="player goalkeeper"
                onClick={(event) => handleShow(event, user.goalkeeper[0])}
              >
                <div className="kit">
                  <img
                    src={user ? `src/${user.goalkeeper[0].kit_src}` : ""}
                    alt={user ? `${user.goalkeeper[0].club}.jpg` : ""}
                  />
                </div>

                {user && user.goalkeeper[0].name && (
                  <div className="name">
                    {user.goalkeeper[0].restore
                      ? user.goalkeeper[0].nameTmp
                      : user.goalkeeper[0].name}
                  </div>
                )}

                {user && user.goalkeeper[0].price && (
                  <div className="price">
                    {user.goalkeeper[0].restore
                      ? user.goalkeeper[0].priceTmp
                      : user.goalkeeper[0].price}
                  </div>
                )}
              </div>

              <div
                className="player subs-goalkeeper"
                onClick={(event) => handleShow(event, user.subs[0])}
              >
                <div className="kit">
                  <img
                    src={user ? `src/${user.subs[0].kit_src}` : ""}
                    alt={user ? `${user.subs[0].club}.jpg` : ""}
                  />
                </div>

                {user && user.subs[0].name && (
                  <div className="name">
                    {user.subs[0].restore
                      ? user.subs[0].nameTmp
                      : user.subs[0].name}
                  </div>
                )}
                {user && user.subs[0].price && (
                  <div className="price">
                    {user.subs[0].restore
                      ? user.subs[0].priceTmp
                      : user.subs[0].price}
                  </div>
                )}
              </div>
            </div>

            <div className="defence">
              {user &&
                user.defence.map((player, index) => (
                  <div
                    className="player defender"
                    key={index}
                    onClick={(event) => handleShow(event, player)}
                  >
                    <div className="kit">
                      <img
                        src={"src/" + player.kit_src}
                        alt={player.club + ".jpeg"}
                      />
                    </div>

                    {user && player.name && (
                      <div className="name">
                        {player.restore ? player.nameTmp : player.name}
                      </div>
                    )}
                    {user && player.price && (
                      <div className="price">
                        {player.restore ? player.priceTmp : player.price}
                      </div>
                    )}
                  </div>
                ))}

              {user &&
                user.subs &&
                user.subs.map(
                  (player, index) =>
                    player.position === "def" && (
                      <div
                        key={index}
                        className="player subs-defender"
                        onClick={(event) => handleShow(event, player)}
                      >
                        <div className="kit">
                          <img
                            src={"src/" + player.kit_src}
                            alt={player.club + ".jpeg"}
                          />
                        </div>

                        {user && player.name && (
                          <div className="name">
                            {player.restore ? player.nameTmp : player.name}
                          </div>
                        )}
                        {user && player.price && (
                          <div className="price">
                            {player.restore ? player.priceTmp : player.price}
                          </div>
                        )}
                      </div>
                    )
                )}
            </div>

            <div className="midfield">
              {user &&
                user.midfield.map((player, index) => (
                  <div
                    className="player midfielder"
                    key={index}
                    onClick={(event) => handleShow(event, player)}
                  >
                    <div className="kit">
                      <img
                        src={"src/" + player.kit_src}
                        alt={player.club + ".jpeg"}
                      />
                    </div>

                    {user && player.name && (
                      <div className="name">
                        {player.restore ? player.nameTmp : player.name}
                      </div>
                    )}
                    {user && player.price && (
                      <div className="price">
                        {player.restore ? player.priceTmp : player.price}
                      </div>
                    )}
                  </div>
                ))}

              {user &&
                user.subs &&
                user.subs.map(
                  (player, index) =>
                    player.position === "mid" && (
                      <div
                        key={index}
                        className="player subs-midfielder"
                        onClick={(event) => handleShow(event, player)}
                      >
                        <div className="kit">
                          <img
                            src={"src/" + player.kit_src}
                            alt={player.club + ".jpeg"}
                          />
                        </div>

                        {user && player.name && (
                          <div className="name">
                            {player.restore ? player.nameTmp : player.name}
                          </div>
                        )}
                        {user && player.price && (
                          <div className="price">
                            {player.restore ? player.priceTmp : player.price}
                          </div>
                        )}
                      </div>
                    )
                )}
            </div>

            <div className="attack">
              {user &&
                user.attack.map((player, index) => (
                  <div
                    className="player attacker"
                    key={index}
                    onClick={(event) => handleShow(event, player)}
                  >
                    <div className="kit">
                      <img
                        src={"src/" + player.kit_src}
                        alt={player.club + ".jpeg"}
                      />
                    </div>

                    {user && player.name && (
                      <div className="name">
                        {player.restore ? player.nameTmp : player.name}
                      </div>
                    )}
                    {user && player.price && (
                      <div className="price">
                        {player.restore ? player.priceTmp : player.price}
                      </div>
                    )}
                  </div>
                ))}

              {user &&
                user.subs &&
                user.subs.map(
                  (player, index) =>
                    player.position === "att" && (
                      <div
                        key={index}
                        className="player subs-attacker"
                        onClick={(event) => handleShow(event, player)}
                      >
                        <div className="kit">
                          <img
                            src={"src/" + player.kit_src}
                            alt={player.club + ".jpeg"}
                          />
                        </div>

                        {user && player.name && (
                          <div className="name">
                            {player.restore ? player.nameTmp : player.name}
                          </div>
                        )}
                        {user && player.price && (
                          <div className="price">
                            {player.restore ? player.priceTmp : player.price}
                          </div>
                        )}
                      </div>
                    )
                )}
            </div>
          </div>
          <button
            className="make-transfers"
            disabled={makeTransfers}
            onClick={() => handleMakeTransfers()}
          >
            Make Transfers
          </button>
        </div>
        <div className="players g-col-12 g-col-lg-3">
          <div className="player-selection">
            <span>Player Selection</span>
            <div className="back-to-pitch" onClick={() => seePitch()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="10"
                viewBox="0 0 24 15"
                color="primary"
                className="Arrows__ArrowLeft-sc-7vd5ii-0 Arrows__ControlArrowLeft-sc-7vd5ii-3 kJRbki dfDEUQ"
              >
                <path
                  d="M23.9996,7.4946 C23.9786,7.0416 23.8296,6.5696 23.4816,6.2506 C23.4816,6.2506 23.4806,6.2496 23.4806,6.2496 L18.4596,1.2256 L17.7526,0.5176 C17.4346,0.1986 16.9586,0.0016 16.5096,-0.0004 C16.0766,-0.0004 15.5616,0.1906 15.2656,0.5176 C14.9596,0.8526 14.7296,1.2916 14.7486,1.7616 C14.7686,2.2296 14.9276,2.6676 15.2656,3.0056 L17.9916,5.7336 C17.9916,5.7336 2.6226,5.7246 1.7966,5.7346 L1.7616,5.7346 C1.3076,5.7346 0.8386,5.9316 0.5186,6.2526 C0.2116,6.5586 -0.0164,7.0556 0.0006,7.4966 C0.0216,7.9496 0.1696,8.4226 0.5176,8.7406 C0.8656,9.0596 1.2886,9.2576 1.7616,9.2566 L17.9986,9.2566 L15.2646,11.9936 C14.9456,12.3116 14.7496,12.7866 14.7476,13.2376 C14.7476,13.6686 14.9376,14.1846 15.2646,14.4816 C15.5996,14.7866 16.0376,15.0166 16.5076,14.9986 C16.9736,14.9746 17.4136,14.8186 17.7506,14.4816 L22.7766,9.4516 L23.4856,8.7436 C23.6656,8.5626 23.7936,8.3486 23.8776,8.1186 C23.9576,7.9146 24.0076,7.6996 23.9996,7.4946"
                  transform="matrix(-1 0 0 1 24 0)"
                ></path>
              </svg>
              <span>Back</span>
            </div>
          </div>

          <Form className="transfers-form">
            <Form.Group className="form-group">
              <Form.Label>View</Form.Label>
              <Form.Select
                as="select"
                custom="true"
                className="my-select-view"
                value={selectViewValue}
                onChange={handleSelectView}
              >
                {optionGroups.map((group, groupIndex) => (
                  <optgroup key={groupIndex} label={group.label}>
                    {group.options.map((option, optionIndex) =>
                      group.options == clubsOnly ? (
                        <option key={optionIndex} value={option.value}>
                          {option.value}
                        </option>
                      ) : (
                        <option key={optionIndex} value={option}>
                          {option}
                        </option>
                      )
                    )}
                  </optgroup>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="form-group">
              <Form.Label>Sorted by</Form.Label>
              <Form.Select
                as="select"
                custom="true"
                className="my-select-sort"
                value={selectSortValue}
                onChange={handleSelectSort}
              >
                <option value="price-asc">Price ascending</option>
                <option value="price-des">Price descending</option>
                <option value="points-asc">Points ascending</option>
                <option value="points-des">Points descending</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Control
                type="text"
                name="search-input"
                id="search-input"
                placeholder="Search for player..."
                className="form-control"
                value={inputSeatchValue}
                onChange={input}
              />
              <div className="search-icon-wrapper">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
              </div>
            </Form.Group>
          </Form>

          <p className="amount-banner">
            {playersShown()}
            <span> players shown</span>
          </p>

          {showGoalkeepers && (
            <div className="goalkeepers-list">
              <div className="title-player-list">
                <h3>Goalkeepers</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                    <th className="price-icon">£</th>
                    <th className="rating-icon">**</th>
                  </tr>
                </thead>

                <tbody>
                  {user &&
                    currentGoalkeepers.map((goalkeeper, index) =>
                      !goalkeeper.shouldShow ? (
                        <tr
                          className="player-select"
                          key={index}
                          id={goalkeeper.name}
                          onClick={() => handleShowSecond(goalkeeper)}
                        >
                          <td className="info">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="6"
                              height="13"
                              viewBox="0 0 6 13"
                            >
                              <path
                                d="M2.22454008,4.81004082 C2.04454008,5.29122857 1.86734808,5.7178898 1.72391208,6.156 C1.26547608,7.55608163 0.79016808,8.95126531 0.37907208,10.3661633 C0.14141208,11.1840857 0.47704128,11.7369796 1.18250808,11.838 C1.43938008,11.8748302 1.71688008,11.8733951 1.96813608,11.8150408 C3.51877608,11.4548694 4.20733608,10.1739796 4.91521608,8.91887755 C4.76334408,9.03175959 4.64147208,9.17573878 4.51255608,9.31301633 C4.11552408,9.7358449 3.67396008,10.0969714 3.12319608,10.2887878 C3.03319608,10.3198788 2.89960008,10.305529 2.82272808,10.2548278 C2.78194728,10.228042 2.80397808,10.0725869 2.8269468,9.98313796 C2.8569468,9.86451551 2.9160096,9.75306857 2.9624148,9.63827265 C3.5652228,8.14782367 4.1759748,6.66080327 4.7638548,5.16410939 C4.865574,4.90486041 4.9325988,4.59873796 4.9058868,4.32609306 C4.8566676,3.82768898 4.3424508,3.47564816 3.7124508,3.48904408 C2.0769708,3.52348286 0.8985708,4.35097469 0.0595308,5.74002367 C0.0285936,5.79120367 0.0285936,5.86151633 0,5.98253388 C0.698436,5.45686041 1.27548,4.82070122 2.22468,4.81018286 L2.22454008,4.81004082 Z M5.82634008,1.5717551 C5.82634008,2.43941633 5.13680808,3.14302041 4.28602008,3.14302041 C3.43571208,3.14302041 2.74618008,2.43941633 2.74618008,1.5717551 C2.74618008,0.703616327 3.43571208,0 4.28602008,0 C5.13679608,0 5.82634008,0.703604082 5.82634008,1.5717551"
                                transform="translate(0 .5)"
                              ></path>
                            </svg>
                          </td>
                          <td
                            className="player-info"
                            style={goalkeeper.set ? { opacity: "0.6" } : {}}
                          >
                            <img
                              src={"src/" + goalkeeper.kit_src}
                              alt={goalkeeper.club + ".jpeg"}
                            />
                            <div className="player-details">
                              <p className="name">{goalkeeper.name}</p>
                              <div className="other">
                                <span className="clu">
                                  {goalkeeper.club
                                    .substring(0, 3)
                                    .toUpperCase()}
                                </span>
                                <span className="pos">
                                  {goalkeeper.position.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div
                              className="price"
                              style={goalkeeper.set ? { opacity: "0.6" } : {}}
                            >
                              {goalkeeper.price}
                            </div>
                          </td>
                          <td>
                            <div
                              className="rating"
                              style={goalkeeper.set ? { opacity: "0.6" } : {}}
                            >
                              {goalkeeper.points}
                            </div>
                          </td>
                        </tr>
                      ) : null
                    )}
                </tbody>
              </table>
            </div>
          )}

          {showDefenders && (
            <div className="defenders-list">
              <div className="title-player-list">
                <h3>Defenders</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                    <th className="price-icon">£</th>
                    <th className="rating-icon">**</th>
                  </tr>
                </thead>

                <tbody>
                  {user &&
                    currentDefenders.map((defender, index) =>
                      !defender.shouldShow ? (
                        <tr
                          className="player-select"
                          key={index}
                          id={defender.name}
                          onClick={() => handleShowSecond(defender)}
                        >
                          <td className="info">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="6"
                              height="13"
                              viewBox="0 0 6 13"
                            >
                              <path
                                d="M2.22454008,4.81004082 C2.04454008,5.29122857 1.86734808,5.7178898 1.72391208,6.156 C1.26547608,7.55608163 0.79016808,8.95126531 0.37907208,10.3661633 C0.14141208,11.1840857 0.47704128,11.7369796 1.18250808,11.838 C1.43938008,11.8748302 1.71688008,11.8733951 1.96813608,11.8150408 C3.51877608,11.4548694 4.20733608,10.1739796 4.91521608,8.91887755 C4.76334408,9.03175959 4.64147208,9.17573878 4.51255608,9.31301633 C4.11552408,9.7358449 3.67396008,10.0969714 3.12319608,10.2887878 C3.03319608,10.3198788 2.89960008,10.305529 2.82272808,10.2548278 C2.78194728,10.228042 2.80397808,10.0725869 2.8269468,9.98313796 C2.8569468,9.86451551 2.9160096,9.75306857 2.9624148,9.63827265 C3.5652228,8.14782367 4.1759748,6.66080327 4.7638548,5.16410939 C4.865574,4.90486041 4.9325988,4.59873796 4.9058868,4.32609306 C4.8566676,3.82768898 4.3424508,3.47564816 3.7124508,3.48904408 C2.0769708,3.52348286 0.8985708,4.35097469 0.0595308,5.74002367 C0.0285936,5.79120367 0.0285936,5.86151633 0,5.98253388 C0.698436,5.45686041 1.27548,4.82070122 2.22468,4.81018286 L2.22454008,4.81004082 Z M5.82634008,1.5717551 C5.82634008,2.43941633 5.13680808,3.14302041 4.28602008,3.14302041 C3.43571208,3.14302041 2.74618008,2.43941633 2.74618008,1.5717551 C2.74618008,0.703616327 3.43571208,0 4.28602008,0 C5.13679608,0 5.82634008,0.703604082 5.82634008,1.5717551"
                                transform="translate(0 .5)"
                              ></path>
                            </svg>
                          </td>
                          <td
                            className="player-info"
                            style={defender.set ? { opacity: "0.6" } : {}}
                          >
                            <img
                              src={"src/" + defender.kit_src}
                              alt={defender.club + ".jpeg"}
                            />
                            <div className="player-details">
                              <p className="name">{defender.name}</p>
                              <div className="other">
                                <span className="clu">
                                  {defender.club.substring(0, 3).toUpperCase()}
                                </span>
                                <span className="pos">
                                  {defender.position.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div
                              className="price"
                              style={defender.set ? { opacity: "0.6" } : {}}
                            >
                              {defender.price}
                            </div>
                          </td>
                          <td>
                            <div
                              className="rating"
                              style={defender.set ? { opacity: "0.6" } : {}}
                            >
                              {defender.points}
                            </div>
                          </td>
                        </tr>
                      ) : null
                    )}
                </tbody>
              </table>
            </div>
          )}

          {showMidfielders && (
            <div className="midfielders-list">
              <div className="title-player-list">
                <h3>Midfielders</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                    <th className="price-icon">£</th>
                    <th className="rating-icon">**</th>
                  </tr>
                </thead>

                <tbody>
                  {user &&
                    currentMidfielders.map((midfielder, index) =>
                      !midfielder.shouldShow ? (
                        <tr
                          className="player-select"
                          key={index}
                          id={midfielder.name}
                          onClick={() => handleShowSecond(midfielder)}
                        >
                          <td className="info">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="6"
                              height="13"
                              viewBox="0 0 6 13"
                            >
                              <path
                                d="M2.22454008,4.81004082 C2.04454008,5.29122857 1.86734808,5.7178898 1.72391208,6.156 C1.26547608,7.55608163 0.79016808,8.95126531 0.37907208,10.3661633 C0.14141208,11.1840857 0.47704128,11.7369796 1.18250808,11.838 C1.43938008,11.8748302 1.71688008,11.8733951 1.96813608,11.8150408 C3.51877608,11.4548694 4.20733608,10.1739796 4.91521608,8.91887755 C4.76334408,9.03175959 4.64147208,9.17573878 4.51255608,9.31301633 C4.11552408,9.7358449 3.67396008,10.0969714 3.12319608,10.2887878 C3.03319608,10.3198788 2.89960008,10.305529 2.82272808,10.2548278 C2.78194728,10.228042 2.80397808,10.0725869 2.8269468,9.98313796 C2.8569468,9.86451551 2.9160096,9.75306857 2.9624148,9.63827265 C3.5652228,8.14782367 4.1759748,6.66080327 4.7638548,5.16410939 C4.865574,4.90486041 4.9325988,4.59873796 4.9058868,4.32609306 C4.8566676,3.82768898 4.3424508,3.47564816 3.7124508,3.48904408 C2.0769708,3.52348286 0.8985708,4.35097469 0.0595308,5.74002367 C0.0285936,5.79120367 0.0285936,5.86151633 0,5.98253388 C0.698436,5.45686041 1.27548,4.82070122 2.22468,4.81018286 L2.22454008,4.81004082 Z M5.82634008,1.5717551 C5.82634008,2.43941633 5.13680808,3.14302041 4.28602008,3.14302041 C3.43571208,3.14302041 2.74618008,2.43941633 2.74618008,1.5717551 C2.74618008,0.703616327 3.43571208,0 4.28602008,0 C5.13679608,0 5.82634008,0.703604082 5.82634008,1.5717551"
                                transform="translate(0 .5)"
                              ></path>
                            </svg>
                          </td>
                          <td
                            className="player-info"
                            style={midfielder.set ? { opacity: "0.6" } : {}}
                          >
                            <img
                              src={"src/" + midfielder.kit_src}
                              alt={midfielder.club + ".jpeg"}
                            />
                            <div className="player-details">
                              <p className="name">{midfielder.name}</p>
                              <div className="other">
                                <span className="clu">
                                  {midfielder.club
                                    .substring(0, 3)
                                    .toUpperCase()}
                                </span>
                                <span className="pos">
                                  {midfielder.position.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div
                              className="price"
                              style={midfielder.set ? { opacity: "0.6" } : {}}
                            >
                              {midfielder.price}
                            </div>
                          </td>
                          <td>
                            <div
                              className="rating"
                              style={midfielder.set ? { opacity: "0.6" } : {}}
                            >
                              {midfielder.points}
                            </div>
                          </td>
                        </tr>
                      ) : null
                    )}
                </tbody>
              </table>
            </div>
          )}

          {showAttackers && (
            <div className="attackers-list">
              <div className="title-player-list">
                <h3>Attackers</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                    <th className="price-icon">£</th>
                    <th className="rating-icon">**</th>
                  </tr>
                </thead>

                <tbody>
                  {user &&
                    currentAttackers.map((attacker, index) =>
                      !attacker.shouldShow ? (
                        <tr
                          className="player-select"
                          key={index}
                          id={attacker.name}
                          onClick={() => handleShowSecond(attacker)}
                        >
                          <td className="info">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="6"
                              height="13"
                              viewBox="0 0 6 13"
                            >
                              <path
                                d="M2.22454008,4.81004082 C2.04454008,5.29122857 1.86734808,5.7178898 1.72391208,6.156 C1.26547608,7.55608163 0.79016808,8.95126531 0.37907208,10.3661633 C0.14141208,11.1840857 0.47704128,11.7369796 1.18250808,11.838 C1.43938008,11.8748302 1.71688008,11.8733951 1.96813608,11.8150408 C3.51877608,11.4548694 4.20733608,10.1739796 4.91521608,8.91887755 C4.76334408,9.03175959 4.64147208,9.17573878 4.51255608,9.31301633 C4.11552408,9.7358449 3.67396008,10.0969714 3.12319608,10.2887878 C3.03319608,10.3198788 2.89960008,10.305529 2.82272808,10.2548278 C2.78194728,10.228042 2.80397808,10.0725869 2.8269468,9.98313796 C2.8569468,9.86451551 2.9160096,9.75306857 2.9624148,9.63827265 C3.5652228,8.14782367 4.1759748,6.66080327 4.7638548,5.16410939 C4.865574,4.90486041 4.9325988,4.59873796 4.9058868,4.32609306 C4.8566676,3.82768898 4.3424508,3.47564816 3.7124508,3.48904408 C2.0769708,3.52348286 0.8985708,4.35097469 0.0595308,5.74002367 C0.0285936,5.79120367 0.0285936,5.86151633 0,5.98253388 C0.698436,5.45686041 1.27548,4.82070122 2.22468,4.81018286 L2.22454008,4.81004082 Z M5.82634008,1.5717551 C5.82634008,2.43941633 5.13680808,3.14302041 4.28602008,3.14302041 C3.43571208,3.14302041 2.74618008,2.43941633 2.74618008,1.5717551 C2.74618008,0.703616327 3.43571208,0 4.28602008,0 C5.13679608,0 5.82634008,0.703604082 5.82634008,1.5717551"
                                transform="translate(0 .5)"
                              ></path>
                            </svg>
                          </td>
                          <td
                            className="player-info"
                            style={attacker.set ? { opacity: "0.6" } : {}}
                          >
                            <img
                              src={"src/" + attacker.kit_src}
                              alt={attacker.club + ".jpeg"}
                            />
                            <div className="player-details">
                              <p className="name">{attacker.name}</p>
                              <div className="other">
                                <span className="clu">
                                  {attacker.club.substring(0, 3).toUpperCase()}
                                </span>
                                <span className="pos">
                                  {attacker.position.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div
                              className="price"
                              style={attacker.set ? { opacity: "0.6" } : {}}
                            >
                              {attacker.price}
                            </div>
                          </td>
                          <td>
                            <div
                              className="rating"
                              style={attacker.set ? { opacity: "0.6" } : {}}
                            >
                              {attacker.points}
                            </div>
                          </td>
                        </tr>
                      ) : null
                    )}
                </tbody>
              </table>
            </div>
          )}

          {shouldSeePagination && (
            <Pagination
              playersPerPage={playersPerPage}
              totalPlayers={totalPlayers}
              paginatePrev={paginatePrev}
              paginateNext={paginateNext}
              paginatePrevEnd={paginatePrevEnd}
              paginateNextEnd={paginateNextEnd}
              disablePrevious={disablePrevious}
              disableNext={disableNext}
              currentPage={currentPage}
            ></Pagination>
          )}
        </div>
      </div>
    </>
  );
}

export default Transfers;
