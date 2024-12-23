import React, { useState, useEffect, useRef } from "react";
import { Modal, Header, Image, Input } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addDataSet,
  getDatasets,
  getDocumentSuccess,
  AddRequestSuccess,
  DatasetUsersDataSuccess,
} from "../../actions/dataConsoleAction";
import TableRowsLoader from "../Pagination/TableRowsLoader";
import PaginationDataTable from "../Pagination/PaginationDataTable";
import "../../styles/Dataset.css";
import Loader from "../../components/Loader";

const Dataset = ({
  OpenDocUpload,
  setOpenDocUpload,
  setDatsetCount,
  showToaster,
  dataFromChild,
}) => {
  const dispatch = useDispatch();
  const { loading, addDataSetResponseData, error } = useSelector(
    (state) => state.addDatasetReducer || {}
  );
  const { response } = useSelector(
    (state) => state.getlistDatasetReducer || {}
  );
  const [open, setOpen] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [lengthError, setLengthError] = useState(true);
  const [specialChar, setSpecialChar] = useState(true);
  const [datasetExistError, setDatasetExistError] = useState("");
  const [data, setData] = useState([]);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const isMounted = useRef(true);
  const [filterDocdata, setfilterDocdata] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [LoaderFlag, setLoaderFlag] = useState(false);

  const getDataSet = () => {
    try {
      dispatch(getDatasets());
      setfilterDocdata(true);
    } catch (error) {
      console.error("Error in getting DataSet:", error);
    }
  };

  useEffect(() => {
    setIsButtonEnabled(false);
    if (OpenDocUpload) {
      setOpen(true);
    }
    if (isMounted.current || deleteStatus) {
      dispatch(getDocumentSuccess([]));
      dispatch(DatasetUsersDataSuccess([]));
      getDataSet();
      isMounted.current = false;
      setDeleteStatus(false);
    }
    if (addDataSetResponseData.response && filterDocdata) {
      if (addDataSetResponseData.status === "success") {
        showToaster(addDataSetResponseData.response.message, "success");
        setLoaderFlag(false);
        getDataSet();
        setfilterDocdata(false);
        setInputValue("");
        handleClose();
        dispatch(AddRequestSuccess([]));
      } else {
        dispatch(AddRequestSuccess([]));
        setLoaderFlag(false);
        setOpen(true);
        setDatasetExistError(addDataSetResponseData.response.message);
      }
    }
  }, [dispatch, addDataSetResponseData, deleteStatus, OpenDocUpload]);

  useEffect(() => {
    if (response.length > 0) {
      setLoadingData(false);
      if (dataFromChild) {
        const fitleredData = response.filter((results) => {
          return results.datasetname
            .toString()
            .toLowerCase()
            .includes(dataFromChild);
        });
        if (fitleredData.length > 0) {
          setData(fitleredData);
        } else {
          setData([]);
        }
      } else {
        setData(response);
      }
    }
  }, [dataFromChild, response]);

  useEffect(() => {
    setIsButtonEnabled(false);
    setDatsetCount(response.length);
    if (response.length > 0) {
      setData(response);
    }
  }, [response]);

  const columns = [
    { id: "datasetname", label: "Dataset name" },
    { id: "files", label: "Documents" },
    { id: "users", label: "Users" },
    { id: "Lastupdated", label: "Last updated" },
  ];

  const columnsSkelton = [
    { id: "datasetname", label: "Dataset name" },
    { id: "files", label: "Documents" },
    { id: "users", label: "Users" },
    { id: "Lastupdated", label: "Last Updated" },
    { id: "action", label: "Action" },
  ];

  const handleClose = () => {
    setOpenDocUpload(false);
    setOpen(false);
    setDatasetExistError("");
    setInputValue("");
    setSpecialChar(true);
  };
  const handleCloseFlag = () => {
    setOpenDocUpload(false);
    setOpen(false);
    setDatasetExistError("");
    setSpecialChar(true);
  };

  const handleDataSet = async () => {
    if (isButtonEnabled) {
      const formDataObject = new FormData();
      formDataObject.append(
        "json",
        JSON.stringify({
          datasetname: inputValue,
        })
      );
      dispatch(addDataSet(formDataObject));
      handleCloseFlag();
      setLoaderFlag(true);
      setfilterDocdata(true);
      setSpecialChar(true);
    }
  };

  const handleChange = (event) => {
    setDatasetExistError("");
    const value = event.target.value;
    const sanitizedValue = value.replace(/[^\w\s]/gi, "");
    setInputValue(value);
    setSpecialChar(value !== sanitizedValue ? false : true);
    setLengthError(sanitizedValue.length > 50 ? false : true);

    lengthError && value == sanitizedValue && sanitizedValue.length > 0
      ? setIsButtonEnabled(true)
      : setIsButtonEnabled(false);
  };

  const actions = [
    { key: "text", text: "Text Only", value: "text" },
    { key: "file", text: "File Only", value: "file" },
  ];

  return (
    <div>
      {loadingData ? (
        <TableRowsLoader columns={columnsSkelton} rowsNum={10} />
      ) : data.length > 0 && !isMounted.current ? (
        <PaginationDataTable
          columns={columns}
          data={data}
          showToaster={showToaster}
          setDeleteStatus={setDeleteStatus}
          loaderFlag={LoaderFlag}
        />
      ) : (
        <>
          <div className="emptyContainer">
            <Image src="/images/empty-state.svg" alt="Empty State" />
            <p className="emptyMessage">
              <span className="titleMessage">No data available </span>
              <span> Add your first dataset</span>
            </p>
          </div>
        </>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        size="tiny"
        className="add-document-model"
      >
        <Modal.Content>
          <Header as="h3">Add new dataset</Header>
          <label>Dataset name</label>
          <br />
          <Input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Add name"
            className="add-datset-input"
          />
          <br />
          {inputValue.length > 0 && !lengthError && (
            <span style={{ color: "red" }}>
              &nbsp;Minimum limit 50 characters.
            </span>
          )}
          {!specialChar && (
            <span style={{ color: "red" }}>
              &nbsp;Special characters are not allowed.
            </span>
          )}
          {inputValue.length > 0 && datasetExistError.length > 0 && (
            <span style={{ color: "red" }}>&nbsp;{datasetExistError}</span>
          )}
        </Modal.Content>
        <Modal.Actions>
          <button className="cancel-btn" onClick={handleClose}>
            Cancel
          </button>
          <button
            disabled={!isButtonEnabled}
            className="add-btn"
            onClick={handleDataSet}
          >
            Add
          </button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default Dataset;
