import { useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const GeographicalInsights = (data) => {
  const dataSet = data?.data; // Extract dataset
  const chartRef = useRef(null);

  if (!dataSet || dataSet.length === 0) {
    return <div>No data available for the chart.</div>;
  }

  // Group data by county and cities
  const groupedData = dataSet.reduce((acc, item) => {
    const county = item["County"];
    const city = item["City"];

    if (!acc[county]) acc[county] = {};
    acc[county][city] = (acc[county][city] || 0) + 1;

    return acc;
  }, {});

  const counties = Object.keys(groupedData); // Extract unique counties

  // State to track selected county
  const [selectedCounty, setSelectedCounty] = useState(counties[0]);

  // Chart data based on the selected county
  const cityData = groupedData[selectedCounty] || {};
  const chartData = {
    labels: Object.keys(cityData), // Cities in the selected county
    datasets: [
      {
        label: "Vehicle Count",
        data: Object.values(cityData), // Counts for each city
        backgroundColor: "#2563eb",
        hoverBackgroundColor: "#1d4ed8",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.raw} vehicles`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Cities",
          color: "#333",
        },
      },
      y: {
        title: {
          display: true,
          text: "Vehicle Count",
          color: "#333",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-primary-600 text-xl font-bold">Geographical Vehicle Distribution</h2>
      
      {/* Dropdown for selecting county */}
      <div className="mb-4">
        <label htmlFor="countyDropdown" className="block text-gray-700 font-medium mb-2">
          Select County:
        </label>
        <select
          id="countyDropdown"
           className="ml-2 p-2 border border-gray-300 rounded-lg"
          value={selectedCounty}
          onChange={(e) => setSelectedCounty(e.target.value)}
        >
          {counties.map((county) => (
            <option key={county} value={county}>
              {county}
            </option>
          ))}
        </select>
      </div>
      <div className="h-full max-h-[500px] flex justify-center">
      <Bar ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default GeographicalInsights;
