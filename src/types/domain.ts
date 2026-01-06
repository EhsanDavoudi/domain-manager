import type { z } from "zod";
import {
  DomainSchema,
  UpsertDomainSchema,
  DomainsListResponseSchema,
  DomainStatusSchema,
} from "../schema/domain";

export type Domain = z.infer<typeof DomainSchema>;
export type UpsertDomainDto = z.infer<typeof UpsertDomainSchema>;
export type DomainsListResponse = z.infer<typeof DomainsListResponseSchema>;
export type DomainStatus = z.infer<typeof DomainStatusSchema>;

export type GetDomainsParams = {
  search?: string;
  status?: DomainStatus;
  page?: number;
  pageSize?: number;
};
