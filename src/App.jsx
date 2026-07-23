import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { AuthProvider } from "./auth/AuthContext";
import { useAuth } from "./auth/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AuthenticatorDetails from "./pages/authenticators/AuthenticatorDetails.jsx";
import AuthenticatorForm from "./pages/authenticators/CreateAuthenticator.jsx";
import Authenticators from "./pages/authenticators/Authenticators.jsx";
import PolicyLoad from "./pages/policies/PolicyLoad.jsx";
import Resources from "./pages/resources/Resources.jsx";
import ResourceDetail from "./pages/resources/ResourceDetails.jsx";
import Dashboard from "./pages/dashboard/dashboard.jsx";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

function NavBar() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const showNavbar = isAuthenticated && location.pathname !== "/login";

  if (!showNavbar) {
    return null;
  }

  return (
    <>
      {showNavbar && (
        <Drawer
          variant="permanent"
          sx={{
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
            },
          }}
        >
          <img
            src="/conjur-logo.svg"
            alt="Conjur"
            style={{
              width: "182px",
              height: "auto",
              margin: "20px",
              filter: "brightness(0) saturate(100%)",
            }}
          />
          <List>
            <ListItemButton component={Link} to="/dashboard">
              <DashboardIcon sx={{ mr: 2 }} />
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton component={Link} to="/resources">
              <Inventory2OutlinedIcon sx={{ mr: 2 }} />
              <ListItemText primary="Resources" />
            </ListItemButton>

            <ListItemButton component={Link} to="/resources?kind=variable">
              <KeyOutlinedIcon sx={{ mr: 2 }} />
              <ListItemText primary="Secrets" />
            </ListItemButton>

            <ListItemButton component={Link} to="/resources?kind=group">
              <GroupOutlinedIcon sx={{ mr: 2 }} />
              <ListItemText primary="Groups" />
            </ListItemButton>

            <ListItemButton component={Link} to="/authenticators">
              <SecurityOutlinedIcon sx={{ mr: 2 }} />
              <ListItemText primary="Authenticators" />
            </ListItemButton>

            <ListItemButton component={Link} to="/resources?kind=policy">
              <DescriptionOutlinedIcon sx={{ mr: 2 }} />
              <ListItemText primary="Policy" />
            </ListItemButton>

            <ListItemButton component={Link} to="/policy/load">
              <CloudUploadIcon sx={{ mr: 2 }} />
              <ListItemText primary="Load Policy" />
            </ListItemButton>


            {isAuthenticated ? (
              <ListItemButton onClick={logout}>
                <LogoutOutlinedIcon sx={{ mr: 2 }} />
                <ListItemText primary="Logout" />
              </ListItemButton>
            ) : (
              <ListItemButton onClick={login}>
                <LoginOutlinedIcon sx={{ mr: 2 }} />
                <ListItemText primary="Login" />
              </ListItemButton>
            )}
          </List>
        </Drawer>
      )}
    </>
  );
}

function AppShell() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const showNavbar = isAuthenticated && location.pathname !== "/login";

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <NavBar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
          }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/resources" replace />} />
            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources/:kind/:serviceId"
              element={
                <ProtectedRoute>
                  <ResourceDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/authenticators"
              element={
                <ProtectedRoute>
                  <Authenticators />
                </ProtectedRoute>
              }
            />
            <Route
              path="/authenticators/:type/:name"
              element={
                <ProtectedRoute>
                  <AuthenticatorDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/policy/load"
              element={
                <ProtectedRoute>
                  <PolicyLoad />
                </ProtectedRoute>
              }
            />
            <Route
              path="/authenticators/create"
              element={
                <ProtectedRoute>
                  <AuthenticatorForm />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
      </Box>
    </>
  );
}

export default App;
