import AppLayout from "@/components/layout/AppLayout";
import DownloadRoute from "@/routes/DownloadRoute";
import { ROUTES } from "@/routes/ROUTES";
import UploadRoute from "@/routes/UploadRoute";
import UploadE2ETestRoute, {
  UploadE2ETestMode,
} from "@/routes/UploadE2ETestRoute";
import WasmE2ETestRoute, { WasmE2ETestMode } from "@/routes/WasmE2ETestRoute";
import { Routes, Route, Navigate } from "react-router";

function AppRoutes() {
  return (
    <Routes>
      {/* Persistent layout */}
      <Route path={ROUTES.BASE} element={<AppLayout />}>
        {/* Default route */}

        {/* Dynamic container controlled by route names */}
        <Route path={ROUTES.UPLOAD} element={<UploadRoute />} />
        <Route path={ROUTES.DOWNLOAD} element={<DownloadRoute />} />
        <Route
          path={ROUTES.UPLOAD_TEST}
          element={<UploadE2ETestRoute mode={UploadE2ETestMode.DEV} />}
        />
        <Route
          path={ROUTES.WASM_TEST}
          element={<WasmE2ETestRoute mode={WasmE2ETestMode.DEV} />}
        />

        {/* Catch-all route to handle invalid paths */}
        <Route path={ROUTES.NOT_FOUND} element={<UploadRoute />} />
        <Route
          path={ROUTES.NOT_FOUND}
          element={<Navigate to={ROUTES.UPLOAD} replace />}
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
