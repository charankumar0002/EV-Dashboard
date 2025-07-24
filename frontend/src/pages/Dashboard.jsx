import React, { Suspense, useState, useMemo } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import useRealTimeData from "../hooks/useRealTimeData";
import Select from "react-select";
import { fetchEVModels } from "../utility/api";

// Dynamically import large chart components
const KpiCard = React.lazy(() => import("../components/KpiCard"));
const SampleLineChart = React.lazy(() => import("../components/SampleLineChart"));
const SampleBarChart = React.lazy(() => import("../components/SampleBarChart"));
const SamplePieChart = React.lazy(() => import("../components/SamplePieChart"));
const SampleScatterChart = React.lazy(() => import("../components/SampleScatterChart"));
const Insights = React.lazy(() => import("../components/Insights"));

function Dashboard() {
  // Change the API URL to point to the backend
  const apiUrl = "https://ev-dashboard-1a32.vercel.app/api/evs";
  const { data, loading } = useRealTimeData(apiUrl, 30000);
console.log(data);
  // Multi-select filter state
  const [years, setYears] = useState([]);
  const [makes, setMakes] = useState([]);
  const [regions, setRegions] = useState([]);

  // Compute filter options from data
  const yearOptions = useMemo(() => Array.from(new Set(data.map(d => d["Model Year"]))).filter(Boolean).sort().map(y => ({ value: y, label: y })), [data]);
  const makeOptions = useMemo(() => Array.from(new Set(data.map(d => d.Make))).filter(Boolean).sort().map(m => ({ value: m, label: m })), [data]);
  const regionOptions = useMemo(() => Array.from(new Set(data.map(d => d.County || d.City || d.State))).filter(Boolean).sort().map(r => ({ value: r, label: r })), [data]);

  // Filter data based on selections
  const filteredData = useMemo(() => {
    return data.filter(d =>
      (years.length === 0 || years.some(y => d["Model Year"] === y.value)) &&
      (makes.length === 0 || makes.some(m => d.Make === m.value)) &&
      (regions.length === 0 || regions.some(r => d.County === r.value || d.City === r.value || d.State === r.value))
    );
  }, [data, years, makes, regions]);

  // Compute KPI values from filtered data
  const totalEVs = filteredData.length || 0;
  const avgRange = filteredData.length ? (filteredData.reduce((sum, item) => sum + (item["Electric Range"] || 0), 0) / filteredData.length).toFixed(1) : "-";
  const avgMsrp = filteredData.length ? (filteredData.reduce((sum, item) => sum + (item["Base MSRP"] || 0), 0) / filteredData.length).toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) : "-";
  const makeCounts = filteredData.reduce((acc, item) => {
    acc[item.Make] = (acc[item.Make] || 0) + 1;
    return acc;
  }, {});
  const mostPopularMake = Object.entries(makeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">EV Dashboard</h1>
          <DarkModeToggle />
        </header>
        {/* Filter Description */}
        <p className="mb-2 text-gray-600 dark:text-gray-300 text-sm">Use the filters below to analyze trends, compare makes, or focus on specific regions and years. All insights and charts update instantly based on your selections.</p>
        {/* Multi-Select Filters */}
        <section className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="min-w-[180px]">
            <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">Year(s)</label>
            <Select
              isMulti
              options={yearOptions}
              value={years}
              onChange={setYears}
              placeholder="All Years"
              classNamePrefix="react-select"
            />
          </div>
          <div className="min-w-[180px]">
            <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">Make(s)</label>
            <Select
              isMulti
              options={makeOptions}
              value={makes}
              onChange={setMakes}
              placeholder="All Makes"
              classNamePrefix="react-select"
            />
          </div>
          <div className="min-w-[180px]">
            <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">Region(s)</label>
            <Select
              isMulti
              options={regionOptions}
              value={regions}
              onChange={setRegions}
              placeholder="All Regions"
              classNamePrefix="react-select"
            />
          </div>
        </section>
        {/* Insights Section */}
        <div className="mb-2 text-gray-700 dark:text-gray-300 text-sm font-medium">Business Insights: Key takeaways and trends for your selected filters.</div>
        <Insights data={filteredData} />
        {/* KPI Cards */}
        <div className="mb-2 text-gray-700 dark:text-gray-300 text-sm font-medium">KPIs: Core business metrics for your selection.</div>
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <KpiCard label="Total EVs" value={loading ? "..." : totalEVs.toLocaleString()} />
          <KpiCard label="Avg. Range" value={loading ? "..." : `${avgRange} mi`} />
          <KpiCard label="Most Popular Make" value={loading ? "..." : mostPopularMake} />
          <KpiCard label="Avg. MSRP" value={loading ? "..." : avgMsrp} />
        </section>
        {/* Charts Grid */}
        <div className="mb-2 text-gray-700 dark:text-gray-300 text-sm font-medium">Charts: Visualize adoption, market share, type distribution, and value.</div>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-72 flex flex-col items-center justify-center">
            <div className="text-xs text-gray-500 mb-1">EV Adoption Over Time (Line Chart)</div>
            <SampleLineChart data={filteredData} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-72 flex flex-col items-center justify-center">
            <div className="text-xs text-gray-500 mb-1">Top Makes (Bar Chart)</div>
            <SampleBarChart data={filteredData} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-72 flex flex-col items-center justify-center">
            <div className="text-xs text-gray-500 mb-1">EV Type Distribution (Pie Chart)</div>
            <SamplePieChart data={filteredData} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-72 flex flex-col items-center justify-center">
            <div className="text-xs text-gray-500 mb-1">Range vs MSRP (Scatter Chart)</div>
            <SampleScatterChart data={filteredData} />
          </div>
          {/* Optionally add a map or more charts here */}
        </section>
        {/* Footer */}
        <footer className="mt-8 text-center text-gray-400 text-sm">
          Data source: EVPopulationData.json | © {new Date().getFullYear()} EV Dashboard
        </footer>
      </div>
    </Suspense>
  );
}

export default Dashboard;
