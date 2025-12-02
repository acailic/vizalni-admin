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
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { serbianAirQualityData } from "@/data/serbian-air_quality";

import {
  getDatasetLabels,
  formatSerbianNumber,
  SerbianLanguageVariant
} from "./serbian-language-utils";

// Mock data for air quality measurements
const airQualityTimeSeries = [
  { date: "2024-01-01", pm10: 45, pm25: 28, no2: 35, o3: 65, location: "Beograd - Centar" },
  { date: "2024-01-02", pm10: 62, pm25: 42, no2: 48, o3: 52, location: "Beograd - Centar" },
  { date: "2024-01-03", pm10: 58, pm25: 38, no2: 45, o3: 58, location: "Beograd - Centar" },
  { date: "2024-01-04", pm10: 71, pm25: 52, no2: 62, o3: 45, location: "Beograd - Centar" },
  { date: "2024-01-05", pm10: 89, pm25: 68, no2: 75, o3: 38, location: "Beograd - Centar" },
  { date: "2024-01-06", pm10: 95, pm25: 74, no2: 82, o3: 35, location: "Beograd - Centar" },
  { date: "2024-01-07", pm10: 78, pm25: 58, no2: 65, o3: 42, location: "Beograd - Centar" },
  { date: "2024-01-08", pm10: 65, pm25: 48, no2: 52, o3: 48, location: "Beograd - Centar" },
  { date: "2024-01-09", pm10: 52, pm25: 38, no2: 42, o3: 55, location: "Beograd - Centar" },
  { date: "2024-01-10", pm10: 48, pm25: 32, no2: 38, o3: 62, location: "Beograd - Centar" }
];

const locationComparisons = [
  { location: "Beograd - Centar", pm10: 65, pm25: 42, latitude: 44.8125, longitude: 20.4612 },
  { location: "Beograd - Novi Beograd", pm10: 58, pm25: 38, latitude: 44.8206, longitude: 20.4098 },
  { location: "Beograd - Voždovac", pm10: 72, pm25: 48, latitude: 44.7678, longitude: 20.4732 },
  { location: "Beograd - Zemun", pm10: 55, pm25: 35, latitude: 44.8606, longitude: 20.4046 },
  { location: "Beograd - Pančevo most", pm10: 85, pm25: 58, latitude: 44.8285, longitude: 20.5023 },
  { location: "Niš", pm10: 68, pm25: 45, latitude: 43.3247, longitude: 21.9033 },
  { location: "Novi Sad", pm10: 52, pm25: 34, latitude: 45.2671, longitude: 19.8335 },
  { location: "Kragujevac", pm10: 48, pm25: 31, latitude: 44.0167, longitude: 20.9167 }
];

const pollutionLevels = [
  { level: "Dobar", pm10_min: 0, pm10_max: 50, color: "#00e400", description: "Vazduh je čist" },
  { level: "Umeren", pm10_min: 51, pm10_max: 100, color: "#ffff00", description: "Niski nivo zagađenja" },
  { level: "Zdravstveno nepovoljan", pm10_min: 101, pm10_max: 150, color: "#ff7e00", description: "Osetljive grupe mogu osetiti simptome" },
  { level: "Nezdrav", pm10_min: 151, pm10_max: 200, color: "#ff0000", description: "Svi mogu osetiti zdravstvene posledice" },
  { level: "Vrlo nezdrav", pm10_min: 201, pm10_max: 300, color: "#8f3f97", description: "Hitne zdravstvene posledice" },
  { level: "Opasan", pm10_min: 301, pm10_max: 500, color: "#7e0023", description: "Svi mogu imati ozbiljne zdravstvene probleme" }
];

interface SerbianAirQualityChartProps {
  language?: SerbianLanguageVariant;
  showInteractiveFeatures?: boolean;
  height?: number;
}

export const SerbianAirQualityChart: React.FC<SerbianAirQualityChartProps> = ({
  language = "sr-Latn",
  showInteractiveFeatures = true,
  height = 400
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedLocation, setSelectedLocation] = useState("Beograd - Centar");

  const labels = useMemo(() => getDatasetLabels('air_quality', language), [language]);

  const getAirQualityLevel = (pm10: number) => {
    return pollutionLevels.find(level => pm10 >= level.pm10_min && pm10 <= level.pm10_max);
  };

  const getAirQualityColor = (pm10: number) => {
    const level = getAirQualityLevel(pm10);
    return level ? level.color : "#666666";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const level = getAirQualityLevel(data.pm10);

      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          <p>PM10: {formatSerbianNumber(data.pm10, language)} μg/m³</p>
          {data.pm25 && <p>PM2.5: {formatSerbianNumber(data.pm25, language)} μg/m³</p>}
          {level && (
            <div className="mt-2">
              <Badge style={{ backgroundColor: level.color, color: "white" }}>
                {level.level}
              </Badge>
              <p className="text-xs mt-1">{level.description}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Trend PM10 vrednosti - {selectedLocation}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={airQualityTimeSeries.filter(d => d.location === selectedLocation)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString(language === "en" ? "en-US" : "sr-RS", { month: "short", day: "numeric" })}
              />
              <YAxis
                label={{ value: 'PM10 (μg/m³)', angle: -90, position: 'insideLeft' }}
                domain={[0, 'dataMax + 20']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="pm10"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ fill: "#8884d8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nivoi zagađenja vazduha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pollutionLevels.map((level, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderLeftColor: level.color, borderLeftWidth: "4px" }}>
                <div>
                  <h4 className="font-semibold">{level.level}</h4>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">PM10: {level.pm10_min}-{level.pm10_max}</p>
                  <div
                    className="w-6 h-6 rounded ml-auto mt-1"
                    style={{ backgroundColor: level.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLocationComparison = () => (
    <Card>
      <CardHeader>
        <CardTitle>Poređenje lokacija</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={locationComparisons} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="location"
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis
              label={{ value: 'PM10 (μg/m³)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="pm10" fill="#8884d8" name="PM10" />
            <Bar dataKey="pm25" fill="#82ca9d" name="PM2.5" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderDetailedAnalysis = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Korelacija zagađenja između lokacija</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="pm10"
                name="PM10"
                unit=" μg/m³"
              />
              <YAxis
                dataKey="pm25"
                name="PM2.5"
                unit=" μg/m³"
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                        <p className="font-semibold">{data.location}</p>
                        <p>PM10: {formatSerbianNumber(data.pm10, language)} μg/m³</p>
                        <p>PM2.5: {formatSerbianNumber(data.pm25, language)} μg/m³</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Lokacije"
                data={locationComparisons}
                fill="#8884d8"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Svi polutanti - {selectedLocation}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={airQualityTimeSeries.filter(d => d.location === selectedLocation)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString(language === "en" ? "en-US" : "sr-RS", { month: "short", day: "numeric" })}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="pm10"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="pm25"
                stackId="2"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="no2"
                stackId="3"
                stroke="#ffc658"
                fill="#ffc658"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {showInteractiveFeatures && (
        <Card>
          <CardHeader>
            <CardTitle>Lokacije za monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {locationComparisons.map((location, index) => {
                const level = getAirQualityLevel(location.pm10);
                return (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedLocation === location.location
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedLocation(location.location)}
                  >
                    <h4 className="font-semibold text-sm">{location.location}</h4>
                    <p className="text-lg font-bold" style={{ color: getAirQualityColor(location.pm10) }}>
                      {formatSerbianNumber(location.pm10, language)}
                    </p>
                    <p className="text-xs text-muted-foreground">PM10 μg/m³</p>
                    {level && (
                      <Badge
                        variant="secondary"
                        className="mt-1 text-xs"
                        style={{ backgroundColor: level.color, color: "white" }}
                      >
                        {level.level}
                      </Badge>
                    )}
                  </div>
                );
              })}
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
            <span>{labels.airQuality} - Republika Srbija</span>
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
            {labels.source}: {serbianAirQualityData[0].organization}
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Pregled</TabsTrigger>
              <TabsTrigger value="locations">Lokacije</TabsTrigger>
              <TabsTrigger value="detailed">Detaljno</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {renderOverview()}
            </TabsContent>

            <TabsContent value="locations" className="space-y-4">
              {renderLocationComparison()}
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

export default SerbianAirQualityChart;