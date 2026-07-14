// React hooks for local component state and lifecycle side effects.
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// MUI UI primitives used to build the page.
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

// Service-layer import (Angular-style service pattern).
// The page calls this service; it does not call fetch() directly.
import { resourcesService, secretsService } from "../../services";

function GroupItem({ resource }) {
    const navigate = useNavigate();
  
  const parts = String(resource.id ?? "").split(":");
  return (
    <TableRow
      key={resource.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {parts[2]}
      </TableCell>
      <TableCell align="right">{parts[0]}</TableCell>
      <TableCell align="right">{parts[1]}</TableCell>
      <TableCell align="right">{resource.owner}</TableCell>
      <TableCell align="right">{resource.policy}</TableCell>
      <TableCell align="right">
        <Tooltip title="View group">
          <IconButton
            aria-label={`View ${resource.id}`}
            size="small"
            onClick={() => navigate(`/groups/${encodeURIComponent(parts[2])}`)}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

export default function Groups() {
  // Stores fetched resources from the API.
  const [resources, setResources] = useState([]);

  // Tracks loading state so we can show spinner/feedback.
  const [loading, setLoading] = useState(true);

  // Stores friendly error text when a request fails.
  const [error, setError] = useState("");

  // Controlled input value for search text.
  const [search, setSearch] = useState("");

  // Memoized filtered list (runs only when resources/search changes).
  // This is client-side filtering for learning/demo purposes.
  const filteredResources = useMemo(() => {
    // Normalize search value for case-insensitive compare.
    const query = search.trim().toLowerCase();

    // If query is empty, show all data.
    if (!query) {
      return resources;
    }

    // Filter by id/kind text.
    return resources.filter((resource) => {
      const id = String(resource.id ?? "").toLowerCase();
      const kind = String(resource.kind ?? "").toLowerCase();
      return id.includes(query) || kind.includes(query);
    });
  }, [resources, search]);

  // Effect runs once on first render (equivalent idea to ngOnInit).
  useEffect(() => {
    // Prevents state updates if component unmounts before request completes.
    let isMounted = true;

    // Async function for data loading.
    async function loadResources() {
      // Request started: set loading true and clear previous error.
      setLoading(true);
      setError("");

      try {
        // Service call returns a Promise.
        // Endpoint can vary by backend/version:
        // - Resource[]
        // - { items: Resource[] }
        // - { resources: Resource[] }
        const response = await resourcesService.list({
          kind: "group",
        });

        // Only update state if component still exists.
        if (isMounted) {
          setResources(response);
        }
      } catch (requestError) {
        // Normalize unknown error into a readable string.
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load resources.",
          );
        }
      } finally {
        // Always clear loading after request finishes.
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    // Execute the async loader.
    loadResources();

    // Cleanup runs on unmount.
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    // Outer page spacing wrapper.
    <Box sx={{ py: 4 }}>
      {/* Content width container */}
      <Container>
        {/* Page title */}
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Groups
        </Typography>

        {/* Intro text */}
        <Typography variant="body1">
          Browse and manage all Groups in your Conjur instance.
        </Typography>

        {/* Vertical stack for form + status + list */}
        <Stack spacing={2} sx={{ mt: 3 }}>
          {/* Search field (client-side filter) */}
          <TextField
            label="Search Groups"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Type id or kind"
            fullWidth
          />

          {/* Loading state UI */}
          {loading && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} />
              <Typography variant="body2">Loading Groups...</Typography>
            </Stack>
          )}

          {/* Error state UI */}
          {!loading && error && <Alert severity="error">{error}</Alert>}

          {/* Empty state (no data returned) */}
          {!loading && !error && resources.length === 0 && (
            <Alert severity="info">No Groups returned by API.</Alert>
          )}

          {/* Empty filter state (data exists, but search excludes all) */}
          {!loading &&
            !error &&
            resources.length > 0 &&
            filteredResources.length === 0 && (
              <Alert severity="info">No Groups match your search.</Alert>
            )}

          {/* Data list */}
          {!loading && !error && filteredResources.length > 0 && (
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Group</TableCell>
                    <TableCell align="right">Account</TableCell>
                    <TableCell align="right">Kind</TableCell>
                    <TableCell align="right">Owner</TableCell>
                    <TableCell align="right">Policy</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredResources.map((resource) => (
                    <GroupItem key={resource.id} resource={resource} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
