export interface MenuFormApi {
  label: string;
  formId: number;
}

export interface MenuNodeApi {
  label: string;
  icon: string | null;
  route: string | null;
  children: MenuFormApi[] | null;
}

// ✅ Add this — used by menu.config.ts
export interface MenuNode {
  label: string;
  icon: string;
  route?: string;
  children?: MenuFormApi[];
}