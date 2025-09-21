import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { AppHeader } from "@/components/Layout/AppHeader";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useCompanyGuard } from "@/hooks/useCompanyGuard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ThankYou from "./pages/Auth/ThankYou";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import AGB from "./pages/Auth/AGB";
import Datenschutz from "./pages/Auth/Datenschutz";
import Terminkalender from "./pages/Terminkalender";
import Kontakte from "./pages/Kontakte";
import Angebote from "./pages/Angebote";
import Vertraege from "./pages/Vertraege";
import Auftraege from "./pages/Auftraege";
import Materialbestellungen from "./pages/Materialbestellungen";
import Rechnungen from "./pages/Rechnungen";
import Objekte from "./pages/Objekte";
import Einsatzplan from "./pages/Einsatzplan";
import Fahrzeuge from "./pages/Fahrzeuge";
import Materialschrank from "./pages/Materialschrank";
import Beschwerden from "./pages/Beschwerden";
import QSKontrollen from "./pages/QSKontrollen";
import Mitarbeiter from "./pages/Mitarbeiter";
import Zeiterfassung from "./pages/Zeiterfassung";
import Stundenkontrolle from "./pages/Stundenkontrolle";
import Abwesenheiten from "./pages/Abwesenheiten";
import Schulungen from "./pages/Schulungen";
import MitarbeiterChat from "./pages/MitarbeiterChat";
import MitarbeiterApp from "./pages/MitarbeiterApp";
import Chat from "./pages/Chat";
import Profileinstellungen from "./pages/Profileinstellungen";
import Einstellungen from "./pages/Einstellungen";
import Benachrichtigungen from "./pages/Benachrichtigungen";
import Tickets from "./pages/Tickets";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Login />;
  }
  
  return <>{children}</>;
}

function AuthLayout() {
  const { user, loading } = useAuth();
  const { needsCompanySetup, loading: companyLoading } = useCompanyGuard();
  
  if (loading || companyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (user && needsCompanySetup) {
    return (
      <SidebarProvider defaultOpen={false}>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AppHeader />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/einstellungen" element={<Einstellungen />} />
                <Route path="*" element={<Einstellungen />} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }
  
  if (user) {
    return (
      <SidebarProvider defaultOpen={false}>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AppHeader />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/terminkalender" element={<Terminkalender />} />
                <Route path="/kontakte" element={<Kontakte />} />
                <Route path="/angebote" element={<Angebote />} />
                <Route path="/vertraege" element={<Vertraege />} />
                <Route path="/auftraege" element={<Auftraege />} />
                <Route path="/materialbestellungen" element={<Materialbestellungen />} />
                <Route path="/rechnungen" element={<Rechnungen />} />
                <Route path="/objekte" element={<Objekte />} />
                <Route path="/einsatzplan" element={<Einsatzplan />} />
                <Route path="/fahrzeuge" element={<Fahrzeuge />} />
                <Route path="/materialschrank" element={<Materialschrank />} />
                <Route path="/beschwerden" element={<Beschwerden />} />
                <Route path="/qs-kontrollen" element={<QSKontrollen />} />
                <Route path="/mitarbeiter" element={<Mitarbeiter />} />
                <Route path="/zeiterfassung" element={<Zeiterfassung />} />
                <Route path="/stundenkontrolle" element={<Stundenkontrolle />} />
                <Route path="/abwesenheiten" element={<Abwesenheiten />} />
                <Route path="/schulungen" element={<Schulungen />} />
                <Route path="/mitarbeiter-chat" element={<MitarbeiterChat />} />
                <Route path="/mitarbeiter-app" element={<MitarbeiterApp />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/profileinstellungen" element={<Profileinstellungen />} />
                <Route path="/einstellungen" element={<Einstellungen />} />
                <Route path="/benachrichtigungen" element={<Benachrichtigungen />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }
  
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      
      <Route path="/agb" element={<AGB />} />
      <Route path="/datenschutz" element={<Datenschutz />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AuthLayout />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
