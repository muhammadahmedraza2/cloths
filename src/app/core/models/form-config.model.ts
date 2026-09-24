export interface ColumnDef {
  key: string;
  label: string;
}

export interface MasterRecord {
  id: string;
  status: 'Authorized' | 'UnAuthorize';
  closed: 'Y' | 'N';
  [key: string]: any;
}

export interface MasterFormConfig {
  formId: number;
  title: string;
  breadcrumb: string;
  columns: ColumnDef[];
  seedData: MasterRecord[];
}
