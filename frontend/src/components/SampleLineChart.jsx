import PropTypes from "prop-types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function SampleLineChart({ data = [] }) {
  // Aggregate by year
  const yearCounts = data.reduce((acc, item) => {
    const year = item["Model Year"];
    if (!year) return acc;
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.keys(yearCounts)
    .sort()
    .map((year) => ({ year, EVs: yearCounts[year] }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="year" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff', border: 'none' }} />
          <Line type="monotone" dataKey="EVs" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

SampleLineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

export default SampleLineChart; 