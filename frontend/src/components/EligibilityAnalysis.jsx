import { useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const EligibilityAnalysis = ( data ) => {
  const dataSet = data?.data; // Extract dataset
  const chartRef = useRef(null);

  if (!dataSet || dataSet.length === 0) {
    return <div>No data available for the chart.</div>;
  }

  // Group data by region (County/City/State) and CAFV eligibility
  const groupedData = dataSet.reduce((acc, item) => {
    const region = item["County"] || item["City"] || item["State"]; // You can prioritize City > County > State
    const eligibility = item["Clean Alternative Fuel Vehicle (CAFV) Eligibility"];

    if (!acc[region]) acc[region] = {
      "Clean Alternative Fuel Vehicle Eligible": 0,
      "Eligibility unknown as battery range has not been researched": 0,
      "Not eligible due to low battery range": 0
    };

    // Increment count for each eligibility category
    if (eligibility === "Clean Alternative Fuel Vehicle Eligible") {
      acc[region]["Clean Alternative Fuel Vehicle Eligible"] += 1;
    } else if (eligibility === "Eligibility unknown as battery range has not been researched") {
      acc[region]["Eligibility unknown as battery range has not been researched"] += 1;
    } else if (eligibility === "Not eligible due to low battery range") {
      acc[region]["Not eligible due to low battery range"] += 1;
    }

    return acc;
  }, {});

  const regions = Object.keys(groupedData); // Extract unique regions

  // State to track selected region
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);

  // Chart data based on the selected region
  const eligibilityData = groupedData[selectedRegion] || {
    "Clean Alternative Fuel Vehicle Eligible": 0,
    "Eligibility unknown as battery range has not been researched": 0,
    "Not eligible due to low battery range": 0
  };

  const chartData = {
    labels: [
      "Clean Alternative Fuel Vehicle Eligible",
      "Eligibility unknown as battery range has not been researched",
      "Not eligible due to low battery range"
    ],
    datasets: [
      {
        label: "Vehicle Count",
        data: [
          eligibilityData["Clean Alternative Fuel Vehicle Eligible"],
          eligibilityData["Eligibility unknown as battery range has not been researched"],
          eligibilityData["Not eligible due to low battery range"]
        ],
        backgroundColor: ["#2563eb", "#fca5a5", "#f59e0b"],
        hoverBackgroundColor: ["#1d4ed8", "#f87171", "#d97706"],
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
          text: "CAFV Eligibility",
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

  // Filter data to compute percentage of eligible, unknown, and ineligible vehicles
  const totalVehicles =
    eligibilityData["Clean Alternative Fuel Vehicle Eligible"] +
    eligibilityData["Eligibility unknown as battery range has not been researched"] +
    eligibilityData["Not eligible due to low battery range"];

  const eligibilityPercentage = {
    eligible: (eligibilityData["Clean Alternative Fuel Vehicle Eligible"] / totalVehicles) * 100,
    unknown: (eligibilityData["Eligibility unknown as battery range has not been researched"] / totalVehicles) * 100,
    ineligible: (eligibilityData["Not eligible due to low battery range"] / totalVehicles) * 100,
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-primary-600 text-xl font-bold mb-4">CAFV Eligibility Analysis</h2>

      {/* Dropdown for selecting region */}
      <div className="mb-4 flex items-center space-x-2">
        <label htmlFor="regionDropdown" className="text-gray-700 font-medium">
          Select County:
        </label>
        <select
          id="regionDropdown"
          className="p-2 border border-gray-300 rounded-lg"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* Display eligibility percentage */}
      <div className="mb-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500">Eligible</p>
          <p className="font-semibold text-primary-600">{eligibilityPercentage.eligible.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Unknown</p>
          <p className="font-semibold text-primary-600">{eligibilityPercentage.unknown.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Ineligible</p>
          <p className="font-semibold text-primary-600">{eligibilityPercentage.ineligible.toFixed(2)}%</p>
        </div>
      </div>

      <div className="h-full max-h-[500px] flex justify-center">
      <Bar ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default EligibilityAnalysis;
