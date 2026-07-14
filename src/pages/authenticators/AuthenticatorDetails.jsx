import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DetailRow } from "../resources/resourceDetails.jsx";

import {
  authenticatorsService,
  membershipsService,
  secretsService,
} from "../../services";
import MembershipGroups from "../members/memberGroup.jsx";


function SecretDetailRow({ resource_id, configKey, value }) {
  const [editing, setEditing] = useState(false);
  const [editedValue, setEditedValue] = useState("");
  const [currentValue, setCurrentValue] = useState(value);

  const startEdit = (configKey, currentValue) => {
    setEditing(true);
    setEditedValue(currentValue);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditedValue("");
  };

  const saveSecret = async (configKey) => {
    try {
      const response = await secretsService.update(
        "variable",
        `${resource_id}/${configKey}`,
        editedValue,
      );

      cancelEdit();
      setCurrentValue(editedValue);
    } catch (error) {
      console.error("Failed to update secret:", error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 180 }}>
        {configKey}
      </Typography>

      {editing ? (
        <Stack spacing={1} alignItems="center" sx={{ flex: 1 }}>
          <TextField
            fullWidth
            multiline
            minRows={12}
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            spellCheck={false}
            sx={{
              "& textarea": {
                fontFamily: "monospace",
                whiteSpace: "pre",
              },
            }}
          />

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={() => saveSecret(configKey)}
            >
              Save
            </Button>

            <Button startIcon={<CloseIcon />} onClick={cancelEdit}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      ) : (
        <>
          <Typography sx={{ flex: 1 }}>{String(currentValue)}</Typography>

          <Button
            startIcon={<EditIcon />}
            onClick={() => startEdit(configKey, currentValue)}
          >
            Edit
          </Button>
        </>
      )}
    </Stack>
  );
}

export default function AuthenticatorDetails() {
  const { type, name } = useParams();
  const [authenticator, setAuthenticator] = useState(null);
  const [appsMembers, setAppsMembers] = useState(null);
  const [operatorMembers, setOperatorMembers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const resource_id = `conjur/authn-${type}/${name}`;

  useEffect(() => {
    let isMounted = true;

    async function loadAuthenticator() {
      setLoading(true);
      setError("");

      try {
        const response = await authenticatorsService.get(type, name);

        if (isMounted) {
          setAuthenticator(response);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load authenticator.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAuthenticator();

    return () => {
      isMounted = false;
    };
  }, [type, name]);

  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Stack spacing={3}>
          <Button
            component={Link}
            to="/authenticators"
            startIcon={<ArrowBackIcon />}
            sx={{ alignSelf: "flex-start" }}
          >
            Authenticators
          </Button>

          {loading && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} />
              <Typography variant="body2">Loading authenticator...</Typography>
            </Stack>
          )}

          {!loading && error && <Alert severity="error">{error.message}</Alert>}

          {!loading && !error && authenticator && (
            <>
              <Stack spacing={0.5}>
                <Typography variant="h4" component="h1">
                  {authenticator.name}
                </Typography>
              </Stack>

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                  <DetailRow label="Type" value={authenticator.type} />
                  <DetailRow
                    label="Enabled"
                    value={authenticator.enabled ? "Yes" : "No"}
                  />
                  <DetailRow
                    label="Branch"
                    value={authenticator.branch ?? ""}
                  />
                  <DetailRow
                    label="Owner"
                    value={authenticator.owner?.id ?? ""}
                  />
                </Stack>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                  <Typography variant="h6" component="h2">
                    Config
                  </Typography>

                  {authenticator.data &&
                  Object.entries(authenticator.data).length > 0 ? (
                    Object.entries(authenticator.data).map(([key, value]) => (
                      <SecretDetailRow
                        key={key.replaceAll("_", "-")}
                        configKey={key.replaceAll("_", "-")}
                        resource_id={resource_id}
                        value={
                          typeof value === "string" ||
                          typeof value === "number" ||
                          typeof value === "boolean"
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
                  <Typography variant="body1" color="text.secondary">
                    Apps
                  </Typography>

                  <MembershipGroups serviceId={`${resource_id}/apps`} />
                                    <Typography variant="body1" color="text.secondary">
                    Operators
                  </Typography>


                  <MembershipGroups serviceId={`${resource_id}/operators`} />
                </Stack>
              </Paper>
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
