import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
} from "@mui/material";
const TableRowsLoader = ({ columns, rowsNum }) => {
  return (
    <>
      <Paper
        sx={{ height: "100vh", overflowX: "auto" }}
        style={{ boxShadow: "none" }}
      >
        <TableContainer style={{ border: "none" }}>
          <Table style={{ borderCollapse: "collapse", border: "none" }}>
            <TableBody>
              {[...Array(rowsNum)].map((row, index) => (
                <TableRow key={`row-${index}`}>
                  {columns.map((column) => (
                    <TableCell key={`cell-${index}-${column.id}`}>
                      <Skeleton animation="wave" variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};
export default TableRowsLoader;
