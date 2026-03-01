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
  deleteOrder,
  getAllOrders,
  insertOrder,
  updateOrder,
} from "../services/orderService";

const Orders = () => {
  const { isManager, isCashier } = useAuth();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    OrderID: "",
    TableNumber: "",
    TotalAmount: "",
    OrderStatus: "pending",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleClose = () => {
    setOpen(false);
    setEditingTable(null);
    setFormData({
      OrderID: "",
      TableNumber: "",
      TotalAmount: "",
      OrderStatus: "free",
    });
  };

  const getTables = async () => {
    const response = await getAllOrders();
    if (response.error) {
      setError(response.message);
    } else {
      setTables(response.data || []);
    }
  };

  useEffect(() => {
    getTables();
  }, []);

  const handleOpen = (Order = null) => {
    if (Order) {
      setEditingTable(Order);
      setFormData({
        OrderID: Order.OrderID || "",
        TableNumber: Order.TableNumber || "",
        TotalAmount: Order.TotalAmount || "",
        OrderStatus: Order.OrderStatus || "pending",
      });
    } else {
      setEditingTable(null);
      setFormData({
        OrderID: "",
        TableNumber: "",
        TotalAmount: "",
        OrderStatus: "pending",
      });
    }
    setOpen(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");
    const response = await deleteOrder(id);
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
      const response = await updateOrder(editingTable.OrderID, formData);
      if (response.error) {
        setError(response.message);
      } else {
        setSuccess(response.message);
        getTables();
      }
    } else {
      const response = await insertOrder(formData);
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
        <Typography variant="h4">Orders Management</Typography>{" "}
        {isManager && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              handleOpen();
            }}
          >
            Add Order{" "}
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
              <TableCell>Total Amount</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell>Actions</TableCell>{" "}
            </TableRow>{" "}
          </TableHead>{" "}
          <TableBody>
            {" "}
            {tables.map((Order) => (
              <TableRow key={Order.OrderID}>
                {" "}
                <TableCell>{Order.OrderID}</TableCell>
                <TableCell>{Order.TableNumber}</TableCell>
                <TableCell>{Order.TotalAmount}</TableCell>{" "}
                <TableCell>
                  {" "}
                  <Chip
                    label={Order.OrderStatus}
                    color={getStatusColor(Order.OrderStatus)}
                    size="small"
                  />{" "}
                </TableCell>{" "}
                <TableCell>
                  {" "}
                  {(isManager || isCashier) && (
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(Order)}
                    >
                      <EditIcon />{" "}
                    </IconButton>
                  )}{" "}
                  {isManager && (
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(Order.OrderID)}
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
          {editingTable ? "Edit Order" : "Add Order"}
        </DialogTitle>{" "}
        <DialogContent>
          {" "}
          <TextField
            fullWidth
            margin="normal"
            label="Order ID"
            type="number"
            value={formData.OrderID}
            onChange={(e) =>
              setFormData({ ...formData, OrderID: e.target.value })
            }
            required
            disabled={editingTable && !isManager}
          />{" "}
          <TextField
            fullWidth
            margin="normal"
            label="Table Number"
            type="number"
            value={formData.TableNumber}
            onChange={(e) =>
              setFormData({ ...formData, TableNumber: e.target.value })
            }
            disabled={editingTable && !isManager}
          />{" "}
          <TextField
            fullWidth
            margin="normal"
            label="Total Amount"
            type="number"
            value={formData.TotalAmount}
            onChange={(e) =>
              setFormData({ ...formData, TotalAmount: e.target.value })
            }
            disabled={editingTable && !isManager}
          />{" "}
          <TextField
            fullWidth
            margin="normal"
            select
            label="Status"
            value={formData.OrderStatus}
            onChange={(e) =>
              setFormData({ ...formData, OrderStatus: e.target.value })
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

export default Orders;
