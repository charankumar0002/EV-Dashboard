import PropTypes from "prop-types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#06b6d4', '#818cf8', '#f59e42'];

function SamplePieChart({ data = [] }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-gray-500">No data available for pie chart.</div>;
  }
  // Aggregate by EV type
  const typeCounts = data.reduce((acc, item) => {
    const type = item["Electric Vehicle Type"];
    if (!type) return acc;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(typeCounts).map(([type, value]) => ({ type, value }));

  if (chartData.length === 0) {
    return <div className="text-gray-500">No data available for pie chart.</div>;
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="type" cx="50%" cy="50%" outerRadius={80} label>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff', border: 'none' }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

SamplePieChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

export default SamplePieChart;