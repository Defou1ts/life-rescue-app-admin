import type {
  HistoricalEmergencyListItem,
  OngoingEmergencyListItem,
} from "@/api/emergency/types";
import {
  useHistoricalEmergencies,
  useOngoingEmergencies,
} from "@/api/hooks/useEmergency";
import { HistoricalEmergencyDetailDialog } from "@/pages/admin/emergency/HistoricalEmergencyDetailDialog";
import { OngoingEmergencyDetailDialog } from "@/pages/admin/emergency/OngoingEmergencyDetailDialog";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";

const PAGE_SIZE = 10;

export default function EmergencyPage() {
  const [tab, setTab] = useState(0);
  const [ongoingPage, setOngoingPage] = useState(0);
  const [historicalPage, setHistoricalPage] = useState(0);
  const [selectedOngoing, setSelectedOngoing] =
    useState<OngoingEmergencyListItem | null>(null);
  const [selectedHistorical, setSelectedHistorical] =
    useState<HistoricalEmergencyListItem | null>(null);

  const ongoingQuery = useOngoingEmergencies(ongoingPage + 1, PAGE_SIZE);
  const historicalQuery = useHistoricalEmergencies(historicalPage + 1, PAGE_SIZE);

  const ongoingItems = ongoingQuery.data?.items ?? [];
  const historicalItems = historicalQuery.data?.items ?? [];

  const handleTabChange = (_: unknown, value: number) => {
    setTab(value);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight={600} sx={{ mb: 2 }}>
        Emergency
      </Typography>

      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Ongoing" />
        <Tab label="Historical" />
      </Tabs>

      {tab === 0 && (
        <>
          {ongoingQuery.isError && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              action={
                <Button onClick={() => ongoingQuery.refetch()}>Retry</Button>
              }
            >
              Failed to load ongoing emergencies.
            </Alert>
          )}

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Initiator ID</TableCell>
                  <TableCell>Paramedic ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ongoingQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={32} />
                    </TableCell>
                  </TableRow>
                ) : ongoingItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No ongoing emergencies.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  ongoingItems.map((item) => (
                    <TableRow
                      key={item.id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => setSelectedOngoing(item)}
                    >
                      <TableCell sx={{ fontFamily: "monospace", fontSize: 13 }}>
                        {item.initiatorId ?? "—"}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "monospace", fontSize: 13 }}>
                        {item.assignedParamedicId ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Chip label={item.status} size="small" />
                      </TableCell>
                      <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        {item.updatedAt
                          ? new Date(item.updatedAt).toLocaleString()
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={ongoingQuery.data?.totalCount ?? 0}
              page={ongoingPage}
              onPageChange={(_, newPage) => setOngoingPage(newPage)}
              rowsPerPage={PAGE_SIZE}
              rowsPerPageOptions={[PAGE_SIZE]}
            />
          </TableContainer>

          {selectedOngoing && (
            <OngoingEmergencyDetailDialog
              emergency={selectedOngoing}
              onClose={() => setSelectedOngoing(null)}
            />
          )}
        </>
      )}

      {tab === 1 && (
        <>
          {historicalQuery.isError && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              action={
                <Button onClick={() => historicalQuery.refetch()}>Retry</Button>
              }
            >
              Failed to load historical emergencies.
            </Alert>
          )}

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Initiator</TableCell>
                  <TableCell>Paramedic</TableCell>
                  <TableCell>Resolution</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Finished</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historicalQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={32} />
                    </TableCell>
                  </TableRow>
                ) : historicalItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No historical emergencies.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  historicalItems.map((item) => (
                    <TableRow
                      key={item.emergencyId}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => setSelectedHistorical(item)}
                    >
                      <TableCell>
                        {item.initiatorName ?? item.initiatorId ?? "—"}
                      </TableCell>
                      <TableCell>
                        {item.finishedByParamedicName ??
                          item.finishedByParamedicId ??
                          "—"}
                      </TableCell>
                      <TableCell>{item.resolution ?? "—"}</TableCell>
                      <TableCell>
                        <Chip label={item.status} size="small" />
                      </TableCell>
                      <TableCell>
                        {item.finishedAt
                          ? new Date(item.finishedAt).toLocaleString()
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={historicalQuery.data?.totalCount ?? 0}
              page={historicalPage}
              onPageChange={(_, newPage) => setHistoricalPage(newPage)}
              rowsPerPage={PAGE_SIZE}
              rowsPerPageOptions={[PAGE_SIZE]}
            />
          </TableContainer>

          {selectedHistorical && (
            <HistoricalEmergencyDetailDialog
              emergency={selectedHistorical}
              onClose={() => setSelectedHistorical(null)}
            />
          )}
        </>
      )}
    </Box>
  );
}
