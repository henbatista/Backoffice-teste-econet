import http from "./http";
import type {
  Company,
  CompanyListResponse,
  CompanyPayload,
  CompanyUpdatePayload,
  CompanyUser,
} from "@/types/company";

const listCompanies = (params: Record<string, unknown>) =>
  http
    .get<CompanyListResponse>("/companies", { params })
    .then((response) => response.data);

const getCompany = (id: number | string) =>
  http.get<Company>(`/companies/${id}`).then((response) => response.data);

const createCompany = (payload: CompanyPayload) =>
  http.post<Company>("/companies", payload).then((response) => response.data);

const updateCompany = (id: number | string, payload: CompanyUpdatePayload) =>
  http.put<Company>(`/companies/${id}`, payload).then((response) => response.data);

const deleteCompany = (id: number | string) => http.delete(`/companies/${id}`);

const addCompanyUser = (companyId: number | string, payload: Omit<CompanyUser, "id">) =>
  http
    .post<CompanyUser>(`/companies/${companyId}/users`, payload)
    .then((response) => response.data);

const updateCompanyUser = (
  companyId: number | string,
  userId: number | string,
  payload: Partial<CompanyUser>
) =>
  http
    .put<CompanyUser>(`/companies/${companyId}/users/${userId}`, payload)
    .then((response) => response.data);

const removeCompanyUser = (companyId: number | string, userId: number | string) =>
  http.delete(`/companies/${companyId}/users/${userId}`);

export {
  listCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  addCompanyUser,
  updateCompanyUser,
  removeCompanyUser,
};
