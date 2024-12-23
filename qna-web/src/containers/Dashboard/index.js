import React, { useState,useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Content from "../../components/Content";
import Dashboard from "./Dashboard";

const index = ({pageID,title}) => {
  const [toggleBtn, setToggleBtn] = useState(true);
  const toggle = () => setToggleBtn((val) => !val);
  const [navTitle, setnavTitle] = useState("Admin Console");


  useEffect(() => {
    setnavTitle(title);
  }, [title]);


  return (
    <div className="top-wrapper">
      <Sidebar toggleBtn={toggleBtn} />
      <Navbar
        setToggle={toggle}
        navTitle={navTitle}
        type={pageID}
      />
      <Content toggleBtn={toggleBtn}>
        <Dashboard />
      </Content>
    </div>
  );
};

export default index;
