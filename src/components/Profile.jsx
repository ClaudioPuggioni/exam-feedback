import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/dataSlice";
import FbackCard from "./FbackCard";

export default function Profile() {
  const cabinet = useSelector((state) => state.cabinet);
  const dispatch = useDispatch();

  return (
    <div id="profileContainer">
      <div id="barContainer">
        <div id="mainBar">
          <img id="logo" src="/assets/logoFeedback.png" alt="logo" />
          <div id="menu">
            <img id="menuIcon" src="/assets/tripleBar.svg" alt="menu" />
            <div id="menuDropdown">
              <button
                id="logoutBtn"
                onClick={() => {
                  dispatch(logout());
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
      <div id="profileHeader">
        <img id="avatar" src="/assets/avatar.svg" alt="avatar" />
        <div id="username">{cabinet.currentUser.username}</div>
        <div id="email">{cabinet.currentUser.email}</div>
      </div>
      <div id="myFback">
        <div id="myFbackHeader">Received</div>
        <div id="myFbackContainer">{!cabinet.feedbackArr ? null : cabinet.feedbackArr.map((ele) => <FbackCard fBack={ele} />)}</div>
      </div>
    </div>
  );
}
