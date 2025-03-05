import AppLayout from "@/components/layout/AppLayout";
import DownloadRoute from "@/routes/main/DownloadRoute";
import { ROUTES } from "@/routes/ROUTES";
import UploadRoute from "@/routes/main/UploadRoute";
import UploadE2ETestRoute, {
  UploadE2ETestMode,
} from "@/routes/test/UploadE2ETestRoute";
import WasmE2ETestRoute, {
  WasmE2ETestMode,
} from "@/routes/test/WasmE2ETestRoute";
import { Routes, Route, Navigate } from "react-router";
import BenchmarkRoute from "@/routes/main/BenchmarkRoute";
import { Env } from "@/env";

function AppRoutes() {
  return (
    <Routes>
      {/* Persistent layout */}
      {/* Default route */}
      <Route path={ROUTES.BASE} element={<AppLayout />}>
        {/* Dynamic container controlled by route names */}
        <Route path={ROUTES.UPLOAD} element={<UploadRoute />} />
        <Route path={ROUTES.DOWNLOAD} element={<DownloadRoute />} />
        {/* Catch-all route to handle invalid paths */}
        <Route path={ROUTES.NOT_FOUND} element={<UploadRoute />} />
        <Route
          path={ROUTES.NOT_FOUND}
          element={<Navigate to={ROUTES.UPLOAD} replace />}
        />
        {/* Development routes */}!
        {Env.IS_DEV && (
          <>
            <Route path={ROUTES.BENCHMARK} element={<BenchmarkRoute />} />
            <Route
              path={ROUTES.UPLOAD_TEST}
              element={<UploadE2ETestRoute mode={UploadE2ETestMode.DEV} />}
            />
            <Route
              path={ROUTES.WASM_TEST}
              element={<WasmE2ETestRoute mode={WasmE2ETestMode.DEV} />}
            />
          </>
        )}
      </Route>
    </Routes>
  );
}

export default AppRoutes;
