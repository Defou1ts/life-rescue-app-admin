import type { Disease } from "@/api/disease/types";
import { useCreateDisease, useUpdateDisease } from "@/api/hooks/useDiseases";
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

type DiseaseFormData = {
  name: string;
};

type DiseaseFormDialogProps = {
  open: boolean;
  disease: Disease | null;
  onClose: () => void;
};

export function DiseaseFormDialog({
  open,
  disease,
  onClose,
}: DiseaseFormDialogProps) {
  const isEdit = disease !== null;
  const createMutation = useCreateDisease();
  const updateMutation = useUpdateDisease();
  const mutation = isEdit ? updateMutation : createMutation;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DiseaseFormData>({
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (!open) return;

    reset({ name: disease?.name ?? "" });
    createMutation.reset();
    updateMutation.reset();
  }, [open, disease?.id, disease?.name, reset]);

  const handleClose = () => {
    if (!mutation.isPending) {
      onClose();
    }
  };

  const onSubmit = (data: DiseaseFormData) => {
    if (isEdit && disease) {
      updateMutation.mutate(
        { id: disease.id, name: data.name },
        { onSuccess: onClose },
      );
      return;
    }

    createMutation.mutate({ name: data.name }, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>{isEdit ? "Edit disease" : "Add disease"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {mutation.isError && (
            <Alert severity="error">
              Failed to {isEdit ? "update" : "create"} disease. Please try again.
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
