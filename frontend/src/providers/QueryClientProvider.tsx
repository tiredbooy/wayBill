import {
  QueryClient,
  QueryClientProvider,
  onlineManager,
} from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// Optional: handle network status changes globally
if (typeof window !== "undefined") {
  onlineManager.setEventListener((setOnline) => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  });
}

export default function ReactQueryProvider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Retry logic: exponential backoff, no retry on 404 or 403
            retry: (failureCount, error) => {
              if (error instanceof Response && error.status === 404) return false;
              if (error instanceof Response && error.status === 403) return false;
              return failureCount < 3;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            staleTime: 60_000, // 1 minute – adjust based on your data volatility
            gcTime: 300_000,   // 5 minutes (formerly cacheTime)
            refetchOnWindowFocus: true,  // good for dashboards, disable for static data
            refetchOnReconnect: true,
            refetchOnMount: true,
            networkMode: "online", // prevents requests when offline (use "always" if you need offline cache)
            throwOnError: (error) => {
              // Optionally log errors to your monitoring service
              console.error("Query error:", error);
              return false; // let react-query handle error state
            },
          },
          mutations: {
            retry: 1, // mutations usually shouldn't retry heavily
            networkMode: "online",
            throwOnError: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* {process.env.NODE_ENV === "development" && <ReactQueryDevtools />} */}
    </QueryClientProvider>
  );
}