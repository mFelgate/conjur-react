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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { resourcesService, policyService } from "../../services";
import { ResourceInfo, DetailRow } from "../resources/resourceDetails.jsx";

export default function PolicyDetails() {
  const { serviceId } = useParams();
  console.log(useParams());
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [effectivePolicy, setEffectivePolicy] = useState(null);
  const [error, setError] = useState("");
  const KIND = "policy";

  async function getEffectivePolicy(serviceId) {
    try {
      console.log("  Loading effective policy for serviceId:", serviceId);
      const effectivePolicy = await policyService.getEffectivePolicy(serviceId);
      console.log(effectivePolicy);
      setEffectivePolicy(effectivePolicy);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load effective policy.",
      );
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadPolicyResource() {
      setLoading(true);
      setError("");
      console.log("Loading policy for serviceId:", serviceId);

      try {
        const resource = await resourcesService.get(KIND, serviceId);
        console.log("Resource:", resource);
        if (isMounted) {
          setResource(resource);
        }
        await getEffectivePolicy(serviceId);
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load policy.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPolicyResource();

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
            to="/policy"
            startIcon={<ArrowBackIcon />}
            sx={{ alignSelf: "flex-start" }}
          >
            Policies
          </Button>

          {loading && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} />
              <Typography variant="body2">Loading policy...</Typography>
            </Stack>
          )}

          {!loading && error && <Alert severity="error">{error}</Alert>}

          {!loading && !error && resource && (
            <>
              <ResourceInfo title="Policy" resource={resource} />

              {resource && resource.policy_versions.length > 0 && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Policy History
                  </Typography>

                  <Stack spacing={1}>
                    {resource.policy_versions.map((policy) => (
                      <Accordion key={policy.version} variant="outlined">
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>
                            Version {policy.version} —{" "}
                            {new Date(policy.created_at).toLocaleString()}
                          </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                          <Stack spacing={1.5}>
                            <Typography
                              component="pre"
                              variant="body2"
                              sx={{
                                fontFamily: "monospace",
                                whiteSpace: "pre-wrap",
                                overflowX: "auto",
                                m: 0,
                              }}
                            >
                              {policy.policy_text.trimStart()}
                            </Typography>
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Stack>
                </Paper>
              )}

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                  <Typography variant="h6" component="h2">
                    Effective Policy
                  </Typography>
                  <Alert severity="info">
                    The returned YAML statements may not be identical to the
                    YAML statements used to create a policy. Additionally, the
                    API has some known limitations (You can refer to the official doc's here{" "}
                    <a
                      href="https://docs.cyberark.com/secrets-manager-sh/latest/en/content/developer/conjur_api_effective_policy.htm?tocpath=Developer%7CSecrets%20Manager%20REST%20APIs%7CREST%C2%A0APIs%7C_____13"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </a>
                    ). 

                    Please save all policy statements used to create a policy in a secure location, as they may be needed for future reference.
                  </Alert>
                  <Typography
                    component="pre"
                    variant="body2"
                    sx={{
                      fontFamily: "monospace",
                      whiteSpace: "pre-wrap",
                      overflowX: "auto",
                      m: 0,
                    }}
                  >
                    {effectivePolicy
                      ? effectivePolicy.trimStart()
                      : "No effective policy available."}
                  </Typography>
                </Stack>
              </Paper>
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
