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

import { authenticatorsService } from "../../services";
export const authenticatorSchemas = {
  oidc: [
    {
      key: "provider_uri",
      label: "Provider URI",
      type: "text",
    },
    {
      key: "ca_cert",
      label: "CA Certificate",
      type: "textarea",
    },
    {
      key: "token_ttl",
      label: "Token TTL",
      type: "text",
      placeholder: "300s",
    },
    {
      key: "provider_scope",
      label: "Provider Scope",
      type: "text",
      placeholder: "openid email profile",
    },
    {
      key: "client_id",
      label: "Client ID",
      type: "text",
    },
    {
      key: "client_secret",
      label: "Client Secret",
      type: "password",
    },
    {
      key: "redirect_uri",
      label: "Redirect URI",
      type: "text",
    },
    {
      key: "claim_mapping",
      label: "Claim Mapping",
      type: "textarea",
    },
  ],

  jwt: [
    {
      key: "jwks_uri",
      label: "JWKS URI",
      type: "text",
    },
    {
      key: "issuer",
      label: "Issuer",
      type: "text",
    },
    {
      key: "audience",
      label: "Audience",
      type: "text",
    },
    {
      key: "public_keys",
      label: "Public Keys",
      type: "textarea",
      format: "json",
    },
    {
      key: "identity.token_app_property",
      label: "Token App Property",
      type: "text",
    },
    {
      key: "identity.enforced_claims",
      label: "Enforced Claims",
      type: "array",
    },
    {
      key: "identity.claim_aliases",
      label: "Claim Aliases",
      type: "json",
    },
    {
      key: "identity.identity_path",
      label: "Identity Path",
      type: "text",
    },
  ],

  k8s: [
    {
      key: "kubernetes/api_url",
      label: "Kubernetes API URL",
      type: "text",
    },
    {
      key: "kubernetes/ca_cert",
      label: "Kubernetes CA Certificate",
      type: "textarea",
    },
    {
      key: "kubernetes/service_account_token",
      label: "Service Account Token",
      type: "password",
    },
    {
      key: "ca/key",
      label: "CA Key",
      type: "password",
    },
    {
      key: "ca/cert",
      label: "CA Certificate",
      type: "textarea",
    },
  ],

  azure: [
    {
      key: "provider_uri",
      label: "Provider URI",
      type: "text",
    },
  ],

  gcp: [
  ],

  ldap: [
    {
      key: "bind_password",
      label: "Bind Password",
      type: "password",
    },
    {
      key: "tls_ca_cert",
      label: "TLS CA Certificate",
      type: "textarea",
    },
  ],

  certificate: [
    {
      key: "ca_cert",
      label: "CA Certificate",
      type: "textarea",
    },
    {
      key: "crl_url",
      label: "CRL URL",
      type: "text",
    },
  ],
};

function AuthenticatorFields({ schema, data, onChange }) {
  return (
    <>
      {schema.map((field) => (
        <TextField
          key={field.key}
          label={field.label}
          type={field.type}
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
      data: form.data,
      annotations: form.annotations,
    };
    try {
      const response = await authenticatorsService.create(payload);
      setError(null);
      setCreatedAuthenticator(response);
    } catch (error) {
      console.error("Failed to create authenticator:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create authenticator.",
      );
      // Handle error (e.g., show a notification)
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
      {createdAuthenticator && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
        <Alert color="success" sx={{ mt: 2 }}>
          Authenticator created successfully!
        </Alert>
                 <Button
            variant="contained"
            startIcon={<VisibilityIcon />}
            onClick={() => navigate(`/authenticators/${createdAuthenticator.type}/${createdAuthenticator.name}`)}
          >
            View Authenticator
          </Button>
        </Stack>
      )}
    </>
  );
}
