const express = require("express");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./fantasy-mock-up-firebase-admin-sdk.json"); // Update path to your service account key
const { refreshToken } = require("firebase-admin/app");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "*****************************************",
});

const app = express();
const port = 3000;
const currentGameweek = 35;
const nextGameweek = 36;
const deadline = "Fri 3 May 19:30";

// Function setting new gameweek for players (run first)
function settingNewGameweekPlayers(refPlayers) {
  refPlayers
    .once("value", (snapshot) => {
      data = snapshot.val();
      Object.keys(data).forEach((key) => {
        let gameweekUnit = {};
        gameweekUnit.gameweekNumber = nextGameweek;
        gameweekUnit.gameweekPoints = 0;
        gameweekUnit.matchStart = false;

        if (data[key].club === "Arsenal") {
          gameweekUnit.opponents = ["BOU (H)"];
        } else if (data[key].club === "Villa") {
          gameweekUnit.opponents = ["BRI (A)"];
        } else if (data[key].club === "Bournemouth") {
          gameweekUnit.opponents = ["ARS (A)"];
        } else if (data[key].club === "Brentford") {
          gameweekUnit.opponents = ["FUL (H)"];
        } else if (data[key].club === "Brighton") {
          gameweekUnit.opponents = ["AST (H)"];
        } else if (data[key].club === "Burnley") {
          gameweekUnit.opponents = ["NEW (H)"];
        } else if (data[key].club === "Chelsea") {
          gameweekUnit.opponents = ["WES (H)"];
        } else if (data[key].club === "Everton") {
          gameweekUnit.opponents = ["LUT (A)"];
        } else if (data[key].club === "Forest") {
          gameweekUnit.opponents = ["SHE (A)"];
        } else if (data[key].club === "Fulham") {
          gameweekUnit.opponents = ["BRE (A)"];
        } else if (data[key].club === "Palace") {
          gameweekUnit.opponents = ["UNI (H)"];
        } else if (data[key].club === "Liverpool") {
          gameweekUnit.opponents = ["TOT (H)"];
        } else if (data[key].club === "Luton") {
          gameweekUnit.opponents = ["EVE (H)"];
        } else if (data[key].club === "City") {
          gameweekUnit.opponents = ["WOL (H)"];
        } else if (data[key].club === "United") {
          gameweekUnit.opponents = ["CRY (A)"];
        } else if (data[key].club === "Sheffield") {
          gameweekUnit.opponents = ["NOT (H)"];
        } else if (data[key].club === "Tottenham") {
          gameweekUnit.opponents = ["LIV (A)"];
        } else if (data[key].club === "Newcastle") {
          gameweekUnit.opponents = ["BUR (A)"];
        } else if (data[key].club === "West Ham") {
          gameweekUnit.opponents = ["CHE (A)"];
        } else if (data[key].club === "Wolves") {
          gameweekUnit.opponents = ["CIT (A)"];
        }

        if (data && Array.isArray(data[key].playerGameweeks)) {
          data[key].playerGameweeks.push(gameweekUnit);
        } else {
          data[key].playerGameweeks = [gameweekUnit];
        }
      });

      ///Updating players for gameweek
      refPlayers
        .set(data)
        .then(() => {
          console.log("Data updated successfully");
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    });
}

// Function setting new gameweek (run second)
function settingNewGameweek(refPlayers, refUsers) {
  let players = [];
  refPlayers
    .once("value", (snapshot) => {
      data = snapshot.val();
      players = data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    });

  refUsers
    .once("value", (snapshot) => {
      const data = snapshot.val();

      Object.keys(data).forEach((key) => {
        if (data[key].addedSquad == true) {
          let allPlayers = [
            ...data[key].goalkeeper,
            ...data[key].defence,
            ...data[key].midfield,
            ...data[key].attack,
            ...data[key].subs,
          ];

          let squadValue = 0;

          allPlayers.forEach((playerTeam) => {
            players.forEach((player) => {
              if (playerTeam.name === player.name) {
                squadValue += player.price;
              }
            });
          });

          data[key].freeTransfers++;
          let gameweekUnit = {};
          gameweekUnit.gameweekNumber = currentGameweek;
          gameweekUnit.gameweekRank = 0;
          gameweekUnit.finalPoints = 0;
          gameweekUnit.goalkeeper = data[key].goalkeeper;
          gameweekUnit.defence = data[key].defence;
          gameweekUnit.midfield = data[key].midfield;
          gameweekUnit.attack = data[key].attack;
          gameweekUnit.subs = data[key].subs;
          gameweekUnit.gameweekTransfersCount = data[key].countTransfers;
          gameweekUnit.gameweekCostCount = data[key].cost;
          gameweekUnit.squadValue = squadValue.toFixed(1);
          if (data[key].gameweekTransfers) {
            gameweekUnit.gameweekTransfers = data[key].gameweekTransfers;
          } else {
            gameweekUnit.gameweekTransfers = [];
          }

          data[key].countTransfers = 0;
          data[key].cost = 0;
          data[key].gameweekTransfers = [];

          if (data && Array.isArray(data[key].gameweeks)) {
            data[key].gameweeks.push(gameweekUnit);
          } else {
            data[key].gameweeks = [gameweekUnit];
          }
        }
      });

      refUsers
        .update(data)
        .then(() => {
          console.log("Data updated successfully");
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    });
}

// Function setting next gameweek (run third)
function settingNextGameweek(refGameweek) {
  refGameweek
    .once("value", (snapshot) => {
      let data = snapshot.val();

      data.currentGameweekNumber = nextGameweek;
      data.currentGameweekDeadline = deadline;

      let gameweekUnit = {};
      gameweekUnit.gameweekNumber = currentGameweek;
      gameweekUnit.highest = 0;
      gameweekUnit.average = 0;

      if (data && Array.isArray(data.gameweeks)) {
        data.gameweeks.push(gameweekUnit);
      } else {
        data.gameweeks = [gameweekUnit];
      }

      refGameweek
        .update(data)
        .then(() => {
          console.log("Data updated successfully");
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    });
}

// Function updating player points
function updatePlayerPoints(refPlayers, playerName, points, secondMatchStart) {
  refPlayers
    .once("value", (snapshot) => {
      data = snapshot.val();

      Object.keys(data).forEach((key) => {
        if (data[key].name === playerName) {
          if (
            data[key].playerGameweeks[data[key].playerGameweeks.length - 2]
              .opponents.length == 2
          ) {
            data[key].playerGameweeks[
              data[key].playerGameweeks.length - 2
            ].secondMatchStart = secondMatchStart;
          }

          data[key].playerGameweeks[
            data[key].playerGameweeks.length - 2
          ].gameweekPoints = points;
          data[key].playerGameweeks[
            data[key].playerGameweeks.length - 2
          ].matchStart = true;
          console.log(data[key]);
        }
      });

      refPlayers
        .set(data)
        .then(() => {
          console.log("Data updated successfully");
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    });
}

// Function updating multiple player points
function updateMultiplePlayerPoints(refPlayers, dataArray) {
  refPlayers
    .once("value", (snapshot) => {
      data = snapshot.val();

      Object.keys(data).forEach((key) => {
        Object.keys(dataArray).forEach((player) => {
          if (data[key].name === dataArray[player].name) {
            if (
              data[key].playerGameweeks[data[key].playerGameweeks.length - 2]
                .opponents.length == 2
            ) {
              data[key].playerGameweeks[
                data[key].playerGameweeks.length - 2
              ].secondMatchStart = dataArray[player].secondMatchStart;
            }

            data[key].playerGameweeks[
              data[key].playerGameweeks.length - 2
            ].gameweekPoints = dataArray[player].points;
            data[key].playerGameweeks[
              data[key].playerGameweeks.length - 2
            ].matchStart = true;
            console.log(data[key]);
          }
        });
      });

      refPlayers
        .set(data)
        .then(() => {
          console.log("Data updated successfully");
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    });
}

// Function updating whole team player points
function updateTeamPlayerPoints(
  refPlayers,
  teamName,
  points,
  secondMatchStart
) {
  refPlayers
    .once("value", (snapshot) => {
      data = snapshot.val();

      Object.keys(data).forEach((key) => {
        if (data[key].club === teamName) {
          if (
            data[key].playerGameweeks[data[key].playerGameweeks.length - 2]
              .opponents.length == 2
          ) {
            data[key].playerGameweeks[
              data[key].playerGameweeks.length - 2
            ].secondMatchStart = secondMatchStart;
          }
          data[key].playerGameweeks[
            data[key].playerGameweeks.length - 2
          ].gameweekPoints = points;
          data[key].playerGameweeks[
            data[key].playerGameweeks.length - 2
          ].matchStart = true;
          console.log(data[key]);
        }
      });

      refPlayers
        .set(data)
        .then(() => {
          console.log("Data updated successfully");
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    });
}

// Function determining average points
function determineAveragePoints(refPlayers, refUsers, refGameweek) {
  let players = [];
  refPlayers
    .once("value", (snapshot) => {
      data = snapshot.val();
      players = data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    });

  refUsers
    .once("value", (snapshot) => {
      const data = snapshot.val();

      /// Function calculating average
      let countUsers = 0;

      function calculateAverage(data) {
        let allPlayers = [
          ...data.gameweeks[data.gameweeks.length - 1].goalkeeper,
          ...data.gameweeks[data.gameweeks.length - 1].defence,
          ...data.gameweeks[data.gameweeks.length - 1].midfield,
          ...data.gameweeks[data.gameweeks.length - 1].attack,
        ];

        let count = 0;
        Object.keys(allPlayers).forEach((keys) => {
          Object.keys(players).forEach((key) => {
            if (allPlayers[keys].name === players[key].name) {
              if (allPlayers[keys].captain == true) {
                count +=
                  players[key].playerGameweeks[
                    players[key].playerGameweeks.length - 2
                  ].gameweekPoints * 2;
              } else {
                count +=
                  players[key].playerGameweeks[
                    players[key].playerGameweeks.length - 2
                  ].gameweekPoints;
              }
            }
          });
        });

        return count;
      }

      let countFinal = 0;
      let countAllUsers = 0;
      Object.keys(data).forEach((key) => {
        countAllUsers++;
        if (data[key].addedSquad == true && data[key].gameweeks) {
          countUsers++;
          countFinal += calculateAverage(data[key]);
        }
      });

      let average = countFinal / countUsers;

      refGameweek
        .once("value", (snapshot) => {
          let data = snapshot.val();
          data.gameweeks[data.gameweeks.length - 1].average = average;
          data.totalUsers = countAllUsers;

          refGameweek
            .update(data)
            .then(() => {
              console.log("Data updated successfully");
            })
            .catch((error) => {
              console.error("Error updating data:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    });
}

// Function determining highest points
function determineHighestPoints(refPlayers, refUsers, refGameweek) {
  let players = [];
  refPlayers
    .once("value", (snapshot) => {
      data = snapshot.val();
      players = data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    });

  refUsers
    .once("value", (snapshot) => {
      const data = snapshot.val();

      function calculatePoints(data) {
        let allPlayers = [
          ...data.gameweeks[data.gameweeks.length - 1].goalkeeper,
          ...data.gameweeks[data.gameweeks.length - 1].defence,
          ...data.gameweeks[data.gameweeks.length - 1].midfield,
          ...data.gameweeks[data.gameweeks.length - 1].attack,
        ];

        let count = 0;
        Object.keys(allPlayers).forEach((keys) => {
          Object.keys(players).forEach((key) => {
            if (allPlayers[keys].name === players[key].name) {
              if (allPlayers[keys].captain == true) {
                count +=
                  players[key].playerGameweeks[
                    players[key].playerGameweeks.length - 2
                  ].gameweekPoints * 2;
              } else {
                count +=
                  players[key].playerGameweeks[
                    players[key].playerGameweeks.length - 2
                  ].gameweekPoints;
              }
            }
          });
        });
        return count;
      }

      let highest = 0;
      Object.keys(data).forEach((key) => {
        if (data[key].addedSquad == true && data[key].gameweeks) {
          if (highest < calculatePoints(data[key])) {
            highest = calculatePoints(data[key]);
          }
        }
      });

      refGameweek
        .once("value", (snapshot) => {
          let data = snapshot.val();
          data.gameweeks[data.gameweeks.length - 1].highest = highest;

          refGameweek
            .update(data)
            .then(() => {
              console.log("Data updated successfully");
            })
            .catch((error) => {
              console.error("Error updating data:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    });
}

// Function determining ranking
function ranking(refPlayers, refUsers) {
  let players = [];
  refPlayers
    .once("value", (snapshot) => {
      data = snapshot.val();
      players = data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    });

  refUsers
    .once("value", (snapshot) => {
      const data = snapshot.val();

      function calculatePoints(allPlayers) {
        let count = 0;
        Object.keys(allPlayers).forEach((keys) => {
          Object.keys(players).forEach((key) => {
            if (allPlayers[keys].name === players[key].name) {
              if (allPlayers[keys].captain == true) {
                count +=
                  players[key].playerGameweeks[
                    players[key].playerGameweeks.length - 2
                  ].gameweekPoints * 2;
              } else {
                count +=
                  players[key].playerGameweeks[
                    players[key].playerGameweeks.length - 2
                  ].gameweekPoints;
              }
            }
          });
        });
        return count;
      }

      let array = [];
      Object.keys(data).forEach((key) => {
        if (data[key].addedSquad && data[key].gameweeks) {
          let allPlayers = [
            ...data[key].gameweeks[data[key].gameweeks.length - 1].goalkeeper,
            ...data[key].gameweeks[data[key].gameweeks.length - 1].defence,
            ...data[key].gameweeks[data[key].gameweeks.length - 1].midfield,
            ...data[key].gameweeks[data[key].gameweeks.length - 1].attack,
          ];

          array.push({
            id: data[key]._id,
            points:
              calculatePoints(allPlayers) -
              data[key].gameweeks[data[key].gameweeks.length - 1]
                .gameweekCostCount,
          });
        }
      });

      array.sort((a, b) => b.points - a.points);
      let gameweekRank = 1;
      let prevPoints = array[0].points;
      array[0].gameweekRank = gameweekRank;

      for (let i = 1; i < array.length; i++) {
        if (array[i].points < prevPoints) {
          gameweekRank++;
        }
        array[i].gameweekRank = gameweekRank;
        prevPoints = array[i].points;
      }

      console.log(array);

      Object.keys(array).forEach((key) => {
        Object.keys(data).forEach((keys) => {
          if (data[keys].addedSquad && data[keys].gameweeks) {
            if (data[keys]._id === array[key].id) {
              data[keys].gameweeks[
                data[keys].gameweeks.length - 1
              ].gameweekRank = array[key].gameweekRank;
            }
          }
        });
      });

      refUsers
        .update(data)
        .then(() => {
          console.log("Data updated successfully");
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    });
}

// Function determining final gameweek points (run at the end of gameweek)
function finalGameweekPoints(refPlayers, refUsers) {
  let players = [];
  refPlayers
    .once("value", (snapshot) => {
      data = snapshot.val();
      players = data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    });

  refUsers
    .once("value", (snapshot) => {
      const data = snapshot.val();

      function calculatePoints(data) {
        let allPlayers = [
          ...data.goalkeeper,
          ...data.defence,
          ...data.midfield,
          ...data.attack,
        ];

        let count = 0;
        Object.keys(allPlayers).forEach((keys) => {
          Object.keys(players).forEach((key) => {
            if (allPlayers[keys].name === players[key].name) {
              if (allPlayers[keys].captain == true) {
                count +=
                  players[key].playerGameweeks[
                    players[key].playerGameweeks.length - 2
                  ].gameweekPoints * 2;
              } else {
                count +=
                  players[key].playerGameweeks[
                    players[key].playerGameweeks.length - 2
                  ].gameweekPoints;
              }
            }
          });
        });
        return count;
      }

      function calculateBenchPoints(data) {
        let allPlayers = [...data.subs];

        let count = 0;
        Object.keys(allPlayers).forEach((keys) => {
          Object.keys(players).forEach((key) => {
            if (allPlayers[keys].name === players[key].name) {
              count +=
                players[key].playerGameweeks[
                  players[key].playerGameweeks.length - 2
                ].gameweekPoints;
            }
          });
        });
        return count;
      }

      Object.keys(data).forEach((key) => {
        if (data[key].addedSquad == true && data[key].gameweeks) {
          data[key].gameweeks[data[key].gameweeks.length - 1].finalPoints =
            calculatePoints(
              data[key].gameweeks[data[key].gameweeks.length - 1]
            );

          data[key].gameweeks[data[key].gameweeks.length - 1].benchPoints =
            calculateBenchPoints(
              data[key].gameweeks[data[key].gameweeks.length - 1]
            );
        }
      });

      refUsers
        .update(data)
        .then(() => {
          console.log("Data updated successfully");
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    });
}

// Function determining overall rank (run at the end of gameweek)
function overallRanking(refPlayers, refUsers) {
  let players = [];
  refPlayers
    .once("value", (snapshot) => {
      data = snapshot.val();
      players = data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    });

  refUsers
    .once("value", (snapshot) => {
      const data = snapshot.val();

      function calculatePoints(data) {
        let count = 0;
        let gameweeks = data.gameweeks;
        Object.keys(gameweeks).forEach((key) => {
          count +=
            gameweeks[key].finalPoints - gameweeks[key].gameweekCostCount;
        });

        return count;
      }

      let array = [];
      Object.keys(data).forEach((key) => {
        if (data[key].addedSquad == true && data[key].gameweeks) {
          array.push({
            id: data[key]._id,
            points: calculatePoints(data[key]),
          });
        }
      });

      array.sort((a, b) => b.points - a.points);
      let overallRank = 1;
      let prevPoints = array[0].points;
      array[0].overallRank = overallRank;

      for (let i = 1; i < array.length; i++) {
        if (array[i].points < prevPoints) {
          overallRank++;
        }
        array[i].overallRank = overallRank;
        prevPoints = array[i].points;
      }

      console.log(array);

      Object.keys(array).forEach((key) => {
        Object.keys(data).forEach((keys) => {
          if (data[keys].addedSquad == true && data[keys].gameweeks) {
            if (data[keys]._id === array[key].id) {
              data[keys].gameweeks[
                data[keys].gameweeks.length - 1
              ].overallRank = array[key].overallRank;
              data[keys].gameweeks[
                data[keys].gameweeks.length - 1
              ].overallPoints = array[key].points;
            }
          }
        });
      });

      refUsers
        .update(data)
        .then(() => {
          console.log("Data updated successfully");
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    });
}

// Define a route to fetch data from Firebase Realtime Database
app.get("/", (req, res) => {
  const db = admin.database();
  const refUsers = db.ref("usersFantasy");
  const refGameweek = db.ref("currentGameweek");
  const refPlayers = db.ref("players");
  overallRanking(refPlayers, refUsers);
  updateMultiplePlayerPoints(refPlayers, [
    { name: "Pickford", points: 1, secondMatchStart: false },
    { name: "Tarkowski", points: 1, secondMatchStart: false },
    { name: "Doucoure", points: 1, secondMatchStart: false },
    { name: "Calvert-Lewin", points: 1, secondMatchStart: false },
    { name: "Turner", points: 0, secondMatchStart: false },
    { name: "Murillo", points: 1, secondMatchStart: false },
    { name: "Elanga", points: 0, secondMatchStart: false },
    { name: "Wood", points: 1, secondMatchStart: false },
  ]);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
