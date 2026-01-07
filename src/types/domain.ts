export type DomainStatus = "verified" | "pending" | "rejected";

export interface Domain {
  id: string; // از API
  _id?: string; // بعضی رکوردها دارند
  domain: string;
  status: DomainStatus;
  isActive: boolean;
  createdDate: number; // timestamp (ثانیه یا میلی‌ثانیه)
}

export type GetDomainsParams = {
  search?: string;
  status?: DomainStatus;
  isActive?: boolean;
  page?: number; // اگر API نداره، فعلاً client-side می‌زنیم
  pageSize?: number;
};

export type UpsertDomainDto = {
  domain: string;
  isActive?: boolean;
  status?: DomainStatus;
};
