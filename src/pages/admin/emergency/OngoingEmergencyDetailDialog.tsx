import type { OngoingEmergencyListItem } from "@/api/emergency/types";
import { useOngoingEmergencyDetails } from "@/api/hooks/useEmergency";
import {
  DeclinedParamedicCard,
  DetailRow,
  DetailSection,
  formatDate,
  formatLocation,
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

type OngoingEmergencyDetailDialogProps = {
  emergency: OngoingEmergencyListItem | null;
  onClose: () => void;
};

export function OngoingEmergencyDetailDialog({
  emergency,
  onClose,
}: OngoingEmergencyDetailDialogProps) {
  const emergencyId = emergency?.id ?? null;
  const { data, isLoading, isError, refetch } =
    useOngoingEmergencyDetails(emergencyId);

  return (
    <Dialog open={emergency !== null} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 1 }}>
        Ongoing emergency
        {emergency && (
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip label={emergency.status} size="small" color="warning" />
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
              <DetailRow label="Emergency ID" value={data.id} monospace />
              <DetailRow label="Status" value={data.status} />
              <DetailRow label="Feedback" value={data.feedback} fullWidth />
            </DetailSection>

            <DetailSection title="Participants">
              <DetailRow
                label="Initiator ID"
                value={data.initiatorId}
                monospace
              />
              <DetailRow
                label="Assigned paramedic ID"
                value={data.assignedParamedicId}
                monospace
              />
              <DetailRow
                label="Finished by paramedic ID"
                value={data.finishedByParamedicId}
                monospace
              />
            </DetailSection>

            <DetailSection title="Timeline">
              <DetailRow label="Created at" value={formatDate(data.createdAt)} />
              <DetailRow
                label="Updated at"
                value={formatDate(emergency?.updatedAt)}
              />
              <DetailRow label="Finished at" value={formatDate(data.finishedAt)} />
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
                label="Final closest"
                value={formatLocation(data.finalClosestLocation)}
                monospace
              />
            </DetailSection>

            {data.declinedParamedics.length > 0 && (
              <Box sx={{ mb: 2 }}>
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
                  {data.declinedParamedics.map((item) => (
                    <DeclinedParamedicCard
                      key={`${item.paramedicId}-${item.declinedAt}`}
                      title={item.paramedicId}
                      reason={item.reason}
                      subtitle={formatDate(item.declinedAt) ?? "—"}
                    />
                  ))}
                </Stack>
              </Box>
            )}
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
