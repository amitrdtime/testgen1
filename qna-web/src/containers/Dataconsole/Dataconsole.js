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
  Segment,
  Popup,
} from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addDocuments,
  getDocumentsDetails,
  getAllDocumentUsersData,
  getDatasetUsersData,
  AddDocumentUsersData,
  getDocumentSuccess,
  DatasetUsersDataSuccess,
  AddDatasetUsersDataSuccess,
  DeleteDocumentSuccess,
  requestSuccess,
  addSuccessPDFs,
  addSuccessPDFsSuccess,
} from "../../actions/dataConsoleAction";
import DocumentPaginationTable from "../Pagination/DocumentPaginationTable";
import UserPaginationTable from "../Pagination/UserPaginationTable";
import AddUserDocPaginationTable from "../Pagination/AddUserDocPaginationTable";
import TableRowsLoader from "../Pagination/TableRowsLoader";
import "../../styles/Dataconsole.css";
import DocUploadStatusModal from "./DocUploadStatusModal";
import { borderRadius } from "@mui/system";
import Loader from "../../components/Loader";

const DataConsole = ({
  setDatsetCount,
  showToaster,
  setnavTitle,
  dataFromChild,
}) => {
  const dispatch = useDispatch();
  const { datasetNameParam } = useParams();
  const isMounted = useRef(true);
  const { loading, addDocData, error } = useSelector(
    (state) => state.addDocReducer || {}
  );
  const { docListData } = useSelector((state) => state.getDocReducer || {});
  const { documentUserListData } = useSelector(
    (state) => state.documentUserList || {}
  );
  const { datasetUserListData } = useSelector(
    (state) => state.datasetUserList || {}
  );
  const { datasetUserAddData } = useSelector(
    (state) => state.AddDatasetUser || {}
  );
  const { datasetUserDeleteData } = useSelector(
    (state) => state.DeleteDatasetUser || {}
  );
  const { addSuccessPDFsData } = useSelector(
    (state) => state.addSuccessPDFs || {}
  );

  const [OpenDocUpload, setOpenDocUpload] = useState(false);
  const [UpdatedFiles, setUpdatedFiles] = useState(false);
  const [open, setOpen] = useState(false);
  const [openUserBox, setopenUserBox] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedAction, setSelectedAction] = useState("text");
  const [isButtonEnabled, setButtonEnabled] = useState(true);
  const [filesData, setfilesData] = useState([]);
  const [maxFilesSize, setmaxFilesSize] = useState("");
  const [maxFilesCount, setmaxFilesCount] = useState("");
  const [userData, setuserData] = useState([]);
  const [datasetUserData, setdatasetUserData] = useState([]);
  const [DocStatusArray, setDocStatusArray] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filterDocdata, setfilterDocdata] = useState(false);
  const [DeleteuserDataFlag, setDeleteuserDataFlag] = useState(false);
  const [selectedUsersData, setselectedUsersData] = useState([]);
  const [addUserFlag, setaddUserFlag] = useState(false);
  const [isFilesData, setisFilesData] = useState(true);
  const [isUserData, setisUserData] = useState(false);
  const [dataFromChildCheckbox, setDataFromChildCheckbox] = useState([]);
  const [DocUploadStatusFlag, setDocUploadStatusFlag] = useState(false);
  const [noRecordFound, setNoRecordFound] = useState(true);
  const [showDocumentError, setshowDocumentError] = useState(false);

  const userDatasetData =
    datasetUserListData.Users && datasetUserListData.Users.length > 0
      ? datasetUserListData.Users
      : [];

  const onDrop = (acceptedFiles) => {
    const maxSize = 5 * 1024 * 1024; //`${process.env.REACT_APP_MAXSIZE_DOCUMENT}` ;
    const validFiles = acceptedFiles.filter((file) => file.size <= maxSize);
    if (validFiles.length === 0) {
      setmaxFilesSize(
        "Please upload files with size less than or equal to 5 MB."
      );
      setshowDocumentError(true);
      return;
    }
    if (uploadedFiles.length > `${process.env.REACT_APP_MAXCOUNT_DOCUMENT}`) {
      setmaxFilesCount(
        "Upload limit exceeded, you can upload up to 20 documents at a time"
      );
      setshowDocumentError(true);
      return;
    }
    const files = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      files: file,
    }));

    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    onDrop,
  });
  const closeDocumentErrorBox = () => {
    setshowDocumentError(false);
  };

  const columnsHead = [
    { id: "filename", label: "Document" },
    { id: "extractiontype", label: "Extraction Type" },
  ];
  const columnsSkelton = [
    { id: "filename", label: "Document" },
    { id: "extractiontype", label: "Extraction Type" },
    { id: "action", label: "Action" },
  ];

  const userColumns = [{ id: "displayName", label: "Name" }];

  const datasetUserColumns = [{ id: "username", label: "Name" }];
  const datasetUserColumnsSkelton = [
    { id: "username", label: "Name" },
    { id: "action", label: "Action" },
  ];

  useEffect(() => {
    if (isMounted.current) {
      fetchData();
      fetchAllUsersData();
      fetchDatasetUsersData();
      isMounted.current = false;
      dispatch(DatasetUsersDataSuccess([]));
      dispatch(getDocumentSuccess([]));
    }
  }, []);

  //set user dataset Users
  useEffect(() => {
    if (documentUserListData.status_code == 200) {
      let filterData = documentUserListData.Users.filter((search) => {
        return search.displayName
          .toString()
          .toLowerCase()
          .includes(inputValue.toString().toLowerCase());
      });
      setuserData(filterData);
    }
    setnavTitle(datasetNameParam);
    setDatsetCount(filesData.length);
  }, [documentUserListData, datasetNameParam, filesData, inputValue]);

  useEffect(() => {
    if (userDatasetData.length > 0) {
      setisUserData(true);
      if (dataFromChild) {
        let filterData = userDatasetData.filter((find) => {
          return find.username.toString().toLowerCase().includes(dataFromChild);
        });
        if (filterData.length > 0) {
          setdatasetUserData(filterData);
        } else {
          setisUserData(false);
          setdatasetUserData([]);
        }
      } else {
        setdatasetUserData(userDatasetData);
      }
    } else {
      setisUserData(false);
    }
  }, [userDatasetData, dataFromChild]);

  // Add Document
  useEffect(() => {
    if (addDocData.status_code === 200 && filterDocdata) {
      filterDocumentStatus(DocStatusArray);
      fetchData();
      setfilterDocdata(false);
      const requestData = {
        datasetname: datasetNameParam,
        files: addDocData.sucess_pdfs,
        extraction_method: "simple",
      };

      dispatch(addSuccessPDFs(requestData));
      dispatch(requestSuccess([]));
    }
    if (addDocData.status_code === 500 && filterDocdata) {
      filterDocumentStatus(DocStatusArray);
      showToaster(addDocData.message, "error");
      setDocUploadStatusFlag(false);
      setDocStatusArray([]);
      setfilterDocdata(false);
      dispatch(requestSuccess([]));
    }
  }, [addDocData, filterDocdata, DocStatusArray]);

  useEffect(() => {
    if (addSuccessPDFsData.status_code === 200) {
      fetchData();
      dispatch(addSuccessPDFsSuccess([]));
    }
  }, [addSuccessPDFsData]);

  //update document list
  useEffect(() => {
    if (docListData.length > 0) {
      if (dataFromChild) {
        let filter = docListData.filter((search) => {
          return search.filename
            .toString()
            .toLowerCase()
            .includes(dataFromChild);
        });
        if (filter.length > 0) {
          setfilesData(filter);
        } else {
          setisFilesData(false);
          setfilesData([]);
        }
      } else {
        setfilesData(docListData);
      }
    }
    if (docListData.length === 0) {
      setfilesData([]);
    }
    if (docListData.code === "404") {
      setisFilesData(false);
    }
  }, [docListData, dataFromChild]);

  //open model
  useEffect(() => {
    if (OpenDocUpload) {
      setOpen(true);
    }
  }, [OpenDocUpload]);

  //delete document
  useEffect(() => {
    if (UpdatedFiles) {
      fetchData();
      setUpdatedFiles(false);
    }
  }, [UpdatedFiles]);

  //Add user
  useEffect(() => {
    if (addUserFlag && datasetUserAddData) {
      if (datasetUserAddData.status_code === 200) {
        showToaster(datasetUserAddData.message, "success");
        setaddUserFlag(false);
        fetchDatasetUsersData();
        fetchAllUsersData();
        dispatch(AddDatasetUsersDataSuccess());
      }
    }
  }, [addUserFlag, datasetUserAddData]);

  //delete User
  useEffect(() => {
    if (DeleteuserDataFlag && datasetUserDeleteData) {
      if (datasetUserDeleteData.status_code === 200) {
        fetchAllUsersData();
        fetchDatasetUsersData();
        setDeleteuserDataFlag(false);
        dispatch(DeleteDocumentSuccess());
      }
      showToaster("User Deleted successfully!", "success");
    }
  }, [DeleteuserDataFlag, datasetUserDeleteData]);

  //uploaded Files
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      setButtonEnabled(true);
    } else {
      setButtonEnabled(false);
    }
  }, [uploadedFiles]);

  const filterDocumentStatus = (DocArray) => {
    try {
      DocArray.forEach((item) => {
        const { documentName } = item;
        if (
          addDocData.duplicate_pdfs.includes(documentName) &&
          item.responseUpdated === 0
        ) {
          item.status = 2;
          item.error = `${process.env.REACT_APP_DOCUMENT_SAME_FILE_ERROR}`;
          item.responseUpdated = 1;
        } else if (
          addDocData.failed_pdfs.includes(documentName) &&
          item.responseUpdated === 0
        ) {
          item.status = 2;
          item.error = `${process.env.REACT_APP_DOCUMENT_VALID_FILE_ERROR}`;
          item.responseUpdated = 1;
        } else if (
          addDocData.large_files.includes(documentName) &&
          item.responseUpdated === 0
        ) {
          item.status = 2;
          item.error = `${process.env.REACT_APP_DOCUMENT_LARGE_FILE_ERROR}`;
          item.responseUpdated = 1;
        } else if (
          addDocData.rejected_files.includes(documentName) &&
          item.responseUpdated === 0
        ) {
          item.status = 2;
          item.error = `${process.env.REACT_APP_DOCUMENT_EXTRACTION_FILE_ERROR}`;
          item.responseUpdated = 1;
        } else if (
          addDocData.sucess_pdfs.includes(documentName) &&
          item.responseUpdated === 0
        ) {
          item.status = 1;
          item.error = "";
          item.responseUpdated = 1;
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const formData = new FormData();
      formData.append(
        "json",
        JSON.stringify({
          datasetname: datasetNameParam,
        })
      );
      setUpdatedFiles(false);
      setfilterDocdata(false);
      dispatch(getDocumentsDetails(formData));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAllUsersData = async () => {
    try {
      const payload = {
        datasetname: datasetNameParam,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      dispatch(getAllDocumentUsersData(payload));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDatasetUsersData = async () => {
    try {
      const payload = {
        datasetname: datasetNameParam,
      };
      dispatch(getDatasetUsersData(payload));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenDocUpload = () => {
    setOpenDocUpload(!OpenDocUpload);
  };

  const handleOpenUserUpload = () => {
    setopenUserBox(true);
  };

  const handleAddUser = () => {
    setopenUserBox(false);
    try {
      const payload = {
        dataset_name: datasetNameParam,
        emails_id_attached: dataFromChildCheckbox.map((user) => ({
          displayName: user.displayName,
          mail: user.mail,
          id: user.id,
        })),
      };
      dispatch(AddDocumentUsersData(payload));
      setaddUserFlag(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClose = () => {
    setUploadedFiles([]);
    setOpenDocUpload(false);
    setopenUserBox(false);
    setOpen(false);
    setshowDocumentError(false);
  };

  const handleRemoveFile = (id) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const handleActionChange = (_, { value }) => {
    setSelectedAction(value);
  };

  const handleCloseDocStatusModal = () => {
    setDocUploadStatusFlag(false);
    setDocStatusArray([]);
  };

  const updateDocStatusArray = (newArray) => {
    setDocStatusArray((prevArray) => [...prevArray, ...newArray]);
  };

  const handleUpload = async () => {
    setOpen(false);
    setOpenDocUpload(false);
    setUploadedFiles([]);
    try {
      const formData = new FormData();
      formData.append(
        "json",
        JSON.stringify({
          username: "vivek",
          datasetname: datasetNameParam,
          extractiontype: "Text only",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        })
      );
      uploadedFiles.forEach((data) => {
        formData.append("files", data.files);
      });
      setfilterDocdata(true);
      setDocUploadStatusFlag(true);
      const docArray = uploadedFiles.flatMap((item) => ({
        documentName: item.files.name,
        status: 0,
        responseUpdated: 0,
        error: "",
      }));
      updateDocStatusArray(docArray);
      dispatch(addDocuments(formData));
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const actions = [
    { key: "text", text: "PDF Containing Text Only", value: "text" },
    // { key: "file", text: "PDF Containing Text+Image", value: "image" },
  ];

  const handleDataFromChild = (data) => {
    setDataFromChildCheckbox(data);
  };

  return (
    <div>
      <Grid columns={2} stackable>
        <Grid.Row>
          <Grid.Column className="documentsCard">
            <Segment>
              <Grid>
                <Grid.Row
                  className="flexSP cardHeader"
                  columns={4}
                  verticalAlign="middle"
                >
                  <div className="flexAli">
                    <Grid.Column>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Image src="/images/Document.svg" alt="Document" />
                        <span
                          className="cardHeading"
                          style={{ marginLeft: "8px" }}
                        >
                          Documents
                        </span>
                      </div>
                    </Grid.Column>
                    <Grid.Column>
                      <div className="tag">{filesData.length} Documents</div>
                    </Grid.Column>
                  </div>
                  <Grid.Column className="lastFlex">
                    <Button
                      onClick={handleOpenDocUpload}
                      className="button-data-console"
                    >
                      <div className="button-data-console-parent">
                        <Image
                          src="/images/base-icons.svg"
                          alt="Add new Dataset"
                        />
                        Add
                      </div>
                    </Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>

              {filesData.length > 0 ? (
                <>
                  <DocumentPaginationTable
                    columns={columnsHead}
                    datas={filesData}
                    setUpdatedFiles={setUpdatedFiles}
                    showToaster={showToaster}
                  />
                </>
              ) : (
                <>
                  {isFilesData ? (
                    <TableRowsLoader
                      className="files-skelton"
                      columns={columnsSkelton}
                      rowsNum={8}
                    />
                  ) : (
                    <div className="emptyContainer">
                      <Image src="/images/empty-state.svg" alt="Empty State" />
                      <p className="emptyMessage">
                        <span className="titleMessage">
                          No Documents available{" "}
                        </span>
                        <span> Add your first dataset</span>
                      </p>
                    </div>
                  )}
                </>
              )}
            </Segment>
          </Grid.Column>
          <Grid.Column className="usersCard">
            <Segment>
              <Grid>
                <Grid.Row
                  className="flexSP cardHeader"
                  columns={4}
                  verticalAlign="middle"
                >
                  <div className="flexAli">
                    <Grid.Column>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Image src="/images/user.svg" alt="Users" />
                        <span
                          className="cardHeading"
                          style={{ marginLeft: "8px" }}
                        >
                          Users
                        </span>
                      </div>
                    </Grid.Column>
                    <Grid.Column>
                      <div className="tag">{datasetUserData.length} Users</div>
                    </Grid.Column>
                  </div>
                  <Grid.Column className="lastFlex">
                    <Button
                      onClick={handleOpenUserUpload}
                      className="button-data-console"
                    >
                      <div className="button-data-console-parent">
                        <Image
                          src="/images/base-icons.svg"
                          alt="Add new Dataset"
                        />
                        Add
                      </div>
                    </Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              {datasetUserData.length == 0 && isUserData ? (
                <>
                  <TableRowsLoader
                    columns={datasetUserColumnsSkelton}
                    rowsNum={5}
                  />
                </>
              ) : (
                <>
                  {datasetUserData.length > 0 ? (
                    <UserPaginationTable
                      columns={datasetUserColumns}
                      data={datasetUserData}
                      loaderFlag={addUserFlag}
                      setDeleteuserDataFlag={setDeleteuserDataFlag}
                    />
                  ) : (
                    <div className="emptyContainer">
                      {addUserFlag && <Loader />}
                      <Image src="/images/empty-state.svg" alt="Empty State" />
                      <p className="emptyMessage">
                        <span className="titleMessage">No data available</span>
                        <span>Add the first user</span>
                      </p>
                    </div>
                  )}
                </>
              )}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid></Grid>

      <Modal
        open={open}
        onClose={handleClose}
        size="tiny"
        className="add-document-model"
      >
        <Modal.Content>
          <Header as="h3">Add Document</Header>
          <Header as="h5">Extraction Type</Header>
          <Dropdown
            placeholder="Select Action"
            options={actions}
            selection
            onChange={handleActionChange}
            value={selectedAction}
            style={{ marginBottom: "10px", width: "100%" }}
          />

          <Header as="h5">
            PDF
            <Popup
              inverted
              position="right center"
              trigger={
                <Image
                  className="pdfHoverImg"
                  src="/images/Info.svg"
                  alt="Info"
                />
              }
              style={{ borderRadius: "15px" }}
            >
              <div>
                <div>You can only upload</div>
                <div>20 documents</div>
              </div>
            </Popup>
          </Header>
          {uploadedFiles.length > 0 && (
            <>
              <List divided relaxed className="uploadBox">
                {uploadedFiles.map((file) => (
                  <List.Item key={file.id}>
                    <List.Content>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <List.Header
                          style={{
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {file.name}
                        </List.Header>
                        <List.Description style={{ marginRight: "10px" }}>
                          {formatBytes(file.size)}
                        </List.Description>
                        <Image
                          className="tableButton"
                          src="/images/grey-circle-close.svg"
                          alt="Upload"
                        />
                        <Image
                          className="tableButtonHover"
                          src="/images/red-circle-delete.svg"
                          alt="Upload"
                          onClick={() => handleRemoveFile(file.id)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </>
          )}
          {showDocumentError && (
            <div className="document-error-msg">
              <div>
                <Image src="/images/Alert red.svg" alt="Info" />
              </div>
              <div className="doc-error-message">
                {maxFilesSize && <p>{maxFilesSize}</p>}
                {maxFilesCount && <p>{maxFilesCount}</p>}
              </div>
              <div onClick={closeDocumentErrorBox}>
                <Image src="/images/Close red.svg" alt="Close" />
              </div>
            </div>
          )}

          <div className="dragBox" {...getRootProps()} style={dropzoneStyles}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop files here...</p>
            ) : (
              <>
                <div className="upload-button-div">
                  <Image src="/images/blue-upload.svg" alt="Upload" />
                  <div>Upload</div>
                </div>
                <p>or</p>
                <p>Drag and drop pdf here</p>
                <p>Max file size: 5Mb</p>
              </>
            )}
          </div>
        </Modal.Content>
        <Modal.Actions>
          <button className="cancel-btn" onClick={handleClose}>
            Cancel
          </button>
          <button
            disabled={!isButtonEnabled}
            className="add-btn"
            onClick={handleUpload}
          >
            Add
          </button>
        </Modal.Actions>
      </Modal>

      <Modal
        open={openUserBox}
        onClose={handleClose}
        size="tiny"
        className="add-document-model addUserPopup"
      >
        <Modal.Content>
          <Header as="h3">Add User</Header>
          <div className="menu-item-search searchBox">
            <input
              type="text"
              id="addUserPopup"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder=" Search "
            />
            <img src="/images/search.svg" alt="Logo"></img>
          </div>

          {userData.length > 0 ? (
            <AddUserDocPaginationTable
              columns={userColumns}
              data={userData}
              setselectedUsersData={setselectedUsersData}
              selectedUsers={selectedUsersData}
              onDataFromChild={handleDataFromChild}
            />
          ) : (
            <div className="emptyContainer">
              <Image src="/images/empty-state.svg" alt="Empty State" />
              <p className="emptyMessage">
                <span className="titleMessage">No data available </span>
              </p>
            </div>
          )}
        </Modal.Content>
        <Modal.Actions>
          <button className="cancel-btn" onClick={handleClose}>
            Cancel
          </button>
          <button
            disabled={!dataFromChildCheckbox.length > 0}
            className="add-btn"
            onClick={handleAddUser}
          >
            Add
          </button>
        </Modal.Actions>
      </Modal>

      {DocUploadStatusFlag && (
        <DocUploadStatusModal
          documents={DocStatusArray}
          onClose={handleCloseDocStatusModal}
        />
      )}
    </div>
  );
};

const dropzoneStyles = {
  border: "2px dashed #d3d3d3",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)));
  return Math.round(bytes / Math.pow(k, i)) + " " + sizes[i];
};

export default DataConsole;
