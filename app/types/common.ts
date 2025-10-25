export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface ImageEntity extends BaseEntity {
  image: string;
}

export interface StatusEntity extends BaseEntity {
  isActive: boolean;
}

export interface UrgencyEntity extends BaseEntity {
  isUrgent: boolean;
}

export interface ImportanceEntity extends BaseEntity {
  importance: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FilterParams {
  search?: string;
  status?: boolean;
  importance?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface TableColumn<T> {
  id: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
}

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "email"
    | "password"
    | "number"
    | "date"
    | "time"
    | "select"
    | "multiselect"
    | "image"
    | "checkbox";
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: unknown; label: string }>;
  multiple?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: unknown) => boolean | string;
  };
}
