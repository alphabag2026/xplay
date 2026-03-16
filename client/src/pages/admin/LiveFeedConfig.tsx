import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, RotateCcw, Globe, Clock, TrendingUp } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface FeedConfig {
  activeCountries?: number;
  minInterval?: number;
  maxInterval?: number;
  baseVolume?: number;
  baseTxCount?: number;
  volumeGrowthPerHour?: number;
  txGrowthPerHour?: number;
}

const DEFAULT_CONFIG: FeedConfig = {
  activeCountries: 180, minInterval: 5000, maxInterval: 20000,
  baseVolume: 50000000, baseTxCount: 15000, volumeGrowthPerHour: 500000, txGrowthPerHour: 150,
};

export default function AdminLiveFeedConfig() {
  const { t } = useApp();
  const utils = trpc.useUtils();
  const { data: configs, isLoading } = trpc.admin.liveFeedConfig.list.useQuery();
  const upsertMutation = trpc.admin.liveFeedConfig.upsert.useMutation({
    onSuccess: () => { utils.admin.liveFeedConfig.list.invalidate(); toast.success(t("admin.save") + " ✓"); },
    onError: (e) => toast.error(e.message),
  });

  const [config, setConfig] = useState<FeedConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    if (configs?.general) setConfig({ ...DEFAULT_CONFIG, ...configs.general });
  }, [configs]);

  const handleSave = () => upsertMutation.mutate({ key: "general", value: config });
  const handleReset = () => setConfig(DEFAULT_CONFIG);

  if (isLoading) return <div className="flex items-center justify-center py-20 text-muted-foreground">{t("admin.loading")}</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("livefeed.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("livefeed.subtitle")}</p>
        </div>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-base">{t("livefeed.countries")}</CardTitle>
          </div>
          <CardDescription>{t("livefeed.countriesDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>{t("livefeed.countries")}</Label>
            <Input type="number" value={config.activeCountries ?? 180}
              onChange={(e) => setConfig({ ...config, activeCountries: parseInt(e.target.value) || 0 })} min={1} max={250} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <CardTitle className="text-base">{t("livefeed.volume")}</CardTitle>
          </div>
          <CardDescription>{t("livefeed.volumeDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("livefeed.baseVolume")}</Label>
              <Input type="number" value={config.baseVolume ?? 50000000}
                onChange={(e) => setConfig({ ...config, baseVolume: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2">
              <Label>{t("livefeed.volumeGrowth")}</Label>
              <Input type="number" value={config.volumeGrowthPerHour ?? 500000}
                onChange={(e) => setConfig({ ...config, volumeGrowthPerHour: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("livefeed.baseTxCount")}</Label>
              <Input type="number" value={config.baseTxCount ?? 15000}
                onChange={(e) => setConfig({ ...config, baseTxCount: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2">
              <Label>{t("livefeed.txGrowth")}</Label>
              <Input type="number" value={config.txGrowthPerHour ?? 150}
                onChange={(e) => setConfig({ ...config, txGrowthPerHour: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-400" />
            <CardTitle className="text-base">{t("livefeed.interval")}</CardTitle>
          </div>
          <CardDescription>{t("livefeed.intervalDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("livefeed.minInterval")}</Label>
              <Input type="number" value={config.minInterval ?? 5000}
                onChange={(e) => setConfig({ ...config, minInterval: parseInt(e.target.value) || 1000 })} min={1000} />
            </div>
            <div className="space-y-2">
              <Label>{t("livefeed.maxInterval")}</Label>
              <Input type="number" value={config.maxInterval ?? 20000}
                onChange={(e) => setConfig({ ...config, maxInterval: parseInt(e.target.value) || 5000 })} min={2000} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} className="gap-2" disabled={upsertMutation.isPending}>
          <Save className="h-4 w-4" /> {upsertMutation.isPending ? t("admin.processing") : t("admin.save")}
        </Button>
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <RotateCcw className="h-4 w-4" /> {t("livefeed.reset")}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">{t("livefeed.note")}</p>
    </div>
  );
}
