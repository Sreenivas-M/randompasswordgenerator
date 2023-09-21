import React, { useState, useEffect } from "react";
import "./passwordgen.css";
import image from "../images/img.jpg";

function generateRandomPassword(
  length,
  useNumbers,
  useLetters,
  useSpecialChars
) {
  const charset = [];
  if (useNumbers) charset.push("0123456789");
  if (useLetters)
    charset.push("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if (useSpecialChars) charset.push("!@#$%^&*()_+-=[]{}|;:,.<>?");

  const availableChars = charset.join("");
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * availableChars.length);
    password += availableChars[randomIndex];
  }
  return password;
}

function PasswordGen() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(8);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useLetters, setUseLetters] = useState(true);
  const [useSpecialChars, setUseSpecialChars] = useState(true);
  const [prevPasswords, setPrevPasswords] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [noPassword, setNoPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedPasswords =
      JSON.parse(localStorage.getItem("prevPasswords")) || [];
    setPrevPasswords(storedPasswords);
  }, []);
  const validateInputs = () => {
    if (!useNumbers && !useLetters && !useSpecialChars) {
      setErrorMessage("Select at least one checkbox.");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return false;
    } else if (!length || length < 6) {
      setErrorMessage("Please enter password length of min 6");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const generatePassword = () => {
    if (!validateInputs()) {
      return;
    } else {
      const newPassword = generateRandomPassword(
        length,
        useNumbers,
        useLetters,
        useSpecialChars
      );
      setPassword(newPassword);

      // Add the generated password to the list of previous passwords
      const newPrevPasswords = [newPassword, ...prevPasswords.slice(0, 4)];
      setPrevPasswords(newPrevPasswords);

      // Store the updated list of previous passwords in local storage
      localStorage.setItem("prevPasswords", JSON.stringify(newPrevPasswords));
    }
  };

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = password;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    if (password.length === 0) {
      setCopySuccess(false);
      setNoPassword(true);
      setTimeout(() => {
        setNoPassword(false);
      }, 2000);
    } else {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    }
  };

  return (
    <div className="container-fluid main">
      <div className="row">
        <div className="text-center p-5 fw-bold">
          <h1>Random Password Generator</h1>
        </div>

        <div className="col-md-6">
          <img src={image} alt="" className="img-fluid" />
        </div>
        <div className="col-md-6">
          <div class="mb-3 row">
            <label for="" class="col-md-3 col-form-label fw-bold">
              Password Length
            </label>
            <div className="col">
              <input
                type="number"
                className="form-control "
                placeholder="Enter number to generate password"
                style={{ width: "500px", borderRadius: "10px" }}
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="row">
            <label htmlFor="" className="col-3 col-form-label fw-bold">
              Characters used
            </label>

            <div className="col d-flex justify-content-around">
              <label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={useNumbers}
                  onChange={() => setUseNumbers(!useNumbers)}
                />
                Numbers
              </label>
              <label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={useLetters}
                  onChange={() => setUseLetters(!useLetters)}
                />
                Alphabets
              </label>
              <label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={useSpecialChars}
                  onChange={() => setUseSpecialChars(!useSpecialChars)}
                />
                Special Chars
              </label>
            </div>
          </div>
          <div className="text-center position-relative">
            {errorMessage && (
              <div className="text-danger message2">{errorMessage}</div>
            )}
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-success" onClick={generatePassword}>
              Generate Password
            </button>
          </div>
          <div className="d-flex mt-4">
            <>
              <div className="d-md-flex justify-content-between">
                <h3 className="pe-5">Password:</h3>
                <input
                  type="text"
                  className="border border-success rounded-pill text-center fw-bold"
                  value={password}
                  readonly
                  style={{ width: "400px" }}
                />
                <div className="ps-md-5  mt-sm-3 mt-md-0">
                  <button className="btn btn-primary" onClick={copyToClipboard}>
                    Copy
                  </button>
                </div>
              </div>
              <div>
                {copySuccess && (
                  <div className="text-success message">
                    Password Copied to Clipboard!
                  </div>
                )}
                {noPassword && (
                  <div className="text-danger ps-2 message">
                    Please Generate Password to Copy!
                  </div>
                )}
              </div>
            </>
          </div>
          <div className=" row mt-5">
            <div className="col">
              {prevPasswords && prevPasswords.length > 0 ? (
                <div className="">
                  <h4 className="">Last 5 Generated Passwords</h4>
                  <ol>
                    {prevPasswords.map((prevPassword, index) => (
                      <li key={index} className="ps-3">
                        {prevPassword}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordGen;
