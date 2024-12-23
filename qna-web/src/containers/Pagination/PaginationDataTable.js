import React, { useState, useEffect } from "react";
import { Modal, Header, Menu, Image } from "semantic-ui-react";
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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteDatasets } from "../../actions/dataConsoleAction";
import axios from "axios";
import moment from "moment";
import Loader from "../../components/Loader";

const PaginationDataTable = ({
  columns,
  data,
  showToaster,
  setDeleteStatus,
  loaderFlag,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10 );
  const { loadings, responseDelete, errors } = useSelector(
    (state) => state.getdeleteDataSetReducer || {}
  );
  const { response } = useSelector(
    (state) => state.getlistDatasetReducer || {}
  );
  const [openDeleteBox, setopenDeleteBox] = useState(false);
  const [deleteFlag, setdeleteFlag] = useState(false);
  const [deleteDatsetName, setdeleteDatsetName] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (responseDelete.status_code === 200 && deleteFlag) {
      showToaster(`${deleteDatsetName} deleted successfully`, "success");
      setDeleteStatus(true);
      setdeleteFlag(false);
    }
    if (responseDelete.status === "failed") {
      setDeleteStatus(true);
      showToaster(responseDelete.message, "error");
    }
  }, [response, responseDelete, dispatch]);

  const handleEdit = (id) => {
    navigate(`/add-doc/${id}`);
  };

  const handleDelete = async (dataset) => {
    setdeleteDatsetName(dataset);
    setopenDeleteBox(true);
  };

  const actionDeleteDataset = async () => {
    setdeleteFlag(true);
    setopenDeleteBox(false);
    try {
      dispatch(deleteDatasets({ datasetname: deleteDatsetName }));
    } catch (error) {
      console.error("Error in delete DataSet:", error);
    }
  };

  const handleClose = async () => {
    setopenDeleteBox(false);
  };

  const totalItems = data.length;

  return (
    <>
      {loaderFlag && <Loader />}
      <Paper className="dataConsoleTable"
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
                        : column.label
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
              {data.length > 0
                ? data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        key={row.datasetname}
                        style={{ cursor: "pointer", marginRight: 8 }}
                      >
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            onClick={() => handleEdit(row.datasetname)}
                          >
                            {column.id === "files" ? (
                              row[column.id].length > 0 ? (
                                <span className="dataset-count-row">
                                  {row[column.id][0].length < 20
                                    ? row[column.id][0]
                                    : row[column.id][0].slice(0, 17) +
                                      "..." +
                                      (row[column.id].length < 2
                                        ? ""
                                        : "  +" +
                                          (row[column.id].length - 1) +
                                          " more  ")}
                                </span>
                              ) : (
                                "" + "  -"
                              )
                            ) : column.id === "users" ? (
                              row[column.id].length > 0 ? (
                                <span className="users-count-row">
                                  {row[column.id][0] +
                                    (row[column.id].length < 2
                                      ? ""
                                      : "  +" +
                                        (row[column.id].length - 1) +
                                        " more ")}{" "}
                                </span>
                              ) : (
                                "" + "  -"
                              )
                            ) : column.id === "Lastupdated" ? (
                              moment(row[column.id]).format(
                                `${process.env.REACT_APP_DATE_FORMAT}`
                              )
                            ) : column.id === "datasetname" ? (
                              row[column.id].length < 30 ? (
                                row[column.id]
                              ) : (
                                row[column.id].slice(0, 27) + ".."
                              )
                            ) : (
                              row[column.id]
                            )}
                          </TableCell>
                        ))}
                        <TableCell>
                          <img
                            className="tableButton"
                            src="/images/view-more.svg"
                            alt="Edit"
                            onClick={() => handleEdit(row.datasetname)}
                            style={{ cursor: "pointer", marginRight: 8 }}
                          />
                          <img
                            className="tableButton"
                            src="/images/delete.svg"
                            alt="Delete"
                            onClick={() => handleDelete(row.datasetname)}
                            style={{ cursor: "pointer" }}
                          />
                          <img
                            className="tableButtonHover"
                            src="/images/view-more-blue.svg"
                            alt="Edit"
                            onClick={() => handleEdit(row.datasetname)}
                            style={{ cursor: "pointer", marginRight: 8 }}
                          />
                          <img
                            className="tableButtonHover"
                            src="/images/delete-red.svg"
                            alt="Delete"
                            onClick={() => handleDelete(row.datasetname)}
                            style={{ cursor: "pointer" }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                : ""}
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
          <Header as="h3">Delete Dataset</Header>

          <p>Are you sure you want to Delete {deleteDatsetName}</p>
        </Modal.Content>
        <Modal.Actions>
          <button className="cancel-btn" onClick={handleClose}>
            Cancel
          </button>
          <button className="add-btn" onClick={actionDeleteDataset}>
            Delete
          </button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default PaginationDataTable;
