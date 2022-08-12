import React from "react";

export default function FbackCard(props) {
  return (
    <div className="fbackCard">
      <div className="fBackMsg">{props.fBack.feedback}</div>
      <div className="fBackDate">{props.fBack.date}</div>
    </div>
  );
}
