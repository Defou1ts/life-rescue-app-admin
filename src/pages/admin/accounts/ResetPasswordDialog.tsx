import { usePasswordResetMethods, useResetAccountPassword } from "@/api/hooks/useAccounts";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";

type ResetPasswordDialogProps = {
  open: boolean;
  accountId: string | null;
  onClose: () => void;
};

export function ResetPasswordDialog({
  open,
  accountId,
  onClose,
}: ResetPasswordDialogProps) {
  const { data: methods = [] } = usePasswordResetMethods(open);
  const resetMutation = useResetAccountPassword();
  const [method, setMethod] = useState<number>(1);
  const [result, setResult] = useState<{
    email: string;
    temporaryPassword: string;
  } | null>(null);

  useEffect(() => {
    if (!open) return;
    setResult(null);
    resetMutation.reset();
  }, [open]);

  useEffect(() => {
    if (!open || methods.length === 0) return;
    setMethod(methods[0].id);
  }, [open, methods.length, methods[0]?.id]);

  const handleClose = () => {
    if (resetMutation.isPending) return;
    onClose();
  };

  const handleSubmit = () => {
    if (!accountId) return;

    resetMutation.mutate(
      { accountId, passwordResetMethod: method },
      {
        onSuccess: (data) => {
          if (data) {
            setResult(data);
          } else {
            handleClose();
          }
        },
      },
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Reset password</DialogTitle>
      {result ? (
        <>
          <DialogContent>
            <Alert severity="success" sx={{ mb: 2 }}>
              Password reset completed.
            </Alert>
            <Alert severity="info">
              Email: <strong>{result.email}</strong>
              <br />
              Temporary password: <strong>{result.temporaryPassword}</strong>
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleClose}>
              Done
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogContent sx={{ pt: 1 }}>
            {resetMutation.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to reset password.
              </Alert>
            )}
            <FormControl fullWidth>
              <InputLabel id="reset-method-label">Method</InputLabel>
              <Select
                labelId="reset-method-label"
                label="Method"
                value={method}
                onChange={(e) => setMethod(Number(e.target.value))}
              >
                {methods.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={resetMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? "Resetting..." : "Reset"}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
