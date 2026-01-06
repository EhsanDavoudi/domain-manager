import { Drawer, Form, Input, Select, Button, Space } from "antd";
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
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function DomainDrawer({
  open,
  mode,
  initial,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const [form] = Form.useForm<UpsertDomainDto>();

  return (
    <Drawer
      open={open}
      title={mode === "create" ? "Create Domain" : "Edit Domain"}
      onClose={onClose}
      width={400}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            loading={loading}
            onClick={async () => {
              const values = await form.getFieldsValue();
              const parsed = UpsertDomainSchema.safeParse(values);
              if (!parsed.success) {
                form.setFields([
                  {
                    name: parsed.error.issues[0].path as any,
                    errors: [parsed.error.issues[0].message],
                  },
                ]);
                return;
              }
              await onSubmit(parsed.data);
            }}
          >
            {mode === "create" ? "Create" : "Update"}
          </Button>
        </Space>
      }
      afterOpenChange={(isOpen) => {
        if (!isOpen) return;
        form.setFieldsValue({
          name: initial?.name || "",
          status: initial?.status || "active",
        });
      }}
    >
      <Form form={form} layout="vertical" requiredMark="optional">
        <Form.Item
          label="Domain Name"
          name="name"
          rules={[{ required: true, message: "Please enter the domain name" }]}
        >
          <Input placeholder="example.com" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select the status" }]}
        >
          <Select options={statusOptions} />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
