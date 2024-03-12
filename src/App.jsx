import "./App.scss";
import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./help-files/AuthContext";
import { ProtectedRoute } from "./help-files/ProtectedRoute";
import { auth } from "./help-files/firebase";
import getCookie from "./help-files/getCookie";
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

function App() {
  // Function handling home page based on if user is logged
  const [valueHome, setValueHome] = useState(() => {
    const storedValue = getCookie("myValueHome");
    if (storedValue === null) {
      document.cookie = "myValueHome=/home";
      return "/home";
    }
    return storedValue;
  });

  useEffect(() => {
    document.cookie = `myValueHome=${valueHome}`;
  }, [valueHome]);

  const updateValueHome = (newValue) => {
    setValueHome(newValue);
  };

  // Checking if user is logged in
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const userCheck = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setCurrentUser(currentUser);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  useEffect(() => {
    if (!getCookie("id")) {
      auth.signOut();
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

  return (
    <>
      <AuthProvider>
        <Navbar />

        {showNavbarSecond(location.pathname) && (
          <NavbarSecond
            showButtons={valueHome === "/points"}
            showHome={valueHome === "/home"}
            hideAllButtons={getCookie("id")}
            onUpdateValueHome={updateValueHome}
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
          <Route path="/sign-up" element={<SignUp />} />

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
        </Routes>

        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;
