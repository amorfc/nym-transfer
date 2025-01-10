import AppLayout from "@/components/layout/AppLayout";
import DownloadRoute from "@/routes/DownloadRoute";
import { ROUTES } from "@/routes/ROUTES";
import UploadRoute from "@/routes/UploadRoute";
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

        {/* Catch-all route to handle invalid paths */}
        {/* <Route path={ROUTES.NOT_FOUND} element={<UploadRoute />} /> */}
        <Route
          path={ROUTES.NOT_FOUND}
          element={<Navigate to={ROUTES.UPLOAD} replace />}
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
