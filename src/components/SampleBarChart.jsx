import PropTypes from "prop-types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function SampleBarChart({ data = [] }) {
  // Aggregate by make
  const makeCounts = data.reduce((acc, item) => {
    const make = item.Make;
    if (!make) return acc;
    acc[make] = (acc[make] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(makeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([make, count]) => ({ make, count }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="make" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff', border: 'none' }} />
          <Bar dataKey="count" fill="#06b6d4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

SampleBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

export default SampleBarChart; 