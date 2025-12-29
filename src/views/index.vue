<template>
  <div class="min-h-screen bg-slate-100 p-3 dark:bg-slate-900 sm:p-6">
    <div class="mx-auto max-w-6xl space-y-4">
      <header
        class="grid gap-3 md:grid-cols-[minmax(220px,1fr)_minmax(320px,2fr)_auto] md:items-center"
      >
        <div>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Listagem das empresas cadastradas.
          </p>
        </div>

        <div class="w-full">
          <InputGroup
            v-model="searchTerm"
            name="company-search"
            placeholder="Buscar por nome, CNPJ ou status"
            prependIcon="heroicons-outline:search"
          />
        </div>

        <Button
          class="w-full md:w-auto"
          text="Nova empresa"
          btnClass="btn-primary"
          link="/companies/new"
        />
      </header>

      <div class="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
        <div
          v-if="isLoading"
          class="text-sm text-slate-500 dark:text-slate-400"
        >
          Carregando empresas...
        </div>
        <div
          v-else-if="errorMessage"
          class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-200"
        >
          {{ errorMessage }}
          <button
            class="ml-3 underline text-red-700 dark:text-red-200"
            type="button"
            @click="fetchCompanies"
          >
            Tentar novamente
          </button>
        </div>
        <div v-else>
          <div
            v-if="companies.length === 0"
            class="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900"
          >
            <span
              class="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-200"
            >
              <Icon :icon="emptyStateIcon" class="text-2xl" />
            </span>
            <div
              class="text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              {{ emptyStateTitle }}
            </div>
            <div class="text-sm text-slate-500 dark:text-slate-400">
              {{ emptyStateDescription }}
            </div>
            <div>
              <Button
                v-if="isSearching"
                text="Limpar busca"
                btnClass="btn-outline-light"
                type="button"
                @click="clearSearch"
              />
              <Button
                v-else
                text="Cadastrar empresa"
                btnClass="btn-primary"
                link="/companies/new"
              />
            </div>
          </div>
          <div class="w-full overflow-x-auto">
            <table
              class="min-w-[720px] w-full border-collapse text-left text-sm"
            >
              <thead
                class="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-700 dark:text-slate-400"
              >
                <tr>
                  <th class="py-3">Empresa</th>
                  <th class="py-3">CNPJ</th>
                  <th class="py-3">Status</th>
                  <th class="py-3 text-right"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="company in companies"
                  :key="company.id"
                  class="border-b border-slate-100 last:border-b-0 dark:border-slate-700"
                >
                  <td
                    class="py-4 font-medium text-slate-900 dark:text-slate-100"
                  >
                    {{ company.name }}
                  </td>
                  <td class="py-4 text-slate-600 dark:text-slate-300">
                    {{ company.cnpj }}
                  </td>
                  <td class="py-4">
                    <span
                      class="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold"
                      :class="statusClass(company.status)"
                    >
                      {{ company.status === "active" ? "Ativa" : "Inativa" }}
                    </span>
                  </td>
                  <td class="py-4 text-right">
                    <div class="inline-flex items-center gap-2 text-sm">
                      <Tooltip placement="top" theme="dark">
                        <template #button>
                          <router-link
                            class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-primary-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-primary-500/40 dark:text-slate-200 dark:hover:bg-slate-700"
                            :to="`/companies/${company.id}`"
                          >
                            <Icon icon="heroicons-outline:eye" />
                          </router-link>
                        </template>
                        Detalhes
                      </Tooltip>
                      <Tooltip placement="top" theme="dark">
                        <template #button>
                          <router-link
                            class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-primary-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-primary-500/40 dark:text-slate-200 dark:hover:bg-slate-700"
                            :to="`/companies/${company.id}/edit`"
                          >
                            <Icon icon="heroicons-outline:pencil" />
                          </router-link>
                        </template>
                        Editar
                      </Tooltip>
                      <Tooltip placement="top" theme="dark">
                        <template #button>
                          <button
                            class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-primary-200 text-red-600 hover:border-danger-300 hover:bg-red-50 hover:text-red-700 dark:border-primary-500/40 dark:text-red-300 dark:hover:bg-red-950/40"
                            type="button"
                            @click="openDeleteModal(company)"
                          >
                            <Icon icon="heroicons-outline:trash" />
                          </button>
                        </template>
                        Excluir
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-6 flex items-center justify-between text-sm">
            <span class="text-slate-500 dark:text-slate-400">
              {{ paginationLabel }}
            </span>
            <div class="flex items-center gap-2">
              <button
                class="rounded-md border border-slate-200 px-3 py-1 text-slate-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
                type="button"
                :disabled="page === 1"
                @click="changePage(page - 1)"
              >
                Anterior
              </button>
              <button
                class="rounded-md border border-slate-200 px-3 py-1 text-slate-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
                type="button"
                :disabled="page === totalPages"
                @click="changePage(page + 1)"
              >
                Proxima
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isDrawerOpen" class="fixed inset-0 z-[9999]">
      <transition name="overlay-fade">
        <div
          class="absolute inset-0 bg-slate-900/40"
          @click="closeDrawer"
        ></div>
      </transition>
      <transition name="drawer-slide">
        <div
          class="fixed right-0 top-0 z-[10000] h-full w-full max-w-md bg-white shadow-xl dark:bg-slate-900 md:max-w-lg lg:w-1/3 pt-[env(safe-area-inset-top)]"
        >
          <div
            class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700"
          >
            <div>
              <h2
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
              >
                {{ drawerTitle }}
              </h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Preencha os dados da empresa.
              </p>
            </div>
            <button
              class="text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
              type="button"
              @click="closeDrawer"
            >
              Fechar
            </button>
          </div>
          <div class="h-[calc(100%-72px)] overflow-y-auto px-4 py-4 sm:px-6">
            <CompanyForm
              embedded
              :companyId="drawerCompanyId"
              @saved="handleDrawerSaved"
            />
          </div>
        </div>
      </transition>
    </div>

    <div v-if="isDeleteOpen" class="fixed inset-0 z-[10010]">
      <div
        class="absolute inset-0 bg-slate-900/40"
        @click="closeDeleteModal"
      ></div>
      <div
        class="relative flex min-h-full items-start justify-center p-4 pt-[calc(16px+env(safe-area-inset-top))] pb-[calc(16px+env(safe-area-inset-bottom))] sm:items-center"
      >
        <div
          class="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:p-6"
        >
          <div class="flex items-start gap-3">
            <span
              class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-200"
            >
              <Icon icon="heroicons-outline:trash" />
            </span>
            <div class="space-y-2">
              <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
              >
                Confirmar exclusao
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-300">
                Deseja excluir "{{ deleteTarget?.name }}" permanentemente?
              </p>
              <p
                v-if="deleteHasUsers"
                class="text-sm text-amber-600 dark:text-amber-300"
              >
                Há {{ deleteUsersCount }}
                {{
                  deleteUsersCount === 1
                    ? "usuário cadastrado"
                    : "usuários cadastrados"
                }}
                para esta empresa.
              </p>
            </div>
          </div>
          <div class="mt-6 flex flex-wrap justify-end gap-3">
            <Button
              text="Cancelar"
              btnClass="btn-outline-light"
              type="button"
              @click="closeDeleteModal"
            />
            <Button
              text="Excluir"
              btnClass="btn-danger"
              type="button"
              :isLoading="isDeleting"
              @click="confirmDelete"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { deleteCompany, listCompanies } from "@/services/companies";
import Icon from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import Button from "@/components/Button";
import InputGroup from "@/components/InputGroup";
import CompanyForm from "@/views/CompanyForm.vue";
import type { Company } from "@/types/company";

const companies = ref<Company[]>([]);
const isLoading = ref(false);
const errorMessage = ref("");
const page = ref(1);
const perPage = ref(5);
const total = ref(0);
const searchTerm = ref("");
const searchTimer = ref(null);
const isDeleteOpen = ref(false);
const isDeleting = ref(false);
const deleteTarget = ref<Company | null>(null);
const route = useRoute();
const router = useRouter();

const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / perPage.value))
);
const isSearching = computed(() => Boolean(searchTerm.value.trim()));
const emptyStateTitle = computed(() =>
  isSearching.value
    ? "Nenhum resultado encontrado."
    : "Nenhuma empresa cadastrada."
);
const emptyStateDescription = computed(() =>
  isSearching.value
    ? "Tente outro termo para nome, CNPJ ou status."
    : "Comece cadastrando a primeira empresa."
);
const emptyStateIcon = computed(() =>
  isSearching.value
    ? "heroicons-outline:search"
    : "heroicons-outline:office-building"
);

const paginationLabel = computed(() => {
  if (total.value === 0) {
    return "0 empresas";
  }
  const start = (page.value - 1) * perPage.value + 1;
  const end = Math.min(total.value, page.value * perPage.value);
  return `${start}-${end} de ${total.value} empresas`;
});

const statusClass = (status) =>
  status === "active"
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
    : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300";

const drawerMode = computed(() => {
  const raw = route.query.drawer;
  return Array.isArray(raw) ? raw[0] : raw;
});
const isDrawerOpen = computed(
  () => drawerMode.value === "new" || drawerMode.value === "edit"
);

const drawerTitle = computed(() =>
  drawerMode.value === "edit" ? "Editar empresa" : "Nova empresa"
);

const drawerCompanyId = computed(() => {
  const raw = route.query.id;
  if (Array.isArray(raw)) {
    return raw[0] || null;
  }
  return raw || null;
});
const deleteUsersCount = computed(() =>
  deleteTarget.value?.users ? deleteTarget.value.users.length : 0
);
const deleteHasUsers = computed(() =>
  Boolean(deleteTarget.value?.users && deleteTarget.value.users.length)
);

const closeDrawer = () => {
  router.push("/companies");
};

const handleDrawerSaved = () => {
  fetchCompanies();
  closeDrawer();
};

const fetchCompanies = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const data = await listCompanies({
      page: page.value,
      perPage: perPage.value,
      q: searchTerm.value,
    });
    companies.value = [...data.items].sort((a, b) =>
      String(a.name || "").localeCompare(String(b.name || ""), "pt-BR", {
        sensitivity: "base",
      })
    );
    total.value = data.total;
  } catch (error) {
    errorMessage.value = "Nao foi possivel carregar as empresas.";
  } finally {
    isLoading.value = false;
  }
};

const changePage = (nextPage) => {
  page.value = nextPage;
  fetchCompanies();
};

const clearSearch = () => {
  searchTerm.value = "";
};

watch(searchTerm, () => {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value);
  }
  searchTimer.value = setTimeout(() => {
    page.value = 1;
    fetchCompanies();
  }, 300);
});

const openDeleteModal = (company) => {
  deleteTarget.value = company;
  isDeleteOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteOpen.value = false;
  deleteTarget.value = null;
  isDeleting.value = false;
};

const confirmDelete = async () => {
  if (!deleteTarget.value) {
    return;
  }
  isDeleting.value = true;
  try {
    await deleteCompany(deleteTarget.value.id);
    if (companies.value.length === 1 && page.value > 1) {
      page.value -= 1;
    }
    await fetchCompanies();
    closeDeleteModal();
  } catch (error) {
    errorMessage.value = "Nao foi possivel excluir a empresa.";
    isDeleting.value = false;
  }
};

onMounted(fetchCompanies);

watch([isDrawerOpen, isDeleteOpen], ([drawerOpen, deleteOpen]) => {
  document.body.style.overflow = drawerOpen || deleteOpen ? "hidden" : "";
});

onUnmounted(() => {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value);
  }
  document.body.style.overflow = "";
});
</script>

<style scoped>
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}
</style>
