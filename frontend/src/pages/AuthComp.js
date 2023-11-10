//where we handle login or directing to app
import React, {useState} from "react";
import Login from "./Login";

const AuthComp = (props) => {
  const [isAuthenticated, updateIsAuthenticated] = useState(false);

  if (isAuthenticated === true || sessionStorage.getItem("memberId") !== null) {
    return <div>{props.children}</div>;
  }

  return <Login updateIsAuthenticated={updateIsAuthenticated} />;
};

export default AuthComp;
