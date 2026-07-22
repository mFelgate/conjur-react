import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  Alert,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { authenticatorSchemas } from "./authenticatorSchema";
import { authenticatorsService } from "../../services";

function AuthenticatorFields({ schema, data, onChange }) {
  return (
    <>
      {schema.map((field) => (
        <TextField
          label={field.required ? `${field.label} *` : field.label}
          type={field.type === "password" ? "password" : "text"}
          multiline={field.type === "textarea"}
          minRows={field.type === "textarea" ? 8 : undefined}
          value={data[field.key] ?? ""}
          onChange={(event) => onChange(field.key, event.target.value)}
          fullWidth
        />
      ))}
    </>
  );
}

export default function CreateAuthenticator() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: "oidc",
    name: "",
    enabled: true,
    data: {},
    annotations: {},
  });

  const [error, setError] = useState(null);
  const [createdAuthenticator, setCreatedAuthenticator] = useState(null);
  function updateData(key, value) {
    setForm((previous) => ({
      ...previous,
      data: {
        ...previous.data,
        [key]: value,
      },
    }));
  }

  async function submit(event) {
    event.preventDefault();

    const payload = {
      type: form.type,
      name: form.name,
      enabled: form.enabled,
      data: { ...form.data },
      annotations: form.annotations,
    };

    try {
      if (
        payload.type === "jwt" &&
        typeof payload.data.public_keys === "string"
      ) {
        payload.data.public_keys = JSON.parse(payload.data.public_keys);
      }
      const response = await authenticatorsService.create(payload);
      setError(null);
      setCreatedAuthenticator(response);
    } catch (error) {
      setError(
        error.response?.message ||
          error.body?.message ||
          error.message ||
          "Failed to create authenticator.",
      );
    }
  }

  return (
    <>
      <Box
        component="form"
        onSubmit={submit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5">Create Authenticator</Typography>

        <TextField
          label="Name"
          value={form.name}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              name: event.target.value,
            }))
          }
          fullWidth
        />

        <Select
          value={form.type}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              type: event.target.value,
              data: {},
            }))
          }
        >
          {Object.keys(authenticatorSchemas).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>

        <FormControlLabel
          control={
            <Checkbox
              checked={form.enabled}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  enabled: event.target.checked,
                }))
              }
            />
          }
          label="Enabled"
        />

        <AuthenticatorFields
          schema={authenticatorSchemas[form.type]}
          data={form.data}
          onChange={updateData}
        />

        <Button type="submit" variant="contained">
          Create Authenticator
        </Button>
      </Box>
      {error && (
        <Alert color="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {console.log("render error:", error)}
      {createdAuthenticator && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
          <Alert color="success" sx={{ mt: 2 }}>
            Authenticator created successfully!
          </Alert>
          <Button
            variant="contained"
            startIcon={<VisibilityIcon />}
            onClick={() =>
              navigate(
                `/authenticators/${createdAuthenticator.type}/${createdAuthenticator.name}`,
              )
            }
          >
            View Authenticator
          </Button>
        </Stack>
      )}
    </>
  );
}
