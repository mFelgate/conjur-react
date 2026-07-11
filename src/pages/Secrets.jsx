import { Box, Typography, Container } from '@mui/material'

export default function Secrets() {
  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Secrets
        </Typography>
        <Typography variant="body1">
          Store, retrieve, and manage secrets securely with Conjur.
        </Typography>
      </Container>
    </Box>
  )
}
