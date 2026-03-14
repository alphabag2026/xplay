import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Users as UsersIcon, Shield, ShieldCheck, User, Search, RefreshCw } from "lucide-react";
import { useState, useMemo } from "react";

const roleLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  admin: { label: "관리자", color: "text-red-500 bg-red-500/10", icon: <Shield className="h-3.5 w-3.5" /> },
  sub_admin: { label: "부관리자", color: "text-amber-500 bg-amber-500/10", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  user: { label: "일반 사용자", color: "text-slate-500 bg-slate-500/10", icon: <User className="h-3.5 w-3.5" /> },
};

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const utils = trpc.useUtils();
  const { data: users, isLoading } = trpc.admin.users.list.useQuery();
  const updateRole = trpc.admin.users.updateRole.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("역할이 변경되었습니다.");
        utils.admin.users.list.invalidate();
      } else {
        toast.error(result.error || "역할 변경에 실패했습니다.");
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((u) => {
      const matchesSearch =
        !searchQuery ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.openId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const roleCounts = useMemo(() => {
    if (!users) return { admin: 0, sub_admin: 0, user: 0 };
    return users.reduce(
      (acc, u) => {
        acc[u.role as keyof typeof acc] = (acc[u.role as keyof typeof acc] || 0) + 1;
        return acc;
      },
      { admin: 0, sub_admin: 0, user: 0 }
    );
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <UsersIcon className="h-6 w-6 text-primary" />
            사용자 관리
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            사용자 역할을 관리합니다. 부관리자는 뉴스와 소통 파트너만 관리할 수 있습니다.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => utils.admin.users.list.invalidate()}>
          <RefreshCw className="h-4 w-4 mr-2" /> 새로고침
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(roleLabels).map(([key, { label, color, icon }]) => (
          <div key={key} className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2">
              <div className={`rounded-full p-1.5 ${color}`}>{icon}</div>
              <span className="text-sm font-medium">{label}</span>
            </div>
            <p className="text-2xl font-bold mt-2">{roleCounts[key as keyof typeof roleCounts]}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="이름, 이메일, OpenID 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="역할 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="admin">관리자</SelectItem>
            <SelectItem value="sub_admin">부관리자</SelectItem>
            <SelectItem value="user">일반 사용자</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Permission Guide */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <h3 className="text-sm font-semibold mb-2">역할별 권한 안내</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-medium">기능</th>
                <th className="text-center py-2 px-3 font-medium">관리자</th>
                <th className="text-center py-2 px-3 font-medium">부관리자</th>
                <th className="text-center py-2 px-3 font-medium">일반 사용자</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b"><td className="py-1.5 pr-4">대시보드</td><td className="text-center">✅</td><td className="text-center">✅</td><td className="text-center">❌</td></tr>
              <tr className="border-b"><td className="py-1.5 pr-4">공지사항 관리</td><td className="text-center">✅</td><td className="text-center">❌</td><td className="text-center">❌</td></tr>
              <tr className="border-b"><td className="py-1.5 pr-4">뉴스 관리</td><td className="text-center">✅</td><td className="text-center">✅</td><td className="text-center">❌</td></tr>
              <tr className="border-b"><td className="py-1.5 pr-4">소통 파트너 관리</td><td className="text-center">✅</td><td className="text-center">✅</td><td className="text-center">❌</td></tr>
              <tr className="border-b"><td className="py-1.5 pr-4">미디어 (R2)</td><td className="text-center">✅</td><td className="text-center">❌</td><td className="text-center">❌</td></tr>
              <tr><td className="py-1.5 pr-4">사용자 관리</td><td className="text-center">✅</td><td className="text-center">❌</td><td className="text-center">❌</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">로딩 중...</div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-3 px-4 font-medium">ID</th>
                <th className="text-left py-3 px-4 font-medium">이름</th>
                <th className="text-left py-3 px-4 font-medium">이메일</th>
                <th className="text-left py-3 px-4 font-medium">현재 역할</th>
                <th className="text-left py-3 px-4 font-medium">마지막 로그인</th>
                <th className="text-left py-3 px-4 font-medium">역할 변경</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const roleInfo = roleLabels[u.role] || roleLabels.user;
                const isSelf = currentUser?.id === u.id;
                return (
                  <tr key={u.id} className={`border-t hover:bg-muted/30 ${isSelf ? "bg-primary/5" : ""}`}>
                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{u.id}</td>
                    <td className="py-3 px-4 font-medium">
                      {u.name || "-"}
                      {isSelf && <span className="ml-2 text-xs text-primary">(나)</span>}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{u.email || "-"}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${roleInfo.color}`}>
                        {roleInfo.icon} {roleInfo.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {u.lastSignedIn ? new Date(u.lastSignedIn).toLocaleString() : "-"}
                    </td>
                    <td className="py-3 px-4">
                      {isSelf ? (
                        <span className="text-xs text-muted-foreground">변경 불가</span>
                      ) : (
                        <Select
                          value={u.role}
                          onValueChange={(newRole) => {
                            updateRole.mutate({ userId: u.id, role: newRole as "user" | "admin" | "sub_admin" });
                          }}
                        >
                          <SelectTrigger className="w-[130px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">일반 사용자</SelectItem>
                            <SelectItem value="sub_admin">부관리자</SelectItem>
                            <SelectItem value="admin">관리자</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchQuery || roleFilter !== "all" ? "검색 결과가 없습니다." : "등록된 사용자가 없습니다."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
