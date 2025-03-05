import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Enum for run status
export enum RunStatus {
  PENDING = "pending",
  SUCCESS = "success",
  ERROR = "error",
  TIMEOUT = "timeout",
}

export interface BenchmarkRequestMetrics {
  id: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: RunStatus;
  error?: string;
}

export interface BenchmarkTestRun {
  id: string;
  fileSize: number;
  uploadRequest: BenchmarkRequestMetrics;
  fileInfoRequest: BenchmarkRequestMetrics;
  downloadRequest: BenchmarkRequestMetrics;
  totalDuration?: number;
  overallStatus: RunStatus;
}

export interface BenchmarkState {
  currentRuns: BenchmarkTestRun[];
}

const initialState: BenchmarkState = {
  currentRuns: [],
};

const generateUniqueId = () =>
  `benchmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const benchmarkSlice = createSlice({
  name: "benchmark",
  initialState,
  reducers: {
    startBenchmarkRun: (
      state,
      action: PayloadAction<{ fileSize: number; runId: string }>
    ) => {
      const newRun: BenchmarkTestRun = {
        id: action.payload.runId,
        fileSize: action.payload.fileSize,
        uploadRequest: {
          id: generateUniqueId(),
          startTime: Date.now(),
          status: RunStatus.PENDING,
        },
        fileInfoRequest: {
          id: generateUniqueId(),
          startTime: 0,
          status: RunStatus.PENDING,
        },
        downloadRequest: {
          id: generateUniqueId(),
          startTime: 0,
          status: RunStatus.PENDING,
        },
        overallStatus: RunStatus.PENDING,
      };
      state.currentRuns.push(newRun);
    },
    updateUploadRequest: (
      state,
      action: PayloadAction<{
        runId: string;
        status: RunStatus;
        error?: string;
      }>
    ) => {
      const run = state.currentRuns.find((r) => r.id === action.payload.runId);
      if (run) {
        const endTime = Date.now();
        run.uploadRequest.endTime = endTime;
        run.uploadRequest.duration = endTime - run.uploadRequest.startTime;
        run.uploadRequest.status = action.payload.status;
        run.uploadRequest.error = action.payload.error;

        // Start file info request timer if upload was successful
        if (action.payload.status === RunStatus.SUCCESS) {
          run.fileInfoRequest.startTime = endTime;
        }
      }
    },
    updateFileInfoRequest: (
      state,
      action: PayloadAction<{
        runId: string;
        status: RunStatus;
        error?: string;
      }>
    ) => {
      const run = state.currentRuns.find((r) => r.id === action.payload.runId);
      if (run) {
        const endTime = Date.now();
        run.fileInfoRequest.endTime = endTime;
        run.fileInfoRequest.duration = endTime - run.fileInfoRequest.startTime;
        run.fileInfoRequest.status = action.payload.status;
        run.fileInfoRequest.error = action.payload.error;

        // Start download request timer if file info was successful
        if (action.payload.status === RunStatus.SUCCESS) {
          run.downloadRequest.startTime = endTime;
        }
      }
    },
    updateDownloadRequest: (
      state,
      action: PayloadAction<{
        runId: string;
        status: RunStatus;
        error?: string;
      }>
    ) => {
      const run = state.currentRuns.find((r) => r.id === action.payload.runId);
      if (run) {
        const endTime = Date.now();
        run.downloadRequest.endTime = endTime;
        run.downloadRequest.duration = endTime - run.downloadRequest.startTime;
        run.downloadRequest.status = action.payload.status;
        run.downloadRequest.error = action.payload.error;

        // Finalize the run
        run.totalDuration = endTime - run.uploadRequest.startTime;
        run.overallStatus = action.payload.status;
      }
    },
    clearBenchmarkRuns: (state) => {
      state.currentRuns = [];
    },
  },
});

export const {
  startBenchmarkRun,
  updateUploadRequest,
  updateFileInfoRequest,
  updateDownloadRequest,
  clearBenchmarkRuns,
} = benchmarkSlice.actions;

export default benchmarkSlice.reducer;
