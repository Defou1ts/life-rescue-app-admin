import type { HistoricalEmergencyListItem } from "@/api/emergency/types";
import { useHistoricalEmergencyDetails } from "@/api/hooks/useEmergency";
import {
  DeclinedParamedicCard,
  DetailPersonRow,
  DetailRow,
  DetailSection,
  formatDate,
  formatLocation,
  SymptomTreeView,
} from "@/pages/admin/emergency/emergencyUi";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

type HistoricalEmergencyDetailDialogProps = {
  emergency: HistoricalEmergencyListItem | null;
  onClose: () => void;
};

export function HistoricalEmergencyDetailDialog({
  emergency,
  onClose,
}: HistoricalEmergencyDetailDialogProps) {
  const emergencyId = emergency?.emergencyId ?? null;
  const { data, isLoading, isError, refetch } =
    useHistoricalEmergencyDetails(emergencyId);

  return (
    <Dialog open={emergency !== null} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 1 }}>
        Historical emergency
        {emergency && (
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
            <Chip label={emergency.status} size="small" />
            {emergency.resolution && (
              <Chip label={emergency.resolution} size="small" variant="outlined" />
            )}
          </Stack>
        )}
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2 }}>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Alert
            severity="error"
            action={<Button onClick={() => refetch()}>Retry</Button>}
          >
            Failed to load emergency details.
          </Alert>
        )}

        {data && !isLoading && (
          <>
            <DetailSection title="Overview">
              <DetailRow label="Emergency ID" value={data.emergencyId} monospace />
              <DetailRow label="Status" value={data.status} />
              <DetailRow label="Resolution" value={data.resolution} />
              <DetailRow
                label="Resolution explanation"
                value={data.resolutionExplanation}
                fullWidth
              />
              <DetailRow label="Rate" value={data.rate} />
              <DetailRow label="Attempt count" value={data.attemptCount} />
              <DetailRow label="Feedback" value={data.feedback} fullWidth />
            </DetailSection>

            <DetailSection title="Participants">
              <DetailPersonRow
                label="Initiator"
                name={data.initiatorName}
                id={data.initiatorId}
              />
              <DetailPersonRow
                label="Assigned paramedic"
                name={data.assignedParamedicName}
                id={data.assignedParamedicId}
              />
              <DetailPersonRow
                label="Finished by paramedic"
                name={data.finishedByParamedicName}
                id={data.finishedByParamedicId}
              />
            </DetailSection>

            <DetailSection title="Timeline">
              <DetailRow
                label="Emergency created"
                value={formatDate(data.emergencyCreatedAt)}
              />
              <DetailRow
                label="Emergency updated"
                value={formatDate(data.emergencyUpdatedAt)}
              />
              <DetailRow label="Finished at" value={formatDate(data.finishedAt)} />
              <DetailRow
                label="Snapshot created"
                value={formatDate(data.createdAt)}
              />
            </DetailSection>

            <DetailSection title="Locations">
              <DetailRow
                label="Initiator"
                value={formatLocation(data.initiatorLocation)}
                monospace
              />
              <DetailRow
                label="Paramedic accepted"
                value={formatLocation(data.paramedicAcceptedLocation)}
                monospace
              />
              <DetailRow
                label="Current paramedic"
                value={formatLocation(data.currentParamedicLocation)}
                monospace
              />
              <DetailRow
                label="Final closest"
                value={formatLocation(data.finalClosestLocation)}
                monospace
              />
            </DetailSection>

            {data.declinedParamedic.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{
                    mb: 1.5,
                    pb: 1,
                    borderBottom: 2,
                    borderColor: "primary.main",
                  }}
                >
                  Declined paramedics
                </Typography>
                <Stack spacing={1.5}>
                  {data.declinedParamedic.map((item) => (
                    <DeclinedParamedicCard
                      key={item.id}
                      title={
                        [item.firstName, item.paramedicId]
                          .filter(Boolean)
                          .join(" — ") || item.paramedicId
                      }
                      reason={item.reason}
                      explanation={item.reasonExplanation}
                      subtitle={formatDate(item.declinedAt) ?? "—"}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{
                  mb: 1.5,
                  pb: 1,
                  borderBottom: 2,
                  borderColor: "primary.main",
                }}
              >
                Symptom tree
              </Typography>
              <SymptomTreeView items={data.symptomTree} />
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
