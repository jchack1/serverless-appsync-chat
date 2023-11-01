import React, {useState} from "react";
import {Auth} from "aws-amplify";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {FormContainer, Input, Label} from "../components/FormComponents";

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const Signup = () => {
  const navigate = useNavigate();

  const [email, updateEmail] = useState("");
  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");
  const [confirmPassword, updateConfirmPassword] = useState("");
  const [signupError, updateSignupError] = useState("");

  const handleSignup = async () => {
    //redirect to login once signup complete

    try {
      //validation

      updateSignupError("");

      if (password.length === 0) {
        updateSignupError("Please enter a password");
        return false;
      }
      if (password !== confirmPassword) {
        updateSignupError("Passwords do not match");
        return false;
      }

      if (email.length === 0) {
        updateSignupError("Email must be filled in");
        return false;
      }

      if (username.length === 0) {
        updateSignupError("Please choose a username");
        return false;
      }

      if (!validateEmail(email)) {
        updateSignupError(
          "Email address must be valid format, e.g. name@example.com"
        );
        return false;
      }

      const {user} = await Auth.signUp({
        username: email,
        password,
        attributes: {
          "custom:username": username,
        },
      });

      if (user) navigate("/");
    } catch (e) {
      console.log("error signing up:", e);
      updateSignupError(e.message);
    }
  };

  return (
    <div>
      <p style={{textAlign: "center"}}>signup page</p>

      <FormContainer>
        <Label htmlFor="email">Email</Label>
        <Input
          type="text"
          id="email"
          value={email}
          onChange={(e) => updateEmail(e.target.value)}
        ></Input>

        <Label htmlFor="username">Username</Label>

        <Input
          type="text"
          id="username"
          value={username}
          onChange={(e) => updateUsername(e.target.value)}
        ></Input>

        <Label htmlFor="password">Password</Label>

        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => updatePassword(e.target.value)}
        ></Input>

        <Label htmlFor="confirm-password">Confirm password</Label>

        <Input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => updateConfirmPassword(e.target.value)}
        ></Input>

        <button type="submit" onClick={() => handleSignup()}>
          Sign up
        </button>

        <p>
          already have an account? <Link to={"/"}>log in here</Link>
        </p>

        {signupError.length > 0 && <p>{signupError}</p>}
      </FormContainer>
    </div>
  );
};

export default Signup;
