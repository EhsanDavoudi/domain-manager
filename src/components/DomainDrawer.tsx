import {
  Drawer,
  Form,
  Input,
  Select,
  Button,
  Space,
  Col,
  Row,
} from "antd";
import type { Domain, UpsertDomainDto, DomainStatus } from "../types/domain";
import { UpsertDomainSchema } from "../schema/domain";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: Domain | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: UpsertDomainDto) => Promise<void>;
};

const statusOptions: { value: DomainStatus; label: string }[] = [
  { value: "verified", label: "Verified" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
];

const activeOptions = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
];

const DEFAULT_STATUS: DomainStatus = "pending";

export default function DomainDrawer({
  open,
  mode,
  initial,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const [form] = Form.useForm<UpsertDomainDto>();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const parsed = UpsertDomainSchema.safeParse(values);
      if (!parsed.success) {
        const issue = parsed.error.issues[0];
        form.setFields([{ name: issue.path as any, errors: [issue.message] }]);
        return;
      }

      await onSubmit(parsed.data);
    } catch {
      // antd validation errors already shown
    }
  };

  return (
    <Drawer
      open={open}
      title={mode === "create" ? "Create Domain" : "Edit Domain"}
      onClose={onClose}
      size={400}
      afterOpenChange={(isOpen) => {
        if (!isOpen) return;

        form.resetFields();
        form.setFieldsValue({
          domain: initial?.domain ?? "",
          status: (initial?.status ?? DEFAULT_STATUS) as DomainStatus,
          isActive: initial?.isActive ?? true,
        });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        initialValues={{
          status: DEFAULT_STATUS,
          isActive: true,
        }}
      >
        <Form.Item
          label="Domain Name"
          name="domain"
          rules={[{ required: true, message: "Please enter the domain name" }]}
        >
          <Input placeholder="example.com" autoComplete="off" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select the status" }]}
            >
              <Select options={statusOptions} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Active"
              name="isActive"
              rules={[{ required: true }]}
            >
              <Select options={activeOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: 24 }}>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" loading={loading} onClick={handleSubmit}>
              {mode === "create" ? "Create" : "Update"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
