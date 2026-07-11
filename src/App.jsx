import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { AuthProvider } from './auth/AuthContext'
import { useAuth } from './auth/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import AuthenticatorDetails from './pages/authenticators/AuthenticatorDetails.jsx'
import Authenticators from './pages/Authenticators'
import Policy from './pages/Policy'
import Resources from './pages/Resources'
import Secrets from './pages/Secrets'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  )
}

function AppShell() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            MyApp
          </Typography>
          <Button color="inherit" component={Link} to="/resources">Resources</Button>
          <Button color="inherit" component={Link} to="/authenticators">Authenticators</Button>
          <Button color="inherit" component={Link} to="/policy">Policy</Button>
          <Button color="inherit" component={Link} to="/secrets">Secrets</Button>
          {isAuthenticated ? (
            <Button color="inherit" onClick={logout}>Logout</Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Toolbar>
      </AppBar>

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
          path="/policy"
          element={
            <ProtectedRoute>
              <Policy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/secrets"
          element={
            <ProtectedRoute>
              <Secrets />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
