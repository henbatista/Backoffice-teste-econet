<template>
  <header class="sticky top-0 z-[999]">
    <div
      class="app-header md:px-6 px-[15px] bg-white dark:bg-slate-800 shadow-base dark:shadow-base3 border-b border-slate-200 dark:border-slate-700"
    >
      <div class="flex items-center justify-between gap-3 py-4">
        <div class="flex items-center gap-3">
          <button
            class="inline-flex items-center justify-center rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 xl:hidden"
            type="button"
            @click="toggleMobileSidebar"
            aria-label="Abrir menu"
          >
            <Icon icon="heroicons-outline:menu-alt-3" />
          </button>
          <router-link to="/companies" class="flex items-center"> </router-link>
        </div>
        <div class="flex flex-wrap items-center gap-2 text-sm">
          <button
            class="rounded-full border border-primary-700 p-2 text-primary-700 hover:border-slate-300 dark:border-primary-200 dark:text-primary-200"
            type="button"
            @click="toggleTheme"
            aria-label="Alternar tema"
          >
            <Icon icon="heroicons-outline:sun" v-if="isDark" />
            <Icon icon="heroicons-outline:moon" v-else />
          </button>
          <div
            class="flex items-center gap-2 pl-2 text-slate-600 dark:text-slate-300"
          >
            <span
              class="h-8 w-8 rounded-full bg-slate-200 text-center text-sm font-semibold leading-8 text-slate-700 dark:bg-slate-700 dark:text-slate-100"
            >
              {{ userInitials }}
            </span>
            <span class="hidden sm:inline">{{ userName }}</span>
          </div>
          <button
            class="text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white"
            type="button"
            @click="handleLogout"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
<script lang="ts">
import { useAuthStore } from "@/stores/auth";
import Icon from "@/components/Icon";
import { useToast } from "vue-toastification";
export default {
  components: {
    Icon,
  },
  computed: {
    isDark() {
      return this.$store.state.isDark;
    },
    userName() {
      const auth = useAuthStore();
      return auth.userName;
    },
    userInitials() {
      const parts = this.userName.trim().split(/\s+/);
      const first = parts[0] ? parts[0][0] : "";
      const last = parts[1] ? parts[1][0] : "";
      return (first + last).toUpperCase() || "U";
    },
  },
  methods: {
    toggleMobileSidebar() {
      this.$store.dispatch("toggleMsidebar");
    },
    toggleTheme() {
      this.$store.dispatch("toogleDark");
    },
    handleLogout() {
      const auth = useAuthStore();
      const toast = useToast();
      auth.logout();
      toast.info("Logout efetuado com sucesso");
      this.$router.push({ name: "Login" });
    },
  },
};
</script>
