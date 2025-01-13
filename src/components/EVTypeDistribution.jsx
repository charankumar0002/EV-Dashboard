import { useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const EVTypeDistribution = ( data ) => {
  const dataSet = data?.data;
  const chartRef = useRef(null);

  if (!dataSet || dataSet.length === 0) {
    return <div>No data available for the chart.</div>;
  }

  const evTypes = dataSet.reduce((acc, ev) => {
    const type = ev["Electric Vehicle Type"];
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(evTypes),
    datasets: [
      {
        data: Object.values(evTypes),
        backgroundColor: ["#008080", "#f97316", "#60a5fa"],
        hoverBackgroundColor: ["#005f5f", "#c65a09", "#3b82f6"],
      },
    ],
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-teal-600 text-xl font-bold mb-4">EV Type Distribution</h2>
      <div className="h-full max-h-[500px] flex justify-center">
        <Pie ref={chartRef} data={chartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default EVTypeDistribution;
