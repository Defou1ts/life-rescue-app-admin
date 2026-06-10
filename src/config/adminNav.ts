export type AdminNavItem = {
  label: string;
  path: string;
};

export const adminNavItems: AdminNavItem[] = [
  { label: "Allergies", path: "/allergys" },
  { label: "Accounts", path: "/accounts" },
  { label: "Diseases", path: "/diseases" },
  { label: "Emergency", path: "/emergency" },
  { label: "KYC", path: "/kyc" },
  { label: "Profile", path: "/profile" },
  { label: "Symptoms", path: "/symptoms" },
];

export const defaultAdminPath = adminNavItems[0].path;
