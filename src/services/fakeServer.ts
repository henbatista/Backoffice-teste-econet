import type {
  AxiosAdapter,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { loadDb, saveDb } from "./fakeDb";
import type {
  Company,
  CompanyPayload,
  CompanyUpdatePayload,
  CompanyUser,
} from "@/types/company";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const buildResponse = <T>(
  config: AxiosRequestConfig,
  status: number,
  data: T
): AxiosResponse<T> => ({
  data,
  status,
  statusText: status >= 400 ? "Error" : "OK",
  headers: {},
  config,
  request: null,
});

const parseUrl = (url: string, params?: Record<string, unknown>) => {
  const base = "http://local";
  const parsed = new URL(url, base);
  if (params && typeof params === "object") {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }
      query.set(key, String(value));
    });
    parsed.search = query.toString();
  }
  return {
    pathname: parsed.pathname,
    searchParams: parsed.searchParams,
  };
};

const normalizeName = (value: string | undefined) =>
  String(value || "").trim().toLowerCase();
const normalizeCnpj = (value: string | undefined) =>
  String(value || "").replace(/\D/g, "");

const findDuplicate = (
  companies: Company[],
  payload: CompanyPayload,
  ignoreId: number | null
) => {
  const name = normalizeName(payload.name);
  const cnpj = normalizeCnpj(payload.cnpj);
  if (!name && !cnpj) {
    return null;
  }
  return companies.find((company) => {
    if (ignoreId && company.id === ignoreId) {
      return false;
    }
    const sameName = name && normalizeName(company.name) === name;
    const sameCnpj = cnpj && normalizeCnpj(company.cnpj) === cnpj;
    return sameName || sameCnpj;
  });
};

const getCompanyById = (companies: Company[], id: number) =>
  companies.find((company) => company.id === id);

const normalizeText = (value: string | null) =>
  String(value || "").trim().toLowerCase();

const listCompanies = (companies: Company[], params: URLSearchParams) => {
  const page = Number(params.get("page") || "1");
  const perPage = Number(params.get("perPage") || "5");
  const query = normalizeText(params.get("q"));
  let filtered = companies;

  if (query) {
    const queryDigits = query.replace(/\D/g, "");
    filtered = companies.filter((company) => {
      const name = normalizeText(company.name);
      const cnpj = normalizeCnpj(company.cnpj);
      const status = normalizeText(company.status);
      const statusLabel = status === "active" ? "ativa" : "inativa";

      const matchesName = name.includes(query);
      const matchesCnpj = queryDigits
        ? cnpj.includes(queryDigits)
        : normalizeText(company.cnpj).includes(query);
      const matchesStatus =
        status.includes(query) || statusLabel.includes(query);

      return matchesName || matchesCnpj || matchesStatus;
    });
  }

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const total = filtered.length;
  const items = filtered.slice(start, end);
  return { items, total, page, perPage };
};

const createCompany = (companies: Company[], payload: CompanyPayload, nextId: number) => {
  const company: Company = {
    id: nextId,
    name: payload.name,
    cnpj: payload.cnpj,
    status: payload.status || "active",
    logo: payload.logo || "",
    users: [],
  };
  companies.unshift(company);
  return company;
};

const updateCompany = (company: Company, payload: CompanyUpdatePayload) => {
  company.name = payload.name ?? company.name;
  company.cnpj = payload.cnpj ?? company.cnpj;
  company.status = payload.status ?? company.status;
  if ("logo" in payload) {
    company.logo = payload.logo;
  }
  return company;
};

const deleteCompany = (companies: Company[], id: number) => {
  const index = companies.findIndex((company) => company.id === id);
  if (index === -1) {
    return false;
  }
  companies.splice(index, 1);
  return true;
};

const addUser = (company: Company, payload: Omit<CompanyUser, "id">, nextId: number) => {
  const user: CompanyUser = {
    id: nextId,
    name: payload.name,
    email: payload.email,
    role: payload.role,
  };
  company.users.push(user);
  return user;
};

const removeUser = (company: Company, userId: number) => {
  const index = company.users.findIndex((user) => user.id === userId);
  if (index === -1) {
    return false;
  }
  company.users.splice(index, 1);
  return true;
};

const updateUser = (company: Company, userId: number, payload: Partial<CompanyUser>) => {
  const user = company.users.find((item) => item.id === userId);
  if (!user) {
    return null;
  }
  user.name = payload.name ?? user.name;
  user.email = payload.email ?? user.email;
  user.role = payload.role ?? user.role;
  return user;
};

const fakeAdapter: AxiosAdapter = async (config: AxiosRequestConfig) => {
  await delay(300);
  const db = loadDb();
  const method = (config.method || "get").toLowerCase();
  const { pathname, searchParams } = parseUrl(
    config.url || "/",
    config.params as Record<string, unknown>
  );

  if (method === "get" && pathname === "/companies") {
    return buildResponse(config, 200, listCompanies(db.companies, searchParams));
  }

  const companyMatch = pathname.match(/^\/companies\/(\d+)$/);
  if (method === "get" && companyMatch) {
    const id = Number(companyMatch[1]);
    const company = getCompanyById(db.companies, id);
    if (!company) {
      return buildResponse(config, 404, { message: "Company not found" });
    }
    return buildResponse(config, 200, company);
  }

  if (method === "post" && pathname === "/companies") {
    const payload = JSON.parse((config.data as string) || "{}") as CompanyPayload;
    const duplicate = findDuplicate(db.companies, payload, null);
    if (duplicate) {
      const sameName = normalizeName(duplicate.name) === normalizeName(payload.name);
      return buildResponse(config, 409, {
        code: sameName ? "DUPLICATE_NAME" : "DUPLICATE_CNPJ",
        message: sameName
          ? "Nome da empresa ja cadastrado."
          : "CNPJ ja cadastrado.",
      });
    }
    const company = createCompany(db.companies, payload, db.nextCompanyId++);
    saveDb(db);
    return buildResponse(config, 201, company);
  }

  if (method === "put" && companyMatch) {
    const id = Number(companyMatch[1]);
    const company = getCompanyById(db.companies, id);
    if (!company) {
      return buildResponse(config, 404, { message: "Company not found" });
    }
    const payload = JSON.parse((config.data as string) || "{}") as CompanyUpdatePayload;
    const nextPayload: CompanyPayload = {
      name: payload.name ?? company.name,
      cnpj: payload.cnpj ?? company.cnpj,
      status: payload.status ?? company.status,
      logo: "logo" in payload ? payload.logo : company.logo,
    };
    const duplicate = findDuplicate(db.companies, nextPayload, id);
    if (duplicate) {
      const sameName =
        normalizeName(duplicate.name) === normalizeName(nextPayload.name);
      return buildResponse(config, 409, {
        code: sameName ? "DUPLICATE_NAME" : "DUPLICATE_CNPJ",
        message: sameName
          ? "Nome da empresa ja cadastrado."
          : "CNPJ ja cadastrado.",
      });
    }
    updateCompany(company, payload);
    saveDb(db);
    return buildResponse(config, 200, company);
  }

  if (method === "delete" && companyMatch) {
    const id = Number(companyMatch[1]);
    if (!deleteCompany(db.companies, id)) {
      return buildResponse(config, 404, { message: "Company not found" });
    }
    saveDb(db);
    return buildResponse(config, 204, null);
  }

  const userMatch = pathname.match(/^\/companies\/(\d+)\/users$/);
  if (method === "post" && userMatch) {
    const id = Number(userMatch[1]);
    const company = getCompanyById(db.companies, id);
    if (!company) {
      return buildResponse(config, 404, { message: "Company not found" });
    }
    const payload = JSON.parse((config.data as string) || "{}") as Omit<
      CompanyUser,
      "id"
    >;
    const user = addUser(company, payload, db.nextUserId++);
    saveDb(db);
    return buildResponse(config, 201, user);
  }

  const userRouteMatch = pathname.match(
    /^\/companies\/(\d+)\/users\/(\d+)$/
  );
  if (method === "delete" && userRouteMatch) {
    const companyId = Number(userRouteMatch[1]);
    const userId = Number(userRouteMatch[2]);
    const company = getCompanyById(db.companies, companyId);
    if (!company) {
      return buildResponse(config, 404, { message: "Company not found" });
    }
    if (!removeUser(company, userId)) {
      return buildResponse(config, 404, { message: "User not found" });
    }
    saveDb(db);
    return buildResponse(config, 204, null);
  }

  if (method === "put" && userRouteMatch) {
    const companyId = Number(userRouteMatch[1]);
    const userId = Number(userRouteMatch[2]);
    const company = getCompanyById(db.companies, companyId);
    if (!company) {
      return buildResponse(config, 404, { message: "Company not found" });
    }
    const payload = JSON.parse((config.data as string) || "{}") as Partial<CompanyUser>;
    const updated = updateUser(company, userId, payload);
    if (!updated) {
      return buildResponse(config, 404, { message: "User not found" });
    }
    saveDb(db);
    return buildResponse(config, 200, updated);
  }

  return buildResponse(config, 404, { message: "Not found" });
};

export { fakeAdapter };
