import React from "react";
import { FireWorksLottie } from "@/components/lotties/FireWorksLottie";
import NymUploadLink from "@/components/upload/NymUploadLink";
import NymButton from "@/components/common/NymButton";
import TransitionWrapper from "@/components/animation/TransitionWrapper";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { UploadMixnetResponseData } from "@/service/response/UploadMixnetResponse";
import { useNymFileLink } from "@/hooks/useNymFileLink";

interface NymUploadCompletedProps {
  data: UploadMixnetResponseData;
}

const NymUploadCompleted: React.FC<NymUploadCompletedProps> = ({ data }) => {
  const { goToUpload } = useAppNavigation();
  const { createNymDownloadLink } = useNymFileLink();

  return (
    <TransitionWrapper>
      <FireWorksLottie />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginTop: "auto",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <NymUploadLink link={createNymDownloadLink(data)} />
        <NymButton onClick={() => goToUpload()}>Send Another File</NymButton>
      </div>
    </TransitionWrapper>
  );
};

export default NymUploadCompleted;
