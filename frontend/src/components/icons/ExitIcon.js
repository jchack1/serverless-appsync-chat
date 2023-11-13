import React from "react";

const ExitIcon = ({onClick}) => {
  return (
    <i
      className="fa fa-times-circle-o exit-icon"
      aria-hidden="true"
      onClick={() => onClick()}
    ></i>
  );
};

export default ExitIcon;
