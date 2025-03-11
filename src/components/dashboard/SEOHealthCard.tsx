
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SEOHealth } from "@/types/wordpress";
import { Check, AlertTriangle, X, Search } from "lucide-react";

interface SEOHealthCardProps {
  data?: SEOHealth;
}

export function SEOHealthCard({ data }: SEOHealthCardProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            <span>SEO Health</span>
          </CardTitle>
          <CardDescription>No SEO data available</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Connect a WordPress site to view SEO metrics</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (severity: string) => {
    switch (severity) {
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          <span>SEO Health</span>
        </CardTitle>
        <CardDescription>
          {data.score >= 80 ? "Good" : data.score >= 60 ? "Needs Improvement" : "Poor"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>SEO Score</span>
            <span>{data.score}%</span>
          </div>
          <Progress value={data.score} className={getScoreColor(data.score)} />
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Key Metrics</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md border p-2">
              <div className="text-sm font-medium">Page Speed</div>
              <div className="text-2xl font-bold">{data.metrics.pageSpeed}/100</div>
            </div>
            <div className="rounded-md border p-2">
              <div className="text-sm font-medium">SEO URLs</div>
              <div className="text-2xl font-bold">{data.metrics.seoFriendlyUrls}%</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Issues</h4>
          <div className="space-y-2 max-h-[150px] overflow-y-auto">
            {data.issues.map((issue, index) => (
              <div key={index} className="flex items-start gap-2 p-2 rounded-md border">
                <div className="mt-0.5">{getStatusIcon(issue.severity)}</div>
                <div className="text-sm">{issue.message}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
