import { z } from "zod";

export const DomainStatusSchema = z.enum(["verified", "pending", "rejected"]);

export const DomainSchema = z.object({
  id: z.string(),
  _id: z.string().optional(),
  domain: z.string(),
  status: DomainStatusSchema,
  isActive: z.boolean(),
  createdDate: z.number(),
});

export const DomainsArraySchema = z.array(DomainSchema);


export const UpsertDomainSchema = z.object({
  domain: z.string().min(1),
  status: DomainStatusSchema, 
  isActive: z.boolean(),
});
