import { axiosInstance } from "@/api/axiosInstance";
import type {
  KycDetails,
  KycListItem,
  PagedResult,
  RejectKycRequest,
} from "./types";

export const kycKeys = {
  inProgress: (page: number, pageSize: number) =>
    ["kyc", "in-progress", page, pageSize] as const,
  detail: (kycId: string) => ["kyc", "detail", kycId] as const,
};

export const fetchInProgressKyc = async (page: number, pageSize: number) => {
  const { data } = await axiosInstance.get<PagedResult<KycListItem>>(
    "/job-application/in-progress",
    { params: { page, pageSize } },
  );
  return data;
};

export const fetchKycById = async (kycId: string) => {
  const { data } = await axiosInstance.get<KycDetails>(
    `/job-application/${kycId}`,
  );
  return data;
};

export const approveKyc = async (kycId: string) => {
  await axiosInstance.patch(`/job-application/approval/${kycId}`);
};

export const rejectKyc = async (payload: RejectKycRequest) => {
  await axiosInstance.patch("/job-application/rejection", payload);
};
