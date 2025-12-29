<template>
  <div
    :class="
      embedded ? 'h-full' : 'min-h-screen bg-slate-100 p-6 dark:bg-slate-900'
    "
  >
    <div :class="embedded ? 'space-y-6' : 'mx-auto max-w-3xl space-y-6'">
      <header
        v-if="!embedded"
        class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {{ isEdit ? "Editar empresa" : "Cadastrar empresa" }}
          </h1>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {{
              isEdit
                ? "Atualize os dados da empresa."
                : "Informe os dados da nova empresa."
            }}
          </p>
        </div>
        <Button
          class="w-full sm:w-auto"
          text="Voltar"
          link="/companies"
          btnClass="btn-info"
        />
      </header>

      <div class="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800 sm:p-6">
        <div v-if="isLoading" class="text-sm text-slate-500 dark:text-slate-400">
          Carregando dados...
        </div>
        <div
          v-else-if="errorMessage"
          class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-200"
        >
          {{ errorMessage }}
        </div>
        <form v-else class="space-y-5" @submit.prevent="handleSubmit">
          <div
            v-if="errorMessage"
            class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-200"
          >
            {{ errorMessage }}
          </div>
          <InputGroup
            v-model="form.name"
            label="Nome"
            name="name"
            placeholder="Nome da empresa"
            prepend-icon="heroicons-outline:office-building"
            :error="errors.name"
          />

          <InputGroup
            v-model="form.cnpj"
            label="CNPJ"
            name="cnpj"
            placeholder="00.000.000/0000-00"
            prepend-icon="heroicons-outline:identification"
            :error="errors.cnpj"
            :is-mask="true"
            :options="cnpjMaskOptions"
          />

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >Logo da empresa</label
            >
            <Fileinput
              name="company-logo"
              placeholder="Selecione a logo"
              label="Selecionar"
              :preview="true"
              @input="handleLogoChange"
            />
            <div
              v-if="form.logo && !logoFile"
              class="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900"
            >
              <img
                :src="form.logo"
                alt="Logo da empresa"
                class="h-24 w-24 rounded-md object-contain"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-200"
              >Status</label
            >
            <div class="flex items-center gap-6">
              <Radio
                v-model="form.status"
                name="status"
                value="active"
                label="Ativa"
              />
              <Radio
                v-model="form.status"
                name="status"
                value="inactive"
                label="Inativa"
              />
            </div>
          </div>

          <div class="flex items-center gap-3">
            <Button
              class="w-full"
              type="submit"
              :text="isSaved ? 'Salvo' : 'Salvar'"
              :isLoading="isSaving"
              :isDisabled="isSaving"
              :btnClass="isSaved ? 'btn-success' : 'btn-primary'"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  embedded: {
    type: Boolean,
    default: false,
  },
  companyId: {
    type: [String, Number],
    default: null,
  },
});
const emit = defineEmits(["saved"]);
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  createCompany,
  getCompany,
  listCompanies,
  updateCompany,
} from "@/services/companies";
import InputGroup from "@/components/InputGroup";
import Button from "@/components/Button";
import Radio from "@/components/Radio";
import Fileinput from "@/components/Fileinput";
import { useToast } from "vue-toastification";
import type { CompanyPayload } from "@/types/company";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const currentCompanyId = computed(() => {
  const raw = props.companyId ?? route.params.id;
  return Array.isArray(raw) ? raw[0] : raw;
});
const isEdit = computed(() => Boolean(currentCompanyId.value));
const isLoading = ref(false);
const isSaving = ref(false);
const isSaved = ref(false);
const errorMessage = ref("");
const logoFile = ref(null);

interface CompanyFormState extends CompanyPayload {
  status: "active" | "inactive";
}

const form = reactive<CompanyFormState>({
  name: "",
  cnpj: "",
  status: "active",
  logo: "",
});

interface CompanyFormErrors {
  name: string;
  cnpj: string;
}

const errors = reactive<CompanyFormErrors>({
  name: "",
  cnpj: "",
});

const cnpjMaskOptions = {
  blocks: [2, 3, 3, 4, 2],
  delimiters: [".", ".", "/", "-"],
  numericOnly: true,
};

const normalizeCnpj = (value: string) => value.replace(/\D/g, "");
const normalizeName = (value: string) =>
  String(value || "")
    .trim()
    .toLowerCase();

const checkDuplicates = async () => {
  const data = await listCompanies({ page: 1, perPage: 1000 });
  const name = normalizeName(form.name);
  const cnpj = normalizeCnpj(form.cnpj);
  const currentId = currentCompanyId.value
    ? Number(currentCompanyId.value)
    : null;

  let nameExists = false;
  let cnpjExists = false;

  data.items.forEach((company) => {
    if (currentId && company.id === currentId) {
      return;
    }
    if (name && normalizeName(company.name) === name) {
      nameExists = true;
    }
    if (cnpj && normalizeCnpj(company.cnpj) === cnpj) {
      cnpjExists = true;
    }
  });

  return { nameExists, cnpjExists };
};

const validate = () => {
  errors.name = "";
  errors.cnpj = "";
  if (!form.name.trim()) {
    errors.name = "Nome e obrigatorio.";
  }
  const cnpjDigits = normalizeCnpj(form.cnpj);
  if (!form.cnpj.trim()) {
    errors.cnpj = "CNPJ e obrigatorio.";
  } else if (cnpjDigits.length !== 14) {
    errors.cnpj = "CNPJ invalido.";
  }
  return !errors.name && !errors.cnpj;
};

const loadCompany = async () => {
  if (!isEdit.value) {
    return;
  }
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const data = await getCompany(currentCompanyId.value);
    form.name = data.name || "";
    form.cnpj = data.cnpj || "";
    form.status = data.status || "active";
    form.logo = data.logo || "";
    logoFile.value = null;
  } catch (error) {
    errorMessage.value = "Nao foi possivel carregar a empresa.";
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async (): Promise<void> => {
  if (!validate()) {
    return;
  }
  isSaving.value = true;
  isSaved.value = false;
  errorMessage.value = "";
  errors.name = "";
  errors.cnpj = "";
  try {
    const duplicate = await checkDuplicates();
    if (duplicate.nameExists || duplicate.cnpjExists) {
      if (duplicate.nameExists) {
        errors.name = "Nome da empresa ja cadastrado.";
      }
      if (duplicate.cnpjExists) {
        errors.cnpj = "CNPJ ja cadastrado.";
      }
      isSaving.value = false;
      return;
    }

    if (isEdit.value) {
      await updateCompany(currentCompanyId.value, { ...form });
      toast.success("Empresa atualizada com sucesso.");
      isSaved.value = true;
      setTimeout(() => {
        isSaved.value = false;
        if (props.embedded) {
          emit("saved");
        }
      }, 2000);
    } else {
      const created = await createCompany({ ...form });
      toast.success("Empresa criada com sucesso.");
      isSaved.value = true;
      setTimeout(() => {
        isSaved.value = false;
        router.push(`/companies/${created.id}`);
      }, 2000);
    }
  } catch (error) {
    const code = error?.response?.data?.code;
    const message = error?.response?.data?.message;
    if (code === "DUPLICATE_NAME") {
      errors.name = message || "Nome da empresa ja cadastrado.";
    } else if (code === "DUPLICATE_CNPJ") {
      errors.cnpj = message || "CNPJ ja cadastrado.";
    } else {
      errorMessage.value = "Nao foi possivel salvar a empresa.";
    }
  } finally {
    isSaving.value = false;
  }
};

const handleLogoChange = (file: File | null) => {
  if (!file) {
    logoFile.value = null;
    form.logo = "";
    return;
  }
  logoFile.value = file;
  const reader = new FileReader();
  reader.onload = () => {
    form.logo = reader.result;
  };
  reader.readAsDataURL(file);
};

onMounted(loadCompany);
</script>
