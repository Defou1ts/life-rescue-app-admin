import type { AccountListItem } from "@/api/account/types";
import {
  useAccountDetails,
  useDeleteAccount,
  useSoftDeleteAccount,
  useUnblockAccount,
  useUpdateAccount,
} from "@/api/hooks/useAccounts";
import { BlockAccountDialog } from "@/pages/admin/accounts/BlockAccountDialog";
import { ResetPasswordDialog } from "@/pages/admin/accounts/ResetPasswordDialog";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type AccountFormData = {
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  isTwoFactorEnabled: boolean;
  isEmailVerified: boolean;
  isTemporaryPassword: boolean;
  isTemporaryPasswordUsed: boolean;
};

type AccountDetailDialogProps = {
  account: AccountListItem | null;
  onClose: () => void;
  onActionComplete: () => void;
};

export function AccountDetailDialog({
  account,
  onClose,
  onActionComplete,
}: AccountDetailDialogProps) {
  const accountId = account?.id ?? null;
  const { data: details, isLoading, isError, refetch } = useAccountDetails(accountId);
  const updateMutation = useUpdateAccount();
  const unblockMutation = useUnblockAccount();
  const softDeleteMutation = useSoftDeleteAccount();
  const deleteMutation = useDeleteAccount();

  const [blockOpen, setBlockOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [confirmSoftDelete, setConfirmSoftDelete] = useState(false);
  const [confirmHardDelete, setConfirmHardDelete] = useState(false);

  const { control, handleSubmit, reset } = useForm<AccountFormData>({
    defaultValues: {
      name: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      isTwoFactorEnabled: false,
      isEmailVerified: false,
      isTemporaryPassword: false,
      isTemporaryPasswordUsed: false,
    },
  });

  useEffect(() => {
    if (!details) return;
    reset({
      name: details.name ?? "",
      lastName: details.lastName ?? "",
      phoneNumber: details.phoneNumber ?? "",
      email: details.email ?? "",
      isTwoFactorEnabled: details.isTwoFactorEnabled ?? false,
      isEmailVerified: details.isEmailVerified ?? false,
      isTemporaryPassword: details.isTemporaryPassword ?? false,
      isTemporaryPasswordUsed: details.isTemporaryPasswordUsed ?? false,
    });
    updateMutation.reset();
  }, [details, reset]);

  const handleClose = () => {
    const pending =
      updateMutation.isPending ||
      unblockMutation.isPending ||
      softDeleteMutation.isPending ||
      deleteMutation.isPending;
    if (pending) return;
    setConfirmSoftDelete(false);
    setConfirmHardDelete(false);
    onClose();
  };

  const onSubmit = (data: AccountFormData) => {
    if (!accountId) return;

    updateMutation.mutate(
      {
        accountId,
        payload: {
          name: data.name || null,
          lastName: data.lastName || null,
          phoneNumber: data.phoneNumber || null,
          email: data.email || null,
          isTwoFactorEnabled: data.isTwoFactorEnabled,
          isEmailVerified: data.isEmailVerified,
          isTemporaryPassword: data.isTemporaryPassword,
          isTemporaryPasswordUsed: data.isTemporaryPasswordUsed,
        },
      },
      { onSuccess: () => onActionComplete() },
    );
  };

  const handleUnblock = () => {
    if (!accountId) return;
    unblockMutation.mutate(accountId, {
      onSuccess: () => {
        onActionComplete();
        handleClose();
      },
    });
  };

  const handleSoftDelete = () => {
    if (!accountId) return;
    softDeleteMutation.mutate(accountId, {
      onSuccess: () => {
        onActionComplete();
        handleClose();
      },
    });
  };

  const handleHardDelete = () => {
    if (!accountId) return;
    deleteMutation.mutate(accountId, {
      onSuccess: () => {
        onActionComplete();
        handleClose();
      },
    });
  };

  const actionPending =
    updateMutation.isPending ||
    unblockMutation.isPending ||
    softDeleteMutation.isPending ||
    deleteMutation.isPending;

  return (
    <>
      <Dialog open={account !== null} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Account details</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            {account && (
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                {account.isBlocked && (
                  <Chip label="Blocked" color="warning" size="small" />
                )}
                {account.isDeleted && (
                  <Chip label="Deleted" color="error" size="small" />
                )}
                {account.roles.map((role) => (
                  <Chip key={role.id} label={role.title} size="small" variant="outlined" />
                ))}
              </Stack>
            )}

            {isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {isError && (
              <Alert
                severity="error"
                action={<Button onClick={() => refetch()}>Retry</Button>}
              >
                Failed to load account details.
              </Alert>
            )}

            {updateMutation.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to update account.
              </Alert>
            )}

            {details && !isLoading && (
              <Stack spacing={2}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <TextField {...field} label="Email" fullWidth />
                  )}
                />
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <TextField {...field} label="First name" fullWidth />
                  )}
                />
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field }) => (
                    <TextField {...field} label="Last name" fullWidth />
                  )}
                />
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <TextField {...field} label="Phone number" fullWidth />
                  )}
                />
                <Controller
                  control={control}
                  name="isTwoFactorEnabled"
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch checked={field.value} onChange={field.onChange} />
                      }
                      label="Two-factor enabled"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="isEmailVerified"
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch checked={field.value} onChange={field.onChange} />
                      }
                      label="Email verified"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="isTemporaryPassword"
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch checked={field.value} onChange={field.onChange} />
                      }
                      label="Temporary password"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="isTemporaryPasswordUsed"
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch checked={field.value} onChange={field.onChange} />
                      }
                      label="Temporary password used"
                    />
                  )}
                />
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ flexWrap: "wrap", gap: 1, px: 3, pb: 2 }}>
            <Button onClick={handleClose} disabled={actionPending}>
              Close
            </Button>
            <Button
              variant="outlined"
              onClick={() => setResetOpen(true)}
              disabled={isLoading || isError}
            >
              Reset password
            </Button>
            {account?.isBlocked ? (
              <Button
                color="success"
                variant="outlined"
                onClick={handleUnblock}
                disabled={actionPending || isLoading || isError}
              >
                {unblockMutation.isPending ? "Unblocking..." : "Unblock"}
              </Button>
            ) : (
              <Button
                color="warning"
                variant="outlined"
                onClick={() => setBlockOpen(true)}
                disabled={isLoading || isError}
              >
                Block
              </Button>
            )}
            <Button
              color="error"
              variant="outlined"
              onClick={() => setConfirmSoftDelete(true)}
              disabled={actionPending || isLoading || isError}
            >
              Soft delete
            </Button>
            <Button
              color="error"
              variant="outlined"
              onClick={() => setConfirmHardDelete(true)}
              disabled={actionPending || isLoading || isError}
            >
              Delete
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={actionPending || isLoading || isError}
            >
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {blockOpen && (
        <BlockAccountDialog
          open={blockOpen}
          accountId={accountId}
          onClose={() => setBlockOpen(false)}
          onSuccess={() => {
            onActionComplete();
            handleClose();
          }}
        />
      )}

      {resetOpen && (
        <ResetPasswordDialog
          open={resetOpen}
          accountId={accountId}
          onClose={() => setResetOpen(false)}
        />
      )}

      <Dialog
        open={confirmSoftDelete}
        onClose={() => !softDeleteMutation.isPending && setConfirmSoftDelete(false)}
      >
        <DialogTitle>Soft delete account</DialogTitle>
        <DialogContent>
          {softDeleteMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to soft delete account.
            </Alert>
          )}
          <DialogContentText>
            Mark account &quot;{account?.email}&quot; as deleted?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmSoftDelete(false)}
            disabled={softDeleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleSoftDelete}
            disabled={softDeleteMutation.isPending}
          >
            {softDeleteMutation.isPending ? "Deleting..." : "Soft delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmHardDelete}
        onClose={() => !deleteMutation.isPending && setConfirmHardDelete(false)}
      >
        <DialogTitle>Permanently delete account</DialogTitle>
        <DialogContent>
          {deleteMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to delete account. Requires Super Admin role.
            </Alert>
          )}
          <DialogContentText>
            Permanently delete &quot;{account?.email}&quot;? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmHardDelete(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleHardDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete permanently"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
