export type SymptomQuestion = {
  id: string;
  text: string;
  questionType: string;
  parentAnswerId: string | null;
};

export type ImageDto = {
  base64Content: string;
  fileName: string;
};

export type SymptomAnswerOption = {
  id: string;
  text: string;
  instructionText: string | null;
  animationKey: ImageDto | null;
  questionId: string;
};

export type EnumValue = {
  id: number;
  name: string;
};

export type CreateSymptomQuestionRequest = {
  text: string;
  questionType: number;
  parentAnswerId: string | null;
};

export type UpdateSymptomQuestionRequest = {
  questionId: string;
  questionType: number;
  text: string;
};

export type CreateSymptomAnswerRequest = {
  text: string;
  instructionText: string;
  animationKey: File | null;
  questionId: string;
};

export type UpdateSymptomAnswerRequest = {
  id: string;
  text: string;
  instructionText: string;
  animationKey: File | null;
};
