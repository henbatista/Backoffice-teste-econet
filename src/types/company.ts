export type CompanyStatus = "active" | "inactive";

export interface CompanyUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Company {
  id: number;
  name: string;
  cnpj: string;
  status: CompanyStatus;
  users: CompanyUser[];
  logo?: string;
}

export interface CompanyListResponse {
  items: Company[];
  total: number;
  page: number;
  perPage: number;
}

export interface CompanyPayload {
  name: string;
  cnpj: string;
  status?: CompanyStatus;
  logo?: string;
}

export type CompanyUpdatePayload = Partial<CompanyPayload>;
