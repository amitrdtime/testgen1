// Navbar.jsx

import React, { useState } from "react";
import { Menu, Icon, Input, Button, Image, Grid } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import "../styles/DataconsoleNavbar.css";

const DataconsoleNavbar = ({
  setToggle,
  navTitle,
  type,
  handleOpenDocUpload,
  showDatasetCount,
  NavbarCollapse,
  onDataFromChild,
}) => {
  const navBarTitle = navTitle || "Q&A";
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value.toLowerCase());
    onDataFromChild(event.target.value.toLowerCase());
  };
  const navigate = useNavigate();

  const handleBack = async () => {
    navigate(`/data-console`);
  };

  return (
    <Menu fixed="top" className="navbar" borderless style={{ zIndex: "0" }}>
      <Menu.Menu className={`${!NavbarCollapse ? "" : "navbar-collapse"}`}>
        {/* Mobile View  and desktop view*/}
        {!NavbarCollapse ? (
          <Grid>
            <React.Fragment>
              <Menu.Item className="menu-item-left">
                {type === "data_console" && (
                  <>
                    <Image src="/images/data-console.svg" alt="Data Console" />
                  </>
                )}
                {type === "add_doc" && (
                  <>
                    <Image
                      className="backButton"
                      onClick={handleBack}
                      src="/images/Back.svg"
                      alt="Back Button"
                    />
                    <Image src="/images/Dataset.svg" alt="Dataset" />
                  </>
                )}
                <label>{navBarTitle || "Default"}</label>
              </Menu.Item>
            </React.Fragment>
            {type === "data_console" && (
              <>
                <Menu.Item className="menu-item-data-consoles">
                  <div className="tag">{showDatasetCount || 0} Datasets</div>
                </Menu.Item>
                <Menu.Item>
                  <div className="menu-item-search">
                    <input
                      type="text"
                      id="landingSearchMobile"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder=" "
                    />
                    <label htmlFor="landingSearchMobile">
                      <img src="/images/search.svg" alt="Logo" />
                      Search
                    </label>
                  </div>
                  {NavbarCollapse}
                </Menu.Item>
              </>
            )}
            {type === "add_doc" && (
              <>
                <Menu.Item>
                  <div className="menu-item-search">
                    <input
                      type="text"
                      id="addSearchMobile"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder=" "
                    />
                    <label htmlFor="addSearchMobile">
                      <img src="/images/search.svg" alt="Logo" />
                      Search
                    </label>
                  </div>
                </Menu.Item>
              </>
            )}
          </Grid>
        ) : (
          <Grid>
            <React.Fragment>
              <Menu.Item className="menu-item-left">
                {type === "data_console" && (
                  <>
                    <Image src="/images/data-console.svg" alt="Data Console" />
                  </>
                )}
                {type === "add_doc" && (
                  <>
                    <Image
                      className="backButton"
                      onClick={handleBack}
                      src="/images/Back.svg"
                      alt="Back Button"
                    />
                    <Image src="/images/Dataset.svg" alt="Datset" />
                  </>
                )}
                <label>
                  {navBarTitle.length < 25
                    ? navBarTitle
                    : navBarTitle.slice(0, 24) + "..." || "Default"}
                </label>
              </Menu.Item>
            </React.Fragment>
            {/*Desktop landing Page */}
            {type === "data_console" && (
              <>
                <Menu.Item className="menu-item-data-consoles">
                  <div className="tag">{showDatasetCount || 0} Datasets</div>
                </Menu.Item>
                <Menu.Item>
                  <div className="menu-item-search">
                    <input
                      type="text"
                      id="landingSearchDesktop"
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder=""
                    />
                    <label htmlFor="landingSearchDesktop">
                      <img src="/images/search.svg" alt="Logo" />
                      Search
                    </label>
                  </div>
                  {NavbarCollapse}
                </Menu.Item>
              </>
            )}
            {type === "add_doc" && (
              <>
                <Menu.Item className="searchItem">
                  <div className="menu-item-search searchBox">
                    <input
                      type="text"
                      id="addSearchDesktop"
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder="search"
                    />
                    <img src="/images/search.svg" alt="Logo"></img>
                  </div>
                </Menu.Item>
              </>
            )}
          </Grid>
        )}
      </Menu.Menu>

      {/* Right-aligned content */}
      <Menu.Menu position="right">
        <React.Fragment>
          {type === "data_console" && (
            <Menu.Item>
              <Button
                primary
                onClick={handleOpenDocUpload}
                className="button-data-console"
              >
                <div className="button-data-console-parent">
                  <Image
                    src="/images/white-base-icons.svg"
                    alt="Add new Dataset"
                  />
                  Add new Dataset
                </div>
              </Button>
            </Menu.Item>
          )}
          {/* <Menu.Item position="right">
            <img
              src="/images/filter.svg" // Using the imported delete image
              alt="Vie More"
              // onClick={() => handleDelete(row.id)}
              style={{ cursor: "pointer" }}
            />
          </Menu.Item> */}
        </React.Fragment>
      </Menu.Menu>
    </Menu>
  );
};

export default DataconsoleNavbar;
