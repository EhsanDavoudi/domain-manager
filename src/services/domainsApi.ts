import z from "zod";
import {
  DomainsArraySchema,
  DomainSchema,
  UpsertDomainSchema,
} from "../schema/domain";
import type { Domain, UpsertDomainDto } from "../types/domain";
import { baseApi } from "./baseApi";

const DeleteSchema = z.object({ success: z.boolean() });

export const domainsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDomains: builder.query<Domain[], void>({
      query: () => ({ url: "domain" }),
      transformResponse: (raw: unknown) => DomainsArraySchema.parse(raw),
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((d) => ({ type: "Domain" as const, id: d.id })),
              { type: "Domain" as const, id: "LIST" },
            ]
          : [{ type: "Domain" as const, id: "LIST" }],
    }),

    getDomainById: builder.query<Domain, string>({
      query: (id) => ({ url: `domain/${id}` }),
      transformResponse: (raw: unknown) => DomainSchema.parse(raw),
      providesTags: (_r, _e, id) => [{ type: "Domain", id }],
    }),

    addDomain: builder.mutation<Domain, UpsertDomainDto>({
      query: (body) => ({
        url: "/domain",
        method: "POST",
        body: UpsertDomainSchema.parse(body),
      }),
      transformResponse: (raw: unknown) => DomainSchema.parse(raw),
      invalidatesTags: [{ type: "Domain", id: "LIST" }],
    }),

    updateDomain: builder.mutation<
      Domain,
      { id: string; body: UpsertDomainDto }
    >({
      query: ({ id, body }) => ({
        url: `domain/${id}`,
        method: "PUT",
        body: UpsertDomainSchema.parse(body), 
      }),
      transformResponse: (raw: unknown) => DomainSchema.parse(raw),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Domain", id: arg.id },
        { type: "Domain", id: "LIST" },
      ],
    }),

    deleteDomain: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `domain/${id}`, method: "DELETE" }),
      transformResponse: (raw: unknown) => DeleteSchema.parse(raw),
      invalidatesTags: (_r, _e, id) => [
        { type: "Domain", id },
        { type: "Domain", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDomainsQuery,
  useGetDomainByIdQuery,
  useAddDomainMutation,
  useUpdateDomainMutation,
  useDeleteDomainMutation,
} = domainsApi;
