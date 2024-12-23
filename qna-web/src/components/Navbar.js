// Navbar.jsx

import React, { useState } from "react";
import { Menu, Icon, Input, Button, Image, Grid } from "semantic-ui-react";
import { useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({
  setToggle,
  navTitle,
  type,
  handleOpenDocUpload,
  showDatasetCount,
}) => {
  const navBarTitle = navTitle || "Q&A";
  const [inputValue, setInputValue] = useState("");

  return (
    <Grid columns={2} divided={false} style={{ marginLeft: "14%" }} stackable>
      <Grid.Row>
        <Grid.Column computer={10} tablet={16} mobile={16}>
          <Grid.Column>
            <div className="menu-item-left">
              <Image src="/images/ai-assistant.svg" alt="ai assitant" />
              <label>{navBarTitle || "Default"}</label>
            </div>
          </Grid.Column>
        </Grid.Column>
        <Grid.Column computer={3} tablet={16} mobile={16}>
          <Grid.Column >
          </Grid.Column>
        </Grid.Column>

        <Grid.Column computer={3} tablet={16} mobile={16}>
          <Grid.Column></Grid.Column>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Navbar;
