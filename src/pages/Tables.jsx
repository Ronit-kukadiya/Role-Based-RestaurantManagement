import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Box,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../context/AuthProvider";
import {
  deleteTable,
  getAllTables,
  insertTable,
  updateTable,
} from "../services/tableService";

const Tables = () => {
  const { isManager, isCashier } = useAuth();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    TableNumber: "",
    TableCapacity: "",
    TableStatus: "free",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleClose = () => {
    setOpen(false);
    setEditingTable(null);
    setFormData({
      TableNumber: "",
      TableCapacity: "",
      TableStatus: "free",
    });
  };

  const getTables = async () => {
    const response = await getAllTables();
    if (response.error) {
      setError(response.message);
    } else {
      setTables(response.data || []);
    }
  };

  useEffect(() => {
    getTables();
  }, []);

  const handleOpen = (table = null) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        TableNumber: table.TableNumber || "",
        TableCapacity: table.TableCapacity || "",
        TableStatus: table.TableStatus || "free",
      });
    } else {
      setEditingTable(null);
      setFormData({
        TableNumber: "",
        TableCapacity: "",
        TableStatus: "free",
      });
    }
    setOpen(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");
    const response = await deleteTable(id);
    if (response.error) {
      setError(response.message);
    } else {
      setSuccess(response.message);
      getTables();
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setOpen(false);
    if (editingTable) {
      const response = await updateTable(editingTable.TableID, formData);
      if (response.error) {
        setError(response.message);
      } else {
        setSuccess(response.message);
        getTables();
      }
    } else {
      const response = await insertTable(formData);
      if (response.error) {
        setError(response.message);
      } else {
        setSuccess(response.message);

        getTables();
      }
    }
  };

  const getStatusColor = (status) => {
    return status === "free" ? "success" : "error";
  };

  return (
    <Container>
      {" "}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Tables Management</Typography>{" "}
        {isManager && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              handleOpen();
            }}
          >
            Add Table{" "}
          </Button>
        )}{" "}
      </Box>{" "}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}{" "}
        </Alert>
      )}{" "}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}{" "}
        </Alert>
      )}{" "}
      <TableContainer component={Paper}>
        {" "}
        <Table>
          {" "}
          <TableHead>
            {" "}
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Table Number</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Status</TableCell> <TableCell>Restaurant</TableCell>{" "}
              <TableCell>Actions</TableCell>{" "}
            </TableRow>{" "}
          </TableHead>{" "}
          <TableBody>
            {" "}
            {tables.map((table) => (
              <TableRow key={table.TableID}>
                {" "}
                <TableCell>{table.TableID}</TableCell>
                <TableCell>{table.TableNumber}</TableCell>
                <TableCell>{table.TableCapacity}</TableCell>{" "}
                <TableCell>
                  {" "}
                  <Chip
                    label={table.TableStatus}
                    color={getStatusColor(table.TableStatus)}
                    size="small"
                  />{" "}
                </TableCell>{" "}
                <TableCell>{table.RestaurantName}</TableCell>{" "}
                <TableCell>
                  {" "}
                  {(isManager || isCashier) && (
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(table)}
                    >
                      <EditIcon />{" "}
                    </IconButton>
                  )}{" "}
                  {isManager && (
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(table.TableID)}
                    >
                      <DeleteIcon />{" "}
                    </IconButton>
                  )}{" "}
                </TableCell>{" "}
              </TableRow>
            ))}{" "}
          </TableBody>{" "}
        </Table>{" "}
      </TableContainer>{" "}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        {" "}
        <DialogTitle>
          {editingTable ? "Edit Table" : "Add Table"}
        </DialogTitle>{" "}
        <DialogContent>
          {" "}
          <TextField
            fullWidth
            margin="normal"
            label="Table Number"
            type="number"
            value={formData.TableNumber}
            onChange={(e) =>
              setFormData({ ...formData, TableNumber: e.target.value })
            }
            required
            disabled={editingTable && !isManager}
          />{" "}
          <TextField
            fullWidth
            margin="normal"
            label="Capacity"
            type="number"
            value={formData.TableCapacity}
            onChange={(e) =>
              setFormData({ ...formData, TableCapacity: e.target.value })
            }
            disabled={editingTable && !isManager}
          />{" "}
          <TextField
            fullWidth
            margin="normal"
            select
            label="Status"
            value={formData.TableStatus}
            onChange={(e) =>
              setFormData({ ...formData, TableStatus: e.target.value })
            }
            required
          >
            <MenuItem value="free">Free</MenuItem>
            <MenuItem value="occupied">Occupied</MenuItem>{" "}
          </TextField>{" "}
        </DialogContent>{" "}
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>{" "}
          <Button onClick={handleSubmit} variant="contained">
            {editingTable ? "Update" : "Create"}{" "}
          </Button>{" "}
        </DialogActions>{" "}
      </Dialog>{" "}
    </Container>
  );
};

export default Tables;
