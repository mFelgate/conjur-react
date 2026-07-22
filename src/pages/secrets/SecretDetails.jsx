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

import { secretsService, resourcesService } from "../../services";
import { ResourceInfo, DetailRow } from "../resources/resourceDetails.jsx";

function formatValue(value) {
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return value;
    }
  }

  return typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
    ? String(value)
    : JSON.stringify(value, null, 2);
}

function AddSecretField({ resource, onSecretAdded }) {
  const [value, setValue] = useState("");

  const parts = String(resource.id ?? "").split(":");
  const serviceId = parts[2];
  const kind = parts[1];

  const saveSecret = async () => {
    await secretsService.set(kind, serviceId, value);
    onSecretAdded();
    // reload resource or flip secretPresent
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6">Add Secret</Typography>

      <TextField
        fullWidth
        multiline
        minRows={8}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        sx={{
          mt: 2,
          "& textarea": {
            fontFamily: "monospace",
          },
        }}
      />

      <Button sx={{ mt: 2 }} variant="contained" onClick={saveSecret}>
        Save Secret
      </Button>
    </Paper>
  );
}

export function SecretValueField({ resource }) {
  const parts = String(resource.id ?? "").split(":");
  const serviceId = parts[2];
  const kind = parts[1];
  const [editing, setEditing] = useState(false);
  const [editedValue, setEditedValue] = useState("");

  const startEdit = async () => {
    setEditing(true);
    const value = await secretsService.get(kind, serviceId);
    setEditedValue(formatValue(value));
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditedValue("");
  };

  const saveSecret = async (serviceId) => {
    try {
      const response = await secretsService.set(kind, serviceId, editedValue);

      cancelEdit();
    } catch (error) {
      console.error("Failed to update secret:", error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h1">
            Secret
          </Typography>

          {!editing ? (
            <Button startIcon={<EditIcon />} onClick={startEdit}>
              Edit
            </Button>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<CheckIcon />}
                onClick={() => saveSecret(serviceId)}
              >
                Save
              </Button>

              <Button startIcon={<CloseIcon />} onClick={cancelEdit}>
                Cancel
              </Button>
            </Stack>
          )}
        </Box>
        {editing ? (
          <TextField
            fullWidth
            multiline
            minRows={1}
            maxRows={12}
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
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontFamily: "monospace",
              p: 2,
              bgcolor: "action.hover",
              borderRadius: 1,
            }}
          >
            ************
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

export default function SecretDetails() {
  const { serviceId } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [secretPresent, setSecretPresent] = useState(false);
  const [error, setError] = useState("");
  const KIND = "variable";

  async function loadSecretResource(serviceId, isMounted) {
    setLoading(true);
    setError("");

    try {
      const resource = await resourcesService.get(KIND, serviceId);
      if (resource && resource.secrets.length > 0) {
        setSecretPresent(true);
      }

      if (isMounted) {
        setResource(resource);
      }
    } catch (requestError) {
      if (isMounted) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load secret.",
        );
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    let isMounted = true;

    loadSecretResource(serviceId, isMounted);

    return () => {
      isMounted = false;
    };
  }, [serviceId]);

  return (
    <Box sx={{ py: 4 }}>
      <Container>
        <Stack spacing={3}>
          <Button
            component={Link}
            to="/secrets"
            startIcon={<ArrowBackIcon />}
            sx={{ alignSelf: "flex-start" }}
          >
            Secrets
          </Button>

          {loading && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} />
              <Typography variant="body2">Loading secret...</Typography>
            </Stack>
          )}

          {!loading && error && <Alert severity="error">{error}</Alert>}

          {!loading && !error && resource && (
            <ResourceInfo title="Secret" resource={resource} />
          )}

          {!loading && !secretPresent && (
            <>
              <Alert severity="info">Secret not found.</Alert>
              <AddSecretField
                resource={resource}
                onSecretAdded={() => loadSecretResource(serviceId, true)}
              />
            </>
          )}

          {!loading && !error && secretPresent && (
            <>
              <SecretValueField resource={resource} />
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
