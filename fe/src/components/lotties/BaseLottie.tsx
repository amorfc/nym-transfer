import TransitionWrapper from "@/components/animation/TransitionWrapper";
import React from "react";
import Lottie from "react-lottie";

interface BaseLottieProps {
  animationData: object; // Lottie animation data
  height?: number; // Optional height
  width?: number; // Optional width
  loop?: boolean; // Should the animation loop
  autoplay?: boolean; // Should the animation autoplay
}

const BaseLottie: React.FC<BaseLottieProps> = ({
  animationData,
  height = 100,
  width = 100,
  loop = true,
  autoplay = true,
}) => {
  const defaultOptions = {
    loop,
    autoplay,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <TransitionWrapper>
      <Lottie options={defaultOptions} height={height} width={width} />
    </TransitionWrapper>
  );
};

export default BaseLottie;
