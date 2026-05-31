import type { Allergy } from "@/api/allergy/types";
import {
  useCreateAllergy,
  useUpdateAllergy,
} from "@/api/hooks/useAllergies";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type AllergyFormData = {
  name: string;
};

type AllergyFormDialogProps = {
  open: boolean;
  allergy: Allergy | null;
  onClose: () => void;
};

export function AllergyFormDialog({
  open,
  allergy,
  onClose,
}: AllergyFormDialogProps) {
  const isEdit = allergy !== null;
  const createMutation = useCreateAllergy();
  const updateMutation = useUpdateAllergy();
  const mutation = isEdit ? updateMutation : createMutation;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AllergyFormData>({
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (!open) return;

    reset({ name: allergy?.name ?? "" });
    createMutation.reset();
    updateMutation.reset();
  }, [open, allergy?.id, allergy?.name, reset]);

  const handleClose = () => {
    if (!mutation.isPending) {
      onClose();
    }
  };

  const onSubmit = (data: AllergyFormData) => {
    if (isEdit && allergy) {
      updateMutation.mutate(
        { id: allergy.id, name: data.name },
        { onSuccess: onClose },
      );
      return;
    }

    createMutation.mutate({ name: data.name }, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>{isEdit ? "Edit allergy" : "Add allergy"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {mutation.isError && (
            <Alert severity="error">
              Failed to {isEdit ? "update" : "create"} allergy. Please try again.
            </Alert>
          )}
          <Controller
            control={control}
            name="name"
            rules={{
              required: "Name is required",
              minLength: { value: 1, message: "Name is required" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                autoFocus
                fullWidth
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : isEdit ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
