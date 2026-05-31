import type { SymptomAnswerOption, SymptomQuestion } from "@/api/symptom/types";
import {
  useCreateSymptomQuestion,
  useQuestionTypes,
  useUpdateSymptomQuestion,
} from "@/api/hooks/useSymptoms";
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
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type QuestionFormData = {
  text: string;
  questionType: number;
  parentAnswerId: string;
};

type QuestionFormDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  question: SymptomQuestion | null;
  answers: SymptomAnswerOption[];
  initialParentAnswerId?: string | null;
  onClose: () => void;
};

export function QuestionFormDialog({
  open,
  mode,
  question,
  answers,
  initialParentAnswerId = null,
  onClose,
}: QuestionFormDialogProps) {
  const { data: questionTypes = [] } = useQuestionTypes();
  const createMutation = useCreateSymptomQuestion();
  const updateMutation = useUpdateSymptomQuestion();
  const mutation = mode === "create" ? createMutation : updateMutation;
  const [submitError, setSubmitError] = useState<string>("");

  const defaultQuestionType = useMemo(
    () => questionTypes[0]?.id ?? 1,
    [questionTypes],
  );

  const { control, handleSubmit, reset, formState } = useForm<QuestionFormData>({
    defaultValues: {
      text: "",
      questionType: defaultQuestionType,
      parentAnswerId: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    reset({
      text: mode === "edit" ? (question?.text ?? "") : "",
      questionType: resolveQuestionTypeId(question?.questionType, questionTypes),
      parentAnswerId:
        mode === "create"
          ? (initialParentAnswerId ?? "")
          : (question?.parentAnswerId ?? ""),
    });

    setSubmitError("");
    createMutation.reset();
    updateMutation.reset();
  }, [open, mode, question, questionTypes, initialParentAnswerId, reset]);

  const onSubmit = (data: QuestionFormData) => {
    setSubmitError("");

    if (mode === "create") {
      createMutation.mutate(
        {
          text: data.text.trim(),
          questionType: data.questionType,
          parentAnswerId: data.parentAnswerId || null,
        },
        {
          onSuccess: onClose,
          onError: () => setSubmitError("Failed to create question."),
        },
      );
      return;
    }

    if (!question) return;

    updateMutation.mutate(
      {
        questionId: question.id,
        text: data.text.trim(),
        questionType: data.questionType,
      },
      {
        onSuccess: onClose,
        onError: () => setSubmitError("Failed to update question."),
      },
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "create" ? "Create question" : "Edit question"}
      </DialogTitle>
      <BoxForm onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {submitError && <Alert severity="error">{submitError}</Alert>}
          <Controller
            control={control}
            name="text"
            rules={{
              required: "Question text is required",
              maxLength: {
                value: 500,
                message: "Question text must be 500 characters or less",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Question text"
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
            name="questionType"
            rules={{ required: "Question type is required" }}
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(formState.errors.questionType)}>
                <InputLabel id="question-type-label">Question type</InputLabel>
                <Select
                  {...field}
                  labelId="question-type-label"
                  label="Question type"
                >
                  {questionTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {mode === "create" && (
            <Controller
              control={control}
              name="parentAnswerId"
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id="parent-answer-label">
                    Parent answer (optional)
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="parent-answer-label"
                    label="Parent answer (optional)"
                  >
                    <MenuItem value="">None (root question)</MenuItem>
                    {answers.map((answer) => (
                      <MenuItem key={answer.id} value={answer.id}>
                        {answer.text}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
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
      </BoxForm>
    </Dialog>
  );
}

function resolveQuestionTypeId(
  questionTypeText: string | undefined,
  questionTypes: { id: number; name: string }[],
) {
  if (!questionTypeText || questionTypes.length === 0) {
    return questionTypes[0]?.id ?? 1;
  }

  const normalizedApiValue = questionTypeText.replace(/[_\s]/g, "").toLowerCase();
  const matched = questionTypes.find(
    (type) => type.name.replace(/[_\s]/g, "").toLowerCase() === normalizedApiValue,
  );

  return matched?.id ?? questionTypes[0].id;
}

function BoxForm({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}) {
  return <form onSubmit={onSubmit}>{children}</form>;
}
