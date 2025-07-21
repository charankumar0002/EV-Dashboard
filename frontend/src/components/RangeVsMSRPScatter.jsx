import { useRef } from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  PointElement,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(PointElement, LinearScale, Tooltip, Legend, Title);

const RangeVsMSRPScatter = ({ data }) => {
  const chartRef = useRef(null);
  const dataSet = data;

  if (!dataSet || dataSet.length === 0) {
    return <div>No data available for the chart.</div>;
  }

  const filtered = dataSet.filter(
    (item) => item["Base MSRP"] > 0 && item["Electric Range"] > 0
  );

  const chartData = {
    datasets: [
      {
        label: "Vehicles",
        data: filtered.map((item) => ({
          x: item["Base MSRP"],
          y: item["Electric Range"],
          label: `${item.Make} ${item.Model} (${item["Model Year"]})`,
        })),
        backgroundColor: "#60a5fa",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Range vs. MSRP",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const { x, y, label } = context.raw;
            return `${label}: $${x}, ${y} mi`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Base MSRP (USD)",
        },
        beginAtZero: true,
      },
      y: {
        title: {
          display: true,
          text: "Electric Range (mi)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-teal-600 text-xl font-bold mb-4">Range vs. MSRP</h2>
      <div className="h-full max-h-[500px] flex justify-center">
        <Scatter ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RangeVsMSRPScatter;
