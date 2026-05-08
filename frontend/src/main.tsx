import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { SidebarProvider } from "./components/ui/sidebar";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="top-center" richColors />
    <SidebarProvider defaultOpen={true}>
      <App />
    </SidebarProvider>
  </StrictMode>,
);
