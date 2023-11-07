import React, {useState} from "react";
import {Auth, API, graphqlOperation} from "aws-amplify";
import {Link} from "react-router-dom";
import {FormContainer, Input, Label} from "../components/FormComponents";

const getMember = `query getMember(
  $email: String
) {
  getMember(email: $email) {
      memberId
      email
      username
  }
}
`;

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const Login = ({updateIsAuthenticated}) => {
  const [email, updateEmail] = useState("");
  const [password, updatePassword] = useState("");
  const [loginError, updateLoginError] = useState("");

  const handleLogin = async () => {
    try {
      //validation

      updateLoginError("");

      if (password.length === 0) {
        updateLoginError("Password must be filled in");
        return false;
      }

      if (email.length === 0) {
        updateLoginError("Email must be filled in");
        return false;
      }

      if (!validateEmail(email)) {
        updateLoginError(
          "Email address must be valid format, e.g. name@example.com"
        );
        return false;
      }

      // log them in with cognito
      const user = await Auth.signIn(email, password);

      if (user) updateIsAuthenticated(true);

      //get their member data from dynamo db
      const {data, errors} = await API.graphql(
        graphqlOperation(getMember, {
          email,
        })
      );

      if (errors) {
        throw new Error(errors[0]);
      }

      sessionStorage.setItem("memberId", data.getMember.memberId);
      sessionStorage.setItem("email", data.getMember.email);
      sessionStorage.setItem("username", data.getMember.username);
    } catch (e) {
      updateLoginError(e.message);
      updatePassword("");
      console.log(e);
    }
  };

  return (
    <div>
      <p style={{textAlign: "center"}}>login page</p>

      <FormContainer>
        <Label htmlFor="email">Email</Label>

        <Input
          type="text"
          id="email"
          value={email}
          onChange={(e) => updateEmail(e.target.value)}
        ></Input>

        <Label htmlFor="password">Password</Label>

        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => updatePassword(e.target.value)}
        ></Input>

        <button type="submit" onClick={() => handleLogin()}>
          Login
        </button>

        <p>
          no account? sign up <Link to={"/signup"}>here</Link>
        </p>

        {loginError.length > 0 && <p>{loginError}</p>}
      </FormContainer>
    </div>
  );
};

export default Login;
