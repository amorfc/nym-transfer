import { useState, useCallback } from "react";
import { useUploadFileMutation } from "@/store/api/nymApi";
import { useSelectNymClient } from "@/hooks/store/useSelectNymClient";
import TransitionWrapper from "@/components/animation/TransitionWrapper";
import NymButton from "@/components/common/NymButton";
import { Input } from "antd";

export enum UploadE2ETestMode {
  DEV = "dev",
}

interface Props {
  mode: UploadE2ETestMode;
}

const UploadE2ETestRoute = ({ mode }: Props) => {
  const [fileSize, setFileSize] = useState<number>(1024); // Default 1MB
  const [uploadFile] = useUploadFileMutation();
  const { isConnected } = useSelectNymClient();
  const [isLoading, setIsLoading] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<string | null>(null);

  const generateAndUploadFile = useCallback(async () => {
    if (!isConnected) {
      console.error("Not connected to Nym network");
      return;
    }

    setIsLoading(true);
    setLastTestResult(null);

    // Generate array of specified size with repeating pattern
    const content = Array.from({ length: fileSize * 1024 }, (_, i) => i % 256);

    console.log(`Starting upload test with file size: ${fileSize}KB`);
    const startTime = performance.now();

    try {
      await uploadFile({
        payload: {
          title: `test-${fileSize}kb-${Date.now()}`,
          message: "This is a test message",
          content,
        },
      }).unwrap();

      const endTime = performance.now();
      const duration = endTime - startTime;
      const speed = (fileSize / 1024 / (duration / 1000)).toFixed(2);

      console.log("Upload Test Results:");
      console.log(`File size: ${fileSize}KB`);
      console.log(`Total time: ${duration.toFixed(2)}ms`);
      console.log(`Speed: ${speed} MB/s`);

      setLastTestResult(`${speed} MB/s`);
    } catch (error) {
      console.error("Upload test failed:", error);
      setLastTestResult("Test failed");
    } finally {
      setIsLoading(false);
    }
  }, [fileSize, uploadFile, isConnected]);

  if (mode !== UploadE2ETestMode.DEV) {
    return null;
  }

  return (
    <TransitionWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-white font-bold text-2xl mb-8">
            Upload E2E Test
          </h1>
          <div className="flex flex-col space-y-6">
            <div>
              <label className="text-white block mb-4">File Size (KB)</label>
              <Input
                type="number"
                value={fileSize}
                onChange={(e) =>
                  setFileSize(Math.max(1, parseInt(e.target.value)))
                }
                disabled={isLoading}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                placeholder="Size in KB"
              />
            </div>
            <NymButton
              onClick={generateAndUploadFile}
              loading={isLoading}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600 transition-colors"
            >
              Run Upload Test
            </NymButton>
            {lastTestResult && (
              <div className="text-center text-white mt-4">
                Upload Speed:{" "}
                <span className="font-bold">{lastTestResult}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default UploadE2ETestRoute;
