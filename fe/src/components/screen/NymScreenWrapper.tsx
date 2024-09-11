import { PropsWithChildren } from "react";
import NymFlexContainer from "@/components/common/NymFlexContainer";
import { FlexProps } from "antd";

const NymScreenWrapper = (props: PropsWithChildren & FlexProps) => {
  return <NymFlexContainer>{props.children}</NymFlexContainer>;
};

export default NymScreenWrapper;
