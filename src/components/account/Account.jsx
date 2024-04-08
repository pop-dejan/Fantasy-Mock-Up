import "../account/Account.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { firebase, database, auth } from "../../help-files/firebase.js";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import Countries from "../../assets/help-jsons/countries.json";
import { Clubs } from "../../assets/help-jsons/clubs.js";
import ReactLoading from "react-loading";
import Select from "react-select";
import Form from "react-bootstrap/Form";
import { Button, ToggleButtonGroup } from "react-bootstrap";
import { Tooltip } from "react-tooltip";

function Account() {
  const navigate = useNavigate();
  const [render, setRender] = useState(false);
  const [updateButton, setUpdateButton] = useState(false);
  const [updatePasswordButton, setUpdatePasswordButton] = useState(false);
  const [deleteButton, setDeleteButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userRef = ref(database, "usersFantasy/" + localStorage.getItem("id"));
  const updatingRef = ref(database, "updating");
  const [user, setUser] = useState([]);

  // Data required to create clubs and countries select
  const countries = JSON.parse(JSON.stringify(Countries));
  const clubs = JSON.parse(JSON.stringify(Clubs));

  // Variables for display of errors
  const [blankName, setBlankName] = useState(false);
  const [blankLastName, setBlankLastName] = useState(false);
  const [blankTeamName, setBlankTeamName] = useState(false);
  const [blankGender, setBlankGender] = useState(false);
  const [blankCountry, setBlankCountry] = useState(false);
  const [blankClub, setBlankClub] = useState(false);
  const [blankEmail, setBlankEmail] = useState(false);

  const [lowerCaseError, setLowerCaseError] = useState(false);
  const [upperCaseError, setUpperCaseError] = useState(false);
  const [numberError, setNumberError] = useState(false);
  const [specialCharacterError, setSpecialCharacterError] = useState(false);
  const [blankPassword, setBlankPassword] = useState(false);
  const [blankCurrentPassword, setBlankCurrentPassword] = useState(false);
  const [invalidCurrentPassword, setInvalidCurrentPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [detailsSuccess, setDetailsSuccess] = useState(false);

  // Variable for handling form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState(null);
  const [favouriteClub, setFavouriteClub] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [currentPasswrod, setCurrentPassword] = useState("");

  // Function reseting errors
  function resetErrors() {
    setBlankName(false);
    setBlankLastName(false);
    setBlankTeamName(false);
    setBlankGender(false);
    setBlankCountry(false);
    setBlankClub(false);
    setBlankEmail(false);
  }

  // Function reseting errors
  function resetPasswordErrors() {
    setLowerCaseError(false);
    setUpperCaseError(false);
    setNumberError(false);
    setSpecialCharacterError(false);
    setBlankPassword(false);
    setBlankCurrentPassword(false);
    setInvalidCurrentPassword(false);
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

  // Function handling input of first name, last name, team name and email
  const handleChangeFirstName = (event) => {
    setFirstName(event.target.value);
  };

  const handleChangeLastName = (event) => {
    setLastName(event.target.value);
  };

  const handleChangeTeamName = (event) => {
    setTeamName(event.target.value);
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  // Function handling selected gender
  const handleChangeGender = (value) => {
    setGender(value);
  };

  // Function handling selected country
  const handleChangeCountries = (selectedOptionCountry) => {
    setCountryOfOrigin(selectedOptionCountry);
  };

  // Function handling selected club
  const handleChangeClub = (selectedOptionClub) => {
    setFavouriteClub(selectedOptionClub);
  };

  // Function handling submit of update personal data form
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    let retVal = true;
    resetErrors();

    if (firstName === "") {
      setBlankName(true);
      retVal = false;
    }
    if (lastName === "") {
      setBlankLastName(true);
      retVal = false;
    }
    if (teamName === "") {
      setBlankTeamName(true);
      retVal = false;
    }
    if (gender === "") {
      setBlankGender(true);
      retVal = false;
    }
    if (countryOfOrigin.value === "") {
      setBlankCountry(true);
      retVal = false;
    }
    if (favouriteClub.value === "") {
      setBlankClub(true);
      retVal = false;
    }
    if (email === "") {
      setBlankEmail(true);
      retVal = false;
    }

    if (retVal) {
      let userTemp = user;
      userTemp.firstName = firstName;
      userTemp.lastName = lastName;
      userTemp.squadName = teamName;
      userTemp.gender = gender;
      userTemp.email = email;
      userTemp.countryOfOrigin = countryOfOrigin.value;
      userTemp.countryCode = countryOfOrigin.code;
      userTemp.favouriteClub = favouriteClub.value;

      updateUser(userTemp);
      setDetailsSuccess(true);
    }
  };

  const handleChangeCurrentPassword = (event) => {
    setCurrentPassword(event.target.value);
  };

  const handleChangeNewPassword = (event) => {
    setNewPassword(event.target.value);
  };

  // Function handling show passwords checkbox
  const handleShowPassword = (event) => {
    let isChecked = event.target.checked;
    let passwordInput = document.querySelector("#passwordChange");
    let passwordInputCurrent = document.querySelector("#currentPassword");

    if (isChecked == true) {
      passwordInput.type = "text";
      passwordInputCurrent.type = "text";
    } else if (isChecked == false) {
      passwordInput.type = "password";
      passwordInputCurrent.type = "password";
    }
  };

  // Function handling submit of update password form
  const handleUpdatePassword = (event) => {
    event.preventDefault();
    event.stopPropagation();

    let retVal = true;
    resetPasswordErrors();

    if (newPassword === "") {
      setBlankPassword(true);
      retVal = false;
    }

    if (currentPasswrod === "") {
      setBlankCurrentPassword(true);
      retVal = false;
    }

    if (!lowercaseRegex.test(newPassword)) {
      setLowerCaseError(true);
      retVal = false;
    }

    if (!uppercaseRegex.test(newPassword)) {
      setUpperCaseError(true);
      retVal = false;
    }

    if (!specialCharRegex.test(newPassword)) {
      setSpecialCharacterError(true);
      retVal = false;
    }

    if (!numberRegex.test(newPassword)) {
      setNumberError(true);
      retVal = false;
    }

    if (newPassword === "") {
      setLowerCaseError(false);
      setUpperCaseError(false);
      setSpecialCharacterError(false);
      setNumberError(false);
    }

    if (retVal) {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPasswrod
      );
      setUpdatePasswordButton(true);
      reauthenticateWithCredential(auth.currentUser, credential)
        .then(() => {
          setUpdatePasswordButton(false);
          updatePassword(auth.currentUser, newPassword)
            .then(() => {
              setPasswordSuccess(true);
              setNewPassword("");
              setCurrentPassword("");
              setUpdatePasswordButton(false);
            })
            .catch((error) => {
              setError("Something went wrong. Please try again.");
              setUpdatePasswordButton(false);
            });
        })
        .catch((error) => {
          setInvalidCurrentPassword(true);
          setUpdatePasswordButton(false);
        });
    }
  };

  // Function handling delete of user
  function handleDelete() {
    const user = auth.currentUser;

    set(userRef, null)
      .then(() => {
        setIsLoading(true);
        setDeleteButton(true);
        user
          .delete()
          .then(() => {
            setIsLoading(false);
            setDeleteButton(false);
            localStorage.removeItem("id");
            onUpdateValueHome("/home");
            navigate("/");
          })
          .catch((error) => {
            setError("Something went wrong. Please try again.");
            navigate("/");
            setIsLoading(false);
            setDeleteButton(false);
          })
          .finally(() => {
            setIsLoading(false);
            setDeleteButton(false);
          });
      })
      .catch((error) => {
        setError("Something went wrong. Please try again.");
        navigate("/");
        setIsLoading(false);
        setDeleteButton(false);
      });
  }

  // Checking should component be rendered
  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate("/");
      } else {
        setRender(true);
      }
    });
  }, []);

  // Fetching user from database and handling render of loading and error interface
  const getData = async () => {
    try {
      setIsLoading(true);
      const [snapshot1, snapshot2] = await Promise.all([
        get(userRef),
        get(updatingRef),
      ]);

      const data1 = snapshot1.val();
      const data2 = snapshot2.val();
      setUser(data1);
      setFirstName(data1.firstName);
      setLastName(data1.lastName);
      setTeamName(data1.squadName);
      setGender(data1.gender);
      setEmail(data1.email);

      setFavouriteClub(() => {
        let value = {};
        clubs.forEach((club) => {
          if (club.value === data1.favouriteClub) {
            value = club;
          }
        });
        return value;
      });

      setCountryOfOrigin(() => {
        let value = {};
        countries.forEach((country) => {
          if (country.value === data1.countryOfOrigin) {
            value = country;
          }
        });
        return value;
      });

      if (data2.isUpdating) {
        navigate("/");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Updating user in database and handling render of loading and error interface
  function updateUser(user) {
    setIsLoading(true);
    setUpdateButton(true);
    set(userRef, user)
      .then(() => {
        getData();
        setUpdateButton(false);
      })
      .catch((error) => {
        setError("Something went wrong. Please try again.");
        setIsLoading(false);
        setUpdateButton(false);
      })
      .finally(() => {
        setIsLoading(false);
        setUpdateButton(false);
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
      {render && (
        <div className="account-wrapper">
          <div className="manage-account">
            <h1 className="account-headline">Manage Account</h1>
            {user.addedSquad && (
              <div className="change-info">
                <h3 className="personal">Personal details</h3>
                <p className="personal-text">
                  Change your first name, last name, team name, gender,
                  country/region of residence, favourite club and contact email.
                </p>
                <Form className="form" onSubmit={handleSubmit}>
                  <Form.Group className="form-group">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      name="firstName"
                      id="firstNameChange"
                      value={firstName}
                      onChange={handleChangeFirstName}
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
                      id="lastNameChange"
                      value={lastName}
                      onChange={handleChangeLastName}
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
                      id="squadNameChange"
                      value={teamName}
                      onChange={handleChangeTeamName}
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
                        value={gender}
                        onChange={handleChangeGender}
                      >
                        <Form.Check
                          inline
                          label="Male"
                          name="male"
                          type={type}
                          value={"male"}
                          id={"maleChange"}
                        />
                        <Form.Check
                          inline
                          label="Female"
                          name="female"
                          type={type}
                          value={"female"}
                          id={"femaleChange"}
                        />
                        <Form.Check
                          inline
                          label="Unspecified"
                          name="unspecified"
                          type={type}
                          value={"unspecified"}
                          id={"unspecifiedChange"}
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
                    <Form.Label>Country / Region of Residence</Form.Label>
                    <Select
                      options={countries}
                      className="my-select-countries"
                      value={countryOfOrigin}
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
                      value={favouriteClub}
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
                    <Form.Label>
                      Email address (this is only your contact email)
                    </Form.Label>
                    <Form.Control
                      type="email"
                      className="form-control"
                      name="emailChange"
                      id="emailChange"
                      value={email}
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
                  </Form.Group>
                  {detailsSuccess && (
                    <div className="password-success">
                      Personal details successfully updated
                    </div>
                  )}
                  <div className="button-wrapper text-center">
                    <Button
                      type="submit"
                      className="btn btn-primary my-button"
                      disabled={updateButton}
                    >
                      Update details
                    </Button>
                  </div>
                </Form>
              </div>
            )}

            {user.signUpMethod === "signUp" && (
              <div className="change-info">
                <h3 className="personal">Change your password</h3>
                <p className="personal-text">
                  In order to improve the security of your account, can you
                  reset your password to a strong and unique one not used on any
                  other online accounts.
                </p>
                <Form className="form" onSubmit={handleUpdatePassword}>
                  <Form.Group className="form-group">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      className="form-control"
                      name="currentPassword"
                      id="currentPassword"
                      value={currentPasswrod}
                      onChange={handleChangeCurrentPassword}
                    />
                    {blankCurrentPassword && (
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
                        <span>Current password is required!</span>
                      </div>
                    )}

                    {invalidCurrentPassword && (
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
                        <span>Invalid current password!</span>
                      </div>
                    )}
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>New Password</Form.Label>

                    <Form.Control
                      type="password"
                      className="form-control"
                      name="passwordChange"
                      id="passwordChange"
                      onMouseEnter={handleTooltipOpen}
                      onMouseLeave={handleTooltipClose}
                      onClick={handleTooltipClose}
                      value={newPassword}
                      onChange={handleChangeNewPassword}
                    />

                    <Tooltip
                      anchorSelect="#passwordChange"
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
                      - At least one number <br />- At least one special
                      character e.g - !&*
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
                        <span>New password is required!</span>
                      </div>
                    )}
                  </Form.Group>
                  <Form.Group className="form-group form-check">
                    <Form.Check
                      className="showPassword"
                      label={"Show Password"}
                      id="showPasswordChange"
                      name="showPasswordChange"
                      onChange={handleShowPassword}
                    />
                  </Form.Group>

                  {passwordSuccess && (
                    <div className="password-success">
                      Password successfilly updated
                    </div>
                  )}
                  <div className="button-wrapper text-center">
                    <Button
                      type="submit"
                      className="btn btn-primary my-button"
                      disabled={updatePasswordButton}
                    >
                      Update Password
                    </Button>
                  </div>
                </Form>
              </div>
            )}

            <div className="change-info">
              <h3 className="personal">Delete your account</h3>
              <p className="personal-text">
                Permanently delete your Premier League account including your
                Fantasy Premier League team.
              </p>
              <div className="button-wrapper text-center">
                <Button
                  type="submit"
                  className="btn btn-primary my-button"
                  disabled={deleteButton}
                  onClick={handleDelete}
                >
                  Delete your account
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Account;
