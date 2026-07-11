import { Box, Typography, Container } from '@mui/material'

export default function Policy() {
  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Policy
        </Typography>
        <Typography variant="body1">
          Define and manage access control policies for your Conjur resources.
        </Typography>
      </Container>
    </Box>
  )
}
