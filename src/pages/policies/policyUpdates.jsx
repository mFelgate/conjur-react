import { useState, useRef } from "react";
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

export default function PolicyUpdates({ UpdatedResources, getChanges }) {
  const beforeItems = UpdatedResources?.updated?.before?.items ?? [];
  const afterItems = UpdatedResources?.updated?.after?.items ?? [];

  if (beforeItems.length === 0) {
    return <Alert severity="info">No resources will be updated.</Alert>;
  }

  return (
    <Stack spacing={1}>
      {beforeItems.map((beforeItem, index) => {
        const afterItem = afterItems[index];
        const changes = getChanges(beforeItem, afterItem, "");
        const resourceId = beforeItem.identifier;

        return (
          <Paper key={resourceId} variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" color="text.secondary">
              {resourceId}
            </Typography>

            {changes.map((change) => (
              <Box key={change.path}>
                <Typography
                  sx={{ color: "error.main", overflowWrap: "anywhere" }}
                >
                  - {change.path}: {JSON.stringify(change.before)}
                </Typography>
                <Typography
                  sx={{ color: "success.main", overflowWrap: "anywhere" }}
                >
                  + {change.path}: {JSON.stringify(change.after)}
                </Typography>
              </Box>
            ))}
          </Paper>
        );
      })}
    </Stack>
  );
}
