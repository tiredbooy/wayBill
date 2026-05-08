import { Outlet } from "react-router-dom";

import Header from "@/features/reusable/Header";
import Sidebar from "@/features/reusable/Sidebar";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main column */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
