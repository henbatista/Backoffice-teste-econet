<template>
  <div class="min-h-screen bg-slate-100 p-4 dark:bg-slate-900 sm:p-6">
    <div class="mx-auto flex max-w-6xl flex-col gap-6">
      <section
        class="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800 dark:shadow-base3 sm:p-6"
      >
        <div
          class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
        >
          <div class="space-y-3">
            <p class="text-xs uppercase tracking-wide text-slate-400">
              Backoffice
            </p>
            <h1
              class="text-2xl font-semibold text-slate-900 sm:text-3xl lg:text-4xl dark:text-slate-100"
            >
              Bem-vindo ao painel de Backoffice
            </h1>
            <p class="text-sm text-slate-600 dark:text-slate-300">
              Organize empresas e usuários, acompanhe o status e mantenha os
              dados sempre atualizados.
            </p>
          </div>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase text-slate-400">Empresas</p>
              <p
                class="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100"
              >
                {{ isLoadingSummary ? "-" : totalCompanies }}
              </p>
            </div>
            <span
              class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200"
            >
              <Icon icon="heroicons-outline:office-building" class="text-xl" />
            </span>
          </div>
          <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Total de empresas cadastradas.
          </p>
        </div>
        <div class="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase text-slate-400">Ativas</p>
              <p
                class="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100"
              >
                {{ isLoadingSummary ? "-" : activeCompanies }}
              </p>
            </div>
            <span
              class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
            >
              <Icon icon="heroicons-outline:badge-check" class="text-xl" />
            </span>
          </div>
          <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Empresas com status ativo.
          </p>
        </div>
        <div class="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase text-slate-400">Inativas</p>
              <p
                class="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100"
              >
                {{ isLoadingSummary ? "-" : inactiveCompanies }}
              </p>
            </div>
            <span
              class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
            >
              <Icon icon="heroicons-outline:pause" class="text-xl" />
            </span>
          </div>
          <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Empresas com status inativo.
          </p>
        </div>
        <div class="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase text-slate-400">Usuários</p>
              <p
                class="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100"
              >
                {{ isLoadingSummary ? "-" : totalUsers }}
              </p>
            </div>
            <span
              class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
            >
              <Icon icon="heroicons-outline:user-group" class="text-xl" />
            </span>
          </div>
          <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Usuários vinculados.
          </p>
        </div>
      </section>
      <p v-if="summaryError" class="text-sm text-red-600 dark:text-red-400">
        Nao foi possivel carregar o resumo das empresas.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { listCompanies } from "@/services/companies";

const isLoadingSummary = ref(false);
const summaryError = ref(false);
const totalCompanies = ref(0);
const activeCompanies = ref(0);
const inactiveCompanies = ref(0);
const totalUsers = ref(0);

const fetchSummary = async () => {
  isLoadingSummary.value = true;
  summaryError.value = false;
  try {
    const data = await listCompanies({ page: 1, perPage: 1000 });
    totalCompanies.value = data.total || 0;
    const items = data.items || [];
    activeCompanies.value = items.filter(
      (item) => item.status === "active"
    ).length;
    inactiveCompanies.value = items.filter(
      (item) => item.status === "inactive"
    ).length;
    totalUsers.value = items.reduce(
      (sum, item) => sum + (item.users ? item.users.length : 0),
      0
    );
  } catch (error) {
    summaryError.value = true;
  } finally {
    isLoadingSummary.value = false;
  }
};

onMounted(fetchSummary);
</script>
