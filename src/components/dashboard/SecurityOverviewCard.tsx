
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SecurityOverview } from "@/types/wordpress";
import { Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";

interface SecurityOverviewCardProps {
  data?: SecurityOverview;
}

export function SecurityOverviewCard({ data }: SecurityOverviewCardProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span>Security Overview</span>
          </CardTitle>
          <CardDescription>No security data available</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Connect a WordPress site to view security metrics</p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low":
        return <ShieldCheck className="h-4 w-4 text-green-500" />;
      case "medium":
        return <ShieldQuestion className="h-4 w-4 text-amber-500" />;
      case "high":
      case "critical":
        return <ShieldAlert className="h-4 w-4 text-red-500" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <span>Security Overview</span>
        </CardTitle>
        <CardDescription>
          Last scan: {data.lastScan.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Security Score</span>
            <span>{data.score}%</span>
          </div>
          <Progress value={data.score} className={getScoreColor(data.score)} />
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Security Metrics</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md border p-2">
              <div className="text-sm font-medium">Login Attempts</div>
              <div className="text-2xl font-bold">{data.loginAttempts}</div>
            </div>
            <div className="rounded-md border p-2">
              <div className="text-sm font-medium">Blocked Attacks</div>
              <div className="text-2xl font-bold">{data.blockedAttacks}</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Vulnerabilities</h4>
          {data.vulnerabilities === 0 ? (
            <div className="flex items-center gap-2 p-3 rounded-md border bg-green-50 text-green-700">
              <ShieldCheck className="h-5 w-5" />
              <span>No vulnerabilities detected</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-md border bg-red-50 text-red-700">
              <ShieldAlert className="h-5 w-5" />
              <span>{data.vulnerabilities} vulnerabilities detected</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Security Issues</h4>
          <div className="space-y-2 max-h-[120px] overflow-y-auto">
            {data.issues.length === 0 ? (
              <div className="p-2 rounded-md border">
                <p className="text-sm text-muted-foreground">No security issues found</p>
              </div>
            ) : (
              data.issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2 p-2 rounded-md border">
                  <div className="mt-0.5">{getSeverityIcon(issue.severity)}</div>
                  <div className="text-sm">{issue.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
