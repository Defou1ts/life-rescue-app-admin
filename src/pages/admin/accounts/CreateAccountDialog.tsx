import type { Role } from "@/api/account/types";
import { useCreateAccount } from "@/api/hooks/useAccounts";
import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type CreateAccountFormData = {
  email: string;
  roleIds: Role[];
};

type CreateAccountDialogProps = {
  open: boolean;
  roles: Role[];
  onClose: () => void;
};

export function CreateAccountDialog({
  open,
  roles,
  onClose,
}: CreateAccountDialogProps) {
  const createMutation = useCreateAccount();
  const [credentials, setCredentials] = useState<{
    email: string;
    temporaryPassword: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAccountFormData>({
    defaultValues: { email: "", roleIds: [] },
  });

  useEffect(() => {
    if (!open) return;
    reset({ email: "", roleIds: [] });
    setCredentials(null);
    createMutation.reset();
  }, [open, reset]);

  const handleClose = () => {
    if (createMutation.isPending) return;
    onClose();
  };

  const onSubmit = (data: CreateAccountFormData) => {
    createMutation.mutate(
      {
        email: data.email,
        roleIds: data.roleIds.map((r) => r.id),
      },
      {
        onSuccess: (result) => {
          setCredentials(result);
        },
      },
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create account</DialogTitle>
      {credentials ? (
        <>
          <DialogContent>
            <Alert severity="success" sx={{ mb: 2 }}>
              Account created successfully.
            </Alert>
            <Alert severity="info">
              Email: <strong>{credentials.email}</strong>
              <br />
              Temporary password: <strong>{credentials.temporaryPassword}</strong>
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleClose}>
              Done
            </Button>
          </DialogActions>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {createMutation.isError && (
              <Alert severity="error">Failed to create account.</Alert>
            )}
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="roleIds"
              rules={{ required: "At least one role is required" }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  options={roles}
                  getOptionLabel={(option) => option.title}
                  value={value}
                  onChange={(_, newValue) => onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Roles"
                      error={Boolean(errors.roleIds)}
                      helperText={errors.roleIds?.message}
                    />
                  )}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={createMutation.isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}
