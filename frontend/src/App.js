import React from "react";
import "./styles/App.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
