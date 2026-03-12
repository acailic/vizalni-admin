/**
 * Plugin System Demo
 *
 * This page demonstrates the chart plugin system by dynamically
 * registering and using a custom RadarChart plugin.
 *
 * @packageDocumentation
 */

import Head from "next/head";
import { useTranslation } from "next-i18next";
import { useState } from "react";

import { Layout } from "../../components/layout";
import {
  registerChartPlugin,
  getChartPlugin,
  getChartPluginStats,
  listChartPlugins,
  type ChartData,
} from "../../exports/charts";
import { radarChartPlugin } from "../../exports/charts/examples/RadarChartPlugin";

export default function PluginSystemDemo() {
  const { t: _t } = useTranslation();
  const [isPluginRegistered, setIsPluginRegistered] = useState(false);
  const [pluginInfo, setPluginInfo] = useState<any>(null);

  // Example data for the radar chart
  const radarData: ChartData[] = [
    { metric: "Speed", value: 85 },
    { metric: "Power", value: 70 },
    { metric: "Technique", value: 90 },
    { metric: "Stamina", value: 75 },
    { metric: "Defense", value: 65 },
    { metric: "Creativity", value: 80 },
  ];

  const radarConfig = {
    xAxis: "metric",
    yAxis: "value",
    color: "#6366f1",
    levels: 5,
    showAxisLabels: true,
    showGrid: true,
    fillOpacity: 0.3,
    pointRadius: 4,
    title: "Player Attributes",
  };

  const handleRegisterPlugin = () => {
    const result = registerChartPlugin(radarChartPlugin);

    if (result.success) {
      setIsPluginRegistered(true);
      const plugin = getChartPlugin("example-radar-chart");
      setPluginInfo(plugin);
      console.log("Plugin registered:", result);
    } else {
      console.error("Plugin registration failed:", result.error);
    }
  };

  const handleUnregisterPlugin = () => {
    // Note: Built-in plugins cannot be unregistered
    // But external plugins can be
    console.log("Unregister plugin");
    setIsPluginRegistered(false);
    setPluginInfo(null);
  };

  const stats = getChartPluginStats();
  const allPlugins = listChartPlugins();

  // Get the RadarChart component if plugin is registered
  const RadarChartComponent = pluginInfo?.component;

  return (
    <Layout>
      <Head>
        <title>Plugin System Demo - vizualni-admin</title>
        <meta
          name="description"
          content="Demonstration of the chart plugin system"
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Chart Plugin System Demo
            </h1>
            <p className="text-lg text-gray-600">
              This page demonstrates how to dynamically register and use custom
              chart plugins without modifying the core bundle.
            </p>
          </div>

          {/* Plugin Controls */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Plugin Controls</h2>

            <div className="flex gap-4 mb-6">
              {!isPluginRegistered ? (
                <button
                  onClick={handleRegisterPlugin}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Register Radar Chart Plugin
                </button>
              ) : (
                <div className="flex gap-4">
                  <span className="px-4 py-3 bg-green-100 text-green-800 rounded-lg font-medium">
                    ✓ Plugin Registered
                  </span>
                  <button
                    onClick={handleUnregisterPlugin}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* Plugin Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600">Total Plugins</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-600">
                  {stats.builtin}
                </div>
                <div className="text-sm text-gray-600">Built-in Plugins</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-600">
                  {stats.external}
                </div>
                <div className="text-sm text-gray-600">External Plugins</div>
              </div>
            </div>
          </div>

          {/* Registered Plugins List */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Registered Plugins ({allPlugins.length})
            </h2>
            <div className="space-y-2">
              {allPlugins.map((plugin) => (
                <div
                  key={plugin.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {plugin.name}
                      <span className="ml-2 text-sm text-gray-500">
                        v{plugin.version}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {plugin.description}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{plugin.author}</div>
                    <div className="text-xs text-gray-400">
                      {plugin.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Demo */}
          {isPluginRegistered && RadarChartComponent && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Radar Chart (Plugin)
              </h2>
              <p className="text-gray-600 mb-6">
                This RadarChart is loaded dynamically from the registered
                plugin. It&apos;s not included in the core bundle and only loads
                when explicitly registered.
              </p>

              <div className="flex justify-center">
                <RadarChartComponent
                  data={radarData}
                  config={radarConfig}
                  height={450}
                  width="100%"
                />
              </div>

              {/* Plugin Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Plugin Information</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-gray-600">ID:</dt>
                  <dd className="font-mono">{pluginInfo?.id}</dd>

                  <dt className="text-gray-600">Version:</dt>
                  <dd>{pluginInfo?.version}</dd>

                  <dt className="text-gray-600">Author:</dt>
                  <dd>{pluginInfo?.author}</dd>

                  <dt className="text-gray-600">License:</dt>
                  <dd>{pluginInfo?.license}</dd>

                  <dt className="text-gray-600">Category:</dt>
                  <dd>{pluginInfo?.category}</dd>

                  <dt className="text-gray-600">Tags:</dt>
                  <dd>{pluginInfo?.tags?.join(", ")}</dd>
                </dl>
              </div>
            </div>
          )}

          {/* How It Works */}
          <div className="mt-8 bg-indigo-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">1. Create a Plugin</h3>
                <p className="text-sm">
                  Define a chart component and export it as a plugin object with
                  metadata, configuration, and optional hooks.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Register the Plugin</h3>
                <p className="text-sm">
                  Use{" "}
                  <code className="bg-white px-2 py-1 rounded">
                    registerChartPlugin(plugin)
                  </code>{" "}
                  to register your plugin with the chart registry.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Use the Plugin</h3>
                <p className="text-sm">
                  Retrieve the plugin using{" "}
                  <code className="bg-white px-2 py-1 rounded">
                    getChartPlugin(id)
                  </code>{" "}
                  and render its component with your data and configuration.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Benefits</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Zero impact on core bundle size</li>
                  <li>Tree-shakeable - only loaded when used</li>
                  <li>Supports third-party plugin ecosystem</li>
                  <li>No modification of core code required</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Code Example */}
          <div className="mt-8 bg-gray-900 rounded-lg p-6 text-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Code Example</h2>
            <pre className="text-sm overflow-x-auto">
              <code>{`// Import the plugin system and your plugin
import { registerChartPlugin, getChartPlugin } from '@acailic/vizualni-admin/charts';
import { radarChartPlugin } from './radar-chart-plugin';

// Register the plugin
const result = registerChartPlugin(radarChartPlugin);

// Use the registered plugin
const plugin = getChartPlugin('example-radar-chart');
const RadarChart = plugin.component;

// Render the chart
<RadarChart data={data} config={config} height={400} />`}</code>
            </pre>
          </div>

          {/* Documentation Link */}
          <div className="mt-8 text-center">
            <a
              href="https://github.com/acailic/vizualni-admin/blob/main/docs/CHART_PLUGIN_GUIDE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              View Plugin Development Guide →
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
