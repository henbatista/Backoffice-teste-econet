import { defineStore } from "pinia";

const readStorage = (key: string, fallback: string) => {
  const value = localStorage.getItem(key);
  return value === null ? fallback : value;
};

const applyBodyClass = (classes: string[]) => {
  document.body.classList.remove(
    "dark",
    "light",
    "skin--bordered",
    "skin--default",
    "semi-dark",
    "semi-light"
  );
  document.body.classList.add(...classes);
};

export interface LayoutState {
  sidebarCollasp: boolean;
  sidebarHidden: boolean;
  mobielSidebar: boolean;
  semidark: boolean;
  semiDarkTheme: string;
  isDark: boolean;
  skin: string;
  theme: string;
  isOpenSettings: boolean;
  cWidth: string;
  menuLayout: string;
  navbarType: string;
  navbarColor: string;
  footerType: string;
  chartColors: {
    title: string;
  };
}

export const useLayoutStore = defineStore("layout", {
  state: (): LayoutState => ({
    sidebarCollasp: false,
    sidebarHidden: false,
    mobielSidebar: false,
    semidark: false,
    semiDarkTheme: "semi-light",
    isDark: false,
    skin: "default",
    theme: "light",
    isOpenSettings: false,
    cWidth: "full",
    menuLayout: "vertical",
    navbarType: "sticky",
    navbarColor: "",
    footerType: "static",
    chartColors: {
      title: "red",
    },
  }),
  actions: {
    setSidebarCollasp() {
      this.sidebarCollasp = !this.sidebarCollasp;
    },
    toogleDark() {
      this.isDark = !this.isDark;
      this.theme = this.theme === "dark" ? "light" : "dark";
      applyBodyClass([this.theme, this.skinClass(), this.semiDarkTheme]);
      localStorage.setItem("theme", this.theme);
    },
    toggleSettings() {
      this.isOpenSettings = !this.isOpenSettings;
    },
    toggleMsidebar() {
      this.mobielSidebar = !this.mobielSidebar;
    },
    toggleSemiDark() {
      this.semidark = !this.semidark;
      this.semiDarkTheme = this.semidark ? "semi-dark" : "semi-light";
      applyBodyClass([this.theme, this.skinClass(), this.semiDarkTheme]);
      localStorage.setItem("semiDark", String(this.semidark));
    },
    skinClass() {
      return this.skin === "bordered" ? "skin--bordered" : "skin--default";
    },
    initFromStorage() {
      const theme = readStorage("theme", "light");
      const skin = readStorage("skin", "default");
      const semiDark = readStorage("semiDark", "false");
      const menuLayout = readStorage("menuLayout", "vertical");

      this.theme = theme === "dark" ? "dark" : "light";
      this.isDark = this.theme === "dark";
      this.skin = skin === "bordered" ? "bordered" : "default";
      this.semidark = semiDark === "true";
      this.semiDarkTheme = this.semidark ? "semi-dark" : "semi-light";
      this.menuLayout = menuLayout === "horizontal" ? "horizontal" : "vertical";

      applyBodyClass([this.theme, this.skinClass(), this.semiDarkTheme]);
    },
  },
});
