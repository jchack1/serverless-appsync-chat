//where we handle login or directing to app
import React, {useState} from "react";
import Login from "./Login";
import {Auth} from "aws-amplify";

const AuthComp = (props) => {
  const [isAuthenticated, updateIsAuthenticated] = useState(false);

  // something like:
  if (isAuthenticated === true) {
    return <div>{props.children}</div>;
  }

  return <Login updateIsAuthenticated={updateIsAuthenticated} />;
};

export default AuthComp;
