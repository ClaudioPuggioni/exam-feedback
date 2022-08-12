import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Feedback from "./Feedback";
import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile";

export default function Main() {
  const cabinet = useSelector((state) => state.cabinet);
  const goTo = useNavigate();
  const location = useLocation();

  useEffect(() => {
    !cabinet.lgn && (location.pathname === "/" || location.pathname === "/profile" || location.pathname === "/signup") ? goTo("/login") : !cabinet.lgn && location.pathname === `/${cabinet.currentUser.username}` ? goTo(`/${cabinet.currentUser.username}`) : goTo("/profile");
    console.log("location is", location);
    console.log("username is", cabinet.currentUser.username);
    // eslint-disable-next-line
  }, [cabinet.lgn]);

  return (
    <div id="mainContainer">
      <Routes>
        <Route path={"/login"} element={<Login />} />
        <Route path={"/signup"} element={<Signup />} />
        <Route path={"/profile"} element={<Profile />} />
        {cabinet.currentUser.username ? <Route path={`/${cabinet.currentUser.username}`} element={<Feedback />} /> : null}
      </Routes>
    </div>
  );
}
