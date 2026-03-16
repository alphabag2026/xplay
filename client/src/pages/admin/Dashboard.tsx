import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Megaphone, Newspaper, Users, MessageSquare, Heart, HardDrive, CheckCircle, XCircle,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = trpc.admin.stats.useQuery();
  const { data: r2Health } = trpc.admin.r2Health.useQuery();
  const { data: recentAnnouncements } = trpc.admin.announcements.list.useQuery({ limit: 5 });
  const { data: recentNews } = trpc.admin.news.list.useQuery({ limit: 5 });
  const { t } = useApp();

  const statCards = [
    { title: t("dash.announcements"), value: stats?.announcements ?? 0, icon: Megaphone, color: "text-cyan-400" },
    { title: t("dash.news"), value: stats?.news ?? 0, icon: Newspaper, color: "text-purple-400" },
    { title: t("dash.partners"), value: stats?.partners ?? 0, icon: Users, color: "text-green-400" },
    { title: t("dash.comments"), value: stats?.comments ?? 0, icon: MessageSquare, color: "text-yellow-400" },
    { title: t("dash.totalLikes"), value: stats?.totalLikes ?? 0, icon: Heart, color: "text-red-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("dash.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("dash.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{t("dash.r2Storage")}</span>
          {r2Health?.ok ? (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
              <CheckCircle className="h-3 w-3 mr-1" /> {t("dash.connected")}
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
              <XCircle className="h-3 w-3 mr-1" /> {t("dash.error")}
            </Badge>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-card/50 border-border/50">
            <CardContent className="pt-5 pb-4 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">
                    {statsLoading ? "—" : stat.value.toLocaleString()}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} opacity-60`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-cyan-400" />
              {t("dash.recentAnnouncements")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentAnnouncements && recentAnnouncements.length > 0 ? (
              <div className="space-y-3">
                {recentAnnouncements.map((ann) => (
                  <div key={ann.id} className="flex items-start justify-between gap-3 py-2 border-b border-border/30 last:border-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{ann.title}</p>
                        {ann.isPinned && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-500 border-amber-500/30">
                            {t("admin.pinned")}
                          </Badge>
                        )}
                      </div>
                      {ann.content && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {ann.content.length > 100 ? ann.content.slice(0, 100) + "..." : ann.content}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(ann.createdAt).toLocaleDateString()} · ❤️ {ann.likeCount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">{t("dash.noAnnouncements")}</p>
            )}
          </CardContent>
        </Card>

        {/* Recent News */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-purple-400" />
              {t("dash.recentNews")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentNews && recentNews.length > 0 ? (
              <div className="space-y-3">
                {recentNews.map((news) => (
                  <div key={news.id} className="flex items-start justify-between gap-3 py-2 border-b border-border/30 last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{news.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {news.siteName ?? new URL(news.url).hostname} · {new Date(news.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">{t("dash.noNews")}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
