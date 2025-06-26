import { useRef, useState } from "react";
import { Bar } from "react-chartjs-2"; // Importing Bar chart only for simplicity
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

const MakerBasedAnalysis = (data) => {
  const dataSet = data.data;

  const chartRef = useRef(null);
  const [selectedMaker, setSelectedMaker] = useState(dataSet[0].Make);
  const [selectedInsight, setSelectedInsight] = useState("bar");

  console.log("selectedMaker", selectedMaker);

  if (!dataSet || dataSet.length === 0) {
    return <div>No data available for the chart.</div>;
  }

  // Extract unique makers
  const uniqueMakers = [...new Set(dataSet.map((vehicle) => vehicle.Make))];
  console.log("unique", uniqueMakers);

  // Filter data based on selected maker
  const filteredData = selectedMaker
    ? dataSet.filter((vehicle) => vehicle.Make === selectedMaker)
    : [];

  // Count models for the selected maker
  const modelCounts = filteredData.reduce((acc, vehicle) => {
    acc[vehicle.Model] = (acc[vehicle.Model] || 0) + 1;
    return acc;
  }, {});

  // Prepare chart data for the Bar chart
  const chartData = {
    labels: Object.keys(modelCounts),
    datasets: [
      {
        label: `Number of Vehicles (${selectedMaker})`,
        data: Object.values(modelCounts),
        backgroundColor: [
          "#0d9488",
          "#2563eb",
          "#f97316",
          "#84cc16",
          "#d946ef",
        ],
        borderColor: ["#115e59", "#1d4ed8", "#c2410c", "#659f11", "#b71ba1"],
        borderWidth: 1,
      },
    ],
  };

  // Extract unique vehicle models for "Range per $1,000 MSRP"
  const uniqueModels = [
    ...new Set(filteredData.map((item) => `${item.Make} ${item.Model}`)), // Unique model names
  ];

  // Prepare chart data for the Range per $1,000 MSRP chart with unique models
  const rangeChartData = {
    labels: uniqueModels, // Use unique vehicle model names
    datasets: [
      {
        label: "Range per $1,000 MSRP",
        data: uniqueModels.map((uniqueModel) => {
          const vehicle = filteredData.find((item) => `${item.Make} ${item.Model}` === uniqueModel);
          const range = vehicle["Electric Range"] || 0;
          const msrp = vehicle["Base MSRP"] || 1; // Avoid division by 0
          return (range / msrp) * 1000;
        }),
        backgroundColor: "#2563eb",
        hoverBackgroundColor: "#1d4ed8",
      },
    ],
  };

  const RangeOptions = {
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
  const ModalOptions = {
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
          text: "Number Of Vehicals",
          color: "#333",
        },
        beginAtZero: true,
      },
    },
  };


  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-primary-600 text-xl font-bold">Vehicle Data Insights by Maker</h2>
      <div className="my-4">
        <label htmlFor="maker" className="text-primary-600 font-semibold">
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

      {/* Buttons to switch between insights */}
      <div className="my-4">
        <button
          className={`p-2 m-2 border rounded ${selectedInsight === "bar" ? "bg-primary-600 text-white" : "bg-white text-primary-600"}`}
          onClick={() => setSelectedInsight("bar")}
        >
          Model Distribution by Maker
        </button>
      
        <button
          className={`p-2 m-2 border rounded ${selectedInsight === "range" ? "bg-primary-600 text-white" : "bg-white text-primary-600"}`}
          onClick={() => setSelectedInsight("range")}
        >
          Range per $1,000 MSRP
        </button>
      </div>
      <div className="h-full max-h-[500px] flex justify-center">
      {/* Conditional rendering of charts based on selected insight */}
      {selectedMaker && Object.keys(modelCounts).length > 0 ? (
        selectedInsight === "bar" ? (
          
          <Bar ref={chartRef} data={chartData} options={ModalOptions}/>
        ) 
         : selectedInsight === "range" ? (
          <Bar ref={chartRef} data={rangeChartData} options={RangeOptions} />
        ) : null
      ) : selectedMaker ? (
        <p className="text-gray-500">No data available for the selected maker.</p>
      ) : (
        <p className="text-gray-500">Please select a maker to view the chart.</p>
      )}
      </div>
    </div>
  );
};

export default MakerBasedAnalysis;
