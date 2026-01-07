import { ConfigProvider } from "antd";
import type { PropsWithChildren } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../store/store";

export default function AppProviders({ children }: PropsWithChildren) {
  return (
    <ReduxProvider store={store}>
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 8,
          },
          components: {
            Table: {
              borderColor: "#d1d5db",
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ReduxProvider>
  );
}
