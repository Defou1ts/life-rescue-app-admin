import { axiosInstance } from "@/api/axiosInstance";
import type {
  CreateSymptomAnswerRequest,
  CreateSymptomQuestionRequest,
  EnumValue,
  SymptomAnswerOption,
  SymptomQuestion,
  UpdateSymptomAnswerRequest,
  UpdateSymptomQuestionRequest,
} from "./types";

export const symptomKeys = {
  roots: ["symptom", "questions", "root"] as const,
  questions: ["symptom", "questions"] as const,
  questionByAnswer: (answerOptionId: string) =>
    ["symptom", "questions", "by-answer", answerOptionId] as const,
  answersByQuestion: (questionId: string) =>
    ["symptom", "answers", "by-question", questionId] as const,
  answersAll: ["symptom", "answers", "all"] as const,
  questionTypes: ["reference", "question-type"] as const,
};

export const fetchRootQuestions = async () => {
  const { data } = await axiosInstance.get<SymptomQuestion[]>(
    "/symptom/questions/root",
  );
  return data;
};

export const fetchAllQuestions = async () => {
  const { data } = await axiosInstance.get<SymptomQuestion[]>("/symptom/questions");
  return data;
};

export const fetchQuestionByAnswerOptionId = async (answerOptionId: string) => {
  const { data } = await axiosInstance.get<SymptomQuestion>(
    `/symptom/questions/${answerOptionId}`,
  );
  return data;
};

export const createQuestion = async (payload: CreateSymptomQuestionRequest) => {
  await axiosInstance.post("/symptom/questions", payload);
};

export const updateQuestion = async (payload: UpdateSymptomQuestionRequest) => {
  await axiosInstance.put("/symptom/questions", payload);
};

export const deleteQuestion = async (questionId: string) => {
  await axiosInstance.delete(`/symptom/questions/${questionId}`);
};

export const fetchAnswersByQuestionId = async (questionId: string) => {
  const { data } = await axiosInstance.get<SymptomAnswerOption[]>(
    `/symptom/questions/${questionId}/answers`,
  );
  return data;
};

export const fetchAllAnswers = async () => {
  const { data } = await axiosInstance.get<SymptomAnswerOption[]>("/symptom/answers");
  return data;
};

export const fetchQuestionTypes = async () => {
  const { data } = await axiosInstance.get<EnumValue[]>(
    "/reference/available-values/question-type",
  );
  return data;
};

function buildCreateAnswerFormData(payload: CreateSymptomAnswerRequest) {
  const formData = new FormData();
  formData.append("Text", payload.text);
  if (payload.instructionText) {
    formData.append("InstructionText", payload.instructionText);
  }
  if (payload.animationKey) {
    formData.append("AnimationKey", payload.animationKey);
  }
  formData.append("QuestionId", payload.questionId);
  return formData;
}

function buildUpdateAnswerFormData(payload: UpdateSymptomAnswerRequest) {
  const formData = new FormData();
  formData.append("Id", payload.id);
  if (payload.text) {
    formData.append("Text", payload.text);
  }
  if (payload.instructionText) {
    formData.append("InstructionText", payload.instructionText);
  }
  if (payload.animationKey) {
    formData.append("AnimationKey", payload.animationKey);
  }
  return formData;
}

export const createAnswer = async (payload: CreateSymptomAnswerRequest) => {
  await axiosInstance.post("/symptom/answers", buildCreateAnswerFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateAnswer = async (payload: UpdateSymptomAnswerRequest) => {
  await axiosInstance.patch("/symptom/answers", buildUpdateAnswerFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteAnswer = async (answerId: string) => {
  await axiosInstance.delete(`/symptom/answers/${answerId}`);
};
