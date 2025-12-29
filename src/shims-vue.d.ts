declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "vue" {
  export * from "@vue/runtime-core";
  export * from "@vue/runtime-dom";
}

declare module "@/components/*" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: {
      state: any;
      dispatch: (action: string, payload?: unknown) => unknown;
      watch: (
        getter: (state: any) => unknown,
        callback: (value: unknown, oldValue: unknown) => void
      ) => () => void;
    };
  }
}
