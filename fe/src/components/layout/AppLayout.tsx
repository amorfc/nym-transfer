import NymLayout from "@/components/common/NymLayout";
import { useTheme } from "@/theme/themeConfig";
import NymControlCenter from "@/components/common/NymControlCenter";
import { ConfigProvider, Layout } from "antd";
import { Outlet, useLocation } from "react-router";
import NymCard from "@/components/common/NymCard";
import NymFlexContainer from "@/components/common/NymFlexContainer";
import { useEffect } from "react";
import { useKeepAliveNymClientMutation } from "@/store/api/nymApi";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import TransitionWrapper from "@/components/animation/TransitionWrapper";
import { setIsConnecting } from "@/store/slice/nymClientSlice";
import { useAppDispatch } from "@/hooks/useAppStore";

const { Content } = Layout;

function AppLayout() {
  const theme = useTheme();
  const { goToUpload } = useAppNavigation();
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [keepAliveNymClient, _data] = useKeepAliveNymClientMutation();

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      goToUpload({ replace: true });
    }
  }, [location, goToUpload]);

  useEffect(() => {
    dispatch(setIsConnecting(true));
    // Start the connection management when the app loads
    const timeout = setTimeout(() => {
      keepAliveNymClient();
    }, 2000);

    return () => clearInterval(timeout);
  }, [dispatch, keepAliveNymClient]);

  return (
    <ConfigProvider wave={{ disabled: true }} theme={theme}>
      <NymLayout>
        <Content
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <NymCard>
            <TransitionWrapper>
              <NymFlexContainer vertical gap={12}>
                {<Outlet />}
              </NymFlexContainer>
            </TransitionWrapper>
          </NymCard>

          <NymControlCenter />
        </Content>
      </NymLayout>
    </ConfigProvider>
  );
}

export default AppLayout;
