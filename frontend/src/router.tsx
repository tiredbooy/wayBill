import { Navigate, type RouteObject } from "react-router-dom";
import CreateOrEditDriverSection from "./features/drivers/create-driver/CreateOrEditDriverSection";
import EditDriver from "./features/drivers/edit-driver/EditDriver";
import CreateVehicleSection from "./features/vehicles/CreateOrEditVehicleSection";
import EditVehicle from "./features/vehicles/edit-vehicle/EditVehicle";
import CustomersPage from "./page/CustomersPage";
import DriversPage from "./page/DriversPage";
import VehiclesPage from "./page/VehiclesPage";
import DashboardLayout from "./routes/DashboardLayout";
import CreateOrEditCustomerSection from "./features/customers/create-customer/CreateOrEditCustomerSection";
import WaybillsPage from "./page/WaybillPage";
import CreateOrEditWaybillSection from "./features/waybill/create-waybill/CreateOrEditWaybillSection";
import LocationsPage from "./page/LocationsPage";
import SettingsPage from "./page/SettingPage";
import DashboardPage from "./page/DashboardPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  // ────────────────────────────────────────────────
  //             DASHBOARD + all nested pages
  // ────────────────────────────────────────────────
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> }, // → /dashboard
      {
        path: "drivers",
        children: [
          { index: true, element: <DriversPage /> },
          { path: "new", element: <CreateOrEditDriverSection /> },
          { path: "edit/:id", element: <EditDriver /> },
        ],
      },
      {
        path: "vehicles",
        children: [
          { index: true, element: <VehiclesPage /> },
          { path: "new", element: <CreateVehicleSection /> },
          { path: "edit/:id", element: <EditVehicle /> },
        ],
      },
      {
        path: "customers",
        children: [
          { index: true, element: <CustomersPage /> },
          { path: "new", element: <CreateOrEditCustomerSection /> },
        ],
      },
      {
        path: "waybills",
        children: [
          { index: true, element: <WaybillsPage /> },
          { path: "new", element: <CreateOrEditWaybillSection /> },
        ],
      },

      {
        path: "locations",
        children: [
          { index: true, element: <LocationsPage /> },
          // { path: "new", element: <CreateOrEditWaybillSection /> },
        ],
      },
      { path: "settings", index: true, element: <SettingsPage /> },
      // { path: "waybills/new", element: <WaybillCreate /> },
      // { path: "waybills/:id", element: <WaybillDetail /> },
      // { path: "waybills/:id/edit", element: <WaybillEdit /> },
      // … many more nested routes
    ],
  },

  // ────────────────────────────────────────────────
  //             PUBLIC / standalone pages
  //             (usually different layout / no sidebar)
  // ────────────────────────────────────────────────
  // {
  //   path: "login",
  //   element: <LoginPage />,
  // },
  // {
  //   path: "apply-license",
  //   element: <LicenseApplyPage />,
  // },
  // {
  //   path: "forgot-password",
  //   element: <ForgotPasswordPage />,
  // },

  // 404 – can be nested or top-level
  // {
  //   path: "*",
  //   element: <NotFoundPage />,
  // },
];
