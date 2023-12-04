//where we handle login or directing to app
import React, {useState, PropsWithChildren} from "react";
import Login from "./Login";

const AuthComp = (props: PropsWithChildren) => {
  const [isAuthenticated, updateIsAuthenticated] = useState<boolean>(false);

  if (isAuthenticated === true || sessionStorage.getItem("memberId") !== null) {
    return <div>{props.children}</div>;
  }

  return <Login updateIsAuthenticated={updateIsAuthenticated} />;
};

export default AuthComp;
