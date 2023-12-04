import React, {useState} from "react";
import "../styles/Background.css";
import {Auth, API, graphqlOperation} from "aws-amplify";
import {Link} from "react-router-dom";
import {
  FormContainer,
  Input,
  Label,
  InputContainer,
  PageWrapper,
  ErrorMessage,
} from "../components/FormComponents";
import Button from "../components/Button";
import Spinner from "../components/icons/Spinner";
import {getMember} from "../graphql";
import {GetMemberQueryResult} from "../types";

function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

type LoginProps = {
  updateIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const Login = ({updateIsAuthenticated}: LoginProps) => {
  const [email, updateEmail] = useState<string>("");
  const [password, updatePassword] = useState<string>("");
  const [loginError, updateLoginError] = useState<string>("");
  const [loading, updateLoading] = useState<boolean>(false);

  const handleLogin = async (): Promise<any> => {
    try {
      //validation
      updateLoading(true);
      updateLoginError("");

      if (password.length === 0) {
        updateLoginError("Password must be filled in");
        updateLoading(false);

        return false;
      }

      if (email.length === 0) {
        updateLoginError("Email must be filled in");
        updateLoading(false);

        return false;
      }

      if (!validateEmail(email)) {
        updateLoginError(
          "Email address must be valid format, e.g. name@example.com"
        );
        updateLoading(false);

        return false;
      }

      // log them in with cognito
      const user = await Auth.signIn(email, password);

      //get their member data from dynamo db

      const getMemberResult = (await API.graphql(
        graphqlOperation(getMember, {
          email,
        })
      )) as GetMemberQueryResult;

      if (getMemberResult.errors) {
        throw new Error(getMemberResult.errors[0]);
      }

      sessionStorage.setItem(
        "memberId",
        getMemberResult.data.getMember.memberId
      );
      sessionStorage.setItem("email", getMemberResult.data.getMember.email);
      sessionStorage.setItem(
        "username",
        getMemberResult.data.getMember.username
      );

      if (user) updateIsAuthenticated(true);
      updateLoading(false);
    } catch (e: any) {
      updateLoading(false);
      updateLoginError(e.message);
      updatePassword("");
      console.log(e);
    }
  };

  return (
    <PageWrapper>
      <h1 style={{textAlign: "center"}}>Chat app</h1>

      <FormContainer>
        <InputContainer>
          <Label htmlFor="email">Email</Label>

          <Input
            type="text"
            id="email"
            value={email}
            onChange={(e) => updateEmail(e.target.value)}
          ></Input>
        </InputContainer>

        <InputContainer>
          <Label htmlFor="password">Password</Label>

          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => updatePassword(e.target.value)}
          ></Input>
        </InputContainer>

        <Button onClick={() => handleLogin()}>
          {loading ? <Spinner /> : "Log in"}
        </Button>

        <p>
          no account? sign up <Link to={"/signup"}>here</Link>
        </p>

        {loginError.length > 0 && <ErrorMessage>{loginError}</ErrorMessage>}
      </FormContainer>
    </PageWrapper>
  );
};

export default Login;
