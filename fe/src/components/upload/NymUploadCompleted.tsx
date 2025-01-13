import React from "react";
import { FireWorksLottie } from "@/components/lotties/FireWorksLottie";
import NymUploadLink from "@/components/upload/NymUploadLink";
import NymButton from "@/components/common/NymButton";
import TransitionWrapper from "@/components/animation/TransitionWrapper";
import { UploadMixnetResponseData } from "@/service/response/UploadMixnetResponse";
import { useNymFileLink } from "@/hooks/file/useNymFileLink";

interface NymUploadCompletedProps {
  data: UploadMixnetResponseData;
  onSendAnotherFile: () => void;
}

const NymUploadCompleted: React.FC<NymUploadCompletedProps> = ({
  data,
  onSendAnotherFile,
}) => {
  const { createNymDownloadLink } = useNymFileLink();

  return (
    <TransitionWrapper>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <FireWorksLottie />
        <div
          style={{
            flex: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <NymUploadLink link={createNymDownloadLink(data)} />
          <NymButton onClick={onSendAnotherFile}>Send Another File</NymButton>
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default NymUploadCompleted;
