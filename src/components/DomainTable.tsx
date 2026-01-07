import { Button, Popconfirm, Space, Table, Tag } from "antd";
import type { Domain } from "../types/domain";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExportOutlined,
} from "@ant-design/icons";
import Link from "antd/es/typography/Link";

type Props = {
  data: Domain[];
  loading?: boolean;
  total: number;
  page: number;
  pageSize: number;
  onChangePage: (page: number, pageSize: number) => void;
  onEdit: (domain: Domain) => void;
  onDelete: (id: string) => void;
};

export default function DomainTable({
  data,
  loading,
  total,
  page,
  pageSize,
  onChangePage,
  onEdit,
  onDelete,
}: Props) {
  const columns = [
    {
      title: "Domain Name",
      dataIndex: "domain",
      key: "domain",
      render: (_: string, record: Domain) => (
        <Space size={8}>
          {/* Status icon */}
          {record.isActive ? (
            <CheckCircleFilled style={{ color: "#52c41a" }} />
          ) : (
            <CloseCircleFilled style={{ color: "#ff4d4f" }} />
          )}

          {/* Domain link */}
          <Link
            href={record.domain}
            target="_blank"
            // rel="noopener noreferrer"
          >
            {record.domain}
          </Link>
          <ExportOutlined style={{ fontSize: 14, color: "#8c8c8c" }} />
        </Space>
      ),
    },
    {
      title: "Verification Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Active status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag className="font-semibold" color={isActive ? "success" : "error"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Domain) => (
        <Space>
          <Button size="small" onClick={() => onEdit(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Delete domain?"
            description="This action cannot be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record.id)}
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
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
        onChange: onChangePage,

        showSizeChanger: false,
        showQuickJumper: false,
        showTotal: undefined,
        placement: ["bottomCenter"],
      }}
      className="table-header-outline table-row-outline"
    />
  );
}
