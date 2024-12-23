import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { Modal, Header, Popup } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  dltDocumentFile,
  viewDocumentFile,
  deleteSuccess,
  requestViewSuccess,
} from "../../actions/dataConsoleAction";
import Loader from "../../components/Loader";

const DocumentPaginationTable = ({
  columns,
  datas,
  setUpdatedFiles,
  showToaster,
}) => {
  const dispatch = useDispatch();
  const { datasetNameParam } = useParams();
  const { loading, viewData, error } = useSelector(
    (state) => state.viewFileReducer || {}
  );
  const { deleteData } = useSelector((state) => state.dltFileReducer || {});
  const [page, setPage] = useState(0);
  const [deleteFileName, setdeleteFileName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(
    parseInt(`${process.env.REACT_APP_ROWSPERPAGE}`)
  ); // Default rows per page
  const [openDeleteBox, setopenDeleteBox] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [deleteFlag, setdeleteFlag] = useState(false);
  const [loaderFlag, setloaderFlag] = useState(false);
  const [loginedUserName, setloginedUserName] = useState("");
  const userToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    setloginedUserName(userToken.name);
  }, [userToken]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (deleteData.status_code === 200 && deleteFlag) {
      setUpdatedFiles(true);
      setdeleteFlag(false);
      setloaderFlag(false);
      showToaster(
        `${deleteFileName.filename} Deleted successfully!`,
        "success"
      );
      dispatch(deleteSuccess([]));
    }
    if (deleteFlag) {
      setUpdatedFiles(true);
    }
  }, [deleteData, deleteFlag, dispatch]);

  const getLastUriPart = (url) => {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    return decodeURIComponent(lastPart.replace(/\s/g, ""));
  };

  useEffect(() => {
    if (viewData.status_code === 200) {
      const downloadFile = async () => {
        const fileUrl = viewData.sas_url;
        try {
          const response = await fetch(fileUrl);
          const blob = await response.blob();
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = getLastUriPart(fileUrl);
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(link.href);
        } catch (error) {
          console.error("Error downloading file:", error);
        }
      };

      downloadFile();
      dispatch(requestViewSuccess([]));
    }
  }, [viewData]);

  const handleEdit = (value) => {
    console.log(`Deleting row with ID ${JSON.stringify(value)}`);
    try {
      const requestBody = {
        datasetname: datasetNameParam,
        filename: value.filename,
        username: loginedUserName,
      };
      dispatch(viewDocumentFile(requestBody));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleDelete = async (value) => {
    setdeleteFileName(value);
    setopenDeleteBox(true);
  };

  const actionDeleteDocument = async () => {
    setopenDeleteBox(false);
    setdeleteFlag(true);
    const fileData = deleteFileName;
    try {
      const requestBody = {
        datasetname: datasetNameParam,
        filename: fileData.filename,
        username: loginedUserName,
      };
      setloaderFlag(true);
      dispatch(dltDocumentFile(requestBody));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleClose = () => {
    setopenDeleteBox(false);
  };

  const totalItems = datas.length;

  return (
    <>
      {loaderFlag && <Loader />}
      <Paper
        sx={{ height: "100vh", overflowX: "auto" }}
        style={{ boxShadow: "none" }}
      >
        <TableContainer style={{ border: "none" }}>
          <Table style={{ borderCollapse: "collapse", border: "none" }}>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={
                      column.id !== undefined && column.id !== null
                        ? column.id
                        : `column-${index}`
                    }
                    sx={{ minWidth: column.minWidth }}
                    style={{ minWidth: column.minWidth, borderBottom: "none" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell style={{ borderBottom: "none" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datas
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.filename}>
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        {row[column.id].length < 13 ? (
                          row[column.id]
                        ) : (
                          <Popup
                            content={row[column.id]}
                            inverted
                            position="right center"
                            style={{ borderRadius: "15px" }}
                            trigger={
                              <span>{row[column.id].slice(0, 13)}..</span>
                            }
                          />
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      {/* <img
                            src="/images/Eye.svg" // Replace with the path to your edit image
                            alt="Edit"
                            onClick={() => handleEdit(row)}
                            style={{ cursor: "pointer", marginRight: 8 }}
                            /> */}
                      <img
                        className="tableButton"
                        src="/images/Download.svg" // Replace with the path to your edit image
                        alt="Edit"
                        onClick={() => handleEdit(row)}
                        style={{ cursor: "pointer", marginRight: 8 }}
                      />
                      <img
                        className="tableButton"
                        src="/images/delete.svg" // Using the imported delete image
                        alt="Delete"
                        onClick={() => handleDelete(row)}
                        style={{ cursor: "pointer" }}
                      />
                      {/* <img
                              src="/images/blue-eye.svg" // Replace with the path to your edit image
                              alt="Edit"
                              onClick={() => handleEdit(row)}
                              style={{ cursor: "pointer", marginRight: 8 }}
                            /> */}
                      <img
                        className="tableButtonHover"
                        src="/images/blue-download.svg" // Replace with the path to your edit image
                        alt="Edit"
                        onClick={() => handleEdit(row)}
                        style={{ cursor: "pointer", marginRight: 8 }}
                      />
                      <img
                        className="tableButtonHover"
                        src="/images/delete-red.svg" // Using the imported delete image
                        alt="Delete"
                        onClick={() => handleDelete(row)}
                        style={{ cursor: "pointer" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalItems}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count}`
          }
          SelectProps={{
            inputProps: { "aria-label": "rows per page" },
            native: true,
          }}
          style={{ justifyContent: "center" }}
        />
      </Paper>

      <Modal
        open={openDeleteBox}
        onClose={handleClose}
        size="tiny"
        className="add-document-model deletePopup"
      >
        <Modal.Content>
          <Header as="h3">Delete document</Header>
          <p>Are you sure you want to delete "{deleteFileName.filename}"</p>
        </Modal.Content>
        <Modal.Actions>
          <button className="cancel-btn" onClick={handleClose}>
            Cancel
          </button>
          <button className="add-btn" onClick={actionDeleteDocument}>
            Delete
          </button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default DocumentPaginationTable;
