import type { KycListItem } from "@/api/kyc/types";
import {
  useApproveKyc,
  useKycDetails,
  useRejectKyc,
} from "@/api/hooks/useKyc";
import { KycImagePreview } from "@/pages/admin/kyc/KycImagePreview";
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
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

type KycDetailDialogProps = {
  kyc: KycListItem | null;
  onClose: () => void;
  onActionComplete: () => void;
};

export function KycDetailDialog({
  kyc,
  onClose,
  onActionComplete,
}: KycDetailDialogProps) {
  const kycId = kyc?.id ?? null;
  const { data: details, isLoading, isError, refetch } = useKycDetails(kycId);
  const approveMutation = useApproveKyc();
  const rejectMutation = useRejectKyc();

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  const handleClose = () => {
    if (approveMutation.isPending || rejectMutation.isPending) return;
    setRejectOpen(false);
    setRejectReason("");
    setRejectError("");
    approveMutation.reset();
    rejectMutation.reset();
    onClose();
  };

  const handleApprove = () => {
    if (!kycId) return;

    approveMutation.mutate(kycId, {
      onSuccess: () => {
        onActionComplete();
        handleClose();
      },
    });
  };

  const handleReject = () => {
    if (!kycId) return;

    const trimmed = rejectReason.trim();
    if (!trimmed) {
      setRejectError("Reject reason is required");
      return;
    }

    rejectMutation.mutate(
      { kycId, rejectReason: trimmed },
      {
        onSuccess: () => {
          onActionComplete();
          handleClose();
        },
      },
    );
  };

  const actionPending = approveMutation.isPending || rejectMutation.isPending;

  return (
    <Dialog open={kyc !== null} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>KYC application</DialogTitle>
      <DialogContent>
        {kyc && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            <Chip label={`Status: ${kyc.status}`} size="small" />
            <Typography variant="body2" color="text.secondary">
              Account: {kyc.accountId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submitted: {new Date(kyc.createdAt).toLocaleString()}
            </Typography>
          </Box>
        )}

        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
            Failed to load KYC details.
          </Alert>
        )}

        {approveMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to approve application.
          </Alert>
        )}

        {rejectMutation.isError && !rejectOpen && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to reject application.
          </Alert>
        )}

        {details && !isLoading && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <KycImagePreview
                title="Identity document"
                image={details.identityDocument}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <KycImagePreview title="Selfie" image={details.selfie} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <KycImagePreview
                title="Certification document"
                image={details.certificationDocument}
              />
            </Grid>
          </Grid>
        )}

        {rejectOpen && (
          <Box sx={{ mt: 3 }}>
            <TextField
              label="Reject reason"
              value={rejectReason}
              onChange={(e) => {
                setRejectReason(e.target.value);
                setRejectError("");
              }}
              fullWidth
              multiline
              minRows={3}
              error={Boolean(rejectError)}
              helperText={rejectError}
              disabled={rejectMutation.isPending}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={actionPending}>
          Close
        </Button>
        {!rejectOpen ? (
          <>
            <Button
              color="error"
              variant="outlined"
              onClick={() => setRejectOpen(true)}
              disabled={isLoading || isError || actionPending}
            >
              Reject
            </Button>
            <Button
              color="success"
              variant="contained"
              onClick={handleApprove}
              disabled={isLoading || isError || actionPending}
            >
              {approveMutation.isPending ? "Approving..." : "Approve"}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => {
                setRejectOpen(false);
                setRejectReason("");
                setRejectError("");
              }}
              disabled={rejectMutation.isPending}
            >
              Cancel reject
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleReject}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? "Rejecting..." : "Confirm reject"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
