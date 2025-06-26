import { Line } from "react-chartjs-2";
import PropTypes from "prop-types";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ElectricVehicleGraph = (data ) => {

  const dataSet = data.data
  const aggregateDataByYear = (data) => {
    const aggregated = data.reduce((acc, vehicle) => {
      const year = vehicle["Model Year"];

      if (!acc[year]) {
        acc[year] = 0;
      }

      acc[year] += 1; 
      return acc;
    }, {});

    return aggregated;
  };

  const aggregatedData = aggregateDataByYear(dataSet);

  // Prepare chart data for the line chart
  const chartData = {
    labels: Object.keys(aggregatedData), // Years as x-axis labels
    datasets: [
      {
        label: "Electric Vehicles",
        data: Object.values(aggregatedData), // Count of vehicles per year
        fill: false,
        borderColor: "rgba(75,192,192,1)", // Line color
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="mt-8 bg-white p-6 shadow-lg rounded-lg">
    <h2 className="text-teal-600 text-xl mb-4">Electric Vehicle Adoption Over Time</h2>
    <div className="h-[500px] flex justify-center" > {/* Set the max height for the chart here */}
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Electric Vehicle Adoption Over Time",
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Year",
              },
            },
            y: {
              title: {
                display: true,
                text: "Number of Vehicles",
              },
              ticks: {
                beginAtZero: true,
              },
            },
          },
        }}
      />
    </div>
  </div>
  );
};

ElectricVehicleGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ElectricVehicleGraph;
