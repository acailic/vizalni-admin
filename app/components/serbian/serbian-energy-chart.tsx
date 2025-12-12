import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { serbianEnergyData } from "@/data/serbian-energy";

import {
  getDatasetLabels,
  formatSerbianNumber,
  SerbianLanguageVariant
} from "./serbian-language-utils";

// Mock energy production data
const monthlyEnergyProduction = [
  { month: "Jan", termoelektrane: 3200, hidroelektrane: 1200, vetar: 180, sunce: 85, ukupno: 4665 },
  { month: "Feb", termoelektrane: 2900, hidroelektrane: 1400, vetar: 220, sunce: 110, ukupno: 4630 },
  { month: "Mar", termoelektrane: 3100, hidroelektrane: 1100, vetar: 280, sunce: 165, ukupno: 4645 },
  { month: "Apr", termoelektrane: 2800, hidroelektrane: 1300, vetar: 320, sunce: 220, ukupno: 4640 },
  { month: "Maj", termoelektrane: 2600, hidroelektrane: 1000, vetar: 380, sunce: 285, ukupno: 4265 },
  { month: "Jun", termoelektrane: 2500, hidroelektrane: 900, vetar: 420, sunce: 350, ukupno: 4170 },
  { month: "Jul", termoelektrane: 2400, hidroelektrane: 850, vetar: 450, sunce: 420, ukupno: 4120 },
  { month: "Avg", termoelektrane: 2600, hidroelektrane: 800, vetar: 480, sunce: 460, ukupno: 4340 },
  { month: "Sep", termoelektrane: 2700, hidroelektrane: 950, vetar: 520, sunce: 380, ukupno: 4550 },
  { month: "Okt", termoelektrane: 3000, hidroelektrane: 1100, vetar: 580, sunce: 280, ukupno: 4960 },
  { month: "Nov", termoelektrane: 3300, hidroelektrane: 1200, vetar: 620, sunce: 180, ukupno: 5300 },
  { month: "Dec", termoelektrane: 3500, hidroelektrane: 1300, vetar: 650, sunce: 120, ukupno: 5570 }
];

const energyBySource = [
  { source: "Termoelektrane (ugalj)", production: 28500, capacity: 4100, percentage: 55.2 },
  { source: "Hidroelektrane", production: 11850, capacity: 2835, percentage: 22.9 },
  { source: "Nuklearna (Vinča)", production: 0, capacity: 0, percentage: 0 },
  { source: "Vetar", production: 4800, capacity: 1200, percentage: 9.3 },
  { source: "Sunce (solarna)", production: 2800, capacity: 800, percentage: 5.4 },
  { source: "Biomasa i biogas", production: 2100, capacity: 400, percentage: 4.1 },
  { source: "Import", production: 1550, capacity: 0, percentage: 3.0 },
  { source: "Ostalo", production: 200, capacity: 100, percentage: 0.1 }
];

const renewableEnergyGrowth = [
  { year: 2018, vetar: 280, sunce: 45, biomasa: 180, ukupno: 505 },
  { year: 2019, vetar: 380, sunce: 85, biomasa: 210, ukupno: 675 },
  { year: 2020, vetar: 520, sunce: 165, biomasa: 250, ukupno: 935 },
  { year: 2021, vetar: 780, sunce: 280, biomasa: 320, ukupno: 1380 },
  { year: 2022, vetar: 1100, sunce: 420, biomasa: 380, ukupno: 1900 },
  { year: 2023, vetar: 1450, sunce: 580, biomasa: 450, ukupno: 2480 },
  { year: 2024, vetar: 1800, sunce: 750, biomasa: 520, ukupno: 3070 }
];

const energyConsumptionBySector = [
  { sector: "Industrija", consumption: 18500, percentage: 45.8 },
  { sector: "Kućanstva", consumption: 12300, percentage: 30.5 },
  { sector: "Saobraćaj", consumption: 5800, percentage: 14.4 },
  { sector: "Poljoprivreda", consumption: 2200, percentage: 5.5 },
  { sector: "Javni sektor", consumption: 1500, percentage: 3.7 }
];

const energyEfficiencyMetrics = [
  { metric: "Energetska efikasnost", value: 65, target: 80, unit: "%" },
  { metric: "Udeo obnovljivih", value: 18, target: 27, unit: "%" },
  { metric: "Gubitci u mreži", value: 12, target: 8, unit: "%" },
  { metric: "CO2 emisije", value: 340, target: 200, unit: "g/kWh" },
  { metric: "Zavisnost od import-a", value: 15, target: 10, unit: "%" },
  { metric: "Korišćenje kapaciteta", value: 78, target: 85, unit: "%" }
];

// WCAG-compliant colors with sufficient contrast against light backgrounds
// Using palette with minimum 4.5:1 contrast ratio for normal text
const COLORS = ['#1E40AF', '#059669', '#CA8A04', '#DC2626', '#7C3AED', '#0891B2', '#EA580C', '#BE123C'];

interface SerbianEnergyChartProps {
  language?: SerbianLanguageVariant;
  showInteractiveFeatures?: boolean;
  height?: number;
}

export const SerbianEnergyChart: React.FC<SerbianEnergyChartProps> = ({
  language = "sr-Latn",
  showInteractiveFeatures = true,
  height = 400
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedYear, setSelectedYear] = useState(2024);

  const labels = useMemo(() => getDatasetLabels('energy', language), [language]);

  const formatEnergyValue = (value: number) => {
    if (value >= 1000) {
      return `${formatSerbianNumber(value / 1000, language)} GWh`;
    }
    return `${formatSerbianNumber(value, language)} MWh`;
  };

  const formatCapacity = (value: number) => {
    return `${formatSerbianNumber(value, language)} MW`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatEnergyValue(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Mesečna proizvodnja energije (2024)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={monthlyEnergyProduction}
              aria-label="Grafikon mesečne proizvodnje energije"
              role="img"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={(value) => `${formatSerbianNumber(value / 1000, language)} GWh`}
                tick={{ fontSize: 12 }}
                label={{ value: 'Proizvodnja (GWh)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Line type="monotone" dataKey="termoelektrane" stroke="#1E40AF" strokeWidth={2} name="Termoelektrane" />
              <Line type="monotone" dataKey="hidroelektrane" stroke="#059669" strokeWidth={2} name="Hidroelektrane" />
              <Line type="monotone" dataKey="vetar" stroke="#CA8A04" strokeWidth={2} name="Vetar" />
              <Line type="monotone" dataKey="sunce" stroke="#EA580C" strokeWidth={2} name="Sunce" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proizvodnja po izvoru</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <PieChart aria-label="Kružni grafikon proizvodnje po izvoru" role="img">
              <Pie
                data={energyBySource.filter(d => d.production > 0)}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ source, percentage }) => `${source}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="production"
              >
                {energyBySource.filter(d => d.production > 0).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatEnergyValue(value)}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                        <p className="font-semibold">{data.source}</p>
                        <p>Proizvodnja: {formatEnergyValue(data.production)}</p>
                        <p>Udeo: {data.percentage}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderRenewableEnergy = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rast obnovljivih izvora energije (2018-2024)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart
              data={renewableEnergyGrowth}
              aria-label="Grafikon rasta obnovljivih izvora energije"
              role="img"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) => `${formatSerbianNumber(value, language)} MW`}
                tick={{ fontSize: 12 }}
                label={{ value: 'Kapacitet (MW)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Area type="monotone" dataKey="vetar" stackId="1" stroke="#059669" fill="#059669" fillOpacity={0.6} name="Vetar" />
              <Area type="monotone" dataKey="sunce" stackId="1" stroke="#CA8A04" fill="#CA8A04" fillOpacity={0.6} name="Sunce" />
              <Area type="monotone" dataKey="biomasa" stackId="1" stroke="#EA580C" fill="#EA580C" fillOpacity={0.6} name="Biomasa" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Vetar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">1,800 MW</p>
              <p className="text-sm text-muted-foreground">Instalirani kapacitet</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "60%" }}></div>
              </div>
              <p className="text-xs text-muted-foreground">60% cilja za 2030.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-yellow-600">Sunčana energija</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">750 MW</p>
              <p className="text-sm text-muted-foreground">Instalirani kapacitet</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "35%" }}></div>
              </div>
              <p className="text-xs text-muted-foreground">35% cilja za 2030.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">Biomasa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">520 MW</p>
              <p className="text-sm text-muted-foreground">Instalirani kapacitet</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: "80%" }}></div>
              </div>
              <p className="text-xs text-muted-foreground">80% cilja za 2030.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderConsumptionAnalysis = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Potrošnja po sektorima</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={energyConsumptionBySector}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              aria-label="Grafikon potrošnje energije po sektorima"
              role="img"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="sector"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 11 }}
                interval={0}
              />
              <YAxis
                tickFormatter={(value) => `${formatSerbianNumber(value / 1000, language)} GWh`}
                tick={{ fontSize: 12 }}
                label={{ value: 'Potrošnja (GWh)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="consumption" fill="#1E40AF" name="Potrošnja" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Energetska efikasnost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {energyEfficiencyMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{metric.metric}</h4>
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Trenutno: {metric.value}</span>
                    <span>Cilj: {metric.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        metric.value >= metric.target ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metric.value >= metric.target ? 'Cilj postignut' : `Fali još ${metric.target - metric.value}%`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDetailedAnalysis = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Proizvodni kapaciteti po izvoru</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart
              data={energyBySource.filter(d => d.capacity > 0)}
              margin={{ top: 20, right: 50, left: 20, bottom: 80 }}
              aria-label="Grafikon proizvodnih kapaciteta po izvoru"
              role="img"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="source"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 10 }}
                interval={0}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={formatEnergyValue}
                tick={{ fontSize: 12 }}
                label={{ value: 'Proizvodnja', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={formatCapacity}
                tick={{ fontSize: 12 }}
                label={{ value: 'Kapacitet (MW)', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                        <p className="font-semibold">{data.source}</p>
                        <p>Proizvodnja: {formatEnergyValue(data.production)}</p>
                        <p>Kapacitet: {formatCapacity(data.capacity)}</p>
                        <p>Udeo: {data.percentage}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Bar yAxisId="left" dataKey="production" fill="#1E40AF" name="Godišnja proizvodnja" />
              <Line yAxisId="right" type="monotone" dataKey="capacity" stroke="#EA580C" strokeWidth={2} name="Instalirani kapacitet" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ciljevi za 2030. godinu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg border-green-200 bg-green-50">
              <h4 className="font-semibold text-green-800 mb-2">Obnovljiva energija</h4>
              <p className="text-2xl font-bold text-green-600">27%</p>
              <p className="text-sm text-muted-foreground">Udeo u ukupnoj proizvodnji</p>
              <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">Trenutno: 18%</Badge>
            </div>
            <div className="p-4 border rounded-lg border-blue-200 bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-2">Efikasnost</h4>
              <p className="text-2xl font-bold text-blue-600">80%</p>
              <p className="text-sm text-muted-foreground">Energetska efikasnost</p>
              <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800">Trenutno: 65%</Badge>
            </div>
            <div className="p-4 border rounded-lg border-purple-200 bg-purple-50">
              <h4 className="font-semibold text-purple-800 mb-2">CO2 emisije</h4>
              <p className="text-2xl font-bold text-purple-600">200</p>
              <p className="text-sm text-muted-foreground">g/kWh</p>
              <Badge variant="secondary" className="mt-2 bg-purple-100 text-purple-800">Trenutno: 340</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {showInteractiveFeatures && (
        <Card>
          <CardHeader>
            <CardTitle>Električne centralne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {energyBySource.filter(d => d.capacity > 0).map((source, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">{source.source}</h4>
                  <div className="space-y-1">
                    <p className="text-lg font-bold">{formatCapacity(source.capacity)}</p>
                    <p className="text-sm text-muted-foreground">Kapacitet</p>
                    <p className="text-lg font-bold">{formatEnergyValue(source.production)}</p>
                    <p className="text-sm text-muted-foreground">Godišnja proizvodnja</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${source.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground">{source.percentage}% ukupno</p>
                  </div>
                </div>
              ))}
            </div>
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
            <span>{labels.energy} - Republika Srbija</span>
            {showInteractiveFeatures && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log('Language toggle clicked');
                  }}
                >
                  {language === "sr-Latn" ? "Ћирилица" : "Latinica"}
                </Button>
              </div>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {labels.source}: {serbianEnergyData[0].organization}
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Pregled</TabsTrigger>
              <TabsTrigger value="renewable">Obnovljivi</TabsTrigger>
              <TabsTrigger value="consumption">Potrošnja</TabsTrigger>
              <TabsTrigger value="detailed">Detaljno</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {renderOverview()}
            </TabsContent>

            <TabsContent value="renewable" className="space-y-4">
              {renderRenewableEnergy()}
            </TabsContent>

            <TabsContent value="consumption" className="space-y-4">
              {renderConsumptionAnalysis()}
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

export default SerbianEnergyChart;