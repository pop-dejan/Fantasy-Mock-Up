const express = require("express");
const admin = require("firebase-admin");

const serviceAccount = require("admin.sdk");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "******************************",
});

const app = express();
const port = 3000;
const currentGameweek = 29;
const nextGameweek = 30;
const deadline = "Sat 30 Mar 12:00";

// Function setting new gameweek for players (run first)
function settingNewGameweekPlayers(refPlayers) {
  refPlayers
    .once("value", (snapshot) => {
      data = snapshot.val();
      Object.keys(data).forEach((key) => {
        let gameweekUnit = {};
        gameweekUnit.gameweekNumber = currentGameweek;
        gameweekUnit.gameweekPoints = 0;

        if (data && Array.isArray(data[key].playerGameweeks)) {
          data[key].playerGameweeks.push(gameweekUnit);
        } else {
          data[key].playerGameweeks = [gameweekUnit];
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

// Function setting new gameweek (run second)
function settingNewGameweek(refUsers) {
  refUsers
    .once("value", (snapshot) => {
      const data = snapshot.val();

      Object.keys(data).forEach((key) => {
        if (data[key].addedSquad == true) {
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
          data[key].countTransfers = 0;
          data[key].cost = 0;

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
function updatePlayerPoints(refPlayers, playerName, points) {
  refPlayers
    .once("value", (snapshot) => {
      data = snapshot.val();

      Object.keys(data).forEach((key) => {
        if (data[key].name === playerName) {
          data[key].playerGameweeks[
            data[key].playerGameweeks.length - 1
          ].gameweekPoints += points;
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
            data[key].playerGameweeks[
              data[key].playerGameweeks.length - 1
            ].gameweekPoints += dataArray[player].points;
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
function updateTeamPlayerPoints(refPlayers, teamName, points) {
  refPlayers
    .once("value", (snapshot) => {
      data = snapshot.val();

      Object.keys(data).forEach((key) => {
        if (data[key].club === teamName) {
          data[key].playerGameweeks[
            data[key].playerGameweeks.length - 1
          ].gameweekPoints += points;
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

      let countUsers = 0;
      let count = 0;

      function calculateAverage(data) {
        let allPlayers = [
          ...data.goalkeeper,
          ...data.defence,
          ...data.midfield,
          ...data.attack,
        ];

        Object.keys(allPlayers).forEach((keys) => {
          Object.keys(players).forEach((key) => {
            if (allPlayers[keys].name === players[key].name) {
              count +=
                players[key].playerGameweeks[
                  players[key].playerGameweeks.length - 1
                ].gameweekPoints;
            }
          });
        });
      }

      Object.keys(data).forEach((key) => {
        if (data[key].addedSquad == true) {
          countUsers++;
          calculateAverage(data[key]);
        }
      });

      let average = count / countUsers;

      refGameweek
        .once("value", (snapshot) => {
          let data = snapshot.val();
          data.gameweeks[data.gameweeks.length - 1].average = average;

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
          ...data.goalkeeper,
          ...data.defence,
          ...data.midfield,
          ...data.attack,
        ];

        let count = 0;
        Object.keys(allPlayers).forEach((keys) => {
          Object.keys(players).forEach((key) => {
            if (allPlayers[keys].name === players[key].name) {
              count +=
                players[key].playerGameweeks[
                  players[key].playerGameweeks.length - 1
                ].gameweekPoints;
            }
          });
        });
        return count;
      }

      let highest = 0;
      Object.keys(data).forEach((key) => {
        if (data[key].addedSquad == true) {
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
              count +=
                players[key].playerGameweeks[
                  players[key].playerGameweeks.length - 1
                ].gameweekPoints;
            }
          });
        });
        return count;
      }

      let array = [];
      Object.keys(data).forEach((key) => {
        if (data[key].addedSquad == true) {
          array.push({
            id: data[key]._id,
            points:
              calculatePoints(data[key]) -
              data[key].gameweeks[data[key].gameweeks.length - 1]
                .gameweekCostCount,
          });
        }
      });

      array.sort((a, b) => b.points - a.points);
      Object.keys(array).forEach((key, index) => {
        Object.keys(data).forEach((keys) => {
          if (data[keys]._id === array[key].id) {
            data[keys].gameweeks[data[keys].gameweeks.length - 1].gameweekRank =
              index + 1;
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
              count +=
                players[key].playerGameweeks[
                  players[key].playerGameweeks.length - 1
                ].gameweekPoints;
            }
          });
        });
        return count;
      }

      Object.keys(data).forEach((key) => {
        data[key].gameweeks[data[key].gameweeks.length - 1].finalPoints =
          calculatePoints(data[key]) -
          data[key].gameweeks[data[key].gameweeks.length - 1].gameweekCostCount;
        if (
          data[key].gameweeks[data[key].gameweeks.length - 1].finalPoints < 0
        ) {
          data[key].gameweeks[data[key].gameweeks.length - 1].finalPoints = 0;
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

// Define a route to fetch data from Firebase Realtime Database
app.get("/", (req, res) => {
  const db = admin.database();

  const refUsers = db.ref("usersFantasy");
  const refGameweek = db.ref("currentGameweek");
  const refPlayers = db.ref("players");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
