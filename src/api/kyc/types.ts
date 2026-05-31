export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export type KycListItem = {
  id: string;
  accountId: string;
  status: string;
  createdAt: string;
};

export type ImageDto = {
  base64Content: string;
  fileName: string;
};

export type KycDetails = {
  id: string;
  accountId: string;
  status: string;
  identityDocument: ImageDto | null;
  selfie: ImageDto | null;
  certificationDocument: ImageDto | null;
};

export type RejectKycRequest = {
  kycId: string;
  rejectReason: string;
};
