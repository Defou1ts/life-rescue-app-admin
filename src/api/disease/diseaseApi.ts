import { axiosInstance } from "@/api/axiosInstance";
import type {
  CreateDiseaseRequest,
  Disease,
  UpdateDiseaseRequest,
} from "./types";

export const diseaseKeys = {
  all: ["diseases"] as const,
};

export const fetchDiseases = async () => {
  const { data } = await axiosInstance.get<Disease[]>("/disease/global");
  return data;
};

export const createDisease = async (payload: CreateDiseaseRequest) => {
  const { data } = await axiosInstance.post<Disease>("/disease", payload);
  return data;
};

export const updateDisease = async (payload: UpdateDiseaseRequest) => {
  const { data } = await axiosInstance.put<Disease>("/disease", payload);
  return data;
};

export const deleteDisease = async (diseaseId: string) => {
  await axiosInstance.delete(`/disease/${diseaseId}`);
};
