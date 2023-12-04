//import all pages here, wrap in auth
import React from "react";
import {Routes, Route} from "react-router-dom";
import AuthComp from "./AuthComp";
import ChatHome from "./ChatHome";

const App = () => {
  //all the other app routes go here
  return (
    <Routes>
      <Route path="/" element={<ChatHome />} />
    </Routes>
  );
};

const Home = () => {
  return (
    <AuthComp>
      <App />
    </AuthComp>
  );
};

export default Home;
