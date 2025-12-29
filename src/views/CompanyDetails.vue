<template>
  <div class="min-h-screen bg-slate-100 p-4 dark:bg-slate-900 sm:p-6">
    <div class="mx-auto max-w-5xl space-y-6">
      <header
        class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Informações da empresa e usuários vinculados.
          </p>
        </div>
        <div
          class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
        >
          <Button
            class="w-full sm:w-auto"
            text="Voltar"
            link="/companies"
            btnClass="btn-info"
          />
          <Button
            class="w-full sm:w-auto"
            text="Editar"
            btnClass="btn-outline-light"
            :link="`/companies/${route.params.id}/edit`"
          />
        </div>
      </header>

      <div class="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800 sm:p-6">
        <div
          v-if="isLoading"
          class="text-sm text-slate-500 dark:text-slate-400"
        >
          Carregando...
        </div>
        <div
          v-else-if="errorMessage"
          class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-200"
        >
          {{ errorMessage }}
        </div>
        <div v-else-if="company">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div
              class="flex h-20 w-20 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
            >
              <img
                v-if="company.logo"
                :src="company.logo"
                alt="Logo da empresa"
                class="h-16 w-16 object-contain"
              />
              <span
                v-else
                class="text-lg font-semibold text-slate-500 dark:text-slate-300"
              >
                {{ companyInitials }}
              </span>
            </div>
            <div class="grid flex-1 gap-4 sm:grid-cols-3">
              <div>
                <p class="text-xs uppercase text-slate-400">Nome</p>
                <p
                  class="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  {{ company.name }}
                </p>
              </div>
              <div>
                <p class="text-xs uppercase text-slate-400">CNPJ</p>
                <p class="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  {{ company.cnpj }}
                </p>
              </div>
              <div>
                <p class="text-xs uppercase text-slate-400">Status</p>
                <span
                  class="mt-1 inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold"
                  :class="statusClass(company.status)"
                >
                  {{ company.status === "active" ? "Ativa" : "Inativa" }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800 sm:p-6">
        <div
          class="grid gap-3 md:grid-cols-[minmax(100px,1fr)_minmax(400px,2fr)_auto] md:items-center"
        >
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Listagem das usuários cadastradas.
          </p>
          <div class="w-full">
            <InputGroup
              v-model="userSearchTerm"
              name="user-search"
              placeholder="Buscar por nome, e-mail ou cargo"
              prependIcon="heroicons-outline:search"
            />
          </div>
          <Button
            text="Adicionar usuário"
            btnClass="btn-primary"
            type="button"
            @click="openModal"
          />
        </div>

        <div v-if="company" class="mt-4">
          <div
            v-if="userTotal === 0"
            class="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900"
          >
            <span
              class="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-200"
            >
              <Icon :icon="userEmptyIcon" class="text-2xl" />
            </span>
            <div
              class="text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              {{ userEmptyTitle }}
            </div>
            <div class="text-sm text-slate-500 dark:text-slate-400">
              {{ userEmptyDescription }}
            </div>
            <div>
              <Button
                v-if="isUserSearching"
                text="Limpar busca"
                btnClass="btn-outline-light"
                type="button"
                @click="clearUserSearch"
              />
              <Button
                v-else
                text="Adicionar usuário"
                btnClass="btn-primary"
                type="button"
                @click="openModal"
              />
            </div>
          </div>
          <div v-else class="w-full overflow-x-auto">
            <table
              class="min-w-[720px] w-full border-collapse text-left text-sm"
            >
              <thead
                class="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-700 dark:text-slate-400"
              >
                <tr>
                  <th class="py-3">Nome</th>
                  <th class="py-3">E-mail</th>
                  <th class="py-3">Cargo</th>
                  <th class="py-3 text-right"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in pagedUsers"
                  :key="user.id"
                  class="border-b border-slate-100 last:border-b-0 dark:border-slate-700"
                >
                  <td
                    class="py-4 font-medium text-slate-900 dark:text-slate-100"
                  >
                    {{ user.name }}
                  </td>
                  <td class="py-4 text-slate-600 dark:text-slate-300">
                    {{ user.email }}
                  </td>
                  <td class="py-4 text-slate-600 dark:text-slate-300">
                    {{ user.role }}
                  </td>
                  <td class="py-4 text-right">
                    <div class="inline-flex items-center gap-2 text-sm">
                      <Tooltip placement="top" theme="dark">
                        <template #button>
                          <button
                            class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-primary-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-primary-500/40 dark:text-slate-200 dark:hover:bg-slate-700"
                            type="button"
                            @click="handleEditUser(user)"
                          >
                            <Icon icon="heroicons-outline:pencil" />
                          </button>
                        </template>
                        Editar
                      </Tooltip>
                      <Tooltip placement="top" theme="dark">
                        <template #button>
                          <button
                            class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-primary-200 text-red-600 hover:border-danger-300 hover:bg-red-50 hover:text-red-700 dark:border-primary-500/40 dark:text-red-300 dark:hover:bg-red-950/40"
                            type="button"
                            @click="handleRemoveUser(user.id)"
                          >
                            <Icon icon="heroicons-outline:trash" />
                          </button>
                        </template>
                        Remover
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            v-if="userTotal > 0"
            class="mt-6 flex items-center justify-between text-sm"
          >
            <span class="text-slate-500 dark:text-slate-400">
              {{ userPaginationLabel }}
            </span>
            <div class="flex items-center gap-2">
              <button
                class="rounded-md border border-slate-200 px-3 py-1 text-slate-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
                type="button"
                :disabled="userPage === 1"
                @click="changeUserPage(userPage - 1)"
              >
                Anterior
              </button>
              <button
                class="rounded-md border border-slate-200 px-3 py-1 text-slate-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
                type="button"
                :disabled="userPage === userTotalPages"
                @click="changeUserPage(userPage + 1)"
              >
                Proxima
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto pt-[calc(16px+env(safe-area-inset-top))] pb-[calc(16px+env(safe-area-inset-bottom))] sm:items-center"
    >
      <div class="absolute inset-0 bg-slate-900/60" @click="closeModal"></div>
      <div
        class="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-slate-900"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {{ userModalTitle }}
          </h3>
          <button
            class="text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-100"
            @click="closeModal"
          >
            Fechar
          </button>
        </div>
        <form class="mt-4 space-y-4" @submit.prevent="handleSubmitUser">
          <InputGroup
            v-model="userForm.name"
            label="Nome"
            name="user-name"
            placeholder="Nome do usuário"
            prepend-icon="heroicons-outline:user"
            :error="userErrors.name"
          />
          <InputGroup
            v-model="userForm.email"
            label="E-mail"
            name="user-email"
            placeholder="email@empresa.com"
            prepend-icon="heroicons-outline:mail"
            :error="userErrors.email"
          />
          <Select
            v-model="userForm.role"
            label="Cargo"
            name="user-role"
            :options="roleOptions"
            placeholder="Selecione um cargo"
            :error="userErrors.role"
            prepend-icon="heroicons-outline:briefcase"
          />
          <div class="flex items-center gap-3">
            <Button
              class="w-full m-4"
              type="submit"
              :text="
                isUserSaved ? 'Salvo' : isSavingUser ? 'Salvando...' : 'Salvar'
              "
              :isLoading="isSavingUser"
              :isDisabled="isSavingUser"
              :btnClass="isUserSaved ? 'btn-success' : 'btn-primary'"
            />
            <p
              v-if="userSuccess"
              class="text-sm text-emerald-600 dark:text-emerald-300"
            >
              {{ userSuccess }}
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import {
  addCompanyUser,
  getCompany,
  updateCompanyUser,
  removeCompanyUser,
} from "@/services/companies";
import Button from "@/components/Button";
import Select from "@/components/Select";
import InputGroup from "@/components/InputGroup";
import Tooltip from "@/components/Tooltip";
import Icon from "@/components/Icon";
import { useToast } from "vue-toastification";
import type { Company, CompanyUser } from "@/types/company";

const route = useRoute();
const company = ref<Company | null>(null);
const isLoading = ref(false);
const errorMessage = ref("");
const isModalOpen = ref(false);
const isSavingUser = ref(false);
const isUserSaved = ref(false);
const userSuccess = ref("");
const isEditingUser = ref(false);
const editingUserId = ref(null);
const userSearchTerm = ref("");
const userSearchTimer = ref(null);
const userPage = ref(1);
const userPerPage = ref(5);
const toast = useToast();
const roleOptions = [
  { value: "Admin", label: "Admin" },
  { value: "Finance", label: "Finance" },
  { value: "HR", label: "HR" },
  { value: "Manager", label: "Manager" },
  { value: "Sales", label: "Sales" },
  { value: "Support", label: "Support" },
  { value: "Tech", label: "Tech" },
];

interface UserFormState {
  name: string;
  email: string;
  role: string;
}

const userForm = reactive<UserFormState>({
  name: "",
  email: "",
  role: "",
});

interface UserErrorState {
  name: string;
  email: string;
  role: string;
}

const userErrors = reactive<UserErrorState>({
  name: "",
  email: "",
  role: "",
});

const statusClass = (status) =>
  status === "active"
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
    : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300";

const isUserSearching = computed(() => Boolean(userSearchTerm.value.trim()));
const filteredUsers = computed(() => {
  const list = company.value?.users || [];
  const term = userSearchTerm.value.trim().toLowerCase();
  if (!term) {
    return list;
  }
  return list.filter((user) => {
    const name = String(user.name || "").toLowerCase();
    const email = String(user.email || "").toLowerCase();
    const role = String(user.role || "").toLowerCase();
    return name.includes(term) || email.includes(term) || role.includes(term);
  });
});
const sortedUsers = computed(() =>
  [...filteredUsers.value].sort((a, b) =>
    String(a.name || "").localeCompare(String(b.name || ""), "pt-BR", {
      sensitivity: "base",
    })
  )
);
const userTotal = computed(() => filteredUsers.value.length);
const userTotalPages = computed(() =>
  Math.max(1, Math.ceil(userTotal.value / userPerPage.value))
);
const pagedUsers = computed(() => {
  const start = (userPage.value - 1) * userPerPage.value;
  return sortedUsers.value.slice(start, start + userPerPage.value);
});
const userPaginationLabel = computed(() => {
  if (userTotal.value === 0) {
    return "0 usuários";
  }
  const start = (userPage.value - 1) * userPerPage.value + 1;
  const end = Math.min(userTotal.value, userPage.value * userPerPage.value);
  return `${start}-${end} de ${userTotal.value} usuários`;
});
const userEmptyTitle = computed(() =>
  isUserSearching.value
    ? "Nenhum usuário encontrado."
    : "Nenhum usuário vinculado."
);
const userEmptyDescription = computed(() =>
  isUserSearching.value
    ? "Tente outro termo para nome, e-mail ou cargo."
    : "Adicione o primeiro usuário para esta empresa."
);
const userEmptyIcon = computed(() =>
  isUserSearching.value
    ? "heroicons-outline:search"
    : "heroicons-outline:user-group"
);

const companyInitials = computed(() => {
  const name = company.value?.name || "";
  const parts = name.trim().split(/\s+/);
  const first = parts[0] ? parts[0][0] : "";
  const second = parts[1] ? parts[1][0] : "";
  return (first + second).toUpperCase() || "E";
});

const fetchCompany = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    company.value = await getCompany(route.params.id);
  } catch (error) {
    errorMessage.value = "Nao foi possivel carregar a empresa.";
  } finally {
    isLoading.value = false;
  }
};

const openModal = () => {
  userForm.name = "";
  userForm.email = "";
  userForm.role = "";
  userErrors.name = "";
  userErrors.email = "";
  userErrors.role = "";
  userSuccess.value = "";
  isUserSaved.value = false;
  isEditingUser.value = false;
  editingUserId.value = null;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  isEditingUser.value = false;
  editingUserId.value = null;
  isUserSaved.value = false;
};

const userModalTitle = computed(() =>
  isEditingUser.value ? "Editar usuário" : "Adicionar usuário"
);

const handleEditUser = (user: CompanyUser) => {
  userForm.name = user.name;
  userForm.email = user.email;
  userForm.role = user.role;
  userErrors.name = "";
  userErrors.email = "";
  userErrors.role = "";
  userSuccess.value = "";
  isEditingUser.value = true;
  editingUserId.value = user.id;
  isModalOpen.value = true;
};

const validateUser = () => {
  userErrors.name = "";
  userErrors.email = "";
  userErrors.role = "";
  if (!userForm.name.trim()) {
    userErrors.name = "Nome e obrigatorio.";
  }
  if (!userForm.email.trim()) {
    userErrors.email = "E-mail e obrigatorio.";
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(userForm.email)) {
    userErrors.email = "E-mail invalido.";
  }
  const emailValue = userForm.email.trim().toLowerCase();
  if (emailValue) {
    const exists = (company.value?.users || []).some((user) => {
      if (isEditingUser.value && user.id === editingUserId.value) {
        return false;
      }
      return (
        String(user.email || "")
          .trim()
          .toLowerCase() === emailValue
      );
    });
    if (exists) {
      userErrors.email = "E-mail ja cadastrado.";
    }
  }
  if (!userForm.role.trim()) {
    userErrors.role = "Cargo e obrigatorio.";
  }
  return !userErrors.name && !userErrors.email && !userErrors.role;
};

const handleSubmitUser = async () => {
  userSuccess.value = "";
  if (!validateUser()) {
    if (userErrors.email === "E-mail ja cadastrado.") {
      toast.error("E-mail ja cadastrado.");
    }
    return;
  }
  isSavingUser.value = true;
  isUserSaved.value = false;
  try {
    if (isEditingUser.value && editingUserId.value) {
      const updated = await updateCompanyUser(
        route.params.id,
        editingUserId.value,
        {
          ...userForm,
        }
      );
      company.value.users = company.value.users.map((user) =>
        user.id === updated.id ? updated : user
      );
      toast.success("Usuário atualizado com sucesso.");
      isUserSaved.value = true;
      setTimeout(() => {
        closeModal();
      }, 2000);
    } else {
      const user = await addCompanyUser(route.params.id, { ...userForm });
      company.value.users.push(user);
      toast.success("Usuário adicionado com sucesso.");
      isUserSaved.value = true;
      setTimeout(() => {
        closeModal();
      }, 2000);
    }
    setTimeout(() => {
      userSuccess.value = "";
    }, 2000);
  } catch (error) {
    userErrors.name = "Nao foi possivel salvar o usuário.";
  } finally {
    isSavingUser.value = false;
  }
};

const handleRemoveUser = async (userId: number) => {
  if (!window.confirm("Deseja remover este usuário?")) {
    return;
  }
  try {
    await removeCompanyUser(route.params.id, userId);
    company.value.users = company.value.users.filter(
      (user) => user.id !== userId
    );
    if (pagedUsers.value.length === 1 && userPage.value > 1) {
      userPage.value -= 1;
    }
  } catch (error) {
    errorMessage.value = "Nao foi possivel remover o usuário.";
  }
};

const changeUserPage = (nextPage) => {
  userPage.value = nextPage;
};

const clearUserSearch = () => {
  userSearchTerm.value = "";
};

watch(userSearchTerm, () => {
  if (userSearchTimer.value) {
    clearTimeout(userSearchTimer.value);
  }
  userSearchTimer.value = setTimeout(() => {
    userPage.value = 1;
  }, 300);
});

watch(userTotalPages, (pages) => {
  if (userPage.value > pages) {
    userPage.value = pages;
  }
});

onUnmounted(() => {
  if (userSearchTimer.value) {
    clearTimeout(userSearchTimer.value);
  }
});

onMounted(fetchCompany);
</script>
