import { Switch, Route, Router, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "./state/AppContext";
import { useEffect } from "react";

import LanguagePicker from "./pages/LanguagePicker";
import Home from "./pages/Home";
import PlatformSelect from "./pages/PlatformSelect";
import Walkthrough from "./pages/Walkthrough";
import School from "./pages/School";
import Celebrate from "./pages/Celebrate";
import Schools from "./pages/Schools";
import HowToUse from "./pages/HowToUse";
import NotFound from "@/pages/not-found";

function LangGate({ children }: { children: React.ReactNode }) {
  const { hasPickedLang } = useApp();
  const [location, navigate] = useLocation();
  useEffect(() => {
    // No language yet: force the language picker (except on the public /schools page).
    if (!hasPickedLang && location !== "/" && location !== "/schools" && location !== "/how-to-use") {
      navigate("/");
      return;
    }
    // Language already picked (persisted): never land on the picker again —
    // jump straight to /home so the logo "back home" lands there too.
    if (hasPickedLang && location === "/") {
      navigate("/home", { replace: true });
    }
  }, [hasPickedLang, location, navigate]);
  return <>{children}</>;
}

// Root entry: pick language on first visit, otherwise the LangGate redirects
// returning visitors to /home.
function RootEntry() {
  const { hasPickedLang } = useApp();
  return hasPickedLang ? <Home /> : <LanguagePicker />;
}

function AppRouter() {
  return (
    <LangGate>
      <Switch>
        <Route path="/" component={RootEntry} />
        <Route path="/home" component={Home} />
        <Route path="/language" component={LanguagePicker} />
        <Route path="/select" component={PlatformSelect} />
        <Route path="/walkthrough/:id" component={Walkthrough} />
        <Route path="/walkthrough/:id/:stage" component={Walkthrough} />
        <Route path="/school" component={School} />
        <Route path="/celebrate" component={Celebrate} />
        <Route path="/schools" component={Schools} />
        <Route path="/how-to-use" component={HowToUse} />
        <Route component={NotFound} />
      </Switch>
    </LangGate>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <Router hook={useHashLocation}>
            <AppRouter />
          </Router>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
