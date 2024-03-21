import "./SignUp.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { firebase, auth, database } from "../../help-files/firebase.js";
import { get, ref, set } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Users from "../../assets/help-jsons/usersFantasyStart.json";
import Countries from "../../assets/help-jsons/countries.json";
import { Clubs } from "../../assets/help-jsons/clubs.js";
import Select from "react-select";
import ReactLoading from "react-loading";
import Form from "react-bootstrap/Form";
import { Button, ToggleButtonGroup } from "react-bootstrap";
import { Tooltip } from "react-tooltip";

function SignUp() {
  // Variables for display of errors
  const [blankEmail, setBlankEmail] = useState(false);
  const [blankPassword, setBlankPassword] = useState(false);
  const [blankComfirmPassword, setBlankComfirmPassword] = useState(false);
  const [blankName, setBlankName] = useState(false);
  const [blankLastName, setBlankLastName] = useState(false);
  const [blankTeamName, setBlankTeamName] = useState(false);
  const [blankGender, setBlankGender] = useState(false);
  const [blankDateOfBirth, setBlankDateOfBirth] = useState(false);
  const [blankCountry, setBlankCountry] = useState(false);
  const [blankClub, setBlankClub] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [takenEmail, setTakenEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [matchPasswords, setMatchPasswords] = useState(false);
  const [lowerCaseError, setLowerCaseError] = useState(false);
  const [upperCaseError, setUpperCaseError] = useState(false);
  const [numberError, setNumberError] = useState(false);
  const [specialCharacterError, setSpecialCharacterError] = useState(false);
  const [invalidDate, setInvalidDate] = useState(false);

  // Other variables
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const updatingRef = ref(database, "updating");
  const [updating, setUpdating] = useState("");
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    window.matchMedia("(max-width: 992px)")
  );

  // Function reseting errors
  function resetErrors() {
    setBlankEmail(false);
    setBlankPassword(false);
    setBlankComfirmPassword(false);
    setBlankName(false);
    setBlankLastName(false);
    setBlankTeamName(false);
    setBlankGender(false);
    setBlankDateOfBirth(false);
    setBlankCountry(false);
    setBlankClub(false);

    setInvalidEmail(false);
    setTakenEmail(false);
    setInvalidPassword(false);
    setMatchPasswords(false);

    setUpperCaseError(false);
    setLowerCaseError(false);
    setNumberError(false);
    setSpecialCharacterError(false);
    setInvalidDate(false);
  }

  // Regular expressions to match required characters
  const lowercaseRegex = /[a-z]/;
  const uppercaseRegex = /[A-Z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  // Functions and variable handling open and close state of password tooltip
  const [open, setOpen] = useState(null);
  const handleTooltipOpen = () => setOpen(true);
  const handleTooltipClose = () => setOpen(false);

  // Function handling switching to sign-in component
  function goToSignIn() {
    navigate("/sign-in");
  }

  // Variable for handling form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    squadName: "",
    gender: "",
    countryOfOrigin: "",
    favouriteClub: "",
    password: "",
    comfirmPassword: "",
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

  // Function handling password input
  const handlePassword = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ["password"]: event.target.value,
    }));
  };

  // Function handling comfirm password input
  const handleComfirmPassword = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ["comfirmPassword"]: event.target.value,
    }));
  };

  // Function handling show passwords checkbox
  const handleShowPassword = (event) => {
    let isChecked = event.target.checked;
    let passwordInput = document.querySelector("#password");
    let comfirmPasswordInput = document.querySelector("#confirmPassword");

    if (isChecked == true) {
      passwordInput.type = "text";
      comfirmPasswordInput.type = "text";
    } else if (isChecked == false) {
      passwordInput.type = "password";
      comfirmPasswordInput.type = "password";
    }
  };

  // Function handling submit of form
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let retVal = true;
    resetErrors();

    if (formData.password === "") {
      setBlankPassword(true);
      retVal = false;
    }

    if (!lowercaseRegex.test(formData.password)) {
      setLowerCaseError(true);
      retVal = false;
    }

    if (!uppercaseRegex.test(formData.password)) {
      setUpperCaseError(true);
      retVal = false;
    }

    if (!specialCharRegex.test(formData.password)) {
      setSpecialCharacterError(true);
      retVal = false;
    }

    if (!numberRegex.test(formData.password)) {
      setNumberError(true);
      retVal = false;
    }

    if (formData.password === "") {
      setLowerCaseError(false);
      setUpperCaseError(false);
      setSpecialCharacterError(false);
      setNumberError(false);
    }

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

    if (formData.comfirmPassword === "") {
      setBlankComfirmPassword(true);
      retVal = false;
    }

    if (formData.comfirmPassword !== formData.password) {
      setMatchPasswords(true);
      retVal = false;
    }

    if (formData.comfirmPassword === "") {
      setMatchPasswords(false);
    }

    if (retVal == true) {
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          setIsLoading(true);
          let user = userCredential.user;
          let userRefFirst = ref(database, "usersFantasy/" + user.uid);
          set(userRefFirst, {
            _id: user.uid,
            goalkeeper: Users.goalkeeper,
            defence: Users.defence,
            midfield: Users.midfield,
            attack: Users.attack,
            subs: Users.subs,
            addedSquad: Users.addedSquad,
            countPlayers: Users.countPlayers,
            money: Users.money,
            squadName: formData.squadName,
            firstName: formData.firstName,
            lastName: formData.lastName,
            gender: formData.gender,
            dateOfBirth: formData.dateOfBirth,
            countryOfOrigin: formData.countryOfOrigin,
            favouriteClub: formData.favouriteClub,
            email: formData.email,
            signInProviders: Users.signInProviders,
            freeTransfers: Users.freeTransfers,
          }).then(() => {
            let userRefSecond = ref(database, "usersFantasy/" + user.uid);
            get(userRefSecond)
              .then((snapshot) => {
                if (snapshot.exists()) {
                  let user = snapshot.val();
                  document.cookie = `id=${user._id}`;
                  navigate("/select-team");
                } else {
                  setError("No data available for this user.");
                }
              })
              .catch((error) => {
                setError("Something went wrong. Please try again.");
              });
          });
        })
        .catch((error) => {
          resetErrors();
          if (error.message === "Firebase: Error (auth/invalid-email).") {
            setInvalidEmail(true);
          } else if (
            error.message === "Firebase: Error (auth/email-already-in-use)."
          ) {
            setTakenEmail(true);
          } else if (
            error.message ===
            "Firebase: Password should be at least 6 characters (auth/weak-password)."
          ) {
            setInvalidPassword(true);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

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

  // Data required to create clubs and countries select
  const countries = JSON.parse(JSON.stringify(Countries));
  const clubs = JSON.parse(JSON.stringify(Clubs));

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
        <div className="main-content">
          <Form className="form" onSubmit={handleSubmit}>
            <Form.Group className="form-group">
              <h2>Sign Up</h2>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                name="firstName"
                id="firstName"
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
                id="lastName"
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
                id="squadName"
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
                id="dateOfBirth"
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
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                className="form-control"
                name="email"
                id="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChangeCredentials}
              />

              {takenEmail && (
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
                  <span>Email address is already taken!</span>
                </div>
              )}

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
            <Form.Group className="form-group">
              <Form.Label>Password</Form.Label>

              <Form.Control
                type="password"
                className="form-control"
                name="password"
                id="password"
                placeholder="Enter Password"
                onChange={handlePassword}
                onMouseEnter={handleTooltipOpen}
                onMouseLeave={handleTooltipClose}
                onClick={handleTooltipClose}
              />

              <Tooltip
                anchorSelect="#password"
                opacity={1}
                isOpen={open}
                place="bottom"
                style={{
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                Password must include: <br />
                - At least 6 characters <br />
                - A mix of upper-case and lower-case characters
                <br />
                - At least one number <br />- At least one special character e.g
                - !&*
              </Tooltip>

              {lowerCaseError && (
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
                  <span>Password must include lowercase letter!</span>
                </div>
              )}
              {upperCaseError && (
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
                  <span>Password must include uppercase letter!</span>
                </div>
              )}
              {numberError && (
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
                  <span>Password must include number!</span>
                </div>
              )}
              {specialCharacterError && (
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
                  <span>Password must include special character!</span>
                </div>
              )}
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

              {invalidPassword && (
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
                  <span>Password must include at least 6 characters!</span>
                </div>
              )}
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                className="form-control"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleComfirmPassword}
              />
              {blankComfirmPassword && (
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
                  <span>Comfirm password is required!</span>
                </div>
              )}

              {matchPasswords && (
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
                  <span>Passwords do not match!</span>
                </div>
              )}
            </Form.Group>
            <Form.Group className="form-group form-check">
              <Form.Check
                className="showPassword"
                label={"Show Password"}
                id="showPassword"
                name="showPassword"
                onChange={handleShowPassword}
              />
            </Form.Group>
            <div className="button-wrapper text-center">
              <Button type="submit" className="btn btn-primary my-button">
                Sign Up
              </Button>
            </div>
            <div className="signIn">
              <p>Already have an account?</p>
              <span onClick={goToSignIn}>Sign In</span>
            </div>
          </Form>
        </div>
      )}
    </>
  );
}

export default SignUp;
