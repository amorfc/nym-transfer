import { InfoCircleOutlined } from "@ant-design/icons";
import NymText from "./NymText";
import { useThemeColors } from "@/hooks/useThemeColors";

interface NymDisclaimerProps {
  children: React.ReactNode;
  maxWidth?: string | number;
}

const NymDisclaimer: React.FC<NymDisclaimerProps> = ({ children }) => {
  const colors = useThemeColors();

  return (
    <div
      style={{
        padding: "12px",
        background: colors.bgOverlay,
        border: `1px solid ${colors.borderPrimary}`,
        borderRadius: "8px",
        display: "flex",
        gap: "12px",
      }}
    >
      <InfoCircleOutlined
        style={{
          fontSize: "20px",
          color: colors.warning,
          marginTop: "2px",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <NymText style={{ opacity: 0.8 }}>{children}</NymText>
      </div>
    </div>
  );
};

export default NymDisclaimer;
