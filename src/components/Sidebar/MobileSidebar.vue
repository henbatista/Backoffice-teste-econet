<template>
  <div
    :class="`mobile-sidebar bg-white dark:bg-slate-800  ${
      this.$store.state.theme === 'bordered'
        ? 'border border-gray-5002'
        : 'shadow-base'
    }   `"
  >
    <div class="logo-segment flex justify-between items-center px-4 py-6">
      <router-link to="/companies">
        <img
          src="@/assets/images/logo/logo.svg"
          alt=""
          v-if="!this.$store.state.isDark"
        />

        <img
          src="@/assets/images/logo/logo-white.svg"
          alt=""
          v-if="this.$store.state.isDark"
        />
      </router-link>
      <span
        class="cursor-pointer text-slate-900 dark:text-white text-2xl"
        @click="toggleMsidebar"
        ><Icon icon="heroicons:x-mark"
      /></span>
    </div>

    <div
      class="sidebar-menu px-4 h-[calc(100%-100px)] overflow-y-auto"
      data-simplebar
    >
      <Navmenu :items="menuItems" />
    </div>
  </div>
</template>
<script lang="ts">
import { Icon } from "@iconify/vue";
import { defineComponent } from "vue";
import { menuItems } from "../../constant/data";
import Navmenu from "./Navmenu.vue";

export default defineComponent({
  components: {
    Icon,
    Navmenu,
  },
  data() {
    return {
      menuItems,
      openClass: "w-[248px]",
      closeClass: "w-[72px] close_sidebar",
    };
  },
  methods: {
    toggleMsidebar() {
      this.$store.dispatch("toggleMsidebar");
    },
  },
});
</script>
<style lang="scss" scoped>
.mobile-sidebar {
  @apply fixed left-0 top-0 h-full z-[9999] w-[85vw] max-w-[320px] sm:w-[280px];
}
</style>
