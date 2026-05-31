import { axiosInstance } from "@/api/axiosInstance";
import type {
  HistoricalEmergencyDetails,
  HistoricalEmergencyListItem,
  OngoingEmergencyDetails,
  OngoingEmergencyListItem,
  PagedResult,
} from "./types";

export const emergencyKeys = {
  ongoing: (page: number, pageSize: number) =>
    ["emergency", "ongoing", page, pageSize] as const,
  ongoingDetail: (id: string) => ["emergency", "ongoing", id] as const,
  historical: (page: number, pageSize: number) =>
    ["emergency", "historical", page, pageSize] as const,
  historicalDetail: (id: string) => ["emergency", "historical", id] as const,
};

export const fetchOngoingEmergencies = async (page: number, pageSize: number) => {
  const { data } = await axiosInstance.get<PagedResult<OngoingEmergencyListItem>>(
    "/emergency/ongoing",
    { params: { page, pageSize } },
  );
  return data;
};

export const fetchOngoingEmergencyById = async (emergencyId: string) => {
  const { data } = await axiosInstance.get<OngoingEmergencyDetails>(
    `/emergency/${emergencyId}`,
  );
  return data;
};

export const fetchHistoricalEmergencies = async (page: number, pageSize: number) => {
  const { data } = await axiosInstance.get<PagedResult<HistoricalEmergencyListItem>>(
    "/emergency/historical",
    { params: { page, pageSize } },
  );
  return data;
};

export const fetchHistoricalEmergencyById = async (emergencyId: string) => {
  const { data } = await axiosInstance.get<HistoricalEmergencyDetails>(
    `/emergency/historical/${emergencyId}`,
  );
  return data;
};
