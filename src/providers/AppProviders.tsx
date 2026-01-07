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
            // global tokens (optional)
            borderRadius: 8,
          },
          components: {
            Table: {
              headerBg: "transparent",
              headerColor: "inherit",
              borderColor: "#d1d5db",

              // optional, depending on your desired look:
              // rowHoverBg: "transparent",
              // headerSortActiveBg: "transparent",
              // headerSortHoverBg: "transparent",
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ReduxProvider>
  );
}
