import type { Company } from "@/types/company";

const STORAGE_KEY = "fake_db_v1";

export interface DbState {
  nextCompanyId: number;
  nextUserId: number;
  companies: Company[];
}

const seed: DbState = {
  nextCompanyId: 3,
  nextUserId: 4,
  companies: [
    {
      id: 1,
      name: "Acme Logistics",
      cnpj: "12.345.678/0001-90",
      status: "active",
      users: [
        { id: 1, name: "Ana Lima", email: "ana@acme.com", role: "Admin" },
        { id: 2, name: "Bruno Costa", email: "bruno@acme.com", role: "Finance" },
      ],
    },
    {
      id: 2,
      name: "Beta Retail",
      cnpj: "98.765.432/0001-10",
      status: "inactive",
      users: [{ id: 3, name: "Carla Souza", email: "carla@beta.com", role: "HR" }],
    },
  ],
};

const clone = (value: DbState): DbState => JSON.parse(JSON.stringify(value));

const loadDb = (): DbState => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return clone(seed);
  }
  try {
    return JSON.parse(raw) as DbState;
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return clone(seed);
  }
};

const saveDb = (db: DbState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export { loadDb, saveDb };
