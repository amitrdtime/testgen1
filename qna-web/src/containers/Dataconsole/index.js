import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Content from "../../components/Content";
import DataConsole from "./Dataconsole";
import DataSet from "./Dataset";
import DataconsoleNavbar from "../../components/DataconsoleNavbar";
import { ToastProvider } from "react-toast-notifications";
import CustomToaster from "../../components/CustomToaster";

const index = ({ pageID, title }) => {
  const [toggleBtn, setToggleBtn] = useState(true);
  const toggle = () => setToggleBtn((val) => !val);
  const [visibleSidebar, setVisibleSidebar] = useState(true);
  const [OpenDocUpload, setOpenDocUpload] = useState(false);
  const [DatsetCount, setDatsetCount] = useState(0);
  const [toasterVisible, setToasterVisible] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterAppearance, setToasterAppearance] = useState("success");
  const [NavbarCollapse, setNavbarCollapse] = useState(true);
  const [dataFromChild, setDataFromChild] = useState(null);
  const [navTitle, setnavTitle] = useState("Data Console");

  const handleDataFromChild = (data) => {
    setDataFromChild(data);
  };

  useEffect(() => {
    setnavTitle(title);
  }, [title]);

  const handleOpenDocUpload = () => {
    setOpenDocUpload(!OpenDocUpload);
  };

  const showToaster = (message, appearance) => {
    setToasterVisible(true);
    setToasterMessage(message);
    setToasterAppearance(appearance);
  };

  const closeToaster = () => {
    setToasterVisible(false);
  };

  return (
    <div className="top-wrapper">
      <DataconsoleNavbar
        setToggle={toggle}
        handleOpenDocUpload={handleOpenDocUpload}
        showDatasetCount={DatsetCount}
        navTitle={navTitle}
        type={pageID}
        NavbarCollapse={NavbarCollapse}
        onDataFromChild={handleDataFromChild}
      />
      <Sidebar toggleBtn={toggleBtn} />

      <Content toggleBtn={toggleBtn}>
        {toasterVisible && (
          <CustomToaster
            message={toasterMessage}
            duration={3000}
            onClose={closeToaster}
            position="right-top"
            appearance={toasterAppearance}
          />
        )}
        {pageID === "data_console" ? (
          <DataSet
            OpenDocUpload={OpenDocUpload}
            setOpenDocUpload={setOpenDocUpload}
            setDatsetCount={setDatsetCount}
            showToaster={showToaster}
            dataFromChild={dataFromChild}
            setnavTitle="Data Console"
          />
        ) : pageID === "add_doc" ? (
          <DataConsole
            OpenDocUpload={OpenDocUpload}
            setOpenDocUpload={setOpenDocUpload}
            setDatsetCount={setDatsetCount}
            showToaster={showToaster}
            setnavTitle={setnavTitle}
            dataFromChild={dataFromChild}
          />
        ) : (
          { pageID }
        )}
      </Content>
    </div>
  );
};

export default index;
