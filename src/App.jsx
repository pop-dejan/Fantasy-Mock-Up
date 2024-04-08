import "./App.scss";
import React, { useEffect, useState } from "react";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from "./help-files/AuthContext";
import { ProtectedRoute } from "./help-files/ProtectedRoute";
import { auth, database } from "./help-files/firebase";
import { get, ref } from "firebase/database";
import SignIn from "./components/sign-in/SignIn";
import SignUp from "./components/sign-up/SignUp";
import Points from "./components/points/Points";
import Footer from "./components/footer/Footer";
import PickTeam from "./components/pick-team/PickTeam";
import SelectTeam from "./components/select-team/SelectTeam";
import Transfers from "./components/transfers/Transfers";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import NavbarSecond from "./components/navbar-second/NavbarSecond";
import TotalTransfers from "./components/total-transfers/TotalTransfers";
import Account from "./components/account/Account";
import GameweekHistory from "./components/gameweek-history/GameweekHistory";

function App() {
  // Function handling home page based on if user is logged
  const usersRef = ref(database, "usersFantasy/" + localStorage.getItem("id"));
  const [error, setError] = useState("");
  const [valueHome, setValueHome] = useState(() => {
    const storedValue = localStorage.getItem("myValueHome");
    if (storedValue === null) {
      localStorage.setItem("myValueHome", "/home");
      return "/home";
    }
    return storedValue;
  });

  useEffect(() => {
    localStorage.setItem("myValueHome", `${valueHome}`);
  }, [valueHome]);

  const updateValueHome = (newValue) => {
    setValueHome(newValue);
  };

  // Checking if user is logged in
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleStorageChange(event) {
      if (event.key === "id") {
        window.location.reload();
      }
    }
    window.addEventListener("storage", handleStorageChange);

    const userCheck = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setCurrentUser(currentUser);
      } else {
        setCurrentUser(null);
      }
    });

    if (!localStorage.getItem("id")) {
      auth.signOut();
    } else {
      if (valueHome === "/home") {
        localStorage.setItem("myValueHome", "/home");
        setValueHome("/home");
      } else if (valueHome === "/pick-team") {
        get(usersRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              if (snapshot.val().gameweeks) {
                localStorage.setItem("myValueHome", "/points");
                setValueHome("/points");
                navigate("/");
              }
            }
          })
          .catch((error) => {
            setError("Something went wrong. Please try again.");
          });
      } else if (valueHome === "/points") {
        get(usersRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              if (!snapshot.val().gameweeks) {
                localStorage.setItem("myValueHome", "/pick-team");
                setValueHome("/pick-team");
                navigate("/");
              }
            }
          })
          .catch((error) => {
            setError("Something went wrong. Please try again.");
          });
      }
    }
  }, []);

  const location = useLocation();

  // Function determining render of second navbar
  function showNavbarSecond(location) {
    if (location === "/sign-up" || location === "/sign-in") {
      return false;
    }

    return true;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <>
      <AuthProvider>
        <Navbar />

        {showNavbarSecond(location.pathname) && (
          <NavbarSecond
            showButtons={valueHome === "/points" || valueHome === "/pick-team"}
            showHome={valueHome === "/home"}
            hideAllButtons={localStorage.getItem("id")}
            onUpdateValueHome={updateValueHome}
            valueHome={valueHome}
          />
        )}

        <Routes>
          <Route path="/" element={<Navigate to={valueHome} />}></Route>
          <Route path="*" element={<Navigate to={valueHome} />}></Route>

          <Route
            path="/home"
            element={
              <ProtectedRoute valueHome={valueHome} pageType={"startPages"}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sign-in"
            element={<SignIn onUpdateValueHome={updateValueHome} />}
          />
          <Route
            path="/sign-up"
            element={<SignUp onUpdateValueHome={updateValueHome} />}
          />

          <Route
            path="/select-team"
            element={
              <ProtectedRoute valueHome={valueHome} pageType={"startPages"}>
                <SelectTeam onUpdateValueHome={updateValueHome} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/points"
            element={
              <ProtectedRoute valueHome={valueHome} pageType={"gamePages"}>
                <Points />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pick-team"
            element={
              <ProtectedRoute valueHome={valueHome} pageType={"gamePages"}>
                <PickTeam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transfers"
            element={
              <ProtectedRoute valueHome={valueHome} pageType={"gamePages"}>
                <Transfers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/total-transfers"
            element={
              <ProtectedRoute valueHome={valueHome} pageType={"gamePages"}>
                <TotalTransfers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gameweek-history"
            element={
              <ProtectedRoute valueHome={valueHome} pageType={"gamePages"}>
                <GameweekHistory />
              </ProtectedRoute>
            }
          />

          <Route path="/account" element={<Account />} />
        </Routes>

        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;
