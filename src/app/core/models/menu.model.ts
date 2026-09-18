export interface MenuChild {
  label: string;
  formId?: number;
  route?: string;
}

export interface MenuNode {
  label: string;
  icon: string;
  route?: string;
  children?: MenuChild[];
}
