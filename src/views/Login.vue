<template>
  <section class="bg-slate-50 py-12 dark:bg-slate-900 sm:py-16 lg:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
      <div class="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div
          class="mb-2 max-w-sm text-center lg:mb-0 lg:max-w-2xl lg:px-4 lg:text-left"
        >
          <a
            class="mb-6 hidden text-3xl font-bold leading-none lg:inline-block"
            href="#"
          >
            <img
              src="@/assets/images/logo/logo.svg"
              alt="Econet"
              class="h-8 dark:hidden"
            />
            <img
              src="@/assets/images/logo/logo-white.svg"
              alt="Econet"
              class="hidden h-8 dark:block"
            />
          </a>
          <h2
            class="mb-4 hidden text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:block lg:text-6xl xl:text-7xl dark:text-slate-100"
          >
            Gestão de Empresas e Usuários
          </h2>
          <p
            class="mb-8 hidden leading-loose text-slate-600 dark:text-slate-300 lg:block"
          >
            Gerencie empresas e seus usuários com listagem, cadastro, edição e
            detalhes completos em um fluxo simples.
          </p>
        </div>
        <div class="w-full">
          <div class="mx-auto w-full max-w-md lg:mr-0 lg:ml-auto">
            <div class="mb-6 flex justify-center lg:hidden">
              <img
                src="@/assets/images/logo/logo.svg"
                alt="Econet"
                class="h-8 dark:hidden"
              />
              <img
                src="@/assets/images/logo/logo-white.svg"
                alt="Econet"
                class="hidden h-8 dark:block"
              />
            </div>
            <div
              class="overflow-hidden rounded-md bg-white shadow-sm dark:bg-slate-800 dark:shadow-base3"
            >
              <div class="px-6 py-8">
                <form class="mt-6 space-y-4" @submit.prevent="handleLogin">
                  <InputGroup
                    v-model="form.name"
                    label="Nome completo"
                    name="name"
                    placeholder="Seu nome"
                    prependIcon="heroicons-outline:user"
                    :error="errors.name"
                  />
                  <InputGroup
                    v-model="form.email"
                    label="E-mail corporativo"
                    name="email"
                    type="email"
                    placeholder="nome@email.com"
                    prependIcon="heroicons-outline:mail"
                    :error="errors.email"
                  />
                  <InputGroup
                    :key="passwordInputType"
                    v-model="form.password"
                    label="Senha (mock: admin)"
                    name="password"
                    :type="passwordInputType"
                    placeholder="Senha"
                    prependIcon="heroicons-outline:lock-closed"
                    :error="errors.password"
                  >
                    <template #append>
                      <button
                        class="input-group-text inline-flex h-full items-center"
                        type="button"
                        @click="togglePasswordVisibility"
                      >
                        <Icon
                          :icon="
                            isPasswordVisible
                              ? 'heroicons-outline:eye-off'
                              : 'heroicons-outline:eye'
                          "
                        />
                      </button>
                    </template>
                  </InputGroup>

                  <Button
                    class="w-full"
                    type="submit"
                    :text="isLoggedSuccess ? 'Login efetuado' : 'Entrar'"
                    :isLoading="isSubmitting"
                    :isDisabled="isSubmitting || isLoggedSuccess"
                    :btnClass="isLoggedSuccess ? 'btn-success' : 'btn-primary'"
                  />
                  <p
                    v-if="errorMessage"
                    class="text-sm text-red-600 dark:text-red-400"
                  >
                    {{ errorMessage }}
                  </p>
                </form>
              </div>
              <div
                class="border-t border-primary-900 bg-primary-900 py-2 dark:border-primary-700"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import InputGroup from "@/components/InputGroup";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useToast } from "vue-toastification";

const router = useRouter();
const auth = useAuthStore();
const toast = useToast();

interface LoginFormState {
  name: string;
  email: string;
  password: string;
}

const form = reactive<LoginFormState>({
  name: "Admin",
  email: "admin@econet.com.br",
  password: "",
});

interface LoginFormErrors {
  name: string;
  email: string;
  password: string;
}

const errors = reactive<LoginFormErrors>({
  name: "",
  email: "",
  password: "",
});

const errorMessage = ref("");
const isSubmitting = ref(false);
const isLoggedSuccess = ref(false);
const isPasswordVisible = ref(false);
const passwordInputType = computed(() =>
  isPasswordVisible.value ? "text" : "password"
);

const validate = () => {
  errors.name = "";
  errors.email = "";
  errors.password = "";
  if (!form.name.trim()) {
    errors.name = "Nome e obrigatorio.";
  }
  if (!form.email.trim()) {
    errors.email = "E-mail e obrigatorio.";
  }
  if (!form.password.trim()) {
    errors.password = "Senha e obrigatoria.";
  }
  return !errors.name && !errors.email && !errors.password;
};

const handleLogin = () => {
  errorMessage.value = "";
  if (!validate()) {
    return;
  }
  if (isSubmitting.value) {
    return;
  }
  isSubmitting.value = true;
  if (form.password !== "admin") {
    errorMessage.value = "Senha invalida. Use: admin";
    isSubmitting.value = false;
    return;
  }
  setTimeout(() => {
    auth.login({ name: form.name, email: form.email });
    toast.success("Login efetuado com sucesso.");
    isSubmitting.value = false;
    isLoggedSuccess.value = true;
    setTimeout(() => {
      isLoggedSuccess.value = false;
      router.push({ name: "Inicio" });
    }, 2000);
  }, 3000);
};

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};
</script>
