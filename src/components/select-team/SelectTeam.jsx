import "../select-team/SelectTeam.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import getCookie from "../../help-files/getCookie";
import { firebase, database } from "../../help-files/firebase.js";
import { get, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { User } from "../../models/user.ts";
import { Player } from "../../models/players.ts";
import Users from "../../assets/usersFantasyStart.json";
import Countries from "../../assets/countries.json";
import Clubs from "../../assets/clubs.json";
import Select from "react-select";
import ReactLoading from "react-loading";
import Form from "react-bootstrap/Form";
import { Button, ToggleButtonGroup } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

function SelectTeam({ onUpdateValueHome }) {
  // Variables related to fetching data, error and loading interface and other
  const [user, setUser] = useState([]);
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const usersRef = ref(database, "usersFantasy/" + getCookie("id"));
  const playersRef = ref(database, "players");
  const navigate = useNavigate();

  // Variables separting user players into their positions
  const [goalkeepers, setGoalkeepers] = useState([]);
  const [defenders, setDefenders] = useState([]);
  const [midfileders, setMidfielders] = useState([]);
  const [attackers, setAttackers] = useState([]);

  // Variable handling display of modals
  const [show, setShow] = useState(false);
  const [showSecond, setShowSecond] = useState(false);

  // Variables determining selected player and errors
  const [player, setPlayer] = useState();
  const [selectedPlayer, setSelectedPlayer] = useState();
  const [playerElement, setPlayerElement] = useState();
  const [errorClub, setErrorClub] = useState();
  const [errorClubShow, setErrorClubShow] = useState(false);
  const [errorMoneyShow, setErrorMoneyShow] = useState(false);

  // Variables for functionality of reset, autopick, add squad button
  const [resetButton, setResetButton] = useState(true);
  const [autopickButton, setAutopickButton] = useState(false);
  const [addSquad, setAddSquad] = useState(true);

  // Variables handling display of players positions
  const [showGoalkeepers, setShowGoalkeepers] = useState(false);
  const [showDefenders, setShowDefenders] = useState(false);
  const [showMidfielders, setShowMidfielders] = useState(false);
  const [showAttackers, setShowAttackers] = useState(false);

  // Variables for display of form errors
  const [blankEmail, setBlankEmail] = useState(false);
  const [blankName, setBlankName] = useState(false);
  const [blankLastName, setBlankLastName] = useState(false);
  const [blankTeamName, setBlankTeamName] = useState(false);
  const [blankGender, setBlankGender] = useState(false);
  const [blankDateOfBirth, setBlankDateOfBirth] = useState(false);
  const [blankCountry, setBlankCountry] = useState(false);
  const [blankClub, setBlankClub] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidDate, setInvalidDate] = useState(false);

  const [isAutoPickFinish, setisAutoPickFinish] = useState(false);
  useEffect(() => {
    if (isAutoPickFinish == true) {
      window.scrollTo({
        top: 350,
        behavior: "instant",
      });
    }
    if (!selectedPlayer) {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
    if (user && selectedPlayer) {
      let result = findDuplicateValue(user.clubs, 3);

      if (result.length) {
        setErrorClub(result[0]);
        setErrorClubShow(true);
        setAutopickButton(true);
        setAddSquad(true);
      } else {
        setErrorClubShow(false);
      }

      if (user.money < 0) {
        setErrorMoneyShow(true);
        setAddSquad(true);
        setAutopickButton(true);
      } else {
        setErrorMoneyShow(false);
      }

      if (user.countPlayers == 0) {
        setResetButton(true);
      } else {
        setResetButton(false);
      }

      if (selectedPlayer.position === "gkp") {
        window.scrollTo({
          top: 550,
          behavior: "instant",
        });
      } else if (selectedPlayer.position === "def") {
        window.scrollTo({
          top: 700,
          behavior: "instant",
        });
      } else if (selectedPlayer.position === "mid") {
        window.scrollTo({
          top: 850,
          behavior: "instant",
        });
      } else if (selectedPlayer.position === "att") {
        window.scrollTo({
          top: 1000,
          behavior: "instant",
        });
      }
    }
  }, [user]);

  // Functions handling display of modal
  function handleShow(event, player) {
    setPlayer(player);
    setPlayerElement(event.currentTarget);
    setShow(true);
  }

  function handleShowSecond(event, player) {
    setSelectedPlayer(player);
    setShowSecond(true);
  }
  const handleClose = () => setShow(false);
  const handleCloseSecond = () => setShowSecond(false);

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

  // Function restoring player
  function restorePlayer() {
    setShowGoalkeepers(false);
    setShowDefenders(false);
    setShowMidfielders(false);
    setShowAttackers(false);
  }

  // Function displaying number of shown players
  function playersShown() {
    let count = 0;
    if (showGoalkeepers) {
      count = goalkeepers.length;
    } else if (showDefenders) {
      count = defenders.length;
    } else if (showMidfielders) {
      count = midfileders.length;
    } else if (showAttackers) {
      count = attackers.length;
    }

    return count;
  }

  // Function that handle choosing position to add player
  function handleAdd(event) {
    let playersElements = document.querySelectorAll(".player");
    const allPlayers = [
      ...user.goalkeeper,
      ...user.defence,
      ...user.midfield,
      ...user.attack,
      ...user.subs,
    ];

    let parentElement = playerElement.parentNode;
    if (parentElement.classList.contains("goalkeepers")) {
      seeGoalkeepers();
    } else if (parentElement.classList.contains("defence")) {
      seeDefence();
    } else if (parentElement.classList.contains("midfield")) {
      seeMidfield();
    } else if (parentElement.classList.contains("attack")) {
      seeAttack();
    }

    playersElements.forEach((player) => {
      player.style.opacity = "0.6";
    });
    playerElement.style.opacity = "1";
    playerElement.style.backgroundColor = "rgba(255, 255, 0, 0.6)";

    allPlayers.forEach((player) => {
      player.add = true;
      player.chosen = true;
    });

    player.chosen = false;
    player.restore = true;

    setPlayer(player);
    if (windowWidth.matches) {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
      seePlayers(event);
    }
    setUser(user);
    setShow(false);
  }

  // Function handling adding player to selected position
  function handleAddFinal() {
    let playersElements = document.querySelectorAll(".player");
    playersElements.forEach((player) => {
      player.style.opacity = "1";
      player.style.backgroundColor = "transparent";
    });

    let userTemp = user;
    const allPlayers = [
      ...userTemp.goalkeeper,
      ...userTemp.defence,
      ...userTemp.midfield,
      ...userTemp.attack,
      ...userTemp.subs,
    ];

    for (let i = 0; i < userTemp.goalkeeper.length; i++) {
      if (userTemp.goalkeeper[i].restore == true) {
        userTemp.goalkeeper[i] = new Player(selectedPlayer);
        userTemp.goalkeeper[i].remove = true;
        userTemp.goalkeeper[i].add = true;
      }
    }

    for (let i = 0; i < userTemp.defence.length; i++) {
      if (userTemp.defence[i].restore == true) {
        userTemp.defence[i] = new Player(selectedPlayer);
        userTemp.defence[i].remove = true;
        userTemp.defence[i].add = true;
      }
    }

    for (let i = 0; i < userTemp.midfield.length; i++) {
      if (userTemp.midfield[i].restore == true) {
        userTemp.midfield[i] = new Player(selectedPlayer);
        userTemp.midfield[i].remove = true;
        userTemp.midfield[i].add = true;
      }
    }

    for (let i = 0; i < userTemp.attack.length; i++) {
      if (userTemp.attack[i].restore == true) {
        userTemp.attack[i] = new Player(selectedPlayer);
        userTemp.attack[i].remove = true;
        userTemp.attack[i].add = true;
      }
    }

    for (let i = 0; i < userTemp.subs.length; i++) {
      if (userTemp.subs[i].restore == true) {
        userTemp.subs[i] = new Player(selectedPlayer);
        userTemp.subs[i].remove = true;
        userTemp.subs[i].add = true;
      }
    }

    allPlayers.forEach((player) => {
      if (player.remove == true) {
        player.add = true;
      } else if (player.remove == false) {
        player.add = false;
      }
      player.restore = false;
      player.chosen = false;
    });

    userTemp.clubs.push(selectedPlayer.club);
    userTemp.money = userTemp.money - selectedPlayer.price;

    userTemp.countPlayers++;
    if (userTemp.countPlayers < 15) {
      setAddSquad(true);
    } else if (userTemp.countPlayers === 15) {
      setAddSquad(false);
      setAutopickButton(true);
    }

    userTemp = new User(userTemp);
    setUser(userTemp);
    updateUser(userTemp);
    if (windowWidth.matches) {
      seePitch();
    }
    restorePlayer();
    setShowSecond(false);
  }

  // Function handling removing the player
  function handleRemove() {
    let userTemp = user;
    const allPlayers = [
      ...userTemp.goalkeeper,
      ...userTemp.defence,
      ...userTemp.midfield,
      ...userTemp.attack,
      ...userTemp.subs,
    ];

    for (let i = 0; i < allPlayers.length; i++) {
      if (allPlayers[i].name === player.name) {
        allPlayers[i].add = false;
        allPlayers[i].remove = false;
        userTemp.money = userTemp.money + allPlayers[i].price;
        let indexArr = userTemp.clubs.indexOf(allPlayers[i].club);
        userTemp.clubs.splice(indexArr, 1);
        allPlayers[i].position = "";
        allPlayers[i].name = "";
        allPlayers[i].club = "";
        allPlayers[i].price = 0;
        allPlayers[i].kit_src = "assets/img/kits/selected-kit.webp";
      }
    }

    userTemp.countPlayers--;

    userTemp = new User(userTemp);

    updateUser(userTemp);
    setAddSquad(true);
    setAutopickButton(false);
    restorePlayer();
    setShow(false);
  }

  // Function handling restore of chosen player
  function handleRestore() {
    let playersElements = document.querySelectorAll(".player");
    const allPlayers = [
      ...user.goalkeeper,
      ...user.defence,
      ...user.midfield,
      ...user.attack,
      ...user.subs,
    ];

    playersElements.forEach((player) => {
      player.style.opacity = "1";
    });
    playerElement.style.backgroundColor = "transparent";

    allPlayers.forEach((player) => {
      if (player.remove == true) {
        player.add = true;
      } else if (player.remove == false) {
        player.add = false;
      }
      player.restore = false;
      player.chosen = false;
    });
    player.restore = false;

    setPlayer(player);
    setUser(user);
    restorePlayer();
    setShow(false);
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
      let wrapperDiv = document.querySelector(".pitch-wrapper");
      let formSelect = document.querySelector(".select-form");
      let upperWrapperDiv = document.querySelector(".upper-wrapper-select");
      let titleWrapperDiv = document.querySelector(".title-wrapper");
      let positionsDivs = document.querySelectorAll(".position");
      let addSquadButton = document.querySelector(".enter-squad");
      let backToPitchDiv = document.querySelector(".back-to-pitch");

      if (width.matches) {
        positionsDivs.forEach((position) => {
          position.innerText = "Add";
        });
        playerList.style.display = "flex";
        wrapperDiv.style.display = "flex";
        formSelect.style.display = "block";
        addSquadButton.style.display = "block";
        playersDiv.style.display = "none";
        upperWrapperDiv.style.display = "block";

        if (playersDiv.classList.contains("active")) {
          backToPitchDiv.style.display = "flex";
          playerList.style.display = "none";
          wrapperDiv.style.display = "none";
          formSelect.style.display = "none";
          addSquadButton.style.display = "none";
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
          formSelect.style.display = "block";
          addSquadButton.style.display = "block";
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
  function seePlayers(event) {
    let element = event.currentTarget;
    let playersDiv = document.querySelector(".players");
    let wrapperDiv = document.querySelector(".pitch-wrapper");
    let formSelect = document.querySelector(".select-form");
    let upperWrapperDiv = document.querySelector(".upper-wrapper-select");
    let titleWrapperDiv = document.querySelector(".title-wrapper");
    let addSquadButton = document.querySelector(".enter-squad");
    let backToPitchDiv = document.querySelector(".back-to-pitch");

    backToPitchDiv.style.display = "flex";
    addSquadButton.style.display = "none";
    element.style.display = "none";
    titleWrapperDiv.style.display = "none";
    wrapperDiv.style.display = "none";
    formSelect.style.display = "none";
    playersDiv.style.display = "block";
    upperWrapperDiv.style.display = "none";
    playersDiv.classList.add("active");
  }

  // Function handling display of pitch-wrapper div element
  function seePitch() {
    let playersDiv = document.querySelector(".players");
    let wrapperDiv = document.querySelector(".pitch-wrapper");
    let formSelect = document.querySelector(".select-form");
    let playerList = document.querySelector(".player-list");
    let upperWrapperDiv = document.querySelector(".upper-wrapper-select");
    let titleWrapperDiv = document.querySelector(".title-wrapper");
    let addSquadButton = document.querySelector(".enter-squad");
    let backToPitchDiv = document.querySelector(".back-to-pitch");

    titleWrapperDiv.style.display = "block";
    backToPitchDiv.style.display = "none";
    wrapperDiv.style.display = "flex";
    formSelect.style.display = "block";
    addSquadButton.style.display = "block";
    playersDiv.style.display = "none";
    playerList.style.display = "flex";
    upperWrapperDiv.style.display = "block";
    playersDiv.classList.remove("active");
  }

  // Function that shuffle array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Functions handling auto-pick button
  const handleAutopick = () => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const [snapshot1, snapshot2] = await Promise.all([
          get(usersRef),
          get(playersRef),
        ]);

        const data1 = snapshot1.val();
        const data2 = snapshot2.val();

        setUser(new User(data1));
        const allPlayers = [
          ...data1.goalkeeper,
          ...data1.defence,
          ...data1.midfield,
          ...data1.attack,
          ...data1.subs,
        ];

        let addedPlayersBig = [];
        allPlayers.forEach((player) => {
          if (player.add == true) {
            addedPlayersBig.push(player);
          }
        });
        data2.forEach((player) => {
          const smallObj = addedPlayersBig.find(
            (obj) => obj.name === player.name
          );
          if (smallObj) {
            player.set = true;
          }
        });

        setPlayers(data2.map((player) => new Player(player)));
        setGoalkeepers(data2.filter((player) => player.position === "gkp"));
        setDefenders(data2.filter((player) => player.position === "def"));
        setMidfielders(data2.filter((player) => player.position === "mid"));
        setAttackers(data2.filter((player) => player.position === "att"));

        let dataUsers = new User(data1);
        let dataUsersCopy = dataUsers;
        let dataPlayers = data2.map((player) => new Player(player));
        let dataPlayersCopy = [...dataPlayers];

        const conditionMet = autoPickCallback(dataUsersCopy, dataPlayersCopy);

        if (conditionMet == true) {
          getData();
        } else {
          setResetButton(true);
          setResetButton(false);
          setAutopickButton(true);
          setAddSquad(false);
          setUser(dataUsers);
          updateUser(dataUsers);
          setisAutoPickFinish(true);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  };

  // Function handling autopick functionality
  function autoPickCallback(newUser, newPlayersTemp) {
    let addedPlayers = [];
    let addedClubs = [];

    for (const key in newUser) {
      for (let i = 0; i < newUser[key].length; i++) {
        if (newUser[key][i].add == true) {
          addedPlayers.push(newUser[key][i]);
          addedClubs.push(newUser[key][i].club);
        }
      }
    }

    let result = findDuplicateValue(addedClubs, 2);

    let newPlayers = newPlayersTemp.filter(
      (item) => !result.includes(item.club)
    );

    const filteredNewPlayers = newPlayers.filter((newPlayer) => {
      return !addedPlayers.some(
        (addedPlayer) => addedPlayer.name === newPlayer.name
      );
    });

    for (let i = 0; i < filteredNewPlayers.length; i++) {
      filteredNewPlayers[i].add = true;
      filteredNewPlayers[i].remove = true;
    }

    let goalkeepersTemp = filteredNewPlayers.filter(
      (player) => player.position === "gkp"
    );
    goalkeepersTemp = shuffleArray([...goalkeepersTemp]);

    let defenceTemp = filteredNewPlayers.filter(
      (player) => player.position === "def"
    );
    defenceTemp = shuffleArray([...defenceTemp]);

    let midfieldTemp = filteredNewPlayers.filter(
      (player) => player.position === "mid"
    );
    midfieldTemp = shuffleArray([...midfieldTemp]);

    let attackTemp = filteredNewPlayers.filter(
      (player) => player.position === "att"
    );
    attackTemp = shuffleArray([...attackTemp]);

    for (const key in newUser) {
      for (let i = 0; i < newUser[key].length; i++) {
        if (newUser[key][i].add == false) {
          if (key === "goalkeeper") {
            newUser[key][i] = goalkeepersTemp[i];
            newUser.countPlayers++;
            newUser.clubs.push(goalkeepersTemp[i].club);
            newUser.money = newUser.money - goalkeepersTemp[i].price;
          } else if (key === "defence") {
            newUser[key][i] = defenceTemp[i];
            newUser.countPlayers++;
            newUser.clubs.push(defenceTemp[i].club);
            newUser.money = newUser.money - defenceTemp[i].price;
          } else if (key === "midfield") {
            newUser[key][i] = midfieldTemp[i];
            newUser.countPlayers++;
            newUser.clubs.push(midfieldTemp[i].club);
            newUser.money = newUser.money - midfieldTemp[i].price;
          } else if (key === "attack") {
            newUser[key][i] = attackTemp[i];
            newUser.countPlayers++;
            newUser.clubs.push(attackTemp[i].club);
            newUser.money = newUser.money - attackTemp[i].price;
          } else if (key === "subs") {
            if (i === 0) {
              newUser[key][i] = goalkeepersTemp[1];
              newUser.countPlayers++;
              newUser.clubs.push(goalkeepersTemp[1].club);
              newUser.money = newUser.money - goalkeepersTemp[1].price;
            } else if (i === 1) {
              newUser[key][i] = defenceTemp[4];
              newUser.countPlayers++;
              newUser.clubs.push(defenceTemp[4].club);
              newUser.money = newUser.money - defenceTemp[4].price;
            } else if (i === 2) {
              newUser[key][i] = midfieldTemp[4];
              newUser.countPlayers++;
              newUser.clubs.push(midfieldTemp[4].club);
              newUser.money = newUser.money - midfieldTemp[4].price;
            } else if (i === 3) {
              newUser[key][i] = attackTemp[3];
              newUser.countPlayers++;
              newUser.clubs.push(attackTemp[3].club);
              newUser.money = newUser.money - attackTemp[3].price;
            }
          }
        }
      }
    }
    newUser = new User(newUser);

    let resultNew = findDuplicateValue(newUser.clubs, 3);

    if (resultNew.length > 0 || newUser.money < 0) {
      window.scrollTo({
        top: 350,
        behavior: "instant",
      });
      restorePlayer();
      return true;
    } else {
      restorePlayer();
      return false;
    }
  }

  // Function handling reset gutton
  function handleReset() {
    setAutopickButton(false);
    setResetButton(true);
    let empthyUser = new User(Users);
    let newUser = user;
    newUser.goalkeeper = empthyUser.goalkeeper;
    newUser.defence = empthyUser.defence;
    newUser.midfield = empthyUser.midfield;
    newUser.attack = empthyUser.attack;
    newUser.subs = empthyUser.subs;
    newUser.countPlayers = empthyUser.countPlayers;
    newUser.money = empthyUser.money;
    newUser.freeTransfers = empthyUser.freeTransfers;
    newUser.clubs = [];
    setUser(new User(newUser));
    setAddSquad(true);
    updateUser(newUser);
    window.scrollTo({
      top: 350,
      behavior: "instant",
    });
  }

  // Function handling add squad button
  function handleAddSquad() {
    if (user.signInProviders == true) {
      if (handleFormData() == true) {
        let userTemp = user;
        userTemp = new User(userTemp);
        let players = [
          ...userTemp.goalkeeper,
          ...userTemp.defence,
          ...userTemp.midfield,
          ...userTemp.attack,
          ...userTemp.subs,
        ];

        players.forEach((player) => {
          player.add = false;
          player.remove = false;
          player.set = false;
        });

        userTemp.signInProviders = false;
        userTemp.firstName = formData.firstName;
        userTemp.lastName = formData.lastName;
        userTemp.squadName = formData.squadName;
        userTemp.gender = formData.gender;
        userTemp.dateOfBirth = formData.dateOfBirth;
        userTemp.countryOfOrigin = formData.countryOfOrigin;
        userTemp.favouriteClub = formData.favouriteClub;
        userTemp.email = formData.email;
        userTemp.addedSquad = true;

        onUpdateValueHome("/points");
        updateUser(userTemp);
        navigate("/points");
      }
    } else if (user.signInProviders == false) {
      let userTemp = user;
      userTemp = new User(userTemp);
      let players = [
        ...userTemp.goalkeeper,
        ...userTemp.defence,
        ...userTemp.midfield,
        ...userTemp.attack,
        ...userTemp.subs,
      ];

      players.forEach((player) => {
        player.add = false;
        player.remove = false;
        player.set = false;
      });

      userTemp.addedSquad = true;

      onUpdateValueHome("/points");
      updateUser(userTemp);
      navigate("/points");
    }
  }

  // Data required to create clubs and countries select
  const countries = JSON.parse(JSON.stringify(Countries));
  const clubs = JSON.parse(JSON.stringify(Clubs));

  // Variable for handling form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    squadName: "",
    gender: "",
    countryOfOrigin: "",
    favouriteClub: "",
    dateOfBirth: "",
  });

  // Function handling input of first name, last name, date of birth and email
  const handleChangeCredentials = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // Function handling selected gender
  const handleChangeGender = (value) => {
    setFormData((prevFormData) => ({ ...prevFormData, ["gender"]: value }));
  };

  // Function handling selected country
  const handleChangeCountries = (selectedOptionCountry) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ["countryOfOrigin"]: selectedOptionCountry.value,
    }));
  };

  // Function handling selected club
  const handleChangeClub = (selectedOptionClub) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ["favouriteClub"]: selectedOptionClub.value,
    }));
  };

  // Function reseting errors
  function resetErrors() {
    setBlankEmail(false);
    setInvalidEmail(false);
    setBlankName(false);
    setBlankLastName(false);
    setBlankTeamName(false);
    setBlankGender(false);
    setBlankDateOfBirth(false);
    setBlankCountry(false);
    setBlankClub(false);
    setInvalidDate(false);
  }

  // Function handling form validation
  function handleFormData() {
    let retVal = true;
    resetErrors();
    if (formData.firstName === "") {
      setBlankName(true);
      retVal = false;
    }
    if (formData.lastName === "") {
      setBlankLastName(true);
      retVal = false;
    }
    if (formData.squadName === "") {
      setBlankTeamName(true);
      retVal = false;
    }
    if (formData.gender === "") {
      setBlankGender(true);
      retVal = false;
    }
    if (formData.dateOfBirth === "") {
      setBlankDateOfBirth(true);
      retVal = false;
    }
    const date1 = new Date("2014-01-01");
    const date2 = new Date(formData.dateOfBirth);

    if (date2.getTime() > date1.getTime()) {
      setInvalidDate(true);
      retVal = false;
    }
    if (formData.countryOfOrigin === "") {
      setBlankCountry(true);
      retVal = false;
    }
    if (formData.favouriteClub === "") {
      setBlankClub(true);
      retVal = false;
    }
    if (formData.email === "") {
      setBlankEmail(true);
      retVal = false;
    }

    if (formData.email === "") {
      setBlankEmail(true);
      retVal = false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(formData.email)) {
      setInvalidEmail(true);
      retVal = false;
    }

    if (formData.email === "") {
      setInvalidEmail(false);
    }

    return retVal;
  }

  // Fetching user and players from database and handling render of loading and error interface
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setIsLoading(true);
      const [snapshot1, snapshot2] = await Promise.all([
        get(usersRef),
        get(playersRef),
      ]);

      const data1 = snapshot1.val();
      const data2 = snapshot2.val();

      setUser(new User(data1));
      const allPlayers = [
        ...data1.goalkeeper,
        ...data1.defence,
        ...data1.midfield,
        ...data1.attack,
        ...data1.subs,
      ];

      let addedPlayers = [];
      allPlayers.forEach((player) => {
        if (player.add == true) {
          addedPlayers.push(player);
        }
      });
      data2.forEach((player) => {
        const smallObj = addedPlayers.find((obj) => obj.name === player.name);
        if (smallObj) {
          player.set = true;
        }
      });

      setPlayers(data2.map((player) => new Player(player)));
      setGoalkeepers(data2.filter((player) => player.position === "gkp"));
      setDefenders(data2.filter((player) => player.position === "def"));
      setMidfielders(data2.filter((player) => player.position === "mid"));
      setAttackers(data2.filter((player) => player.position === "att"));

      if (data1.clubs) {
        let result = findDuplicateValue(data1.clubs, 3);

        if (result.length) {
          setErrorClub(result[0]);
          setErrorClubShow(true);
          setAddSquad(true);
        } else {
          setErrorClubShow(false);
        }

        if (
          result.length <= 0 &&
          data1.money > 0 &&
          data1.countPlayers === 15
        ) {
          setAddSquad(false);
        } else {
          setAddSquad(true);
        }
      }

      if (data1.money < 0) {
        setErrorMoneyShow(true);
      } else {
        setErrorMoneyShow(false);
      }

      if (data1.countPlayers === 15) {
        setAutopickButton(true);
      }

      if (data1.countPlayers === 0) {
        setResetButton(true);
      } else {
        setResetButton(false);
      }
    } catch (error) {
      navigate("/");
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Updating user in database and handling render of loading and error interface
  function updateUser(user) {
    setIsLoading(true);
    set(usersRef, user)
      .then(() => {
        getData();
      })
      .catch((error) => {
        navigate("/");
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
          {player && player.chosen && (
            <div className="chosen">Player to add is already chosen.</div>
          )}
          {player && !player.add && (
            <Button
              variant="primary"
              className="btn btn-secondary add"
              onClick={(event) => handleAdd(event, player)}
            >
              Add Player
            </Button>
          )}
          {player && player.restore && (
            <Button
              variant="primary"
              className="btn btn-secondary restore"
              onClick={() => handleRestore(player)}
            >
              Restore Player
            </Button>
          )}
          {player && player.remove && (
            <Button
              variant="primary"
              className="btn btn-secondary cancel"
              onClick={() => handleRemove()}
            >
              Remove Player
            </Button>
          )}
          {player && player.remove && (
            <Button variant="primary" className="btn btn-secondary info">
              View Information
            </Button>
          )}
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
          {selectedPlayer && selectedPlayer.set && (
            <div className="chosenSecond">You already choose this player.</div>
          )}

          {selectedPlayer && !selectedPlayer.set && (
            <Button
              variant="primary"
              className="btn btn-secondary add"
              onClick={() => handleAddFinal()}
            >
              Add Player
            </Button>
          )}

          <Button
            variant="primary"
            className="btn btn-secondary info"
            onClick={handleCloseSecond}
          >
            View Informattion
          </Button>
        </Modal.Body>
      </Modal>

      <div className="page-wrapper grid gap-4">
        <div className="left-side g-col-12 g-col-lg-9">
          <div className="title-wrapper">
            <div className="title-select">Squad Selection</div>
            <div className="player-list" onClick={(event) => seePlayers(event)}>
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
              Click on "Add Player" to choose which player would you like to add
              to your squad or 'Auto Pick' if you're short of time.
            </div>
          </div>
          <div
            className="upper-wrapper-select"
            style={errorClubShow && errorMoneyShow ? { height: "380px" } : {}}
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
                <div className="selected-players">
                  <span className="text">Players Selected</span>
                  <div
                    className="counter"
                    style={
                      user.countPlayers == 15
                        ? {
                            backgroundColor: "rgb(0, 255, 135)",
                            color: "black",
                          }
                        : {
                            backgroundColor: "rgb(251, 37, 27)",
                            color: "white",
                          }
                    }
                  >
                    <span className="number">{user.countPlayers}</span>
                    /15
                  </div>
                  <Button
                    variant="primary"
                    className="btn btn-secondary my-button"
                    disabled={autopickButton}
                    onClick={(e) => handleAutopick(e)}
                  >
                    Auto Pick
                  </Button>
                </div>
                <div className="divide-line"></div>
                <div className="money">
                  <span className="text">Money Remaining</span>
                  <div
                    className="counter"
                    style={
                      user.money > 0
                        ? {
                            backgroundColor: "rgb(0, 255, 135)",
                            color: "black",
                          }
                        : {
                            backgroundColor: "rgb(251, 37, 27)",
                            color: "white",
                          }
                    }
                  >
                    {user.money.toFixed(1)}
                  </div>
                  <Button
                    variant="primary"
                    className="btn btn-secondary my-button"
                    disabled={resetButton}
                    onClick={(e) => handleReset(e)}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
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

          <div className="pitch-wrapper">
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
                {user &&
                  !user.goalkeeper[0].name &&
                  !user.goalkeeper[0].club && (
                    <div className="position">
                      {windowWidth.matches ? "Add" : "Add Goalkeeper"}
                    </div>
                  )}
                {user && user.goalkeeper[0].name && (
                  <div className="name">{user.goalkeeper[0].name}</div>
                )}
                {user && user.goalkeeper[0].club && (
                  <div className="price">{user.goalkeeper[0].price}</div>
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
                {user && !user.subs[0].name && !user.subs[0].club && (
                  <div className="position">
                    {windowWidth.matches ? "Add" : "Add Goalkeeper"}
                  </div>
                )}
                {user && user.subs[0].name && (
                  <div className="name">{user.subs[0].name}</div>
                )}
                {user && user.subs[0].club && (
                  <div className="price">{user.subs[0].price}</div>
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
                    {user && !player.name && !player.club && (
                      <div className="position">
                        {" "}
                        {windowWidth.matches ? "Add" : "Add Defender"}
                      </div>
                    )}
                    {user && player.name && (
                      <div className="name">{player.name}</div>
                    )}
                    {user && player.club && (
                      <div className="price">{player.price}</div>
                    )}
                  </div>
                ))}

              <div
                className="player subs-defender"
                onClick={(event) => handleShow(event, user.subs[1])}
              >
                <div className="kit">
                  <img
                    src={user ? `src/${user.subs[1].kit_src}` : ""}
                    alt={user ? `${user.subs[1].club}.jpg` : ""}
                  />
                </div>
                {user && !user.subs[1].name && !user.subs[1].club && (
                  <div className="position">
                    {" "}
                    {windowWidth.matches ? "Add" : "Add Defender"}
                  </div>
                )}
                {user && user.subs[1].name && (
                  <div className="name">{user.subs[1].name}</div>
                )}
                {user && user.subs[1].club && (
                  <div className="price">{user.subs[1].price}</div>
                )}
              </div>
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
                    {user && !player.name && !player.club && (
                      <div className="position">
                        {" "}
                        {windowWidth.matches ? "Add" : "Add Midfielder"}
                      </div>
                    )}
                    {user && player.name && (
                      <div className="name">{player.name}</div>
                    )}
                    {user && player.club && (
                      <div className="price">{player.price}</div>
                    )}
                  </div>
                ))}

              <div
                className="player subs-midfielder"
                onClick={(event) => handleShow(event, user.subs[2])}
              >
                <div className="kit">
                  <img
                    src={user ? `src/${user.subs[2].kit_src}` : ""}
                    alt={user ? `${user.subs[2].club}.jpg` : ""}
                  />
                </div>
                {user && !user.subs[2].name && !user.subs[2].club && (
                  <div className="position">
                    {" "}
                    {windowWidth.matches ? "Add" : "Add Midfielder"}
                  </div>
                )}
                {user && user.subs[2].name && (
                  <div className="name">{user.subs[2].name}</div>
                )}
                {user && user.subs[2].club && (
                  <div className="price">{user.subs[2].price}</div>
                )}
              </div>
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
                    {user && !player.name && !player.club && (
                      <div className="position">
                        {" "}
                        {windowWidth.matches ? "Add" : "Add Attacker"}
                      </div>
                    )}
                    {user && player.name && (
                      <div className="name">{player.name}</div>
                    )}
                    {user && player.club && (
                      <div className="price">{player.price}</div>
                    )}
                  </div>
                ))}

              <div
                className="player subs-attacker"
                onClick={(event) => handleShow(event, user.subs[3])}
              >
                <div className="kit">
                  <img
                    src={user ? `src/${user.subs[3].kit_src}` : ""}
                    alt={user ? `${user.subs[3].club}.jpg` : ""}
                  />
                </div>
                {user && !user.subs[3].name && !user.subs[3].club && (
                  <div className="position">
                    {" "}
                    {windowWidth.matches ? "Add" : "Add Attacker"}
                  </div>
                )}
                {user && user.subs[3].name && (
                  <div className="name">{user.subs[3].name}</div>
                )}
                {user && user.subs[3].club && (
                  <div className="price">{user.subs[3].price}</div>
                )}
              </div>
            </div>
          </div>
          {user.signInProviders && (
            <Form className="select-form">
              <Form.Group className="form-group">
                <h2>Please fill out this form before you enter your squad</h2>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control"
                  name="firstName"
                  id="firstNameSelect"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChangeCredentials}
                />
                {blankName && (
                  <div className="form-text text-danger error-form">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi-x-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                    </svg>{" "}
                    <span>First name is required!</span>
                  </div>
                )}
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control"
                  name="lastName"
                  id="lastNameSelect"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChangeCredentials}
                />
                {blankLastName && (
                  <div className="form-text text-danger error-form">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi-x-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                    </svg>{" "}
                    <span>Last name is required!</span>
                  </div>
                )}
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label>Team Name</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control"
                  name="squadName"
                  id="squadNameSelect"
                  placeholder="Enter your team name"
                  value={formData.squadName}
                  onChange={handleChangeCredentials}
                />

                {blankTeamName && (
                  <div className="form-text text-danger error-form">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi-x-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                    </svg>{" "}
                    <span>Team name is required!</span>
                  </div>
                )}
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label className="gender-label">Gender</Form.Label>

                {["radio"].map((type) => (
                  <ToggleButtonGroup
                    key={`inline-${type}`}
                    className="gender-group mb-1"
                    type="radio"
                    name="options"
                    onChange={handleChangeGender}
                  >
                    <Form.Check
                      inline
                      label="Male"
                      name="male"
                      type={type}
                      value={"male"}
                      id={"male"}
                    />
                    <Form.Check
                      inline
                      label="Female"
                      name="female"
                      type={type}
                      value={"female"}
                      id={"female"}
                    />
                    <Form.Check
                      inline
                      label="Unspecified"
                      name="unspecified"
                      type={type}
                      value={"unspecified"}
                      id={"unspecified"}
                    />
                  </ToggleButtonGroup>
                ))}
                {blankGender && (
                  <div className="form-text text-danger error-form">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi-x-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                    </svg>{" "}
                    <span>Gender is required!</span>
                  </div>
                )}
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChangeCredentials}
                  className="form-control"
                  id="dateOfBirthSelect"
                />
                {blankDateOfBirth && (
                  <div className="form-text text-danger error-form">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi-x-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                    </svg>{" "}
                    <span>Date of birth is required!</span>
                  </div>
                )}
                {invalidDate && (
                  <div className="form-text text-danger error-form">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi-x-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                    </svg>{" "}
                    <span>Invalid date!</span>
                  </div>
                )}
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label>Country / Region of Residence</Form.Label>
                <Select
                  options={countries}
                  className="my-select-countries"
                  placeholder="Select a country"
                  onChange={handleChangeCountries}
                  formatOptionLabel={(country) => (
                    <div className="country-option">
                      <span>{country.value}</span>
                    </div>
                  )}
                ></Select>
                {blankCountry && (
                  <div className="form-text text-danger error-form">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi-x-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                    </svg>{" "}
                    <span>Country / Region of residence is required!</span>
                  </div>
                )}
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label>Select favourite club</Form.Label>
                <Select
                  options={clubs}
                  className="my-select-clubs"
                  placeholder="Select a club"
                  onChange={handleChangeClub}
                  formatOptionLabel={(club) => (
                    <div className="club-option">
                      <img src={club.img} alt={club.value + ".kit"} />
                      <span>{club.value}</span>
                    </div>
                  )}
                ></Select>
                {blankClub && (
                  <div className="form-text text-danger error-form">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi-x-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                    </svg>{" "}
                    <span>Favourite club is required!</span>
                  </div>
                )}
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label>Contact email address</Form.Label>
                <Form.Control
                  type="email"
                  className="form-control"
                  name="email"
                  id="emailSelect"
                  placeholder="Enter contact email address"
                  value={formData.email}
                  onChange={handleChangeCredentials}
                />

                {blankEmail && (
                  <div className="form-text text-danger error-form">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi-x-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                    </svg>{" "}
                    <span>Email is required!</span>
                  </div>
                )}

                {invalidEmail && (
                  <div className="form-text text-danger error-form">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi-x-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                    </svg>{" "}
                    <span>Please enter valid email!</span>
                  </div>
                )}
              </Form.Group>
            </Form>
          )}
          <button
            className="enter-squad"
            disabled={addSquad}
            onClick={() => handleAddSquad()}
          >
            Enter Squad
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
          <div className="player-subtext">
            Select from available players for each position.
          </div>
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
                    goalkeepers.map((goalkeeper, index) => (
                      <tr
                        className="player-select"
                        key={index}
                        id={goalkeeper.name}
                        onClick={(event) => handleShowSecond(event, goalkeeper)}
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
                                {goalkeeper.club.substring(0, 3).toUpperCase()}
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
                    ))}
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
                    defenders.map((defender, index) => (
                      <tr
                        className="player-select"
                        key={index}
                        id={defender.name}
                        onClick={(event) => handleShowSecond(event, defender)}
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
                    ))}
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
                    midfileders.map((midfielder, index) => (
                      <tr
                        className="player-select"
                        key={index}
                        id={midfielder.name}
                        onClick={(event) => handleShowSecond(event, midfielder)}
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
                                {midfielder.club.substring(0, 3).toUpperCase()}
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
                    ))}
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
                    attackers.map((attacker, index) => (
                      <tr
                        className="player-select"
                        key={index}
                        id={attacker.name}
                        onClick={(event) => handleShowSecond(event, attacker)}
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
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SelectTeam;
