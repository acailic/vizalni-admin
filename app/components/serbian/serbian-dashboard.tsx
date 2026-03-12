import React, { useState, useMemo } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// eslint-disable-next-line import/order
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import dataset information
import { serbianAirQualityData } from "@/data/serbian-air_quality";
import { serbianBudgetData } from "@/data/serbian-budget";
import { serbianDemographicsData } from "@/data/serbian-demographics";
import { serbianEnergyData } from "@/data/serbian-energy";

import SerbianAirQualityChart from "./serbian-air-quality-chart";
import SerbianBudgetChart from "./serbian-budget-chart";
import SerbianDemographicsChart from "./serbian-demographics-chart";
import SerbianEnergyChart from "./serbian-energy-chart";
import {
  getSerbianTranslation,
  SerbianLanguageVariant,
  formatSerbianDate,
  formatSerbianNumber,
} from "./serbian-language-utils";

interface SerbianDashboardProps {
  initialLanguage?: SerbianLanguageVariant;
  showInteractiveFeatures?: boolean;
  height?: number;
  activeDataset?: string;
}

export const SerbianDashboard: React.FC<SerbianDashboardProps> = ({
  initialLanguage = "sr-Latn",
  showInteractiveFeatures = true,
  height = 400,
  activeDataset = "overview",
}) => {
  const [language, setLanguage] =
    useState<SerbianLanguageVariant>(initialLanguage);
  const [selectedDataset, setSelectedDataset] = useState(activeDataset);
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock real-time data updates
  const lastUpdated = useMemo(() => new Date(), [refreshKey]);

  const datasets = useMemo(
    () => [
      {
        id: "budget",
        title: getSerbianTranslation("budget", language),
        description: "Budžet i finansije Republike Srbije",
        data: serbianBudgetData,
        count: serbianBudgetData.length,
        icon: "💰",
        color: "text-blue-600",
      },
      {
        id: "air_quality",
        title: getSerbianTranslation("airQuality", language),
        description: "Kvalitet vazduha i environmentalni podaci",
        data: serbianAirQualityData,
        count: serbianAirQualityData.length,
        icon: "🌍",
        color: "text-green-600",
      },
      {
        id: "demographics",
        title: getSerbianTranslation("demographics", language),
        description: "Popis stanovništva i demografske projekcije",
        data: serbianDemographicsData,
        count: serbianDemographicsData.length,
        icon: "👥",
        color: "text-purple-600",
      },
      {
        id: "energy",
        title: getSerbianTranslation("energy", language),
        description: "Energetska proizvodnja i potrošnja",
        data: serbianEnergyData,
        count: serbianEnergyData.length,
        icon: "⚡",
        color: "text-orange-600",
      },
    ],
    [language]
  );

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const toggleLanguage = () => {
    setLanguage((current) => (current === "sr-Latn" ? "sr-Cyrl" : "sr-Latn"));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {datasets.map((dataset) => (
          <Card
            key={dataset.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {dataset.title}
              </CardTitle>
              <span className="text-2xl">{dataset.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dataset.count}</div>
              <p className="text-xs text-muted-foreground">
                {dataset.description}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setSelectedDataset(dataset.id)}
              >
                Pogledaj detalje
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budžetski pregled</CardTitle>
          </CardHeader>
          <CardContent>
            <SerbianBudgetChart
              language={language}
              showInteractiveFeatures={false}
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trend kvaliteta vazduha</CardTitle>
          </CardHeader>
          <CardContent>
            <SerbianAirQualityChart
              language={language}
              showInteractiveFeatures={false}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Nedavne aktivnosti na datasetima</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Ažurirani podaci o kvalitetu vazduha
                </p>
                <p className="text-xs text-muted-foreground">Pre 2 sata</p>
              </div>
              <Badge variant="outline">Novo</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Budžetski izveštaj za Q4 2024
                </p>
                <p className="text-xs text-muted-foreground">Pre 1 dan</p>
              </div>
              <Badge variant="outline">Ažurirano</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Demografske projekcije do 2050.
                </p>
                <p className="text-xs text-muted-foreground">Pre 3 dana</p>
              </div>
              <Badge variant="outline">Analiza</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSpecificDataset = (datasetId: string) => {
    switch (datasetId) {
      case "budget":
        return (
          <SerbianBudgetChart
            language={language}
            showInteractiveFeatures={showInteractiveFeatures}
            height={height}
          />
        );
      case "air_quality":
        return (
          <SerbianAirQualityChart
            language={language}
            showInteractiveFeatures={showInteractiveFeatures}
            height={height}
          />
        );
      case "demographics":
        return (
          <SerbianDemographicsChart
            language={language}
            showInteractiveFeatures={showInteractiveFeatures}
            height={height}
          />
        );
      case "energy":
        return (
          <SerbianEnergyChart
            language={language}
            showInteractiveFeatures={showInteractiveFeatures}
            height={height}
          />
        );
      default:
        return (
          <Alert>
            <AlertTitle>Dataset nije pronađen</AlertTitle>
            <AlertDescription>
              Izabrani dataset "{datasetId}" ne postoji. Molimo odaberite jedan
              od dostupnih datasetova.
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {getSerbianTranslation("dashboard", language)} - Republika
                Srbija
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Nacionalni podaci otvorenog portala - data.gov.rs
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {showInteractiveFeatures && (
                <>
                  {/* @ts-expect-error - Select component children type mismatch */}
                  <Select
                    value={selectedDataset}
                    onValueChange={setSelectedDataset}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Izaberite dataset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Pregled svih</SelectItem>
                      {datasets.map((dataset) => (
                        <SelectItem key={dataset.id} value={dataset.id}>
                          {dataset.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="sm" onClick={toggleLanguage}>
                    {language === "sr-Latn" ? "Ћирилица" : "Latinica"}
                  </Button>

                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    🔄 Osveži
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Status Alert */}
      <Alert>
        <AlertTitle>📊 Status sistema</AlertTitle>
        <AlertDescription>
          Svi datasetovi su ažurirani. Poslednja sinhronizacija:{" "}
          {formatSerbianDate(lastUpdated, language)}. Broj dostupnih datasetova:{" "}
          {formatSerbianNumber(
            serbianBudgetData.length +
              serbianAirQualityData.length +
              serbianDemographicsData.length +
              serbianEnergyData.length,
            language
          )}
          .
        </AlertDescription>
      </Alert>

      {/* Main Content */}
      <div className="space-y-6">
        {selectedDataset === "overview"
          ? renderOverview()
          : renderSpecificDataset(selectedDataset)}
      </div>

      {/* Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              <p>Izvori podataka: Ministarstva i agencije Republike Srbije</p>
              <p>Otvoreni podaci: data.gov.rs</p>
            </div>
            <div className="text-right">
              <p>Vizualizacija: vizualni-admin</p>
              <p>
                Jezik:{" "}
                {language === "sr-Latn"
                  ? "Latinica"
                  : language === "sr-Cyrl"
                    ? "Ћирилица"
                    : "English"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SerbianDashboard;
