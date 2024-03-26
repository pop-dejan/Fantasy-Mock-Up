import "./SignIn.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { firebase, auth, database } from "../../help-files/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { get, ref, set } from "firebase/database";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import Users from "../../assets/help-jsons/usersFantasyStart.json";
import ReactLoading from "react-loading";
import FacebookImg from "../../assets/img/socials/icons8-facebook-150.png";
import GoogleImg from "../../assets/img/socials/icons8-google-150.png";
import GithubImg from "../../assets/img/socials/icons8-github-128.png";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

function SignIn({ onUpdateValueHome }) {
  const [isLoading, setIsLoading] = useState(true);
  const updatingRef = ref(database, "updating");
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState("");
  const [signInButton, setSignInButton] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    window.matchMedia("(max-width: 992px)")
  );
  const navigate = useNavigate();

  // Variables for display of errors
  const [invalidUser, setInvalidUser] = useState(false);
  const [blankEmail, setBlankEmail] = useState(false);
  const [blankPassword, setBlankPassword] = useState(false);

  // Function reseting errors
  function resetErrors() {
    setInvalidUser(false);
    setBlankEmail(false);
    setBlankPassword(false);
  }

  // Function handling switching to sign-in component
  function goToSignUp() {
    navigate("/sign-up");
  }

  // Variable for handling form data
  const [formData, setFormData] = useState({
    emailSignIn: "",
    passwordSignIn: "",
  });

  // Function handling input of email
  const handleChangeEmail = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // Function handling password input
  const handlePassword = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ["passwordSignIn"]: event.target.value,
    }));
  };

  // Function handling show passwords checkbox
  const handleShowPassword = (event) => {
    let isChecked = event.target.checked;
    let passwordInput = document.querySelector("#passwordSignIn");

    if (isChecked == true) {
      passwordInput.type = "text";
    } else if (isChecked == false) {
      passwordInput.type = "password";
    }
  };

  // Function handling submit of form
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    let retVal = true;
    resetErrors();

    if (formData.emailSignIn === "") {
      setBlankEmail(true);
      retVal = false;
    }
    if (formData.passwordSignIn === "") {
      setBlankPassword(true);
      retVal = false;
    }

    if (retVal == true) {
      setSignInButton(true);
      signInWithEmailAndPassword(
        auth,
        formData.emailSignIn,
        formData.passwordSignIn
      )
        .then((userCredential) => {
          setIsLoading(true);
          let userRef = ref(
            database,
            "usersFantasy/" + userCredential.user.uid
          );
          get(userRef)
            .then((snapshot) => {
              if (snapshot.exists()) {
                let user = snapshot.val();

                if (user.addedSquad == false) {
                  localStorage.setItem("id", `${user._id}`);
                  onUpdateValueHome("/home");
                  navigate("/select-team");
                } else if (user.addedSquad == true) {
                  if (user.gameweeks) {
                    localStorage.setItem("id", `${user._id}`);
                    onUpdateValueHome("/points");
                    navigate("/");
                  } else {
                    localStorage.setItem("id", `${user._id}`);
                    onUpdateValueHome("/pick-team");
                    navigate("/");
                  }
                }

                setSignInButton(false);
              } else {
                setSignInButton(false);
                setError("No data available for this user.");
              }
            })
            .catch((error) => {
              setSignInButton(false);
              setError("Something went wrong. Please try again.");
            });
        })
        .catch((error) => {
          setSignInButton(false);
          resetErrors();
          if (error.message === "Firebase: Error (auth/invalid-credential).") {
            setInvalidUser(true);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  // Function handling sign in using providers
  function signInUsingProviders(provider) {
    signInWithPopup(auth, provider)
      .then((result) => {
        setIsLoading(true);
        let userRef = ref(database, "usersFantasy/" + result.user.uid);
        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              let user = snapshot.val();

              if (user.addedSquad == false) {
                localStorage.setItem("id", `${user._id}`);
                onUpdateValueHome("/home");
                navigate("/select-team");
              } else if (user.addedSquad == true) {
                if (user.gameweeks) {
                  localStorage.setItem("id", `${user._id}`);
                  onUpdateValueHome("/points");
                  navigate("/");
                } else {
                  localStorage.setItem("id", `${user._id}`);
                  onUpdateValueHome("/pick-team");
                  navigate("/");
                }
              }
            } else {
              let userRefFirst = ref(
                database,
                "usersFantasy/" + result.user.uid
              );
              set(userRefFirst, {
                _id: result.user.uid,
                goalkeeper: Users.goalkeeper,
                defence: Users.defence,
                midfield: Users.midfield,
                attack: Users.attack,
                subs: Users.subs,
                addedSquad: Users.addedSquad,
                countPlayers: Users.countPlayers,
                money: Users.money,
                signInProviders: true,
                freeTransfers: Users.freeTransfers,
              })
                .then(() => {
                  let userRefSecond = ref(
                    database,
                    "usersFantasy/" + result.user.uid
                  );

                  get(userRefSecond)
                    .then((snapshot) => {
                      if (snapshot.exists()) {
                        let user = snapshot.val();
                        localStorage.setItem("id", `${user._id}`);
                        navigate("/select-team");
                      } else {
                        setError("No data available for this user.");
                      }
                    })
                    .catch((error) => {
                      setError("Something went wrong. Please try again.");
                    });
                })
                .catch((error) => {
                  setError("Something went wrong. Please try again.");
                });
            }
          })
          .catch((error) => {
            setError("Something went wrong. Please try again.");
          });
      })
      .catch((error) => {
        setError("Something went wrong. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // Function handling sign-in with google
  function signInWithGoogleAuth() {
    const provider = new GoogleAuthProvider();
    signInUsingProviders(provider);
  }

  // Function handling sign-in with facebook
  function signInWithFacebookAuth() {
    const provider = new FacebookAuthProvider();
    signInUsingProviders(provider);
  }

  // Function handling sign-in with github
  function signInWithGithubAuth() {
    const provider = new GithubAuthProvider();
    signInUsingProviders(provider);
  }

  useEffect(() => {
    get(updatingRef)
      .then((snapshot) => {
        setIsLoading(true);
        if (snapshot.exists()) {
          setUpdating(new Object(snapshot.val()));

          window.scrollTo({
            top: 0,
            behavior: "instant",
          });
        }
      })
      .catch((error) => {
        setError("Something went wrong. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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
      {updating.isUpdating ? (
        <Navigate to="/" />
      ) : (
        <div className="main">
          <Form className="form" onSubmit={handleSubmit}>
            <Form.Group className="form-group">
              <h2>Sign In</h2>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                className="form-control"
                name="emailSignIn"
                id="emailSignIn"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChangeEmail}
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
              {invalidUser && (
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
                  <span>Email or password are incorrect!</span>
                </div>
              )}
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                className="form-control"
                name="passwordSignIn"
                id="passwordSignIn"
                placeholder="Enter Password"
                onChange={handlePassword}
              />
              {blankPassword && (
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
                  <span>Password is required!</span>
                </div>
              )}
            </Form.Group>
            <Form.Group className="form-group form-check">
              <Form.Check
                className="showPasswordSignIn"
                label={"Show Password"}
                id="showPasswordSignIn"
                name="showPasswordSignIn"
                onChange={handleShowPassword}
              />
            </Form.Group>
            <div className="button-wrapper text-center">
              <Button
                type="submit"
                className="btn btn-primary my-button"
                disabled={signInButton}
              >
                Sign In
              </Button>
            </div>
            <div className="signUp">
              <p>Don't have an account?</p>
              <span onClick={goToSignUp}>Sign Up</span>
            </div>
            <div className="orLoginWith">or login with</div>
            <div className="socials">
              <img
                src={FacebookImg}
                alt="Facebook Socials"
                onClick={signInWithFacebookAuth}
              />
              <img
                src={GoogleImg}
                alt="Google Socials"
                onClick={signInWithGoogleAuth}
              />
              <img
                src={GithubImg}
                alt="Github socials"
                onClick={signInWithGithubAuth}
              />
            </div>
          </Form>
        </div>
      )}
    </>
  );
}

export default SignIn;
