import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const CostEfficiencyAnalysis = ({ data }) => {
  // Extract unique countries
  const countries = [...new Set(data.map((item) => item.Country))].filter(Boolean); // Filter out empty countries

  // State to track selected country
  const [selectedCountry, setSelectedCountry] = useState(countries[0] || "");

  // Filter data based on selected country
  const filteredData = data.filter((item) => item.Country === selectedCountry);

  // Prepare chart data
  const chartData = {
    labels: filteredData.map((item) => `${item.Make} ${item.Model}`),
    datasets: [
      {
        label: "Range per $1,000 MSRP",
        data: filteredData.map((item) => {
          const range = item["Electric Range"] || 0;
          const msrp = item["Base MSRP"] || 1; // Avoid division by 0
          return (range / msrp) * 1000;
        }),
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
            return `${context.raw.toFixed(2)} mi/$1,000`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Vehicle Model",
          color: "#333",
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: "Range per $1,000 MSRP (mi/$1,000)",
          color: "#333",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-primary-600 text-xl font-bold mb-4">Cost Efficiency Analysis by Country</h2>
      
      {/* Country Dropdown */}
      <div className="mb-4">
        <label htmlFor="countryDropdown" className="block text-gray-700 font-medium mb-2">
          Select Country:
        </label>
        <select
          id="countryDropdown"
          className="border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      {filteredData.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p className="text-center text-gray-500">No data available for the selected country.</p>
      )}
    </div>
  );
};

export default CostEfficiencyAnalysis;
