import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import SubbedAnime from "./pages/SubbedAnime";
import DubbedAnime from "./pages/DubbedAnime";
import MostPopular from "./pages/MostPopular";
import Movies from "./pages/Movies";
import TVSeries from "./pages/TVSeries";
import GenrePage from "./pages/GenrePage";
import AnimeDetails from "./pages/AnimeDetails";
import WatchPage from "./pages/WatchPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/subbed-anime" element={<SubbedAnime />} />
            <Route path="/dubbed-anime" element={<DubbedAnime />} />
            <Route path="/most-popular" element={<MostPopular />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv-series" element={<TVSeries />} />
            <Route path="/genre/:genreName" element={<GenrePage />} />
            <Route path="/anime/:id" element={<AnimeDetails />} />
            <Route path="/watch/:id" element={<WatchPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
