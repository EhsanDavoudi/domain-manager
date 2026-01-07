export type DomainStatus = "verified" | "pending" | "rejected";

export interface Domain {
  id: string;
  _id?: string; 
  domain: string;
  status: DomainStatus;
  isActive: boolean;
  createdDate: number;
}

export type GetDomainsParams = {
  search?: string;
  status?: DomainStatus;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
};

export type UpsertDomainDto = {
  domain: string;
  isActive: boolean;
  status: DomainStatus;
};
