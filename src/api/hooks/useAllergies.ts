import {
  allergyKeys,
  createAllergy,
  deleteAllergy,
  fetchAllergies,
  updateAllergy,
} from "@/api/allergy/allergyApi";
import type {
  CreateAllergyRequest,
  UpdateAllergyRequest,
} from "@/api/allergy/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAllergies() {
  return useQuery({
    queryKey: allergyKeys.all,
    queryFn: fetchAllergies,
  });
}

export function useCreateAllergy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAllergyRequest) => createAllergy(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allergyKeys.all });
    },
  });
}

export function useUpdateAllergy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAllergyRequest) => updateAllergy(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allergyKeys.all });
    },
  });
}

export function useDeleteAllergy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (allergyId: string) => deleteAllergy(allergyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allergyKeys.all });
    },
  });
}
