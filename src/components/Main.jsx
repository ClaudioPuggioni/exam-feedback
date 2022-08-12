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
    if (!cabinet.lgn && (location.pathname === "/" || location.pathname === "/profile" || location.pathname === "/signup")) {
      goTo("/login");
    } else if (cabinet.lgn) {
      goTo("/profile");
    }
    console.log("location is", location);
    console.log("username is", cabinet.currentUser.username);
    // eslint-disable-next-line
  }, [cabinet.lgn]);

  // useEffect(() => {
  //   if (location.pathname === `/${cabinet.currentUser.username}`) {
  //     console.log(location.pathname, `/${cabinet.currentUser.username}`);
  //     goTo(`/${cabinet.currentUser.username}`);
  //     return;
  //   }
  //   if (cabinet.currentUser.username) goTo(`/${cabinet.currentUser.username}`);
  //   // eslint-disable-next-line
  // }, [cabinet.currentUser.username]);

  return (
    <div id="mainContainer">
      <Routes>
        <Route path={"/login"} element={<Login />} />
        <Route path={"/signup"} element={<Signup />} />
        <Route path={"/profile"} element={<Profile />} />
        <Route path="*" element={<Feedback />} />
      </Routes>
    </div>
  );
}
