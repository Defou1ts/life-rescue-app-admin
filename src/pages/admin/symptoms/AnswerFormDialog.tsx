import type { SymptomAnswerOption } from "@/api/symptom/types";
import {
  useCreateSymptomAnswer,
  useUpdateSymptomAnswer,
} from "@/api/hooks/useSymptoms";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type AnswerFormData = {
  text: string;
  instructionText: string;
};

type AnswerFormDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  questionId: string | null;
  answer: SymptomAnswerOption | null;
  onClose: () => void;
};

export function AnswerFormDialog({
  open,
  mode,
  questionId,
  answer,
  onClose,
}: AnswerFormDialogProps) {
  const createMutation = useCreateSymptomAnswer();
  const updateMutation = useUpdateSymptomAnswer();
  const mutation = mode === "create" ? createMutation : updateMutation;
  const [file, setFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string>("");

  const previewImageSrc = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    if (answer?.animationKey?.base64Content) {
      const ext = answer.animationKey.fileName.split(".").pop()?.toLowerCase();
      const mime =
        ext === "png"
          ? "image/png"
          : ext === "webp"
            ? "image/webp"
            : ext === "gif"
              ? "image/gif"
              : "image/jpeg";
      return `data:${mime};base64,${answer.animationKey.base64Content}`;
    }
    return null;
  }, [file, answer]);

  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(previewImageSrc ?? "");
      }
    };
  }, [file, previewImageSrc]);

  const { control, handleSubmit, reset, formState } = useForm<AnswerFormData>({
    defaultValues: {
      text: "",
      instructionText: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      text: answer?.text ?? "",
      instructionText: answer?.instructionText ?? "",
    });
    setFile(null);
    setSubmitError("");
    createMutation.reset();
    updateMutation.reset();
  }, [open, answer, reset]);

  const onSubmit = (data: AnswerFormData) => {
    setSubmitError("");

    if (mode === "create") {
      if (!questionId) return;
      createMutation.mutate(
        {
          text: data.text.trim(),
          instructionText: data.instructionText.trim(),
          animationKey: file,
          questionId,
        },
        {
          onSuccess: onClose,
          onError: () => setSubmitError("Failed to create answer option."),
        },
      );
      return;
    }

    if (!answer) return;

    updateMutation.mutate(
      {
        id: answer.id,
        text: data.text.trim(),
        instructionText: data.instructionText.trim(),
        animationKey: file,
      },
      {
        onSuccess: onClose,
        onError: () => setSubmitError("Failed to update answer option."),
      },
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "create" ? "Create answer option" : "Edit answer option"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {submitError && <Alert severity="error">{submitError}</Alert>}
          <Controller
            control={control}
            name="text"
            rules={{
              required: "Answer text is required",
              maxLength: {
                value: 500,
                message: "Answer text must be 500 characters or less",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Answer text"
                fullWidth
                multiline
                minRows={2}
                error={Boolean(formState.errors.text)}
                helperText={formState.errors.text?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="instructionText"
            render={({ field }) => (
              <TextField
                {...field}
                label="Instruction text"
                fullWidth
                multiline
                minRows={2}
              />
            )}
          />

          <Box>
            <Button variant="outlined" component="label">
              {mode === "create" ? "Upload image (optional)" : "Replace image"}
              <input
                type="file"
                hidden
                accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,image/*"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0] ?? null;
                  setFile(selectedFile);
                }}
              />
            </Button>
            <Typography variant="caption" display="block" color="text.secondary" mt={0.75}>
              Allowed: jpg, jpeg, png, gif, bmp, webp. Max size: 5 MB.
            </Typography>
          </Box>

          {previewImageSrc && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Animation key preview
              </Typography>
              <Box
                component="img"
                src={previewImageSrc}
                alt="Animation key preview"
                sx={{
                  mt: 0.75,
                  width: "100%",
                  maxHeight: 220,
                  objectFit: "contain",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              />
              {answer?.animationKey?.fileName && (
                <Typography variant="caption" color="text.secondary">
                  Current file: {answer.animationKey.fileName}
                </Typography>
              )}
            </Box>
          )}

          {mode === "edit" && answer?.animationKey && !file && (
            <Typography variant="caption" color="text.secondary">
              Leave file empty to keep current image.
            </Typography>
          )}

          {answer?.animationKey?.fileName && (
            <Link
              component="button"
              type="button"
              underline="hover"
              onClick={() => setFile(null)}
              sx={{ alignSelf: "flex-start" }}
            >
              Reset selected file
            </Link>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
