import NymLayout from "@/components/common/NymLayout";
import { useTheme } from "@/theme/themeConfig";
import NymControlCenter from "@/components/common/NymControlCenter";
import { ConfigProvider, Layout } from "antd";
import { Link, Outlet, useLocation } from "react-router";
import NymCard from "@/components/common/NymCard";
import NymFlexContainer from "@/components/common/NymFlexContainer";
import { useEffect } from "react";
import { useKeepAliveNymClientMutation } from "@/store/api/nymApi";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import TransitionWrapper from "@/components/animation/TransitionWrapper";
import { setIsConnecting } from "@/store/slice/nymClientSlice";
import { useAppDispatch } from "@/hooks/useAppStore";
import NymLogoSvg from "@/components/svg/NymLogoSvg";
import { ROUTES } from "@/routes/ROUTES";
import { useThemeColors } from "@/hooks/useThemeColors";
import NymText from "@/components/common/NymText";
import NymDisclaimer from "@/components/common/NymDisclaimer";
import { useResponsive } from "antd-style";

const { Content } = Layout;

function AppLayout() {
  const theme = useTheme();
  const { mobile } = useResponsive();
  const { goToUpload } = useAppNavigation();
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [keepAliveNymClient, _data] = useKeepAliveNymClientMutation();
  const colors = useThemeColors();
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
        <Link to={ROUTES.UPLOAD} style={{ color: colors.primary }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "2rem",
            }}
          >
            <NymLogoSvg />
            <NymText color={colors.primary} weight="bold">
              TRANSFER
            </NymText>
          </div>
        </Link>
        <Content
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1rem",
            padding: mobile ? "1rem" : "0rem",
            // Mobile-specific styles
            ...(mobile && {
              height: "100vh",
              overflow: "auto",
              scrollBehavior: "smooth",
              paddingBottom: "80px",
            }),
          }}
        >
          <NymCard>
            <TransitionWrapper>
              <NymFlexContainer vertical gap={12}>
                {<Outlet />}
              </NymFlexContainer>
            </TransitionWrapper>
          </NymCard>
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <NymDisclaimer>
              Multiple tabs are not allowed to use{" "}
              <NymText color={colors.primary}>
                Nym Transfer through the Nym Mixnet
              </NymText>{" "}
              due to stability issues.
            </NymDisclaimer>
          </div>

          <NymControlCenter />
        </Content>
      </NymLayout>
    </ConfigProvider>
  );
}

export default AppLayout;
