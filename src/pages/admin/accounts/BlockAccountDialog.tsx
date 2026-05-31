import { useBlockAccount } from "@/api/hooks/useAccounts";
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

type BlockAccountDialogProps = {
  open: boolean;
  accountId: string | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function BlockAccountDialog({
  open,
  accountId,
  onClose,
  onSuccess,
}: BlockAccountDialogProps) {
  const blockMutation = useBlockAccount();
  const [isTemporary, setIsTemporary] = useState(false);
  const [blockUntil, setBlockUntil] = useState("");

  useEffect(() => {
    if (!open) return;
    setIsTemporary(false);
    setBlockUntil("");
    blockMutation.reset();
  }, [open]);

  const handleClose = () => {
    if (blockMutation.isPending) return;
    onClose();
  };

  const handleSubmit = () => {
    if (!accountId) return;

    blockMutation.mutate(
      {
        accountId,
        isTemporary,
        blockUntil: isTemporary && blockUntil ? new Date(blockUntil).toISOString() : null,
      },
      {
        onSuccess: () => {
          onSuccess();
          handleClose();
        },
      },
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Block account</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        {blockMutation.isError && (
          <Alert severity="error">Failed to block account.</Alert>
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={isTemporary}
              onChange={(e) => setIsTemporary(e.target.checked)}
            />
          }
          label="Temporary block"
        />
        {isTemporary && (
          <TextField
            label="Block until"
            type="datetime-local"
            value={blockUntil}
            onChange={(e) => setBlockUntil(e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={blockMutation.isPending}>
          Cancel
        </Button>
        <Button
          color="warning"
          variant="contained"
          onClick={handleSubmit}
          disabled={blockMutation.isPending || (isTemporary && !blockUntil)}
        >
          {blockMutation.isPending ? "Blocking..." : "Block"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
