import React, {useState} from "react";
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import AuthComp from "./AuthComp";
import ChatHome from "./ChatHome";
//import all pages here, wrap in auth

const App = () => {
  //all the other app routes go here
  return (
    <Routes>
      <Route path="/" element={<ChatHome />} />
    </Routes>
  );
};

const Home = () => {
  //auth component wraps app, somthing like this:
  return (
    <AuthComp>
      <App />
    </AuthComp>
  );
};

export default Home;
