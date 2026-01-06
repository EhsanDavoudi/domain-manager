import { DomainSchema, DomainsListResponseSchema } from "../schema/domain";
import type {
  Domain,
  DomainsListResponse,
  GetDomainsParams,
  UpsertDomainDto,
} from "../types/domain";
import { baseApi } from "./baseApi";

export const domainsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDomains: builder.query<DomainsListResponse, GetDomainsParams | void>({
      query: (params) => ({
        url: "/domains",
        params: params ?? {},
      }),
      transformResponse: (raw: unknown) => DomainsListResponseSchema.parse(raw),
      providesTags: (result) =>
        result?.items?.length
          ? [
              ...result.items.map((d) => ({
                type: "Domain" as const,
                id: d.id,
              })),
              { type: "Domain" as const, id: "LIST" },
            ]
          : [{ type: "Domain" as const, id: "LIST" }],
    }),

    addDomain: builder.mutation<Domain, UpsertDomainDto>({
      query: (body) => ({
        url: "/domains",
        method: "POST",
        body,
      }),
      transformResponse: (raw: unknown) => DomainSchema.parse(raw),
      invalidatesTags: [{ type: "Domain", id: "LIST" }],
    }),

    updateDomain: builder.mutation<
      Domain,
      { id: string; body: UpsertDomainDto }
    >({
      query: ({ id, body }) => ({
        url: `/domains/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (raw: unknown) => DomainSchema.parse(raw),
      invalidatesTags: (result, error, arg) => [
        { type: "Domain", id: arg.id },
        { type: "Domain", id: "LIST" },
      ],
    }),

    deleteDomain: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/domains/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Domain", id: id },
        { type: "Domain", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDomainsQuery,
  useAddDomainMutation,
  useUpdateDomainMutation,
  useDeleteDomainMutation,
} = domainsApi;
