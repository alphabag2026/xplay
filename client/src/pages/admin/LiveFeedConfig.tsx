import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { BarChart3, Save, RotateCcw, Globe, Clock, TrendingUp } from "lucide-react";

interface FeedConfig {
  /** Active countries count shown in stats */
  activeCountries?: number;
  /** Min interval between transactions (ms) */
  minInterval?: number;
  /** Max interval between transactions (ms) */
  maxInterval?: number;
  /** Base total volume (USD) */
  baseVolume?: number;
  /** Base transaction count */
  baseTxCount?: number;
  /** Volume growth per hour (USD) */
  volumeGrowthPerHour?: number;
  /** Tx count growth per hour */
  txGrowthPerHour?: number;
}

const DEFAULT_CONFIG: FeedConfig = {
  activeCountries: 180,
  minInterval: 5000,
  maxInterval: 20000,
  baseVolume: 50000000,
  baseTxCount: 15000,
  volumeGrowthPerHour: 500000,
  txGrowthPerHour: 150,
};

export default function AdminLiveFeedConfig() {
  const utils = trpc.useUtils();
  const { data: configs, isLoading } = trpc.admin.liveFeedConfig.list.useQuery();
  const upsertMutation = trpc.admin.liveFeedConfig.upsert.useMutation({
    onSuccess: () => {
      utils.admin.liveFeedConfig.list.invalidate();
      toast.success("설정이 저장되었습니다");
    },
    onError: (e) => toast.error(e.message),
  });

  const [config, setConfig] = useState<FeedConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    if (configs?.general) {
      setConfig({ ...DEFAULT_CONFIG, ...configs.general });
    }
  }, [configs]);

  const handleSave = () => {
    upsertMutation.mutate({ key: "general", value: config });
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">로딩 중...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">실시간 글로벌 매출 설정</h1>
          <p className="text-muted-foreground mt-1">실시간 매출 피드의 표시 규칙을 수동으로 설정합니다</p>
        </div>
      </div>

      {/* Countries */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-base">참여 국가 수</CardTitle>
          </div>
          <CardDescription>통계에 표시되는 참여 국가 수를 설정합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>참여 국가 수</Label>
            <Input
              type="number"
              value={config.activeCountries ?? 180}
              onChange={(e) => setConfig({ ...config, activeCountries: parseInt(e.target.value) || 0 })}
              min={1}
              max={250}
            />
          </div>
        </CardContent>
      </Card>

      {/* Volume & Tx Count */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <CardTitle className="text-base">누적 유동성 & 거래 수</CardTitle>
          </div>
          <CardDescription>기본 시작값과 시간당 증가량을 설정합니다. 너무 규칙적이지 않도록 자동으로 변동이 적용됩니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>기본 누적 유동성 (USD)</Label>
              <Input
                type="number"
                value={config.baseVolume ?? 50000000}
                onChange={(e) => setConfig({ ...config, baseVolume: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>시간당 유동성 증가 (USD)</Label>
              <Input
                type="number"
                value={config.volumeGrowthPerHour ?? 500000}
                onChange={(e) => setConfig({ ...config, volumeGrowthPerHour: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>기본 거래 수</Label>
              <Input
                type="number"
                value={config.baseTxCount ?? 15000}
                onChange={(e) => setConfig({ ...config, baseTxCount: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>시간당 거래 수 증가</Label>
              <Input
                type="number"
                value={config.txGrowthPerHour ?? 150}
                onChange={(e) => setConfig({ ...config, txGrowthPerHour: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timing */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-400" />
            <CardTitle className="text-base">거래 생성 간격</CardTitle>
          </div>
          <CardDescription>새 거래가 생성되는 간격(밀리초)을 설정합니다. 실제 간격은 이 범위 내에서 랜덤으로 결정됩니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>최소 간격 (ms)</Label>
              <Input
                type="number"
                value={config.minInterval ?? 5000}
                onChange={(e) => setConfig({ ...config, minInterval: parseInt(e.target.value) || 1000 })}
                min={1000}
              />
            </div>
            <div className="space-y-2">
              <Label>최대 간격 (ms)</Label>
              <Input
                type="number"
                value={config.maxInterval ?? 20000}
                onChange={(e) => setConfig({ ...config, maxInterval: parseInt(e.target.value) || 5000 })}
                min={2000}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave} className="gap-2" disabled={upsertMutation.isPending}>
          <Save className="h-4 w-4" />
          {upsertMutation.isPending ? "저장 중..." : "설정 저장"}
        </Button>
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          기본값 복원
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        설정 변경 후 사이트를 새로고침하면 적용됩니다. 투자 시간이 너무 규칙적이지 않도록 랜덤 변동이 자동으로 적용됩니다.
      </p>
    </div>
  );
}
