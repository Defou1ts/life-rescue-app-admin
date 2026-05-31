import {
  approveKyc,
  fetchInProgressKyc,
  fetchKycById,
  kycKeys,
  rejectKyc,
} from "@/api/kyc/kycApi";
import type { RejectKycRequest } from "@/api/kyc/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useKycList(page: number, pageSize: number) {
  return useQuery({
    queryKey: kycKeys.inProgress(page, pageSize),
    queryFn: () => fetchInProgressKyc(page, pageSize),
  });
}

export function useKycDetails(kycId: string | null) {
  return useQuery({
    queryKey: kycKeys.detail(kycId ?? ""),
    queryFn: () => fetchKycById(kycId!),
    enabled: kycId !== null,
  });
}

export function useApproveKyc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (kycId: string) => approveKyc(kycId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
    },
  });
}

export function useRejectKyc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RejectKycRequest) => rejectKyc(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
    },
  });
}
