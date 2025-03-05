import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Select,
  Card,
  Typography,
  Space,
  Tag,
  Row,
  Col,
  Flex,
  Button,
  Alert,
  Spin,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  startBenchmarkRun,
  updateUploadRequest,
  updateFileInfoRequest,
  updateDownloadRequest,
  clearBenchmarkRuns,
  BenchmarkTestRun,
  RunStatus,
} from "@/store/slices/benchmarkSlice";
import {
  useLazyGetFileInfoQuery,
  useUploadFileMutation,
  useDownloadFileMutation,
} from "@/store/api/nymApi";
import { notifyError } from "@/components/toast/toast";
import { useNymClientStatus } from "@/hooks/store/useNymClientStatus";
import { useThemeColors } from "@/hooks/useThemeColors";
import NymButton from "@/components/common/NymButton";
import NymText from "@/components/common/NymText";
import { DeleteOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

// Utility to generate test files
const generateTestFile = (sizeInKB: number): File => {
  const bytes = sizeInKB * 1024;
  const buffer = new ArrayBuffer(bytes);
  const view = new Uint8Array(buffer);

  // Fill with random data
  for (let i = 0; i < view.length; i++) {
    view[i] = Math.floor(Math.random() * 256);
  }

  return new File([buffer], `benchmark-${sizeInKB}kb.bin`, {
    type: "application/octet-stream",
  });
};

const durationHuman = (durationMs?: number): string | null => {
  if (durationMs === 0 || durationMs === undefined || durationMs === null) {
    return null;
  }

  if (durationMs >= 3000) {
    // Convert to seconds with one decimal place if >= 2 seconds
    const seconds = (durationMs / 1000).toFixed(1);
    return `${seconds} sec`;
  } else {
    // Show milliseconds as whole number
    return `${Math.round(durationMs)} ms`;
  }
};

const BenchmarkMetricCard: React.FC<BenchmarkTestRun> = ({
  id,
  fileSize,
  uploadRequest,
  fileInfoRequest,
  downloadRequest,
}) => {
  const colors = useThemeColors();

  // Calculate total duration
  const totalDuration =
    (uploadRequest?.duration || 0) +
    (fileInfoRequest?.duration || 0) +
    (downloadRequest?.duration || 0);

  return (
    <Card
      title={`#${id}`}
      style={{
        width: 300,
        margin: "0 12px 12px 0",
        backgroundColor: colors.bgOverlay,
      }}
    >
      <Row gutter={[0, 8]}>
        <Col
          span={24}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Text strong>File Size:</Text>
          <Text>{fileSize} KB</Text>
        </Col>
        <Col
          span={24}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Text strong>Upload Duration:</Text>
          <Text>{durationHuman(uploadRequest?.duration) ?? <Spin />}</Text>
        </Col>
        <Col
          span={24}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Text strong>File Info Duration:</Text>
          <Text>{durationHuman(fileInfoRequest?.duration) ?? <Spin />}</Text>
        </Col>
        <Col
          span={24}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Text strong>Download Duration:</Text>
          <Text>{durationHuman(downloadRequest?.duration) ?? <Spin />}</Text>
        </Col>
        <Col
          span={24}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Text strong>Total Duration:</Text>
          {totalDuration === 0 ? (
            <Spin />
          ) : (
            <Tag
              bordered={false}
              color={totalDuration > 5000 ? "error" : "success"}
              style={{ fontSize: 14, fontWeight: 600 }}
            >
              {durationHuman(totalDuration)}
            </Tag>
          )}
        </Col>
      </Row>
    </Card>
  );
};

const BenchmarkRoute: React.FC = () => {
  const dispatch = useDispatch();
  const colors = useThemeColors();
  const { isNymClientReady } = useNymClientStatus();
  const [fileSize, setFileSize] = useState<number>(2); // Default 2KB
  const [isRunning, setIsRunning] = useState(false);

  const [uploadFile] = useUploadFileMutation();
  const [downloadFile] = useDownloadFileMutation();
  const [triggerGetFileInfo] = useLazyGetFileInfoQuery();

  const currentRuns = useSelector(
    (state: RootState) => state.benchmark.currentRuns
  );

  const benchmarkResultsRef = useRef<HTMLDivElement>(null);

  // Add a useEffect to scroll to the latest run
  useEffect(() => {
    if (currentRuns.length > 0 && benchmarkResultsRef.current) {
      // Scroll to the rightmost (newest) item
      benchmarkResultsRef.current.scrollLeft =
        benchmarkResultsRef.current.scrollWidth;
    }
  }, [currentRuns.length]);

  const runBenchmark = useCallback(async () => {
    setIsRunning(true);

    try {
      // Generate test file
      const testFile = generateTestFile(fileSize);

      // Start benchmark run
      const runId = `benchmark-${Date.now()}`;
      dispatch(startBenchmarkRun({ fileSize, runId }));

      // Convert file to array buffer for upload
      const arrayBuffer = await testFile.arrayBuffer();
      const content = Array.from(new Uint8Array(arrayBuffer));

      // Upload file
      try {
        const uploadResult = await uploadFile({
          payload: {
            title: `Benchmark Test - ${fileSize}KB`,
            message: `Performance test file of ${fileSize}KB`,
            content,
          },
        }).unwrap();

        // Update upload request status
        dispatch(
          updateUploadRequest({
            runId,
            status: RunStatus.SUCCESS,
          })
        );

        // If upload successful, set the current file path
        if (uploadResult.path) {
          // Trigger file info query
          await triggerGetFileInfo({
            payload: { path: uploadResult.path },
          }).unwrap();

          // Update file info request status with duration
          dispatch(
            updateFileInfoRequest({
              runId,
              status: RunStatus.SUCCESS,
            })
          );

          // Attempt download
          await downloadFile({
            payload: { path: uploadResult.path },
          }).unwrap();

          // Update download request status with duration
          dispatch(
            updateDownloadRequest({
              runId,
              status: RunStatus.SUCCESS,
            })
          );
        }
      } catch (error) {
        // Handle any errors in the upload/download process
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        // Update request statuses with error
        dispatch(
          updateUploadRequest({
            runId,
            status: RunStatus.ERROR,
            error: errorMessage,
          })
        );

        // Notify error
        notifyError({
          message: "Benchmark Upload Failed",
          ...(error instanceof Error ? { description: error.message } : {}),
        });
      }
    } catch (error) {
      notifyError({
        message: "Benchmark failed",
        ...(error instanceof Error ? { description: error.message } : {}),
      });
    } finally {
      setIsRunning(false);
    }
  }, [fileSize, dispatch, uploadFile, downloadFile, triggerGetFileInfo]);

  const handleClearBenchmarkRuns = () => {
    dispatch(clearBenchmarkRuns());
  };

  const options = [
    { value: 2, label: "2 KB" },
    { value: 10, label: "10 KB" },
    { value: 100, label: "100 KB" },
    { value: 200, label: "200 KB" },
    { value: 1024, label: "1 MB" },
    { value: 2 * 1024, label: "2 MB" },
    { value: 10 * 1024, label: "10 MB" },
  ];

  // If Nym client is not ready, show a warning
  if (!isNymClientReady) {
    return (
      <Alert
        message="Nym Client Not Ready"
        description={
          <>
            Benchmark tests cannot be performed without a connected Nym client.
            Please check the{" "}
            <a href="https://github.com/amorfc/nym-transfer" target="_blank">
              README.md
            </a>{" "}
            for setup instructions and ensure your Nym client is properly
            configured and connected before running benchmarks.
          </>
        }
        type="warning"
        showIcon
        style={{
          backgroundColor: colors.bgOverlay,
          borderColor: colors.warning,
        }}
      />
    );
  }

  const hasCurrentRuns = currentRuns.length > 0;

  return (
    <Flex vertical gap={12}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Title level={4}>Nym Network Benchmark</Title>

          <Space
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Select
              placeholder="Select File Size"
              value={fileSize}
              onChange={(value) => setFileSize(value)}
              disabled={isRunning}
              variant="borderless"
              style={{
                display: "flex",
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.4)", // Increased opacity for better contrast
                color: colors.textPrimary,
                borderRadius: 10,
              }}
              dropdownStyle={{ backgroundColor: colors.bgOverlay }}
              options={options}
            />

            <NymButton onClick={runBenchmark} loading={isRunning}>
              Run Benchmark
            </NymButton>
          </Space>
        </Space>
      </Card>
      <Flex vertical gap={12}>
        <Flex align="center">
          <NymText>Benchmark Results</NymText>
          {hasCurrentRuns && (
            <Button
              type="text"
              onClick={handleClearBenchmarkRuns}
              style={{ color: colors.error }}
              icon={<DeleteOutlined />}
              size={"small"}
              disabled={isRunning}
            />
          )}
        </Flex>
        <Flex
          ref={benchmarkResultsRef}
          gap={12}
          style={{
            overflowX: "auto",
            scrollBehavior: "smooth", // Add smooth scrolling
          }}
        >
          {hasCurrentRuns ? (
            currentRuns.map((run) => (
              <BenchmarkMetricCard key={run.id} {...run} />
            ))
          ) : (
            <Typography.Text type="secondary">
              No benchmark runs completed yet.
            </Typography.Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default BenchmarkRoute;
