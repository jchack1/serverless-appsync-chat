import React, {useState} from "react";
// import "../styles/Background.css";
import {Auth} from "aws-amplify";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {
  FormContainer,
  Input,
  Label,
  PageWrapper,
  ErrorMessage,
} from "../components/FormComponents";
import Button from "../components/Button";
import Spinner from "../components/Spinner";

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
  const [buttonText, updateButtonText] = useState("Sign up");
  const [loading, updateLoading] = useState(false);

  const handleSignup = async () => {
    //redirect to login once signup complete

    try {
      //validation
      updateLoading(true);
      updateSignupError("");

      if (password.length === 0) {
        updateSignupError("Please enter a password");
        updateLoading(false);

        return false;
      }
      if (password !== confirmPassword) {
        updateSignupError("Passwords do not match");
        updateLoading(false);

        return false;
      }

      if (email.length === 0) {
        updateSignupError("Email must be filled in");
        updateLoading(false);

        return false;
      }

      if (username.length === 0) {
        updateSignupError("Please choose a username");
        updateLoading(false);

        return false;
      }

      if (!validateEmail(email)) {
        updateSignupError(
          "Email address must be valid format, e.g. name@example.com"
        );
        updateLoading(false);

        return false;
      }

      const {user} = await Auth.signUp({
        username: email,
        password,
        attributes: {
          "custom:username": username,
        },
      });

      updateLoading(false);
      if (user) {
        updateButtonText("sign-up successful, redirecting...");
        setTimeout(() => {
          navigate("/");
        }, 2500);
      }
    } catch (e) {
      updateLoading(false);
      console.log("error signing up:", e);
      updatePassword("");
      updateConfirmPassword("");
      updateSignupError(e.message);
    }
  };

  return (
    <PageWrapper>
      <h1 style={{textAlign: "center"}}>Create an account</h1>

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

        <Button type="submit" onClick={() => handleSignup()}>
          {loading ? <Spinner /> : buttonText}
        </Button>

        <p>
          already have an account? <Link to={"/"}>log in here</Link>
        </p>

        {signupError.length > 0 && <ErrorMessage>{signupError}</ErrorMessage>}
      </FormContainer>
    </PageWrapper>
  );
};

export default Signup;
