"use client";

import React, { useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  hydrate,
} from "@tanstack/react-query";

export default function QueryProvider({ children, dehydratedState }) {
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => {
    if (dehydratedState) {
      hydrate(queryClient, dehydratedState);
    }
  }, [queryClient, dehydratedState]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
