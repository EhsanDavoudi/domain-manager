import { useState } from "react";
import type { Domain, DomainStatus, UpsertDomainDto } from "./types/domain";
import {
  useAddDomainMutation,
  useDeleteDomainMutation,
  useGetDomainByIdQuery,
  useGetDomainsQuery,
  useUpdateDomainMutation,
} from "./services/domainsApi";
import { Button, Input, message, Select, Space } from "antd";
import DomainTable from "./components/DomainTable";
import DomainDrawer from "./components/DomainDrawer";

export default function DomainsView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<DomainStatus | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(
    undefined
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<Domain | null>(null);

  const { data = [], isFetching, isError, refetch } = useGetDomainsQuery();

  const domainId = selected?.id;
  const { data: domainDetails, isFetching: isFetchingDomain } =
    useGetDomainByIdQuery(domainId!, {
      skip: !drawerOpen || drawerMode !== "edit" || !domainId,
    });

  const filtered = data.filter((d) => {
    const s = search.trim().toLowerCase();
    const matchSearch = !s || d.domain.toLowerCase().includes(s);
    const matchStatus = !status || d.status === status;
    const matchActive =
      activeFilter === undefined || d.isActive === activeFilter;
    return matchSearch && matchStatus && matchActive;
  });

  const [addDomain, { isLoading: isAdding }] = useAddDomainMutation();
  const [updateDomain, { isLoading: isUpdating }] = useUpdateDomainMutation();
  const [deleteDomain, { isLoading: isDeleting }] = useDeleteDomainMutation();

  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  const openCreate = () => {
    setDrawerMode("create");
    setSelected(null);
    setDrawerOpen(true);
  };

  const openEdit = (domain: Domain) => {
    setDrawerMode("edit");
    setSelected(domain);
    setDrawerOpen(true);
  };

  const onSubmit = async (values: UpsertDomainDto) => {
    try {
      if (drawerMode === "create") {
        await addDomain(values).unwrap();
        message.success("Domain added successfully");
      } else if (selected) {
        await updateDomain({ id: selected.id, body: values }).unwrap();
        message.success("Domain updated successfully");
      }
      setDrawerOpen(false);
    } catch (error) {
      message.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteDomain(id).unwrap();
      message.success("Domain deleted successfully");
    } catch {
      message.error("Failed to delete domain");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl">Domains</h1>

        <Space>
          <Input
            allowClear
            placeholder="Search.."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ width: 200 }}
          />
          <Select
            allowClear
            placeholder="Filter by status"
            value={status}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            style={{ width: 150 }}
            options={[
              { value: "verified", label: "Verified" },
              { value: "pending", label: "Pending" },
              { value: "rejected", label: "Rejected" },
            ]}
          />
          <Select
            allowClear
            placeholder="Active?"
            value={activeFilter}
            onChange={(v) => {
              setActiveFilter(v);
              setPage(1);
            }}
            style={{ width: 140 }}
            options={[
              { value: true, label: "Active" },
              { value: false, label: "Inactive" },
            ]}
          />
          <Button type="primary" onClick={openCreate}>
            Add Domain
          </Button>
        </Space>
      </div>
      {isError ? (
        <div className="border rounded p-4">
          <div className="mb-2">Failed to load domains.</div>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      ) : (
        <DomainTable
          data={paged}
          total={filtered.length}
          loading={isFetching || isDeleting}
          page={page}
          pageSize={pageSize}
          onChangePage={(p, ps) => {
            setPage(p);
            setPageSize(ps);
          }}
          onEdit={openEdit}
          onDelete={onDelete}
        />
      )}

      <DomainDrawer
        open={drawerOpen}
        mode={drawerMode}
        initial={drawerMode === "edit" ? domainDetails ?? null : selected}
        loading={isAdding || isUpdating}
        initialLoading={drawerMode === "edit" && isFetchingDomain}
        onClose={() => setDrawerOpen(false)}
        onSubmit={onSubmit}
      />
    </div>
  );
}
