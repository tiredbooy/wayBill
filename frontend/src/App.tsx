import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./router";
import { ThemeProvider } from "./providers/ThemeProvider";
import ReactQueryProvider from "./providers/QueryClientProvider";
import { useEffect } from "react";
import { GetSession } from "./_libs/auth/authClient";

const router = createBrowserRouter(routes);

function App() {
  useEffect(() => {
    GetSession({ credentials: "include" });
  }, []);

  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <RouterProvider router={router} />
      </ReactQueryProvider>
    </ThemeProvider>
  );
}

export default App;
