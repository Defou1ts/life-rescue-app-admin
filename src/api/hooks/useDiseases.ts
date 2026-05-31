import {
  createDisease,
  deleteDisease,
  diseaseKeys,
  fetchDiseases,
  updateDisease,
} from "@/api/disease/diseaseApi";
import type {
  CreateDiseaseRequest,
  UpdateDiseaseRequest,
} from "@/api/disease/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useDiseases() {
  return useQuery({
    queryKey: diseaseKeys.all,
    queryFn: fetchDiseases,
  });
}

export function useCreateDisease() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDiseaseRequest) => createDisease(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: diseaseKeys.all });
    },
  });
}

export function useUpdateDisease() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDiseaseRequest) => updateDisease(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: diseaseKeys.all });
    },
  });
}

export function useDeleteDisease() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (diseaseId: string) => deleteDisease(diseaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: diseaseKeys.all });
    },
  });
}
