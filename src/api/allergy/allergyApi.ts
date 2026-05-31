import { axiosInstance } from "@/api/axiosInstance";
import type {
  Allergy,
  CreateAllergyRequest,
  UpdateAllergyRequest,
} from "./types";

export const allergyKeys = {
  all: ["allergies"] as const,
};

export const fetchAllergies = async () => {
  const { data } = await axiosInstance.get<Allergy[]>("/allergy/global");
  return data;
};

export const createAllergy = async (payload: CreateAllergyRequest) => {
  const { data } = await axiosInstance.post<Allergy>("/allergy", payload);
  return data;
};

export const updateAllergy = async (payload: UpdateAllergyRequest) => {
  const { data } = await axiosInstance.put<Allergy>("/allergy", payload);
  return data;
};

export const deleteAllergy = async (allergyId: string) => {
  await axiosInstance.delete(`/allergy/${allergyId}`);
};
