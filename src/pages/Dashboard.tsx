
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SiteHealthStatus } from "@/components/dashboard/SiteHealthStatus";
import { TrafficChart } from "@/components/dashboard/TrafficChart";
import { StorageUsageChart } from "@/components/dashboard/StorageUsageChart";
import { SEOHealthCard } from "@/components/dashboard/SEOHealthCard";
import { SecurityOverviewCard } from "@/components/dashboard/SecurityOverviewCard";
import { ContentOverviewCard } from "@/components/dashboard/ContentOverviewCard";
import { SitesManager } from "@/components/SitesManager";
import { ConnectSiteWizard } from "@/components/ConnectSiteWizard";
import { useWordPress } from "@/contexts/WordPressContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Users, Eye, BarChart3, PlusCircle, RefreshCw } from "lucide-react";

const Dashboard = () => {
  const { 
    currentSite, 
    posts, 
    pages, 
    users, 
    plugins, 
    fetchPosts, 
    fetchPages, 
    fetchUsers, 
    fetchPlugins 
  } = useWordPress();
  const [wizardOpen, setWizardOpen] = useState(false);
  
  // Fetch data when site changes
  useEffect(() => {
    if (currentSite) {
      fetchPosts();
      fetchPages();
      fetchUsers();
      fetchPlugins();
    }
  }, [currentSite]);

  // Generate mock metrics based on real data
  // In a real app, you would fetch these from WordPress or your backend
  const generateMockMetrics = () => {
    if (!currentSite) return null;
    
    return {
      siteHealth: {
        uptime: 99.8,
        speed: 850,
        overallStatus: "good" as const,
        lastChecked: new Date(),
        issues: {
          good: 15,
          warning: 3,
          critical: 0
        }
      },
      trafficAnalytics: {
        totalVisits: 25432,
        uniqueUsers: 12841,
        referralSources: [
          { source: "Google", count: 15240 },
          { source: "Direct", count: 7500 },
          { source: "Social", count: 2692 }
        ],
        timeframe: "month" as const,
        data: [
          { date: "3/1", visitors: 4000, pageviews: 8000 },
          { date: "3/5", visitors: 3000, pageviews: 6500 },
          { date: "3/10", visitors: 5000, pageviews: 9800 },
          { date: "3/15", visitors: 2780, pageviews: 7908 },
          { date: "3/20", visitors: 4890, pageviews: 12800 },
          { date: "3/25", visitors: 5390, pageviews: 14300 },
          { date: "3/30", visitors: 6490, pageviews: 15900 },
        ]
      },
      storageUsage: {
        total: 1250,
        media: 780,
        database: 120,
        plugins: 85,
        themes: 45,
        other: 220
      },
      seoHealth: {
        score: 82,
        issues: [
          { severity: "good" as const, message: "Most meta descriptions are well-written" },
          { severity: "warning" as const, message: "4 posts missing meta descriptions" },
          { severity: "error" as const, message: "2 broken links detected" }
        ],
        metrics: {
          pageSpeed: 78,
          missingMetaTags: 4,
          brokenLinks: 2,
          seoFriendlyUrls: 98
        }
      },
      securityOverview: {
        score: 90,
        loginAttempts: 127,
        blockedAttacks: 23,
        vulnerabilities: 1,
        lastScan: new Date(),
        issues: [
          { severity: "medium" as const, message: "Outdated plugin detected" }
        ]
      },
      contentOverview: {
        posts: posts.length,
        pages: pages.length,
        users: users.length,
        comments: 248,
        categories: 12,
        tags: 56
      }
    };
  };

  const metrics = generateMockMetrics();

  const handleRefreshData = async () => {
    if (currentSite) {
      await Promise.all([fetchPosts(), fetchPages(), fetchUsers(), fetchPlugins()]);
    }
  };

  if (!currentSite) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <Button onClick={() => setWizardOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Connect WordPress Site
            </Button>
          </div>
          
          <SitesManager />
          <ConnectSiteWizard open={wizardOpen} onOpenChange={setWizardOpen} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button variant="outline" onClick={handleRefreshData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Data</span>
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardStatsCard
            title="Total Posts"
            value={metrics?.contentOverview.posts || 0}
            icon={<FileText className="h-5 w-5" />}
            trend={{ value: 12, isPositive: true }}
          />
          <DashboardStatsCard
            title="Total Users"
            value={metrics?.contentOverview.users || 0}
            icon={<Users className="h-5 w-5" />}
            trend={{ value: 18, isPositive: true }}
          />
          <DashboardStatsCard
            title="Total Pageviews"
            value={metrics?.trafficAnalytics?.totalVisits.toLocaleString() || "0"}
            icon={<Eye className="h-5 w-5" />}
            trend={{ value: 7, isPositive: true }}
          />
          <DashboardStatsCard
            title="SEO Health"
            value={`${metrics?.seoHealth?.score || 0}%`}
            icon={<BarChart3 className="h-5 w-5" />}
            trend={{ value: 2, isPositive: false }}
          />
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="security">Security & SEO</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TrafficChart data={metrics?.trafficAnalytics?.data || []} />
              </div>
              <div className="space-y-6">
                <QuickActions />
                <SiteHealthStatus health={metrics?.siteHealth} />
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <ContentOverviewCard data={metrics?.contentOverview} />
              <RecentActivityList />
            </div>
          </TabsContent>
          
          <TabsContent value="traffic" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <TrafficChart data={metrics?.trafficAnalytics?.data || []} />
              <StorageUsageChart data={metrics?.storageUsage} />
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <SecurityOverviewCard data={metrics?.securityOverview} />
              <SEOHealthCard data={metrics?.seoHealth} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <ConnectSiteWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </DashboardLayout>
  );
};

export default Dashboard;
