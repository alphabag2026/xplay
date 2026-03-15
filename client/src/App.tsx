import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppProvider } from "./contexts/AppContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAnnouncements from "./pages/admin/Announcements";
import AdminNews from "./pages/admin/News";
import AdminPartners from "./pages/admin/Partners";
import AdminMedia from "./pages/admin/Media";
import AdminUsers from "./pages/admin/Users";
import AdminAuditLogs from "./pages/admin/AuditLogs";
import AdminCsTickets from "./pages/admin/CsTickets";
import AdminLeaderReferrals from "./pages/admin/LeaderReferrals";
import AdminUrgentNotices from "./pages/admin/UrgentNotices";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      {/* Admin Back-Office Routes */}
      <Route path="/admin">
        <AdminLayout><AdminDashboard /></AdminLayout>
      </Route>
      <Route path="/admin/announcements">
        <AdminLayout><AdminAnnouncements /></AdminLayout>
      </Route>
      <Route path="/admin/news">
        <AdminLayout><AdminNews /></AdminLayout>
      </Route>
      <Route path="/admin/partners">
        <AdminLayout><AdminPartners /></AdminLayout>
      </Route>
      <Route path="/admin/media">
        <AdminLayout><AdminMedia /></AdminLayout>
      </Route>
      <Route path="/admin/users">
        <AdminLayout><AdminUsers /></AdminLayout>
      </Route>
      <Route path="/admin/leader-referrals">
        <AdminLayout><AdminLeaderReferrals /></AdminLayout>
      </Route>
      <Route path="/admin/cs">
        <AdminLayout><AdminCsTickets /></AdminLayout>
      </Route>
      <Route path="/admin/urgent-notices">
        <AdminLayout><AdminUrgentNotices /></AdminLayout>
      </Route>
      <Route path="/admin/audit-logs">
        <AdminLayout><AdminAuditLogs /></AdminLayout>
      </Route>
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
