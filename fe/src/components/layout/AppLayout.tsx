import NymLayout from "@/components/common/NymLayout";
import { useTheme } from "@/theme/themeConfig";
import NymControlCenter from "@/components/common/NymControlCenter";
import "./AppLayout.css";
import { ConfigProvider, Layout } from "antd";
import { Outlet, useNavigate } from "react-router";
import NymCard from "@/components/common/NymCard";
import NymFlexContainer from "@/components/common/NymFlexContainer";
import NymButton from "@/components/common/NymButton";
import { useEffect } from "react";
import { useKeepAliveNymClientMutation } from "@/store/api/nymApi";
const { Content } = Layout;

function AppLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [keepAliveNymClient, _data] = useKeepAliveNymClientMutation();

  useEffect(() => {
    // Start the connection management when the app loads
    keepAliveNymClient();
  }, [keepAliveNymClient]);

  return (
    <ConfigProvider wave={{ disabled: false }} theme={theme}>
      <NymLayout>
        <NymButton onClick={() => navigate("/upload")}>Upload</NymButton>
        <NymButton onClick={() => navigate("/download/asdfasdfadsf")}>
          Download
        </NymButton>
        <Content
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <NymCard>
            <NymFlexContainer vertical gap={12}>
              <Outlet />
            </NymFlexContainer>
          </NymCard>

          <NymControlCenter />
        </Content>
      </NymLayout>
    </ConfigProvider>
  );
}

export default AppLayout;
