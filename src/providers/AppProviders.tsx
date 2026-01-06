import { ConfigProvider } from "antd";
import type { PropsWithChildren } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../store/store";

export default function AppProviders({ children }: PropsWithChildren) {
  return (
    <ReduxProvider store={store}>
      <ConfigProvider>
        {children}
      </ConfigProvider>
    </ReduxProvider>
  );
}
