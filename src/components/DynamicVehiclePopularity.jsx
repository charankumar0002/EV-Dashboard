import { useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DynamicVehiclePopularity = (data) => {
  const [selectedMaker, setSelectedMaker] = useState("");
  const dataSet = data.data;
  const chartRef = useRef(null);

  if (!dataSet || dataSet.length === 0) {
    return <div>No data available for the chart.</div>;
  }

  // Extract unique makers
  const uniqueMakers = [...new Set(dataSet.map((vehicle) => vehicle.Make))];
console.log("unique",uniqueMakers)
  // Filter data based on selected maker
  const filteredData = selectedMaker
    ? dataSet.filter((vehicle) => vehicle.Make === selectedMaker)
    : [];

  // Count models for the selected maker
  const modelCounts = filteredData.reduce((acc, vehicle) => {
    acc[vehicle.Model] = (acc[vehicle.Model] || 0) + 1;
    return acc;
  }, {});

  // Prepare chart data
  const chartData = {
    labels: Object.keys(modelCounts),
    datasets: [
      {
        label: `Number of Vehicles (${selectedMaker})`,
        data: Object.values(modelCounts),
        backgroundColor: [
          "#008080",
          "#60a5fa",
          "#f97316",
          "#84cc16",
          "#d946ef",
        ],
        borderColor: ["#005f5f", "#3b82f6", "#c65a09", "#659f11", "#b71ba1"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-teal-600 text-xl font-bold">
        Model Distribution by Maker
      </h2>
      <div className="my-4">
        <label htmlFor="maker" className="text-teal-600 font-semibold">
          Select Maker:
        </label>
        <select
          id="maker"
          value={selectedMaker}
          onChange={(e) => setSelectedMaker(e.target.value)}
          className="ml-2 p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select a Maker</option>
          {uniqueMakers?.map((maker) => (
            <option key={maker} value={maker}>
              {maker}
            </option>
          ))}
        </select>
      </div>

      {selectedMaker && Object.keys(modelCounts).length > 0 ? (
        <Bar ref={chartRef} data={chartData} />
      ) : selectedMaker ? (
        <p className="text-gray-500">
          No data available for the selected maker.
        </p>
      ) : (
        <p className="text-gray-500">
          Please select a maker to view the chart.
        </p>
      )}
    </div>
  );
};

export default DynamicVehiclePopularity;
