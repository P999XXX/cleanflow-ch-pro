import React from 'react';
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from './components/ErrorBoundary';
import { queryConfig } from './lib/queryConfig';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: queryConfig.contacts.staleTime,
      gcTime: queryConfig.contacts.cacheTime,
      retry: queryConfig.retry.retries,
      retryDelay: queryConfig.retry.retryDelay,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
