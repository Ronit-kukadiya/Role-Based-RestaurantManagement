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
  deleteRestaurants,
  getAllRestaurants,
  insertRestaurants,
  updateRestaurants,
} from "../services/restaurantService";

const Restaurants = () => {
  const { isManager, isCashier } = useAuth();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    RestaurantID: "",
    RestaurantName: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleClose = () => {
    setOpen(false);
    setEditingTable(null);
    setFormData({
      RestaurantID: "",
      RestaurantName: "",
    });
  };

  const getTables = async () => {
    const response = await getAllRestaurants();
    if (response.error) {
      setError(response.message);
    } else {
      setTables(response.data || []);
    }
  };

  useEffect(() => {
    getTables();
  }, []);

  const handleOpen = (Restaurant = null) => {
    if (Restaurant) {
      setEditingTable(Restaurant);
      setFormData({
        RestaurantID: Restaurant.RestaurantID || "",
        RestaurantName: Restaurant.RestaurantName || "",
      });
    } else {
      setEditingTable(null);
      setFormData({
        RestaurantID: "",
        RestaurantName: "",
      });
    }
    setOpen(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");
    const response = await deleteRestaurants(id);
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
      const response = await updateRestaurants(
        editingTable.RestaurantID,
        formData,
      );
      if (response.error) {
        setError(response.message);
      } else {
        setSuccess(response.message);
        getTables();
      }
    } else {
      const response = await insertRestaurants(formData);
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
        <Typography variant="h4">Restaurant Management</Typography>{" "}
        {isManager && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              handleOpen();
            }}
          >
            Add Restaurant{" "}
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
              <TableCell>Restaurant Name</TableCell>{" "}
              <TableCell>Actions</TableCell>{" "}
            </TableRow>{" "}
          </TableHead>{" "}
          <TableBody>
            {" "}
            {tables.map((Restaurant) => (
              <TableRow key={Restaurant.RestaurantID}>
                {" "}
                <TableCell>{Restaurant.RestaurantID}</TableCell>
                <TableCell>{Restaurant.RestaurantName}</TableCell>{" "}
                <TableCell> </TableCell>{" "}
                <TableCell>
                  {" "}
                  {(isManager || isCashier) && (
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(Restaurant)}
                    >
                      <EditIcon />{" "}
                    </IconButton>
                  )}{" "}
                  {isManager && (
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(Restaurant.RestaurantID)}
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
          {editingTable ? "Edit Restaurant" : "Add Restaurant"}
        </DialogTitle>{" "}
        <DialogContent>
          {" "}
          <TextField
            fullWidth
            margin="normal"
            label="Restaurant Number"
            type="number"
            value={formData.RestaurantNumber}
            onChange={(e) =>
              setFormData({ ...formData, RestaurantNumber: e.target.value })
            }
            required
            disabled={editingTable && !isManager}
          />{" "}
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            type="Text"
            value={formData.RestaurantName}
            onChange={(e) =>
              setFormData({ ...formData, RestaurantName: e.target.value })
            }
            disabled={editingTable && !isManager}
          />{" "}
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

export default Restaurants;
