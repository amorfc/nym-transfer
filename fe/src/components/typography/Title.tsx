import { Typography } from "antd";
import { BasicProps } from "antd/es/layout/layout";

const NymTitle = (props: BasicProps) => {
  const { ...titleProps } = props;
  return <Typography.Title {...titleProps} />;
};

export default NymTitle;
