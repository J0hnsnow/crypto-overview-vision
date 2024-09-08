import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import AssetList from "./pages/AssetList";
import AssetDetail from "./pages/AssetDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <div className="futuristic">
          <header className="bg-black bg-opacity-50 text-blue-300 p-4">
            <h1 className="text-3xl font-bold">GFCTracket</h1>
          </header>
          <main className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<AssetList />} />
              <Route path="/asset/:id" element={<AssetDetail />} />
              {navItems.map(({ to, page }) => (
                <Route key={to} path={to} element={page} />
              ))}
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;