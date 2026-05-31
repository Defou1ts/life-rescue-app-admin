export type Allergy = {
  id: string;
  name: string;
};

export type CreateAllergyRequest = {
  name: string;
};

export type UpdateAllergyRequest = {
  id: string;
  name: string;
};
