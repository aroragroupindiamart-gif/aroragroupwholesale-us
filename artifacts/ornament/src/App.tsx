import { Switch, Route, Router as WouterRouter } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import LandingPage from "@/pages/LandingPage";
import StateDirectory from "@/pages/StateDirectory";
import { ALL_US_STATES } from "@/lib/staticData";

function useNormalizedLocation() {
  const [location, navigate] = useBrowserLocation();
  const normalized = location !== "/" && location.endsWith("/")
    ? location.slice(0, -1)
    : location;
  return [normalized, navigate] as ReturnType<typeof useBrowserLocation>;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function SlugRouter({ params }: { params: { slug: string } }) {
  const slug = (params.slug || "").toLowerCase();
  const isState = ALL_US_STATES.some(
    (s) =>
      s.state_code?.toLowerCase() === slug ||
      s.state_slug === slug ||
      `korean-jewellery-wholesaler-${s.state_slug}` === slug ||
      `korean-jewellery-wholesaler-${s.state_code?.toLowerCase()}` === slug
  );
  if (isState) {
    return <StateDirectory slug={slug} />;
  }
  return <LandingPage />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/:slug" component={SlugRouter} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter hook={useNormalizedLocation} base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
