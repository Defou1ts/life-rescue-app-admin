import {
  emergencyKeys,
  fetchHistoricalEmergencies,
  fetchHistoricalEmergencyById,
  fetchOngoingEmergencies,
  fetchOngoingEmergencyById,
} from "@/api/emergency/emergencyApi";
import { useQuery } from "@tanstack/react-query";

export function useOngoingEmergencies(page: number, pageSize: number) {
  return useQuery({
    queryKey: emergencyKeys.ongoing(page, pageSize),
    queryFn: () => fetchOngoingEmergencies(page, pageSize),
  });
}

export function useOngoingEmergencyDetails(emergencyId: string | null) {
  return useQuery({
    queryKey: emergencyKeys.ongoingDetail(emergencyId ?? ""),
    queryFn: () => fetchOngoingEmergencyById(emergencyId!),
    enabled: emergencyId !== null,
  });
}

export function useHistoricalEmergencies(page: number, pageSize: number) {
  return useQuery({
    queryKey: emergencyKeys.historical(page, pageSize),
    queryFn: () => fetchHistoricalEmergencies(page, pageSize),
  });
}

export function useHistoricalEmergencyDetails(emergencyId: string | null) {
  return useQuery({
    queryKey: emergencyKeys.historicalDetail(emergencyId ?? ""),
    queryFn: () => fetchHistoricalEmergencyById(emergencyId!),
    enabled: emergencyId !== null,
  });
}
