import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { BrowserRouter } from "react-router";
import AppRoutes from "@/routes/AppRoutes";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <>
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
    <ToastContainer stacked />
  </>
);
