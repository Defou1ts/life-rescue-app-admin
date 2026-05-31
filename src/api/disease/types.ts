export type Disease = {
  id: string;
  name: string;
};

export type CreateDiseaseRequest = {
  name: string;
};

export type UpdateDiseaseRequest = {
  id: string;
  name: string;
};
