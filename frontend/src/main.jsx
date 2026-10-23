import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from 'react-router-dom'

import "./index.css"
import App from "./App.jsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { AuthProvider } from './components/context/AuthContext.jsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(

  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>

            <App />

          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
