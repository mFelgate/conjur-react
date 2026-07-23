import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Container, Stack, TextField, Typography, Alert, Paper } from '@mui/material'
import { useAuth } from '../auth/useAuth'

export default function Login() {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()
  const [account, setAccount] = useState('')
  const [loginName, setLoginName] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [localError, setLocalError] = useState('')
  const ACCOUNT = 'conjur.account'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLocalError('')

    try {
      await login({ account, login: loginName, apiKey })
      localStorage.setItem(ACCOUNT, account)
      navigate('/dashboard')
    } catch (requestError) {
      setLocalError(requestError instanceof Error ? requestError.message : 'Login failed.')
    }
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Login
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Sign in with your Conjur account, login, and API key to load authenticated data.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Account" value={account} onChange={(event) => setAccount(event.target.value)} fullWidth />
            <TextField label="Login" value={loginName} onChange={(event) => setLoginName(event.target.value)} fullWidth />
            <TextField
              label="API Key"
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              fullWidth
            />
            {(localError || error) && <Alert severity="error">{localError || error}</Alert>}
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </Stack>
        </Box>
        </Paper>
      </Container>
    </Box>
  )
}
