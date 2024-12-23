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
import { useDispatch, useSelector } from "react-redux";

const AddUserDocPaginationTable = ({
  columns,
  data,
  setselectedUsersData,
  selectedUsers,
  onDataFromChild,
}) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(
    parseInt(`${process.env.REACT_APP_ROWSPERPAGE}`)
  );
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    onDataFromChild(selectedCheckboxes);
  }, [selectedCheckboxes]);

  const ChangeUsersSelection = (row) => {
    const isUserSelected = selectedCheckboxes.some(
      (user) => user.id === row.id
    );
    if (isUserSelected) {
      setSelectedCheckboxes(
        selectedCheckboxes.filter((user) => user.id !== row.id)
      );
    } else {
      setSelectedCheckboxes([
        ...selectedCheckboxes,
        { id: row.id, displayName: row.displayName, mail: row.mail },
      ]);
    }
  };

  const handleDelete = async (id) => {
    console.log(`Deleting row with ID ${id}`);
    try {
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleTableRowClick = (row) => {
    ChangeUsersSelection(row);
  };

  const totalItems = data.length;

  return (
    <Paper sx={{ overflowX: "auto" }} style={{ boxShadow: "none" }}>
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
                <TableRow key={row.id} onClick={() => handleTableRowClick(row)}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>{row[column.id]}</TableCell>
                  ))}
                  <TableCell>
                    <input
                      value={row.id}
                      type="checkbox"
                      onChange={() => ChangeUsersSelection(row)}
                      className="user-list-checkbox"
                      checked={selectedCheckboxes.some(
                        (user) => user.id === row.id
                      )}
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
  );
};

export default AddUserDocPaginationTable;
