import NymLayout from "@/components/common/NymLayout";
import { useTheme } from "@/theme/themeConfig";
import NymControlCenter from "@/components/common/NymControlCenter";
import { ConfigProvider, Layout } from "antd";
import { Link, Outlet, useLocation } from "react-router";
import NymCard from "@/components/common/NymCard";
import NymFlexContainer from "@/components/common/NymFlexContainer";
import { useEffect } from "react";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import TransitionWrapper from "@/components/animation/TransitionWrapper";
import NymLogoSvg from "@/components/svg/NymLogoSvg";
import { ROUTES } from "@/routes/ROUTES";
import { useThemeColors } from "@/hooks/useThemeColors";
import NymText from "@/components/common/NymText";
import NymDisclaimer from "@/components/common/NymDisclaimer";
import { useResponsive } from "antd-style";
import { useNymConnection } from "@/hooks/nym/useNymConnection";

const { Content } = Layout;

function AppLayout() {
  //Init Nym Connection&KeepAlive
  useNymConnection();

  const theme = useTheme();
  const { mobile } = useResponsive();
  const { goToUpload } = useAppNavigation();
  const colors = useThemeColors();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") {
      goToUpload({ replace: true });
    }
  }, [location, goToUpload]);

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
