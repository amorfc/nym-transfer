import animationData from "@/assets/lotties/loading.json";
import BaseLottie from "@/components/lotties/BaseLottie";

export const LoadingLottie = () => {
  return <BaseLottie animationData={animationData} height={200} width={200} />;
};
