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
import { Modal, Header, Image } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteDocumentUser } from "../../actions/dataConsoleAction";
import Loader from "../../components/Loader";

const UserPaginationTable = ({
  columns,
  data,
  loaderFlag,
  setDeleteuserDataFlag,
}) => {
  const dispatch = useDispatch();
  const { datasetNameParam } = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(
    parseInt(`${process.env.REACT_APP_ROWSPERPAGE}`)
  );
  const [openDeleteBox, setopenDeleteBox] = useState(false);
  const [DeleteuserData, setDeleteuserData] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClose = () => {
    setopenDeleteBox(false);
  };

  const handleDelete = async (data) => {
    setopenDeleteBox(true);
    setDeleteuserData(data);
  };

  const deleteUserData = async () => {
    try {
      const requestBody = {
        dataset_name: datasetNameParam,
        email_id: DeleteuserData.mail,
      };
      setDeleteuserDataFlag(true);
      setopenDeleteBox(false);
      dispatch(deleteDocumentUser(requestBody));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const totalItems = data.length;

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
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{ minWidth: column.minWidth }}
                    style={{ minWidth: column.minWidth, borderBottom: "none" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.user_id}>
                    {columns.map((column) => (
                      <TableCell key={column.id}>{row[column.id]}</TableCell>
                    ))}
                    <TableCell>
                      <img
                        className="tableButton"
                        src="/images/grey-circle-delete.svg" // Using the imported delete image
                        alt="Delete"
                        onClick={() => handleDelete(row)}
                        style={{ cursor: "pointer" }}
                      />
                      <img
                        className="tableButtonHover"
                        src="/images/red-circle-delete.svg" // Using the imported delete image
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
          <Header as="h3">Remove User</Header>
          <p>Are you sure you want to remove {DeleteuserData.username}</p>
        </Modal.Content>
        <Modal.Actions>
          <button className="cancel-btn" onClick={handleClose}>
            Cancel
          </button>
          <button className="add-btn" onClick={deleteUserData}>
            Delete
          </button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default UserPaginationTable;
