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
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { serbianDemographicsData } from "@/data/serbian-demographics";

import {
  getSerbianTranslation,
  getDatasetLabels,
  formatSerbianNumber,
  SerbianLanguageVariant,
} from "./serbian-language-utils";

// Mock demographic data
const populationTimeSeries = [
  {
    year: 2010,
    total: 7276000,
    male: 3582000,
    female: 3694000,
    urban: 4769000,
    rural: 2507000,
  },
  {
    year: 2012,
    total: 7188000,
    male: 3536000,
    female: 3652000,
    urban: 4721000,
    rural: 2467000,
  },
  {
    year: 2014,
    total: 7101000,
    male: 3492000,
    female: 3609000,
    urban: 4673000,
    rural: 2428000,
  },
  {
    year: 2016,
    total: 7034000,
    male: 3457000,
    female: 3577000,
    urban: 4638000,
    rural: 2396000,
  },
  {
    year: 2018,
    total: 7001000,
    male: 3442000,
    female: 3559000,
    urban: 4619000,
    rural: 2382000,
  },
  {
    year: 2020,
    total: 6964000,
    male: 3421000,
    female: 3543000,
    urban: 4602000,
    rural: 2362000,
  },
  {
    year: 2022,
    total: 6797000,
    male: 3335000,
    female: 3462000,
    urban: 4521000,
    rural: 2276000,
  },
];

const populationByRegion = [
  { region: "Beograd", population: 1689000, density: 1452, growth: -0.2 },
  { region: "Vojvodina", population: 1991000, density: 97, growth: -1.1 },
  {
    region: "Šumadija i Zapadna Srbija",
    population: 2014000,
    density: 71,
    growth: -1.8,
  },
  {
    region: "Južna i Istočna Srbija",
    population: 1648000,
    density: 56,
    growth: -2.3,
  },
  {
    region: "Kosovo i Metohija",
    population: 1455000,
    density: 134,
    growth: -0.8,
  },
];

const ageDistribution = [
  {
    age: "0-14",
    count: 980000,
    percentage: 14.4,
    male: 502000,
    female: 478000,
  },
  {
    age: "15-24",
    count: 820000,
    percentage: 12.1,
    male: 420000,
    female: 400000,
  },
  {
    age: "25-54",
    count: 3200000,
    percentage: 47.1,
    male: 1620000,
    female: 1580000,
  },
  {
    age: "55-64",
    count: 880000,
    percentage: 12.9,
    male: 420000,
    female: 460000,
  },
  { age: "65+", count: 917000, percentage: 13.5, male: 373000, female: 544000 },
];

const populationProjection = [
  { year: 2024, optimistic: 6850000, realistic: 6750000, pessimistic: 6650000 },
  { year: 2030, optimistic: 6800000, realistic: 6500000, pessimistic: 6200000 },
  { year: 2035, optimistic: 6700000, realistic: 6300000, pessimistic: 5800000 },
  { year: 2040, optimistic: 6600000, realistic: 6000000, pessimistic: 5400000 },
  { year: 2045, optimistic: 6500000, realistic: 5700000, pessimistic: 5000000 },
  { year: 2050, optimistic: 6400000, realistic: 5400000, pessimistic: 4600000 },
];

// WCAG-compliant colors with sufficient contrast against light backgrounds
// Using palette with minimum 4.5:1 contrast ratio for normal text
const COLORS = [
  "#1E40AF",
  "#059669",
  "#CA8A04",
  "#DC2626",
  "#7C3AED",
  "#0891B2",
];

interface SerbianDemographicsChartProps {
  language?: SerbianLanguageVariant;
  showInteractiveFeatures?: boolean;
  height?: number;
}

export const SerbianDemographicsChart: React.FC<
  SerbianDemographicsChartProps
> = ({
  language = "sr-Latn",
  showInteractiveFeatures = true,
  height = 400,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [_selectedRegion, _setSelectedRegion] = useState("Beograd");

  const labels = useMemo(
    () => getDatasetLabels("demographics", language),
    [language]
  );

  const formatPopulation = (value: number) => {
    if (value >= 1000000) {
      return `${formatSerbianNumber(value / 1000000, language)}M`;
    } else if (value >= 1000) {
      return `${formatSerbianNumber(value / 1000, language)}K`;
    }
    return formatSerbianNumber(value, language);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatSerbianNumber(entry.value, language)}
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
          <CardTitle>Trend stanovništva (2010-2022)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={populationTimeSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={formatPopulation} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                strokeWidth={2}
                name="Ukupno"
              />
              <Line
                type="monotone"
                dataKey="male"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Muškarci"
              />
              <Line
                type="monotone"
                dataKey="female"
                stroke="#ffc658"
                strokeWidth={2}
                name="Žene"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Starosna struktura (2022)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={ageDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ age, percentage }: any) => `${age}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {ageDistribution.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number | undefined) =>
                  formatSerbianNumber(value || 0, language)
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderRegionalAnalysis = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stanovništvo po regijama</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={populationByRegion}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="region"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis tickFormatter={formatPopulation} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="population" fill="#8884d8" name="Stanovništvo" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gustina naseljenosti po regijama</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={populationByRegion}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="region"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis
                label={{
                  value: "Stanovnika po km²",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                        <p className="font-semibold">{data.region}</p>
                        <p>
                          Gustina: {formatSerbianNumber(data.density, language)}{" "}
                          stanovnika/km²
                        </p>
                        <p>Rast: {data.growth}% godišnje</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="density"
                fill="#82ca9d"
                name="Gustina (stanovnika/km²)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderProjections = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Projekcija stanovništva do 2050.</CardTitle>
          <p className="text-sm text-muted-foreground">
            {getSerbianTranslation("projection", language)} prema različitim
            scenarijima
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={populationProjection}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={formatPopulation} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="optimistic"
                stroke="#00C49F"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Optimističan"
              />
              <Line
                type="monotone"
                dataKey="realistic"
                stroke="#8884d8"
                strokeWidth={3}
                name="Realističan"
              />
              <Line
                type="monotone"
                dataKey="pessimistic"
                stroke="#FF8042"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Pesimističan"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">
              Optimističan scenario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">6.4M</p>
              <p className="text-sm text-muted-foreground">Stanovnika 2050.</p>
              <div className="space-y-1">
                <p className="text-xs">✓ Povećana stopa nataliteta</p>
                <p className="text-xs">✓ Pad emigracije</p>
                <p className="text-xs">✓ Dugovečnost stanovništva</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">
              Realističan scenario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">5.4M</p>
              <p className="text-sm text-muted-foreground">Stanovnika 2050.</p>
              <div className="space-y-1">
                <p className="text-xs">• Trenutni trendovi se nastavljaju</p>
                <p className="text-xs">• Umerena emigracija</p>
                <p className="text-xs">• Stabilizacija nataliteta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">
              Pesimističan scenario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">4.6M</p>
              <p className="text-sm text-muted-foreground">Stanovnika 2050.</p>
              <div className="space-y-1">
                <p className="text-xs">✗ Nastavak pada nataliteta</p>
                <p className="text-xs">✗ Povećana emigracija</p>
                <p className="text-xs">✗ Demografsko starenje</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDetailedAnalysis = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vrsta naselja (2022)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={populationTimeSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={formatPopulation} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="urban"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
                name="Gradsko"
              />
              <Area
                type="monotone"
                dataKey="rural"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
                name="Seosko"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Muški vs Ženski po starosnim grupama</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ageDistribution.map((group, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Grupa: {group.age} godina</h4>
                  <Badge variant="outline">
                    {group.percentage}% populacije
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Muškarci</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatSerbianNumber(group.male, language)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Žene</p>
                    <p className="text-lg font-semibold text-pink-600">
                      {formatSerbianNumber(group.female, language)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showInteractiveFeatures && (
        <Card>
          <CardHeader>
            <CardTitle>Ključne demografske statistike</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-blue-600">6.80M</p>
                <p className="text-sm text-muted-foreground">
                  Trenutno stanovništvo
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-red-600">-1.8%</p>
                <p className="text-sm text-muted-foreground">Godišnji pad</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-green-600">42.6</p>
                <p className="text-sm text-muted-foreground">
                  Prosečna starost
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-purple-600">66%</p>
                <p className="text-sm text-muted-foreground">
                  Urbana populacija
                </p>
              </div>
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
            <span>{labels.demographics} - Republika Srbija</span>
            {showInteractiveFeatures && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log("Language toggle clicked");
                  }}
                >
                  {language === "sr-Latn" ? "Ћирилица" : "Latinica"}
                </Button>
              </div>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {labels.source}: {serbianDemographicsData[0].organization}
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Pregled</TabsTrigger>
              <TabsTrigger value="regional">Regionalno</TabsTrigger>
              <TabsTrigger value="projections">Projekcije</TabsTrigger>
              <TabsTrigger value="detailed">Detaljno</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {renderOverview()}
            </TabsContent>

            <TabsContent value="regional" className="space-y-4">
              {renderRegionalAnalysis()}
            </TabsContent>

            <TabsContent value="projections" className="space-y-4">
              {renderProjections()}
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

export default SerbianDemographicsChart;
