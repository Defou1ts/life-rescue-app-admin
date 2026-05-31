import {
  createAnswer,
  createQuestion,
  deleteAnswer,
  deleteQuestion,
  fetchAllAnswers,
  fetchAllQuestions,
  fetchAnswersByQuestionId,
  fetchQuestionByAnswerOptionId,
  fetchQuestionTypes,
  fetchRootQuestions,
  symptomKeys,
  updateAnswer,
  updateQuestion,
} from "@/api/symptom/symptomApi";
import type {
  CreateSymptomAnswerRequest,
  CreateSymptomQuestionRequest,
  UpdateSymptomAnswerRequest,
  UpdateSymptomQuestionRequest,
} from "@/api/symptom/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRootSymptomQuestions() {
  return useQuery({
    queryKey: symptomKeys.roots,
    queryFn: fetchRootQuestions,
  });
}

export function useAllSymptomQuestions() {
  return useQuery({
    queryKey: symptomKeys.questions,
    queryFn: fetchAllQuestions,
  });
}

export function useQuestionByAnswerOptionId(answerOptionId: string | null) {
  return useQuery({
    queryKey: symptomKeys.questionByAnswer(answerOptionId ?? ""),
    queryFn: () => fetchQuestionByAnswerOptionId(answerOptionId!),
    enabled: answerOptionId !== null,
  });
}

export function useAnswersByQuestionId(questionId: string | null) {
  return useQuery({
    queryKey: symptomKeys.answersByQuestion(questionId ?? ""),
    queryFn: () => fetchAnswersByQuestionId(questionId!),
    enabled: questionId !== null,
  });
}

export function useAllSymptomAnswers() {
  return useQuery({
    queryKey: symptomKeys.answersAll,
    queryFn: fetchAllAnswers,
  });
}

export function useQuestionTypes() {
  return useQuery({
    queryKey: symptomKeys.questionTypes,
    queryFn: fetchQuestionTypes,
    staleTime: 5 * 60_000,
  });
}

function useInvalidateSymptoms() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["symptom"] });
  };
}

export function useCreateSymptomQuestion() {
  const invalidate = useInvalidateSymptoms();

  return useMutation({
    mutationFn: (payload: CreateSymptomQuestionRequest) => createQuestion(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateSymptomQuestion() {
  const invalidate = useInvalidateSymptoms();

  return useMutation({
    mutationFn: (payload: UpdateSymptomQuestionRequest) => updateQuestion(payload),
    onSuccess: invalidate,
  });
}

export function useDeleteSymptomQuestion() {
  const invalidate = useInvalidateSymptoms();

  return useMutation({
    mutationFn: (questionId: string) => deleteQuestion(questionId),
    onSuccess: invalidate,
  });
}

export function useCreateSymptomAnswer() {
  const invalidate = useInvalidateSymptoms();

  return useMutation({
    mutationFn: (payload: CreateSymptomAnswerRequest) => createAnswer(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateSymptomAnswer() {
  const invalidate = useInvalidateSymptoms();

  return useMutation({
    mutationFn: (payload: UpdateSymptomAnswerRequest) => updateAnswer(payload),
    onSuccess: invalidate,
  });
}

export function useDeleteSymptomAnswer() {
  const invalidate = useInvalidateSymptoms();

  return useMutation({
    mutationFn: (answerId: string) => deleteAnswer(answerId),
    onSuccess: invalidate,
  });
}
