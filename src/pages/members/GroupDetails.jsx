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
import { membershipsService, resourcesService } from "../../services";
import MembershipGroups from "./memberGroup.jsx";
import { ResourceInfo, DetailRow } from "../resources/resourceDetails.jsx";


export default function GroupDetails({ resource }) {
  const parts = String(resource.id ?? "").split(":");
  const serviceId = parts[2];
  const kind = parts[1];

  return (
    <Box sx={{ py: 2 }}>
        <Stack spacing={3}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                  <Typography variant="h6" component="h2">
                    Memberships
                  </Typography>
                  <MembershipGroups serviceId={serviceId} />
                </Stack>
              </Paper>
        </Stack>
    </Box>
  );
}
