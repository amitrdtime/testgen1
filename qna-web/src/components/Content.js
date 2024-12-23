import React, { useState, useEffect } from "react";
const Content = ({ toggleBtn, children }) => {
  const [isCollapse, setisCollapse] = useState(true);
  return (
    <div
      className={`app-wrapper ${
        toggleBtn ? (isCollapse ? "" : "collapse") : "collapse"
      }`}
      data-simplebar
    >
      {children}
    </div>
  );
};

export default Content;
