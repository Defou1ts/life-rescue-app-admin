export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export type Location = {
  latitude: number;
  longitude: number;
};

export type OngoingEmergencyListItem = {
  id: string;
  initiatorId: string | null;
  assignedParamedicId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
};

export type DeclinedParamedic = {
  paramedicId: string;
  reason: string;
  declinedAt: string;
};

export type OngoingEmergencyDetails = {
  id: string;
  initiatorId: string | null;
  assignedParamedicId: string | null;
  finishedByParamedicId: string | null;
  declinedParamedics: DeclinedParamedic[];
  initiatorLocation: Location;
  paramedicAcceptedLocation: Location | null;
  finalClosestLocation: Location | null;
  feedback: string | null;
  status: string;
  createdAt: string;
  finishedAt: string | null;
};

export type HistoricalEmergencyListItem = {
  emergencyId: string;
  initiatorName: string | null;
  initiatorId: string | null;
  finishedByParamedicName: string | null;
  finishedByParamedicId: string | null;
  resolution: string | null;
  status: string;
  finishedAt: string | null;
  emergencyCreatedAt: string;
};

export type SymptomAnswer = {
  answerId: string;
  answerText: string;
  childrenQuestion: SymptomTreeItem[];
};

export type SymptomTreeItem = {
  questionId: string;
  questionText: string;
  selectedAnswers: SymptomAnswer[];
};

export type DeclinedParamedicSnapshot = {
  id: string;
  paramedicId: string;
  firstName: string | null;
  reason: string;
  reasonExplanation: string | null;
  declinedAt: string;
};

export type HistoricalEmergencyDetails = {
  id: string;
  emergencyId: string;
  initiatorId: string | null;
  initiatorName: string | null;
  assignedParamedicId: string | null;
  assignedParamedicName: string | null;
  finishedByParamedicId: string | null;
  finishedByParamedicName: string | null;
  resolution: string | null;
  resolutionExplanation: string | null;
  initiatorLocation: Location;
  paramedicAcceptedLocation: Location | null;
  currentParamedicLocation: Location | null;
  finalClosestLocation: Location | null;
  feedback: string | null;
  rate: number | null;
  status: string;
  finishedAt: string | null;
  attemptCount: number;
  symptomTree: SymptomTreeItem[];
  declinedParamedic: DeclinedParamedicSnapshot[];
  emergencyCreatedAt: string;
  emergencyUpdatedAt: string | null;
  createdAt: string;
};
