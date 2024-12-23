import React, { useState, useEffect } from "react";
import AiNavbar from "../../components/AiNavbar";
import Sidebar from "../../components/Sidebar";
import Content from "../../components/Content";
import AiAssistant from "./AiAssistant";
import ChatHistory from "./ChatHistory";
import { Grid, Form, Button, Image, Card } from "semantic-ui-react";
import "../../styles/AiAssistant.css";
import ChatDataSet from "./ChatDataSet";

const index = ({ pageID, title }) => {
  const [toggleBtn, setToggleBtn] = useState(true);
  const toggle = () => setToggleBtn((val) => !val);
  const [filterPopUp, setFilterPopUp] = useState(false);
  const [dataFromChild, setDataFromChild] = useState(null);
  const [filterdataFromChild, setFilterDataFromChild] = useState(null);
  const [clearFilterFromChild, setClearFilterFromChild] = useState(false);
  const [resetFilterStartDate, setResetFilterStartDate] = useState(false);
  const [isFilterPopUpClick, setIsFilterPopUpClick] = useState(false);
  const [navTitle, setnavTitle] = useState("Ai Assistant");
  const [clearFilterPopUp, setClearFilterPopUp] = useState(false);
  const [checkClicked, setCheckClicked] = useState(false);
  const [isChatHistory, setIsChatHistory] = useState(false);

  useEffect(() => {
    setnavTitle(title);
  }, [title]);

  const handleFilterSort = () => {
    setFilterPopUp(!filterPopUp);
    setResetFilterStartDate(!filterPopUp ? false : "");
  };

  const handleDataFromChild = (data) => {
    setDataFromChild(data);
  };

  const handleFilteredDataFromChild = (data) => {
    setFilterDataFromChild(data);
    setClearFilterFromChild(data.filter);
  };

  const clearFilterFromChildFunc = (data) => {
    setClearFilterFromChild(data);
    setClearFilterPopUp(true);
  };

  const reverseFilteringFromSD = (data) => {
    setResetFilterStartDate(data);
  };

  const checkFilterPopUP = (flag) => {
    setIsFilterPopUpClick(flag);
  };

  // Function to handle click events
  const handleOutsideClick = (data) => {
    setCheckClicked(true);
  };

  return (
    <div className="top-wrapper">
      <Sidebar toggleBtn={toggleBtn} />
      <AiNavbar
        setToggle={toggle}
        navTitle={navTitle}
        type={pageID}
        handleFilterSort={handleFilterSort}
      />
      <Content toggleBtn={toggleBtn}>
        <Grid columns={2} divided={false} stackable>
          <Grid.Row className="chatWithHistory">
            <Grid.Column className="ai-chat-grid">
              <AiAssistant
                filterPopUp={filterPopUp}
                setFilterPopUp={setFilterPopUp}
                onDataFromChild={handleDataFromChild}
                onFilteredDataFromChild={handleFilteredDataFromChild}
                resetFilterStartDate={resetFilterStartDate}
                isFilterPopUpClick={checkFilterPopUP}
                isClearFiltered={clearFilterPopUp}
              />
            </Grid.Column>
            <Grid.Column className="ai-history-grid">
              <ChatHistory
                dataFromChild={dataFromChild}
                filterdataFromChild={filterdataFromChild}
                onClearFilteredFromChild={clearFilterFromChildFunc}
                clearFilterFromChild={clearFilterFromChild}
                onStartDateClear={reverseFilteringFromSD}
                isFilterPopUpClick={isFilterPopUpClick}
                handleFilterSort={handleFilterSort}
                onOutsideClick={handleOutsideClick}
                isChatHistory={isChatHistory}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Content>
    </div>
  );
};

export default index;
