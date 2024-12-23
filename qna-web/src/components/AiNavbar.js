import React, { useState } from "react";
import { Icon, Input, Button, Image, Grid } from "semantic-ui-react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/AiNavbar.css";

const AiNavbar = ({ setToggle, navTitle, type, handleFilterSort }) => {
  const navBarTitle = navTitle || "Q&A";
  const navigate = useNavigate();
  const location = useLocation();
  const hasQueryParams = location.search.length > 0;

  const handleView = () => {
    navigate(`/ai-assistant`);
  };

  return (
    <Grid
      className="aiAssiatantRow"
      columns={2}
      divided={false}
      style={{ marginLeft: "18%" }}
      stackable
    >
      <Grid.Row className="aiAssiatantHeaderRow">
        <div className="aiAssistantSegment">
          <Grid.Column className="aiAssiatantFirstDiv">
            <Grid.Column>
              <div className="menu-item-left">
                <Image src="/images/ai-assistant.svg" alt="ai assitant" />
                <label>{navBarTitle || "Default"}</label>
              </div>
            </Grid.Column>
          </Grid.Column>
          <Grid.Column className="aiAssiatantSecondDiv">
            <Grid.Column style={{ display: "flex", paddingTop: "29px" }}>
              <Button
                primary
                className="button-ai-new-chat"
                onClick={() => handleView()}
                disabled={!hasQueryParams}
              >
                <div className="button-ai-console-parent">
                  <Image
                    src="/images/white-chat-icons.svg"
                    alt="Add new Dataset"
                  />
                  <label>New Chat</label>
                </div>
              </Button>
            </Grid.Column>
          </Grid.Column>
        </div>
        <Grid.Column className="aiAssiatantThirdDiv">
          <Grid.Column>
            <div
              className="chatHistoryBox"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 20px 22px 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Image src="/images/chat-history.svg" alt="Chat History" />
                <label>Chat History</label>
              </div>
              <div className="filterButton">
                <img
                  src="/images/filter.svg"
                  alt="View More"
                  style={{ cursor: "pointer" }}
                  onClick={handleFilterSort}
                />
              </div>
            </div>
          </Grid.Column>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default AiNavbar;
