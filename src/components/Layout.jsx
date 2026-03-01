import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Table,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import GridViewIcon from "@mui/icons-material/GridView";
import { useAuth } from "../context/AuthProvider";
import {
  Book,
  BookOnline,
  BookOutlined,
  Restaurant,
  TableBarOutlined,
} from "@mui/icons-material";
const drawerWidth = 240;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    navigate("/login");
  };
  const { user, isManager, isWaiter, isChef, isCashier } = useAuth();

  const menuItems = [
    { text: "Dashboard", icon: <GridViewIcon />, path: "/" },
    ...(isCashier
      ? [{ text: "Orders", icon: <BookOutlined />, path: "/orders" }]
      : []),
    ...(isWaiter || null == null
      ? [{ text: "Tables", icon: <TableBarOutlined />, path: "/tables" }]
      : []),
    ...(isManager
      ? [{ text: "Restaurants", icon: <Restaurant />, path: "/restaurants" }]
      : []),
  ];

  const drawer = (
    <Box>
      {" "}
      <Toolbar>
        {" "}
        <Typography variant="h6" noWrap component="div">
          DineFlow POS{" "}
        </Typography>{" "}
      </Toolbar>
      <Divider />{" "}
      <List>
        {" "}
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            {" "}
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              {" "}
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />{" "}
            </ListItemButton>{" "}
          </ListItem>
        ))}{" "}
      </List>
      <Divider />{" "}
      <List>
        {" "}
        <ListItem disablePadding>
          {" "}
          <ListItemButton onClick={handleLogout}>
            {" "}
            <ListItemIcon>
              <LogoutIcon />{" "}
            </ListItemIcon>
            <ListItemText primary="Logout" />{" "}
          </ListItemButton>{" "}
        </ListItem>{" "}
      </List>{" "}
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {" "}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        {" "}
        <Toolbar>
          {" "}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />{" "}
          </IconButton>{" "}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user?.data?.UserName} ({user?.data?.UserRole}){" "}
          </Typography>{" "}
        </Toolbar>{" "}
      </AppBar>{" "}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {" "}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}{" "}
        </Drawer>{" "}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}{" "}
        </Drawer>{" "}
      </Box>{" "}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />{" "}
      </Box>{" "}
    </Box>
  );
};

export default Layout;
