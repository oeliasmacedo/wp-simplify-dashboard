
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for site traffic
const trafficData = [
  { date: "3/1", visitors: 4000, pageviews: 8000 },
  { date: "3/5", visitors: 3000, pageviews: 6500 },
  { date: "3/10", visitors: 5000, pageviews: 9800 },
  { date: "3/15", visitors: 2780, pageviews: 7908 },
  { date: "3/20", visitors: 4890, pageviews: 12800 },
  { date: "3/25", visitors: 5390, pageviews: 14300 },
  { date: "3/30", visitors: 6490, pageviews: 15900 },
];

export function TrafficChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Traffic</CardTitle>
        <CardDescription>
          Visitors and pageviews over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trafficData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="visitors" 
                stackId="1" 
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
                fillOpacity={0.6} 
              />
              <Area 
                type="monotone" 
                dataKey="pageviews" 
                stackId="2" 
                stroke="#0EA5E9" 
                fill="#0EA5E9" 
                fillOpacity={0.3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
