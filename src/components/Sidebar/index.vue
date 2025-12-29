<template>
  <div :class="this.$store.state.semidark ? 'dark' : ''">
    <div
      :class="`sidebar-wrapper bg-white dark:bg-slate-800    ${
        this.$store.state.skin === 'bordered'
          ? 'border-r border-gray-5002 dark:border-slate-700'
          : 'shadow-base'
      }   ${
        this.$store.state.sidebarCollasp ? this.closeClass : this.openClass
      }`"
    >
      <div
        :class="`logo-segment flex justify-between items-center bg-white dark:bg-slate-800 z-[9] py-3  sticky top-0   px-3  ${
          this.$store.state.sidebarCollasp ? this.closeClass : this.openClass
        } ${
          this.$store.state.skin === 'bordered'
            ? ' border-b border-r border-gray-5002 dark:border-slate-700'
            : ' border-none'
        }`"
      >
        <router-link to="/companies" v-if="!this.$store.state.sidebarCollasp">
          <img
            src="@/assets/images/logo/logo.svg"
            alt=""
            v-if="!this.$store.state.isDark && !this.$store.state.semidark"
          />

          <img
            src="@/assets/images/logo/logo-white.svg"
            alt=""
            v-if="this.$store.state.isDark || this.$store.state.semidark"
          />
        </router-link>
        <router-link to="/companies" v-if="this.$store.state.sidebarCollasp">
          <img
            src="@/assets/images/logo/logo-c.svg"
            alt=""
            v-if="!this.$store.state.isDark && !this.$store.state.semidark"
          />
          <img
            src="@/assets/images/logo/logo-c-white.svg"
            alt=""
            v-if="this.$store.state.isDark || this.$store.state.semidark"
          />
        </router-link>
        <span
          v-if="!this.$store.state.sidebarCollasp"
          class="cursor-pointer text-slate-900 dark:text-white text-2xl"
          @click="
            this.$store.state.sidebarCollasp = !this.$store.state.sidebarCollasp
          "
        >
          <Icon icon="heroicons-outline:menu-alt-3" />
        </span>
      </div>
      <button
        v-if="this.$store.state.sidebarCollasp"
        class="absolute -right-4 top-4 z-[999] flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        type="button"
        @click="
          this.$store.state.sidebarCollasp = !this.$store.state.sidebarCollasp
        "
      >
        <Icon icon="heroicons-outline:arrow-right" />
      </button>
      <div
        class="h-[60px] absolute top-[80px] nav-shadow z-[1] w-full transition-all duration-200 pointer-events-none"
        :class="[shadowbase ? ' opacity-100' : ' opacity-0']"
      ></div>

      <div
        ref="scrollEl"
        class="sidebar-menu px-4 h-[calc(100%-80px)] overflow-y-auto"
      >
        <Navmenu :items="menuItems" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Icon } from "@iconify/vue";
import { defineComponent } from "vue";
import { menuItems } from "../../constant/data";
import Navmenu from "./Navmenu.vue";
import { ref, onMounted } from "vue";

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

  setup() {
    const shadowbase = ref(false);
    const scrollEl = ref(null);
    onMounted(() => {
      const el = scrollEl.value;
      if (!el) {
        return;
      }
      el.addEventListener("scroll", () => {
        if (el.scrollTop > 50) {
          el.classList.add("scroll");
          shadowbase.value = true;
        } else {
          el.classList.remove("scroll");
          shadowbase.value = false;
        }
      });
    });

    return {
      scrollEl,
      shadowbase,
    };
  },
});
</script>
<style lang="scss">
.sidebar-wrapper {
  @apply fixed left-0 top-0   h-screen   z-[999];
}
.close_sidebar.sidebar-wrapper {
  @apply absolute bottom-0 h-full;
}

.nav-shadow {
  background: linear-gradient(
    rgb(255, 255, 255) 5%,
    rgba(255, 255, 255, 75%) 45%,
    rgba(255, 255, 255, 20%) 80%,
    transparent
  );
}
.dark {
  .nav-shadow {
    background: linear-gradient(
      rgba(#1e293b, 100%) 5%,
      rgba(#1e293b, 75%) 45%,
      rgba(#1e293b, 20%) 80%,
      transparent
    );
  }
}
</style>
