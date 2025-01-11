import NymButton from "@/components/common/NymButton";
import NymFlexContainer from "@/components/common/NymFlexContainer";
import NymText from "@/components/common/NymText";
import { FireWorksLottie } from "@/components/lotties/FireWorksLottie";
import { LoadingLottie } from "@/components/lotties/LoadingLottie";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useNymClientStatus } from "@/hooks/store/useNymClientStatus";
import { useDownloadFileMutation } from "@/store/api/nymApi";
import { downloadFileToLocal } from "@/utils/fileUtils";
import { Layout } from "antd";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router";

const DownloadRoute = () => {
  // Extract parameters from the URL
  const { fileId, name } = useParams();
  const [downloadFile, { isLoading, isUninitialized }] =
    useDownloadFileMutation();
  const { isNymClientReady } = useNymClientStatus();
  const { goToUpload } = useAppNavigation();

  const handleDownload = useCallback(async () => {
    const { content } = await downloadFile({
      payload: {
        path: `${fileId ?? ""}/${name ?? ""}`,
      },
    }).unwrap();

    if (content) {
      downloadFileToLocal(content, name ?? "Nym File");
    }
  }, [downloadFile, fileId, name]);

  useEffect(() => {
    const download = async () => {
      if (isUninitialized && fileId && name) {
        await handleDownload();
      }
    };

    if (isNymClientReady) {
      download();
    }
  }, [isUninitialized, fileId, name, handleDownload, isNymClientReady]);

  if (isLoading) {
    return <LoadingLottie />;
  }

  return (
    <Layout style={{ background: "transparent" }}>
      <NymFlexContainer
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <FireWorksLottie />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <NymText style={{ marginBottom: 20 }}>
            {name} Successfully Downloaded
          </NymText>
          <NymButton onClick={() => goToUpload()}>Send New File</NymButton>
        </div>
      </NymFlexContainer>
    </Layout>
  );
};

export default DownloadRoute;
