import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/",
    component: () => import("@/Layout/index.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Inicio",
        component: () => import("@/views/Home.vue"),
      },
      {
        path: "/companies",
        name: "Empresas",
        component: () => import("@/views/index.vue"),
      },
      {
        path: "/companies/new",
        name: "Nova empresa",
        redirect: { name: "Empresas", query: { drawer: "new" } },
      },
      {
        path: "/companies/:id/edit",
        name: "Editar empresa",
        redirect: (to) => ({
          name: "Empresas",
          query: { drawer: "edit", id: String(to.params.id) },
        }),
      },
      {
        path: "/companies/:id",
        name: "Detalhes da empresa",
        component: () => import("@/views/CompanyDetails.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const name = typeof to.name === "string" ? to.name : "App";
  document.title = `Econet - ${name}`;
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: "Login" });
    return;
  }
  if (to.name === "Login" && auth.isAuthenticated) {
    next({ name: "Inicio" });
    return;
  }
  next();
});

export default router;
