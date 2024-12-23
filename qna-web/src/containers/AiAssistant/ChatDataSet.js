import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Button,
  Icon,
  List,
  Dropdown,
  Header,
  Image,
  Grid,
  Input,
  Form,
  Radio,
} from "semantic-ui-react";

import { useDispatch, useSelector } from "react-redux";
import { getRadioDataActionSet } from "../../actions/dataConsoleAction";
import axios from "axios";
import "../../styles/ChatScreen.css";
import "semantic-ui-css/semantic.min.css";
import { size } from "@floating-ui/core";
import { useNavigate } from "react-router-dom";

const ChatDataSet = () => {
  const dispatch = useDispatch();
  const { responseRadioDataList } = useSelector(
    (state) => state.listDatasetRadioReducer || {}
  );
  const isMounted = useRef(true);
  const [selectedValues, setSelectedValues] = useState("");
  const [radioValues, setRadioValues] = useState(null);
  const [isHandleSetDisabled, setIsHandleSetDisabled] = useState(false);
  const [UserDatsetCheckFlag, setUserDatsetCheckFlag] = useState(false);
  const [filteredDataSet, setFilteredDataSet] = useState({});
  const [datasetOptions, setDatasetOptions] = useState({});
  const [loginedUserName, setloginedUserName] = useState("");
  const [loginedUserType, setloginedUserType] = useState("");
  const currentUserType = useSelector((state) => state.auth.user);
  const userToken = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    setloginedUserName(userToken.name);
    setloginedUserType(currentUserType);
    if (isMounted.current && userToken && currentUserType) {
      getRadioDataSet(
        currentUserType,
        userToken.extension_UserEmail,
        userToken.oid
      );
      isMounted.current = false;
    }
  }, [currentUserType, userToken]);

  const getRadioDataSet = (UserType, userEmail, userOid) => {
    try {
      const formDataObject = new FormData();
      formDataObject.append(
        "json",
        JSON.stringify({
          email: userEmail,
          role: UserType,
          user_id: userOid,
        })
      );
      dispatch(getRadioDataActionSet(formDataObject));
    } catch (error) {
      console.error("Error in getting DataSet:", error);
    }
  };

  useEffect(() => {
    if (radioValues || selectedValues) {
      setIsHandleSetDisabled(true);
    }
    if (responseRadioDataList && responseRadioDataList.status === "success") {
      getFilteredRadio(responseRadioDataList.data);
      setUserDatsetCheckFlag(false);
    }
    if (responseRadioDataList && responseRadioDataList.status === "fail") {
      setUserDatsetCheckFlag(true);
    }
  }, [dispatch, radioValues, selectedValues, responseRadioDataList]);

  const getFilteredRadio = (response) => {
    let dataset = "";
    let radioDataSet = "";
    if (response.length > 0) {
      dataset = response.map((dataset) => {
        return {
          text: dataset,
          value: dataset,
        };
      });
      radioDataSet = response;
      let rows = [];
      rows = radioDataSet.slice(0, 4).reduce(function (rows, key, index) {
        return (
          (index % 2 == 0
            ? rows.push([key])
            : rows[rows.length - 1].push(key)) && rows
        );
      }, []);
      setDatasetOptions(dataset);
      setFilteredDataSet(rows);
    }
  };

  const handleDropdownChange = (event, { value }) => {
    setSelectedValues(value);
    setRadioValues(null);
  };

  const handleChange = (event, { value }) => {
    setRadioValues({ value });
    setSelectedValues(null);
  };

  const handleDataSet = async () => {
    if (isHandleSetDisabled) {
      if (selectedValues === null) {
        navigate(`/ai-assistant?c=${radioValues.value}`);
      } else {
        navigate(`/ai-assistant?c=${selectedValues}`);
      }
    }
  };

  const isEmpty = (value) => {
    return (
      value == null || (typeof value === "string" && value.trim().length === 0)
    );
  };

  const handleTableRowClick = (value) => {
    setRadioValues({ value });
    setSelectedValues(null);
  };

  return (
    <>
      <div className="ui card chat-screen">
        <Header as="h3">New Chat</Header>
        {datasetOptions.length > 0 ? (
          <>
            <Header as="h5">Select data set</Header>
            <Dropdown
              placeholder="Select"
              search
              selection
              options={datasetOptions.length > 0 ? datasetOptions : ""}
              onChange={handleDropdownChange}
              value={selectedValues}
              clearable
              allowAdditions // added here
              selectOnBlur={false} // and here
              className="dropdown-dataset"
            />
          </>
        ) : (
          <>
            {UserDatsetCheckFlag ? (
              <>
                <Header as="h5" className="no-dataset-header">
                  Select data set
                </Header>
                <Dropdown
                  className="dropdown-dataset no-dataset-dropdown"
                  placeholder="No datasets available"
                  disabled
                />
              </>
            ) : (
              <Grid className="skelton-dataset-grid">
                <Grid.Row>
                  <Grid.Column
                    className="skelton-dataset-grid-column"
                    width={8}
                  >
                    <Form.Field>
                      <div className="skeleton-view skelton-dataset-grid-div"></div>
                    </Form.Field>
                  </Grid.Column>
                  <Grid.Column
                    width={8}
                    className="skelton-dataset-grid-column"
                  >
                    <Form.Field>
                      <div className="skeleton-view skelton-dataset-grid-div"></div>
                    </Form.Field>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            )}
          </>
        )}
        {filteredDataSet.length > 0 ? (
          <>
            <Header className="newChatRadioHead" as="h5">
              or Add from recently added in <span>Data Console</span>
            </Header>
            <br />
          </>
        ) : (
          <>
            {UserDatsetCheckFlag ? (
              ""
            ) : (
           
                <Grid className="skelton-dataset-grid skelton-dataset-grid-empty" >
                <Grid.Row>
                  <Grid.Column
                    className="skelton-dataset-grid-column"
                    width={8}
                  >
                    <Form.Field>
                      <div className="skeleton-view skelton-dataset-grid-div"></div>
                    </Form.Field>
                  </Grid.Column>
                  <Grid.Column
                    width={8}
                    className="skelton-dataset-grid-column"
                  >
                    <Form.Field>
                      <div className="skeleton-view skelton-dataset-grid-div"></div>
                    </Form.Field>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            )}
          </>
        )}
        <Grid>
          {filteredDataSet.length > 0 ? (
            filteredDataSet.map((vals, index) => {
              return (
                <Grid.Row key={index}>
                  {vals.map((val, index2) => {
                    return (
                      <Grid.Column width={8} key={index2}>
                        <Form.Field onClick={() => handleTableRowClick(val)}>
                          <Radio
                            className="datasetRadioOption"
                            label={
                              val.length < 20 ? val : val.slice(0, 18) + "..."
                            }
                            name="radioGroup"
                            value={val}
                            checked={
                              !isEmpty(radioValues)
                                ? radioValues.value === val
                                : ""
                            }
                            onChange={handleChange}
                          />
                        </Form.Field>
                      </Grid.Column>
                    );
                  })}
                </Grid.Row>
              );
            })
          ) : (
            <>
              {!UserDatsetCheckFlag && (
                <>
                  <Grid.Row className="skelton-chat-radio-row">
                    <Grid.Column
                      width={8}
                      className="skelton-chat-radio-column"
                    >
                      <Form.Field>
                        <div className="skeleton-view skelton-chat-radio-column-div"></div>
                      </Form.Field>
                    </Grid.Column>
                    <Grid.Column
                      width={8}
                      className="skelton-chat-radio-column"
                    >
                      <Form.Field>
                        <div className="skeleton-view skelton-chat-radio-column-div"></div>
                      </Form.Field>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column
                      width={8}
                      className="skelton-chat-radio-column"
                    >
                      <Form.Field>
                        <div className="skeleton-view skelton-chat-radio-column-div"></div>
                      </Form.Field>
                    </Grid.Column>
                    <Grid.Column
                      width={8}
                      className="skelton-chat-radio-column"
                    >
                      <Form.Field>
                        <div className="skeleton-view skelton-chat-radio-column-div"></div>
                      </Form.Field>
                    </Grid.Column>
                  </Grid.Row>
                </>
              )}
            </>
          )}
        </Grid>

        <Modal.Actions>
          <button
            disabled={!isHandleSetDisabled}
            className="continue-btn"
            onClick={handleDataSet}
          >
            Continue
          </button>
        </Modal.Actions>
      </div>
    </>
  );
};

export default ChatDataSet;
