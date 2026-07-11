import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'


import { authenticatorsService, membershipsService } from '../services'

function DetailRow({ label, value }) {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  )
}


function AuthenticatorGroups({type, name, group}) {
  const [members, setMembers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const resource_id = `conjur/authn-${type}/${name}/${group}`

  	async function handleDeleteMember(member, isMounted) {
			try {
				await membershipsService.removeMember("group", resource_id, member)
        loadMembers(group, true)
			} catch (error) {
				setError(error instanceof Error ? error.message : 'Update failed.')
			}
		}


    async function loadMembers(group, isMounted) {
      setLoading(true)
      setError('')

      try {
        const response = await membershipsService.listMembers("group", resource_id)
        if (isMounted) {
        setMembers(response)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Failed to load members.',
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    // Effect runs once on first render (equivalent idea to ngOnInit).
    useEffect(() => {
    // Prevents state updates if component unmounts before request completes.
      let isMounted = true


      loadMembers(group, isMounted)

      // Cleanup runs on unmount.
      return () => {
          isMounted = false
      }
    }, [type, name, group])

  return (
      <>
    <Typography variant="body1" color="text.secondary">
        {group.toUpperCase()}
      </Typography>

      {!loading && error && <Alert severity="error">{error}</Alert>}
      
       {!loading && !error && members?.length == 0 && (
          <Alert severity="info">No members found.</Alert>
      )}
     {members && members.length > 0 && (
        <Stack spacing={1.5}>
          {members.map((member) => (
            <Stack
              key={member.member}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography   
               variant="body2"
               sx={{ display: 'flex', alignItems: 'center' }}
               >
                {member.member}
              </Typography>
              <Tooltip title="Remove member">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteMember(member.member)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>

          ))}

        </Stack>

      )}
    </>
  )
}

export default function AuthenticatorDetails() {
  const { type, name } = useParams()
  const [authenticator, setAuthenticator] = useState(null)
  const [appsMembers, setAppsMembers] = useState(null)
  const [operatorMembers, setOperatorMembers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadAuthenticator() {
      setLoading(true)
      setError('')

      try {
        const response = await authenticatorsService.get(type, name)

        if (isMounted) {
          setAuthenticator(response)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Failed to load authenticator.',
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadAuthenticator()

    return () => {
      isMounted = false
    }
  }, [type, name])

  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Stack spacing={3}>
          <Button
            component={Link}
            to="/authenticators"
            startIcon={<ArrowBackIcon />}
            sx={{ alignSelf: 'flex-start' }}
          >
            Authenticators
          </Button>

          {loading && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} />
              <Typography variant="body2">Loading authenticator...</Typography>
            </Stack>
          )}

          {!loading && error && <Alert severity="error">{error}</Alert>}

          {!loading && !error && authenticator && (
            <>
              <Stack spacing={0.5}>
                <Typography variant="h4" component="h1">
                  {authenticator.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {authenticator.type}
                </Typography>
              </Stack>

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                  <DetailRow label="Name" value={authenticator.name} />
                  <DetailRow label="Type" value={authenticator.type} />
                  <DetailRow label="Enabled" value={authenticator.enabled ? 'Yes' : 'No'} />
                  <DetailRow label="Branch" value={authenticator.branch ?? ''} />
                  <DetailRow label="Owner" value={authenticator.owner?.id ?? ''} />
                </Stack>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                  <Typography variant="h6" component="h2">
                    Config
                  </Typography>

                  {authenticator.data && Object.entries(authenticator.data).length > 0 ? (
                    Object.entries(authenticator.data).map(([key, value]) => (
                      <DetailRow
                        key={key}
                        label={key}
                        value={
                          typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
                            ? String(value)
                            : JSON.stringify(value)
                        }
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No config returned.
                    </Typography>
                  )}
                </Stack>
              </Paper>
                      

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Typography variant="h6" component="h2">
                    Members
                  </Typography>
                    <AuthenticatorGroups type={type} name={name} group="apps" />
                    <AuthenticatorGroups type={type} name={name} group="operators" />
                </Stack>
              </Paper>
            </>)}
        </Stack>
      </Container>
    </Box>
  )
}
