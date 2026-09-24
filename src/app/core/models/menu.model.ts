export interface MenuFormApi {
  label: string;
  formId: number;
}

export interface MenuNodeApi {
  id: number;
  label: string;
  icon: string | null;
  route: string | null;
  formId: number | null;
  children: MenuNodeApi[];
}

// ✅ Add this — used by menu.config.ts
export interface MenuNode {
  label: string;
  icon: string;
  route?: string;
  children?: MenuFormApi[];
}