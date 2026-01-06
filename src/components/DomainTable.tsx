import { Button, Space, Table } from "antd";
import type { Domain } from "../types/domain";

type Props = {
  data: Domain[];
  loading?: boolean;
  total: number;
  page: number;
  pageSize: number;
  onChangePage: (page: number, pageSize: number) => void;
  onEdit: (domain: Domain) => void;
};

export default function DomainTable({
  data,
  loading,
  total,
  page,
  pageSize,
  onChangePage,
  onEdit,
}: Props) {
  const columns = [
    {
      title: "Domain Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => onEdit(record)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{
        total,
        current: page,
        pageSize,
        showSizeChanger: true,
        onChange: onChangePage,
      }}
    />
  );
}
