import AppLayout from "@/components/layout/AppLayout";
import DownloadRoute from "@/routes/DownloadRoute";
import UploadRoute from "@/routes/UploadRoute";
import { Routes, Route } from "react-router";

function AppRoutes() {
  return (
    <Routes>
      {/* Persistent layout */}
      <Route path="/" element={<AppLayout />}>
        {/* Dynamic container controlled by route names */}
        <Route path={"/upload"} element={<UploadRoute />} />
        <Route path={"/download/:path"} element={<DownloadRoute />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
