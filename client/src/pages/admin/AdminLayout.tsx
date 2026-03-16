import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { getLoginUrl } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { useApp } from "@/contexts/AppContext";
import { LANG_LABELS, LANG_ORDER, type Lang } from "@/lib/i18n";
import {
  LayoutDashboard, Megaphone, Newspaper, Users, HardDrive, UserCog,
  LogOut, PanelLeft, ArrowLeft, Shield, ShieldCheck, ScrollText, Headphones, Crown, AlertTriangle, FolderOpen, KeyRound, BarChart3, BookOpen, Globe,
} from "lucide-react";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, Link } from "wouter";
import { DashboardLayoutSkeleton } from "@/components/DashboardLayoutSkeleton";
import { Button } from "@/components/ui/button";

type MenuItem = {
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  path: string;
  /** Which roles can see this menu item */
  roles: Array<"admin" | "sub_admin">;
};

const allMenuItems: MenuItem[] = [
  { icon: LayoutDashboard, labelKey: "menu.dashboard", path: "/admin", roles: ["admin", "sub_admin"] },
  { icon: Megaphone, labelKey: "menu.announcements", path: "/admin/announcements", roles: ["admin"] },
  { icon: Newspaper, labelKey: "menu.news", path: "/admin/news", roles: ["admin", "sub_admin"] },
  { icon: Users, labelKey: "menu.partners", path: "/admin/partners", roles: ["admin", "sub_admin"] },
  { icon: FolderOpen, labelKey: "menu.resources", path: "/admin/resources", roles: ["admin", "sub_admin"] },
  { icon: HardDrive, labelKey: "menu.media", path: "/admin/media", roles: ["admin"] },
  { icon: UserCog, labelKey: "menu.users", path: "/admin/users", roles: ["admin"] },
  { icon: Crown, labelKey: "menu.leaderReferrals", path: "/admin/leader-referrals", roles: ["admin", "sub_admin"] },
  { icon: AlertTriangle, labelKey: "menu.urgentNotices", path: "/admin/urgent-notices", roles: ["admin", "sub_admin"] },
  { icon: Headphones, labelKey: "menu.cs", path: "/admin/cs", roles: ["admin", "sub_admin"] },
  { icon: BarChart3, labelKey: "menu.liveFeed", path: "/admin/live-feed", roles: ["admin"] },
  { icon: BookOpen, labelKey: "menu.tutorials", path: "/admin/tutorials", roles: ["admin", "sub_admin"] },
  { icon: ScrollText, labelKey: "menu.auditLogs", path: "/admin/audit-logs", roles: ["admin"] },
  { icon: KeyRound, labelKey: "menu.changePassword", path: "/admin/change-password", roles: ["admin", "sub_admin"] },
];

const SIDEBAR_WIDTH_KEY = "admin-sidebar-width";
const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;

/** Compact language selector for admin sidebar */
function AdminLangSelector({ collapsed }: { collapsed: boolean }) {
  const { lang, setLang } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative px-2 mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium rounded-lg transition-colors hover:bg-accent/50 text-muted-foreground"
      >
        <Globe className="h-4 w-4 shrink-0" />
        {!collapsed && <span className="truncate">{LANG_LABELS[lang]}</span>}
      </button>

      {open && (
        <div
          className="absolute left-0 bottom-full mb-1 py-1 min-w-[160px] max-h-[400px] overflow-y-auto z-50 rounded-lg border bg-popover text-popover-foreground shadow-lg"
        >
          {LANG_ORDER.map((l) => (
            <button
              key={l}
              onClick={() => { setLang(l); setOpen(false); }}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors hover:bg-accent ${l === lang ? "text-primary font-medium bg-accent/50" : ""}`}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();
  const { t } = useApp();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) return <DashboardLayoutSkeleton />;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <Shield className="h-16 w-16 text-muted-foreground opacity-50" />
          <h1 className="text-2xl font-semibold tracking-tight text-center">{t("sidebar.loginRequired")}</h1>
          <p className="text-sm text-muted-foreground text-center">{t("sidebar.loginDesc")}</p>
          <Button onClick={() => { window.location.href = getLoginUrl(); }} size="lg" className="w-full">
            {t("login.submit")}
          </Button>
        </div>
      </div>
    );
  }

  // Check admin or sub_admin role
  if (user.role !== "admin" && user.role !== "sub_admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-6 p-8 max-w-md w-full">
          <Shield className="h-16 w-16 text-destructive opacity-50" />
          <h1 className="text-2xl font-semibold tracking-tight text-center">{t("sidebar.noAccess")}</h1>
          <p className="text-sm text-muted-foreground text-center">{t("sidebar.noAccessDesc")}</p>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> {t("sidebar.backToMain")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}>
      <AdminLayoutContent setSidebarWidth={setSidebarWidth}>{children}</AdminLayoutContent>
    </SidebarProvider>
  );
}

function AdminLayoutContent({ children, setSidebarWidth }: { children: React.ReactNode; setSidebarWidth: (w: number) => void }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { t } = useApp();

  const userRole = (user?.role ?? "user") as "admin" | "sub_admin" | "user";

  // Filter menu items based on user role
  const visibleMenuItems = useMemo(() => {
    if (userRole === "admin") return allMenuItems;
    if (userRole === "sub_admin") return allMenuItems.filter(item => item.roles.includes("sub_admin"));
    return [];
  }, [userRole]);

  const activeMenuItem = visibleMenuItems.find(item => item.path === location);

  useEffect(() => {
    if (isCollapsed) setIsResizing(false);
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar collapsible="icon" className="border-r-0" disableTransition={isResizing}>
          <SidebarHeader className="h-16 justify-center">
            <div className="flex items-center gap-3 px-2 transition-all w-full">
              <button onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors focus:outline-none shrink-0">
                <PanelLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              {!isCollapsed && (
                <div className="flex items-center gap-2 min-w-0">
                  {userRole === "admin" ? (
                    <Shield className="h-4 w-4 text-cyan-400 shrink-0" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
                  )}
                  <span className="font-semibold tracking-tight truncate text-sm">{t("sidebar.backoffice")}</span>
                </div>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0">
            {/* Role badge */}
            {!isCollapsed && (
              <div className="px-4 py-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  userRole === "admin" ? "text-red-500 bg-red-500/10" : "text-amber-500 bg-amber-500/10"
                }`}>
                  {userRole === "admin" ? <Shield className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                  {userRole === "admin" ? t("sidebar.admin") : t("sidebar.subAdmin")}
                </span>
              </div>
            )}

            <SidebarMenu className="px-2 py-1">
              {visibleMenuItems.map(item => {
                const isActive = location === item.path;
                const label = t(item.labelKey);
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton isActive={isActive} onClick={() => setLocation(item.path)} tooltip={label} className="h-10 transition-all font-normal">
                      <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>

            {/* Back to site */}
            <div className="px-2 mt-4">
              <SidebarMenuButton onClick={() => setLocation("/")} tooltip={t("sidebar.backToSite")} className="h-10 font-normal text-muted-foreground">
                <ArrowLeft className="h-4 w-4" />
                <span>{t("sidebar.backToSite")}</span>
              </SidebarMenuButton>
            </div>
          </SidebarContent>

          <SidebarFooter className="p-3">
            {/* Language selector */}
            <AdminLangSelector collapsed={isCollapsed} />

            {/* User info */}
            <div className="flex items-center gap-3 rounded-lg px-3 py-2 w-full">
              <Avatar className="h-9 w-9 border shrink-0">
                <AvatarFallback className="text-xs font-medium">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate leading-none">{user?.name || "-"}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1.5">{user?.email || "-"}</p>
                </div>
              )}
            </div>

            {/* Logout button - always visible */}
            <div className="px-2">
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-destructive/10 text-destructive"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>{t("sidebar.logout")}</span>}
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => { if (!isCollapsed) setIsResizing(true); }} style={{ zIndex: 50 }} />
      </div>

      <SidebarInset>
        {isMobile && (
          <div className="flex border-b h-14 items-center justify-between bg-background/95 px-2 backdrop-blur sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 rounded-lg bg-background" />
              <span className="tracking-tight text-foreground">{activeMenuItem ? t(activeMenuItem.labelKey) : t("sidebar.backoffice")}</span>
            </div>
          </div>
        )}
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </>
  );
}
