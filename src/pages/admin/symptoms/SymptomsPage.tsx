import type { SymptomAnswerOption, SymptomQuestion } from "@/api/symptom/types";
import {
  useAllSymptomAnswers,
  useAllSymptomQuestions,
  useAnswersByQuestionId,
  useDeleteSymptomAnswer,
  useDeleteSymptomQuestion,
  useRootSymptomQuestions,
} from "@/api/hooks/useSymptoms";
import { AnswerFormDialog } from "@/pages/admin/symptoms/AnswerFormDialog";
import { QuestionFormDialog } from "@/pages/admin/symptoms/QuestionFormDialog";
import { buildQuestionTree, type QuestionNode } from "@/pages/admin/symptoms/symptomUtils";
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
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlined";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import { useMemo, useState } from "react";

type QuestionDialogState =
  | { open: false; mode: "create" | "edit"; question: null }
  | { open: true; mode: "create" | "edit"; question: SymptomQuestion | null };

type AnswerDialogState =
  | { open: false; mode: "create" | "edit"; answer: null }
  | {
      open: true;
      mode: "create" | "edit";
      answer: SymptomAnswerOption | null;
    };

export default function SymptomsPage() {
  const rootsQuery = useRootSymptomQuestions();
  const allQuestionsQuery = useAllSymptomQuestions();
  const allAnswersQuery = useAllSymptomAnswers();

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [selectedAnswerIdForBranch, setSelectedAnswerIdForBranch] = useState<string | null>(
    null,
  );

  const [questionDialog, setQuestionDialog] = useState<QuestionDialogState>({
    open: false,
    mode: "create",
    question: null,
  });
  const [answerDialog, setAnswerDialog] = useState<AnswerDialogState>({
    open: false,
    mode: "create",
    answer: null,
  });

  const [deleteQuestionTarget, setDeleteQuestionTarget] =
    useState<SymptomQuestion | null>(null);
  const [deleteAnswerTarget, setDeleteAnswerTarget] =
    useState<SymptomAnswerOption | null>(null);

  const deleteQuestionMutation = useDeleteSymptomQuestion();
  const deleteAnswerMutation = useDeleteSymptomAnswer();

  const allQuestions = allQuestionsQuery.data ?? [];
  const allAnswers = allAnswersQuery.data ?? [];
  const rootQuestions = rootsQuery.data ?? [];

  const selectedQuestion = useMemo(() => {
    if (selectedQuestionId) {
      return allQuestions.find((q) => q.id === selectedQuestionId) ?? null;
    }
    return rootQuestions[0] ?? null;
  }, [selectedQuestionId, allQuestions, rootQuestions]);

  const answersQuery = useAnswersByQuestionId(selectedQuestion?.id ?? null);
  const answersForSelectedQuestion = answersQuery.data ?? [];

  const answerToQuestionMap = useMemo(() => {
    const map = new Map<string, SymptomQuestion>();
    for (const answer of allAnswers) {
      const ownerQuestion = allQuestions.find((q) => q.id === answer.questionId);
      if (ownerQuestion) {
        map.set(answer.id, ownerQuestion);
      }
    }
    return map;
  }, [allAnswers, allQuestions]);

  const questionTree = useMemo(
    () => buildQuestionTree(allQuestions, answerToQuestionMap),
    [allQuestions, answerToQuestionMap],
  );

  const openCreateRootQuestion = () => {
    setQuestionDialog({ open: true, mode: "create", question: null });
    setSelectedAnswerIdForBranch(null);
  };

  const openCreateChildQuestion = (parentAnswerId: string) => {
    setSelectedAnswerIdForBranch(parentAnswerId);
    setQuestionDialog({ open: true, mode: "create", question: null });
  };

  const openEditQuestion = (question: SymptomQuestion) => {
    setQuestionDialog({ open: true, mode: "edit", question });
  };

  const openCreateAnswer = () => {
    if (!selectedQuestion) return;
    setAnswerDialog({ open: true, mode: "create", answer: null });
  };

  const openEditAnswer = (answer: SymptomAnswerOption) => {
    setAnswerDialog({ open: true, mode: "edit", answer });
  };

  const handleCloseQuestionDialog = () => {
    setQuestionDialog({ open: false, mode: "create", question: null });
  };

  const handleCloseAnswerDialog = () => {
    setAnswerDialog({ open: false, mode: "create", answer: null });
  };

  const confirmDeleteQuestion = () => {
    if (!deleteQuestionTarget) return;
    deleteQuestionMutation.mutate(deleteQuestionTarget.id, {
      onSuccess: () => {
        if (selectedQuestionId === deleteQuestionTarget.id) {
          setSelectedQuestionId(null);
        }
        setDeleteQuestionTarget(null);
      },
    });
  };

  const confirmDeleteAnswer = () => {
    if (!deleteAnswerTarget) return;
    deleteAnswerMutation.mutate(deleteAnswerTarget.id, {
      onSuccess: () => {
        setDeleteAnswerTarget(null);
      },
    });
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Typography variant="h4" component="h1" fontWeight={600}>
          Symptoms
        </Typography>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openCreateRootQuestion}>
          Add root question
        </Button>
      </Stack>

      {(rootsQuery.isError || allQuestionsQuery.isError || allAnswersQuery.isError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load symptom data. Please refresh the page.
        </Alert>
      )}

      <Stack direction={{ xs: "column", lg: "row" }} spacing={2}>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            width: { xs: "100%", lg: 380 },
            maxHeight: "72vh",
            overflow: "auto",
          }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
            Question tree
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Root and nested symptom questions based on parent answer links.
          </Typography>
          {allQuestionsQuery.isLoading || allAnswersQuery.isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={28} />
            </Box>
          ) : questionTree.length === 0 ? (
            <Typography color="text.secondary">No questions yet.</Typography>
          ) : (
            <List disablePadding>
              {questionTree.map((node) => (
                <QuestionTreeNode
                  key={node.id}
                  node={node}
                  level={0}
                  selectedQuestionId={selectedQuestion?.id ?? null}
                  onSelectQuestion={(questionId) => setSelectedQuestionId(questionId)}
                  onEditQuestion={(question) => openEditQuestion(question)}
                  onDeleteQuestion={(question) => setDeleteQuestionTarget(question)}
                />
              ))}
            </List>
          )}
        </Paper>

        <Paper
          variant="outlined"
          sx={{ p: 2, flex: 1, minHeight: 500, overflow: "auto" }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
            spacing={1}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {selectedQuestion ? selectedQuestion.text : "Select a question"}
              </Typography>
              {selectedQuestion && (
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip label={selectedQuestion.questionType} size="small" />
                  {selectedQuestion.parentAnswerId && (
                    <Chip label="Child question" size="small" variant="outlined" />
                  )}
                </Stack>
              )}
            </Box>
            <Stack direction="row" spacing={1}>
              {selectedQuestion && (
                <Button
                  variant="outlined"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() => openEditQuestion(selectedQuestion)}
                >
                  Edit question
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={openCreateAnswer}
                disabled={!selectedQuestion}
              >
                Add answer
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {!selectedQuestion ? (
            <Typography color="text.secondary">
              Select a question from the tree to manage answer options.
            </Typography>
          ) : answersQuery.isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={28} />
            </Box>
          ) : answersQuery.isError ? (
            <Alert severity="error">Failed to load answers for this question.</Alert>
          ) : answersForSelectedQuestion.length === 0 ? (
            <Typography color="text.secondary">
              No answer options yet for this question.
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {answersForSelectedQuestion.map((answer) => (
                <Paper key={answer.id} variant="outlined" sx={{ p: 1.5 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={1}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={600}>{answer.text}</Typography>
                      {answer.instructionText && (
                        <Typography variant="body2" color="text.secondary">
                          {answer.instructionText}
                        </Typography>
                      )}
                      {answer.animationKey?.fileName && (
                        <Typography variant="caption" color="text.secondary">
                          Animation key: {answer.animationKey.fileName}
                        </Typography>
                      )}
                    </Box>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Create child question from this answer">
                        <IconButton
                          size="small"
                          onClick={() => openCreateChildQuestion(answer.id)}
                        >
                          <CallSplitIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit answer">
                        <IconButton size="small" onClick={() => openEditAnswer(answer)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete answer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteAnswerTarget(answer)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Paper>
      </Stack>

      <QuestionFormDialog
        open={questionDialog.open}
        mode={questionDialog.mode}
        question={questionDialog.mode === "edit" ? questionDialog.question : null}
        answers={allAnswers}
        initialParentAnswerId={selectedAnswerIdForBranch}
        onClose={() => {
          handleCloseQuestionDialog();
          setSelectedAnswerIdForBranch(null);
        }}
      />

      <AnswerFormDialog
        open={answerDialog.open}
        mode={answerDialog.mode}
        questionId={selectedQuestion?.id ?? null}
        answer={answerDialog.answer}
        onClose={handleCloseAnswerDialog}
      />

      <Dialog
        open={deleteQuestionTarget !== null}
        onClose={() => !deleteQuestionMutation.isPending && setDeleteQuestionTarget(null)}
      >
        <DialogTitle>Delete question</DialogTitle>
        <DialogContent>
          {deleteQuestionMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to delete question.
            </Alert>
          )}
          <DialogContentText>
            Delete question &quot;{deleteQuestionTarget?.text}&quot;? This can affect nested
            symptom flow.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteQuestionTarget(null)}
            disabled={deleteQuestionMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteQuestionMutation.isPending}
            onClick={confirmDeleteQuestion}
          >
            {deleteQuestionMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteAnswerTarget !== null}
        onClose={() => !deleteAnswerMutation.isPending && setDeleteAnswerTarget(null)}
      >
        <DialogTitle>Delete answer option</DialogTitle>
        <DialogContent>
          {deleteAnswerMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to delete answer option.
            </Alert>
          )}
          <DialogContentText>
            Delete answer option &quot;{deleteAnswerTarget?.text}&quot;?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteAnswerTarget(null)}
            disabled={deleteAnswerMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteAnswerMutation.isPending}
            onClick={confirmDeleteAnswer}
          >
            {deleteAnswerMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function QuestionTreeNode({
  node,
  level,
  selectedQuestionId,
  onSelectQuestion,
  onEditQuestion,
  onDeleteQuestion,
}: {
  node: QuestionNode;
  level: number;
  selectedQuestionId: string | null;
  onSelectQuestion: (id: string) => void;
  onEditQuestion: (question: SymptomQuestion) => void;
  onDeleteQuestion: (question: SymptomQuestion) => void;
}) {
  return (
    <>
      <ListItem
        disableGutters
        sx={{
          pl: level * 2,
          py: 0.25,
        }}
        secondaryAction={
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" onClick={() => onEditQuestion(node)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => onDeleteQuestion(node)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        }
      >
        <ListItemButton
          selected={selectedQuestionId === node.id}
          onClick={() => onSelectQuestion(node.id)}
          sx={{ pr: 8, borderRadius: 1 }}
        >
          <ListItemText
            primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
            secondaryTypographyProps={{ fontSize: 12 }}
            primary={node.text}
            secondary={node.questionType}
          />
        </ListItemButton>
      </ListItem>
      {node.children.map((child) => (
        <QuestionTreeNode
          key={child.id}
          node={child}
          level={level + 1}
          selectedQuestionId={selectedQuestionId}
          onSelectQuestion={onSelectQuestion}
          onEditQuestion={onEditQuestion}
          onDeleteQuestion={onDeleteQuestion}
        />
      ))}
    </>
  );
}
