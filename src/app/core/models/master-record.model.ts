export interface ColumnDef {
  key: string;
  label: string;
}

export interface FormDefinitionApi {
  formId: number;
  title: string;
  breadcrumb: string;
  columns: ColumnDef[];
}

export interface MasterRecordApi {
  id: string;
  status: string;   // "Authorized" | "UnAuthorize"
  closed: string;   // "Y" | "N"
  fields: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
}

export interface MasterRecordUpsert {
  status?: string;
  closed?: string;
  fields: Record<string, any>;
}