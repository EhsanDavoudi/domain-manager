import { z } from "zod";

export const DomainStatusSchema = z.enum(["active", "inactive"]);

export const DomainSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, "نام دامنه الزامی است")
    .transform((v) => v.trim().toLowerCase())
    .refine((v) => !v.startsWith("http://") && !v.startsWith("https://"), {
      message: "دامنه نباید شامل http/https باشد",
    }),
  status: DomainStatusSchema,
  createdAt: z.string().optional(),
});

export const UpsertDomainSchema = z.object({
  name: DomainSchema.shape.name,
  status: DomainStatusSchema,
});

export const DomainsListResponseSchema = z.object({
  items: z.array(DomainSchema),
  total: z.number(),
});
