
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, AlertTriangle, X, Activity } from "lucide-react";
import { SiteHealthMetrics } from "@/types/wordpress";

interface SiteHealthStatusProps {
  health?: SiteHealthMetrics;
}

export function SiteHealthStatus({ health }: SiteHealthStatusProps) {
  // If no health data provided, use mock data
  const healthItems = health ? [
    {
      id: 1,
      status: "good",
      message: `Uptime: ${health.uptime}%`,
    },
    {
      id: 2,
      status: health.speed < 1000 ? "good" : health.speed < 2000 ? "warning" : "error",
      message: `Page load speed: ${health.speed}ms`,
    },
    {
      id: 3,
      status: "good",
      message: "PHP version is up to date",
    },
    {
      id: 4,
      status: "warning",
      message: "3 plugin updates available",
    },
    {
      id: 5,
      status: "good",
      message: "Database is optimized",
    },
  ] : [
    {
      id: 1,
      status: "good",
      message: "WordPress version is up to date",
    },
    {
      id: 2,
      status: "warning",
      message: "3 plugin updates available",
    },
    {
      id: 3,
      status: "good",
      message: "PHP version is up to date",
    },
    {
      id: 4,
      status: "error",
      message: "SSL certificate expires in 5 days",
    },
    {
      id: 5,
      status: "good",
      message: "Database is optimized",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <Check className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "error":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <span>Site Health</span>
        </CardTitle>
        <CardDescription>
          {health ? `Last checked: ${health.lastChecked.toLocaleString()}` : "Current status and potential issues"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {health && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Health Score</span>
              <span className={health.overallStatus === 'good' ? 'text-green-500' : health.overallStatus === 'warning' ? 'text-amber-500' : 'text-red-500'}>
                {health.overallStatus === 'good' ? 'Good' : health.overallStatus === 'warning' ? 'Needs Attention' : 'Critical'}
              </span>
            </div>
            <Progress 
              value={health.overallStatus === 'good' ? 90 : health.overallStatus === 'warning' ? 60 : 30} 
              className={health.overallStatus === 'good' ? 'bg-green-500' : health.overallStatus === 'warning' ? 'bg-amber-500' : 'bg-red-500'} 
            />
          </div>
        )}
        
        <div className="space-y-3">
          {healthItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
              <div>{getStatusIcon(item.status)}</div>
              <div className="text-sm">{item.message}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
