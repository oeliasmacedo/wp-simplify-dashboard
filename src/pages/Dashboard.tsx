
import DashboardLayout from "@/components/DashboardLayout";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SiteHealthStatus } from "@/components/dashboard/SiteHealthStatus";
import { TrafficChart } from "@/components/dashboard/TrafficChart";
import { FileText, Users, Eye, BarChart3 } from "lucide-react";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStatsCard
          title="Total Posts"
          value="36"
          icon={<FileText className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardStatsCard
          title="Total Users"
          value="248"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 18, isPositive: true }}
        />
        <DashboardStatsCard
          title="Total Pageviews"
          value="143,921"
          icon={<Eye className="h-5 w-5" />}
          trend={{ value: 7, isPositive: true }}
        />
        <DashboardStatsCard
          title="Conversion Rate"
          value="3.42%"
          icon={<BarChart3 className="h-5 w-5" />}
          trend={{ value: 2, isPositive: false }}
        />
      </div>
      
      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrafficChart />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <SiteHealthStatus />
        </div>
      </div>
      
      <div className="mt-6">
        <RecentActivityList />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
