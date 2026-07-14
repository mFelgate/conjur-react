import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Typography,
} from "@mui/material";
import Editor from "@monaco-editor/react";
import { configureMonacoYaml } from "monaco-yaml";
import { policyService } from "../../services/policyService";
import { ResourceInfo, DetailRow } from "../resources/resourceDetails.jsx";

export function PolicyResourceInfo({ title, resource }) {
  return (
    <Stack spacing={1.5}>
      <DetailRow label="Name" value={resource.id} />
      <DetailRow label="Type" value={resource.type} />
      <DetailRow label="Identifier" value={resource.identifier} />
      <DetailRow label="Owner" value={resource.owner} />
      <DetailRow label="Policy" value={resource.policy} />

      {resource.members?.length > 0 && (
        <>
          <Typography variant="subtitle2" color="text.secondary">
            Members
          </Typography>
          <Stack spacing={0.5}>
            {resource.members.map((member) => (
              <Typography key={member} variant="body2">
                {member}
              </Typography>
            ))}
          </Stack>
        </>
      )}

      {resource.memberships?.length > 0 && (
        <>
          <Typography variant="subtitle2" color="text.secondary">
            Memberships
          </Typography>
          {resource.memberships.map((membership) => (
            <Typography key={membership} variant="body2">
              {membership}
            </Typography>
          ))}
        </>
      )}
    </Stack>
  );
}

export default function PolicyLoad() {
  const [policyText, setPolicyText] = useState("");
  const [dryRun, setDryRun] = useState(true);
  const [loading, setLoading] = useState(false);
  const [policyResponse, setPolicyResponse] = useState(null);
  const [responseStatus, setResponseStatus] = useState(null);
  const [branch, setBranch] = useState("root");
  const [error, setError] = useState("");
  const [method, setMethod] = useState("POST");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // TODO: Call policyService.loadPolicy(policyText, dryRun)
      const response = await policyService.loadPolicy(
        policyText,
        branch,
        method,
        dryRun,
      );
      setPolicyResponse(response.data);
      setResponseStatus(response.status);
      console.log(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load policy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Typography variant="h4">Load Policy</Typography>

          <TextField
            label="Branch"
            value={branch}
            onChange={(event) => setBranch(event.target.value)}
            placeholder="Type branch name"
            fullWidth
          />

          <Alert severity="info">
            Paste a Conjur policy below. Enable Dry Run to validate the policy
            before applying it.
          </Alert>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <FormControlLabel
                  control={
                    <Switch
                      checked={dryRun}
                      onChange={(e) => setDryRun(e.target.checked)}
                    />
                  }
                  label="Dry Run"
                />
                <ToggleButtonGroup
                  value={method}
                  exclusive
                  onChange={(event, value) => {
                    if (value !== null) {
                      setMethod(value);
                    }
                  }}
                  aria-label="policy operation"
                >
                  <ToggleButton value="POST">Create</ToggleButton>
                  <ToggleButton value="PATCH">Update</ToggleButton>
                  <ToggleButton value="PUT">Replace</ToggleButton>
                </ToggleButtonGroup>
              </Stack>

              <Editor
                height="600px"
                defaultLanguage="yaml"
                value={policyText}
                onChange={(value) => setPolicyText(value ?? "")}
              />
              {error && <Alert severity="error">{error}</Alert>}
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || !policyText.trim()}
                >
                  {dryRun ? "Run Validation" : "Load Policy"}
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {!error && policyResponse && responseStatus == "200" && (
            <>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Created Resources
                </Typography>

                {!policyResponse.created?.items ||
                policyResponse.created.items.length === 0 ? (
                  <Alert severity="info">No resources created.</Alert>
                ) : (
                  <Stack spacing={1}>
                    {policyResponse.created.items.map((resource) => (
                      <Paper key={resource.id} variant="outlined" sx={{ p: 2 }}>
                        <PolicyResourceInfo
                          key={resource.id}
                          title="Created Resource"
                          resource={resource}
                        />
                      </Paper>
                    ))}
                  </Stack>
                )}

                <Typography variant="h6" sx={{ mt: 1 }}>
                  Deleted Resources
                </Typography>

                {!policyResponse.deleted?.items ||
                policyResponse.deleted.items.length === 0 ? (
                  <Alert severity="info">No resources deleted.</Alert>
                ) : (
                  <Stack spacing={1}>
                    {policyResponse.deleted.items.map((resource) => (
                      <Paper key={resource.id} variant="outlined" sx={{ p: 2 }}>
                        <PolicyResourceInfo
                          key={resource.id}
                          title="Deleted Resource"
                          resource={resource}
                        />
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Stack>
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
