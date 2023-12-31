import React from "react";
import {mediumBlue} from "../../styles/Colors";

const LoadMore = () => {
  return (
    <svg
      aria-hidden="true"
      fill={"none"}
      stroke={mediumBlue}
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LoadMore;
