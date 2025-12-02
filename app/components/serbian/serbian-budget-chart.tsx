import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { serbianBudgetData } from "@/data/serbian-budget";

import {
  getSerbianTranslation,
  getDatasetLabels,
  formatSerbianCurrency,
  formatSerbianNumber,
  SerbianLanguageVariant
} from "./serbian-language-utils";

// Mock data for demonstration - in production this would come from API
const mockBudgetData = [
  {
    category: getSerbianTranslation('revenue', 'sr-Latn'),
    amount: 1500000000,
    subcategories: [
      { name: "Porezi na dohodak", value: 600000000 },
      { name: "PDV", value: 450000000 },
      { name: "Akizize", value: 200000000 },
      { name: "Ostali prihodi", value: 250000000 }
    ]
  },
  {
    category: getSerbianTranslation('expenses', 'sr-Latn'),
    amount: 1450000000,
    subcategories: [
      { name: "Obrazovanje", value: 300000000 },
      { name: "Zdravstvo", value: 280000000 },
      { name: "Socijalna zaštita", value: 350000000 },
      { name: "Infrastruktura", value: 200000000 },
      { name: "Odbrana", value: 180000000 },
      { name: "Ostalo", value: 140000000 }
    ]
  }
];

const monthlyBudgetData = [
  { month: "Jan", prihodi: 120000000, rashodi: 110000000 },
  { month: "Feb", prihodi: 125000000, rashodi: 115000000 },
  { month: "Mar", prihodi: 130000000, rashodi: 120000000 },
  { month: "Apr", prihodi: 128000000, rashodi: 118000000 },
  { month: "Maj", prihodi: 135000000, rashodi: 125000000 },
  { month: "Jun", prihodi: 140000000, rashodi: 130000000 },
  { month: "Jul", prihodi: 138000000, rashodi: 128000000 },
  { month: "Avg", prihodi: 142000000, rashodi: 132000000 },
  { month: "Sep", prihodi: 145000000, rashodi: 135000000 },
  { month: "Okt", prihodi: 148000000, rashodi: 138000000 },
  { month: "Nov", prihodi: 150000000, rashodi: 140000000 },
  { month: "Dec", prihodi: 155000000, rashodi: 145000000 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface SerbianBudgetChartProps {
  language?: SerbianLanguageVariant;
  showInteractiveFeatures?: boolean;
  height?: number;
}

export const SerbianBudgetChart: React.FC<SerbianBudgetChartProps> = ({
  language = "sr-Latn",
  showInteractiveFeatures = true,
  height = 400
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const labels = useMemo(() => getDatasetLabels('budget', language), [language]);

  const formatCurrency = (value: number) => formatSerbianCurrency(value, language);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{`${label}: ${formatCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{labels.revenue} vs {labels.expenses}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={mockBudgetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(value) => `${formatSerbianNumber(value / 1000000000, language)} Mrd`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{getSerbianTranslation('total', language)} {labels.expenses}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={mockBudgetData[1].subcategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockBudgetData[1].subcategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderMonthlyTrends = () => (
    <Card>
      <CardHeader>
        <CardTitle>{getSerbianTranslation('month', language)}ni trendovi</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={monthlyBudgetData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `${formatSerbianNumber(value / 1000000000, language)} Mrd`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="prihodi"
              stroke="#8884d8"
              strokeWidth={2}
              name={labels.revenue}
            />
            <Line
              type="monotone"
              dataKey="rashodi"
              stroke="#82ca9d"
              strokeWidth={2}
              name={labels.expenses}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderDetailedAnalysis = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{labels.expenses} po kategorijama</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={mockBudgetData[1].subcategories} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => `${formatSerbianNumber(value / 1000000000, language)} Mrd`} />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {showInteractiveFeatures && (
        <Card>
          <CardHeader>
            <CardTitle>Analiza trendova</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={height}>
              <AreaChart data={monthlyBudgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${formatSerbianNumber(value / 1000000000, language)} Mrd`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="prihodi"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                  name={labels.revenue}
                />
                <Area
                  type="monotone"
                  dataKey="rashodi"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                  name={labels.expenses}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{getSerbianTranslation('budget', language)} - Republika Srbija</span>
            {showInteractiveFeatures && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // This would be handled by parent component in real implementation
                    console.log('Language toggle clicked');
                  }}
                >
                  {language === "sr-Latn" ? "Ћирилица" : "Latinica"}
                </Button>
              </div>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {labels.source}: {serbianBudgetData[0].organization}
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Pregled</TabsTrigger>
              <TabsTrigger value="monthly">Mesečno</TabsTrigger>
              <TabsTrigger value="detailed">Detaljno</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {renderOverview()}
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4">
              {renderMonthlyTrends()}
            </TabsContent>

            <TabsContent value="detailed" className="space-y-4">
              {renderDetailedAnalysis()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SerbianBudgetChart;