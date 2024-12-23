// AiAssistant.jsx
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
  Segment,
  Checkbox,
} from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDatasets,
  getChatHistoryByFilter,
} from "../../actions/dataConsoleAction";
import ChatDataSet from "./ChatDataSet";
import ChatBot from "./ChatBot";
import { useLocation } from "react-router-dom";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import Moment from "react-moment";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";
import "../../styles/AiAssistant.css";
import moment from "moment";

const AiAssistant = ({
  filterPopUp,
  setFilterPopUp,
  onDataFromChild,
  onFilteredDataFromChild,
  resetFilterStartDate,
  isFilterPopUpClick,
  isClearFiltered,
}) => {
  const dispatch = useDispatch();
  const { response } = useSelector(
    (state) => state.getlistDatasetReducer || {}
  );

  const { filterData } = useSelector(
    (state) => state.chatHistoryFilterData || {}
  );

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const chatBotQueryParam = queryParams.get("c");
  const [data, setData] = useState([]);
  const isMounted = useRef(true);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selection, setSelection] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [isHandleSetDisabled, setIsHandleSetDisabled] = useState(false);

  const getDataSet = () => {
    try {
      dispatch(getDatasets());
    } catch (error) {
      console.error("Error in getting DataSet:", error);
    }
  };

  useEffect(() => {
    if (response.length > 0) {
      setData(response);
    }

    if (filterPopUp) {
      setOpenPopUp(true);
    }

    if (isMounted.current) {
      getDataSet();
      isMounted.current = false;
    }

    if (resetFilterStartDate) {
      if (
        resetFilterStartDate.hasOwnProperty("startDate") &&
        resetFilterStartDate.startDate == null
      ) {
        setStartDate(resetFilterStartDate.startDate);
        handleFilterData("start_date");
      }

      if (
        resetFilterStartDate.hasOwnProperty("endDate") &&
        resetFilterStartDate.endDate == null
      ) {
        setEndDate(resetFilterStartDate.endDate);
        handleFilterData("end_date");
      }

      if (
        resetFilterStartDate.hasOwnProperty("datasets") &&
        resetFilterStartDate.datasets == null
      ) {
        setSelectedValues(resetFilterStartDate.datasets);
        handleFilterData("datasets");
      }

      setIsHandleSetDisabled(true);
    }
  }, [dispatch, response, filterPopUp, resetFilterStartDate]);

  useEffect(() => {
    if (filterData) {
      const newStartDate = new Date(startDate);
      const newEndDate = new Date(endDate);
      onDataFromChild(filterData);
      onFilteredDataFromChild({
        startDate: startDate ? moment(newStartDate).format("DD/MM/YYYY") : "",
        endDate: endDate ? moment(newEndDate).format("DD/MM/YYYY") : "",
        datasets: selectedValues,
        filter: true,
      });
    }
  }, [filterData]);

  useEffect(() => {
    if (isClearFiltered) {
      sortHandleCloseOnCancel();
    }
  }, [isClearFiltered]);

  const toggleSelection = (e, { label, checked }) => {
    if (checked) {
      setSelection([...selection, label]);
    } else {
      setSelection(selection.filter((el) => el !== label));
    }
  };

  const onChangeStartDate = (event, data) => {
    const newDateValue = new Date(data.value);
    setStartDate(data.value);
    checkAddButtonDisabled();
  };
  const onChangeEndDate = (event, data) => {
    setEndDate(data.value);
    checkAddButtonDisabled();
  };

  const checkAddButtonDisabled = () => {
    if ((!startDate || !endDate) && selectedValues.length == 0) {
      setIsHandleSetDisabled(false);
    } else {
      setIsHandleSetDisabled(true);
    }
  };

  const handleActionChange = (_, { value }) => {
    setSelectedAction(value);
    checkAddButtonDisabled();
  };

  const clearFilter = () => {
    setIsHandleSetDisabled(false);
    setStartDate("");
    setEndDate("");
    setSelectedAction("");
    setSelectedValues([]);
  };

  const sortHandleClose = () => {
    setOpenPopUp(false);
    setFilterPopUp(false);
  };

  const sortHandleCloseOnCancel = () => {
    setStartDate("");
    setEndDate("");
    setSelectedAction("");
    setSelectedValues([]);
    setOpenPopUp(false);
    setFilterPopUp(false);
    setIsHandleSetDisabled(false);
  };

  const handleDropdownChange = (event, { value }) => {
    setSelectedValues(value);
    value.length > 0 || (startDate && endDate)
      ? setIsHandleSetDisabled(true)
      : setIsHandleSetDisabled(false);
  };

  const actions = [
    { key: "s", text: "Select", value: "" },
    { key: "a", text: "A to Z", value: "A to Z" },
    { key: "z", text: "Z to A", value: "Z to A" },
  ];

  let datasetOptions = [];
  if (response && response.length > 0) {
    datasetOptions = response.map((dataset) => {
      return { text: dataset.datasetname, value: dataset.datasetname };
    });
  }

  const handleClose = () => {
    setOpenPopUp(false);
    setFilterPopUp(false);
  };

  const handleFilterData = async (start_date = "") => {
    if (isHandleSetDisabled) {
      const newStartDate = startDate ? new Date(startDate).toISOString() : "";
      const newEndDate = endDate ? new Date(endDate).toISOString() : "";
      const formDataObject = new FormData();
      formDataObject.append(
        "json",
        JSON.stringify({
          dates: [
            startDate && start_date !== "start_date" ? newStartDate : "",
            endDate && start_date !== "end_date" ? newEndDate : "",
          ],
          datasets:
            selectedValues && start_date !== "datasets" ? selectedValues : [],
          sort:
            !selectedAction || selectedAction == undefined
              ? "A to Z"
              : selectedAction,
        })
      );
      dispatch(getChatHistoryByFilter(formDataObject));
      sortHandleClose();
      isFilterPopUpClick(true);
    }
  };
  const chatConversationParam = queryParams.get("cid");
  const today = new Date();

  return (
    <div className="ai-assistant">
      <div className="ai-chat-box">
        {chatBotQueryParam || chatConversationParam ? (
          <ChatBot />
        ) : (
          <>
            <ChatDataSet />
            <div className="input-with-icon asAssistantSearchBoxFull">
              <div className="input-with-icon asAssistantSearch">
                <Input fluid placeholder="Ask question" disabled />
                <Image
                  className="icon-image"
                  src="/images/grey-send.svg"
                  alt="New Chat"
                />
              </div>
            </div>
          </>
        )}
      </div>
      <Modal
        open={openPopUp}
        onClose={handleClose}
        size="tiny"
        className="add-document-model filterPopup"
      >
        <Modal.Content>
          <Header as="h3">
            Filter and sort by
            <span
              style={{ color: "red", fontSize: "12px", cursor: "pointer" }}
              onClick={clearFilter}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Clear all
            </span>
          </Header>
          <Header as="h5">Date</Header>
          <div className="filterDate">
            <div className="dateFromOuter">
              <SemanticDatepicker
                className="field dateFrom"
                format="DD/MM/YYYY"
                value={startDate}
                onChange={onChangeStartDate}
                calendarIcon={
                  <img
                    src="/images/search.svg"
                    alt="Logo"
                    style={{ cursor: "pointer" }}
                  />
                }
                maxDate={endDate ? endDate : today}
                inputProps={{ style: { cursor: "pointer" } }} // Add cursor pointer to input element
              />{" "}
            </div>
            <div className="filterTo">To </div>
            <div className="dateFromOuter">
              <SemanticDatepicker
                format="DD/MM/YYYY"
                value={endDate}
                onChange={onChangeEndDate}
                className="field dateTo"
                calendarIcon={
                  <img
                    src="/images/search.svg"
                    alt="Logo"
                    style={{ cursor: "pointer" }}
                  />
                }
                minDate={startDate}
                maxDate={today}
              />
            </div>
          </div>
          <Header as="h5">Sort by</Header>
          <Dropdown
            placeholder="Select"
            options={actions}
            selection
            onChange={handleActionChange}
            value={selectedAction}
            style={{ marginBottom: "10px", width: "100%" }}
            calendarIcon={<img src="/images/search.svg" alt="Logo" />}
          />
          <Header as="h5">Dataset</Header>
          <Dropdown
            placeholder="Select"
            fluid
            multiple
            search
            selection
            options={datasetOptions}
            onChange={handleDropdownChange}
            value={selectedValues}
            style={{ marginBottom: "10px", width: "100%", cursor: "pointer" }}
          />
        </Modal.Content>
        <Modal.Actions>
          <button className="cancel-btn" onClick={sortHandleClose}>
            Cancel
          </button>
          <button
            disabled={!isHandleSetDisabled}
            className="add-btn"
            onClick={handleFilterData}
          >
            Continue
          </button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default AiAssistant;
