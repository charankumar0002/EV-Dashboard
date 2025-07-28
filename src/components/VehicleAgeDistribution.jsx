import { useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const VehicleAgeDistribution = ({ data }) => {
  const chartRef = useRef(null);
  const dataSet = data;
  const currentYear = new Date().getFullYear();

  if (!dataSet || dataSet.length === 0) {
    return <div>No data available for the chart.</div>;
  }

  // Calculate vehicle age distribution
  const ageCounts = dataSet.reduce((acc, item) => {
    const age = currentYear - Number(item["Model Year"]);
    acc[age] = (acc[age] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(ageCounts)
    .map((age) => Number(age))
    .sort((a, b) => a - b);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Number of Vehicles",
        data: labels.map((age) => ageCounts[age]),
        backgroundColor: "#4ade80",
        hoverBackgroundColor: "#16a34a",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Vehicle Age Distribution",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.parsed.y} vehicles`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Age (years)",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Vehicles",
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-teal-600 text-xl font-bold mb-4">Vehicle Age Distribution</h2>
      <div className="h-full max-h-[500px] flex justify-center">
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default VehicleAgeDistribution;
