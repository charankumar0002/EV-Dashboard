import PropTypes from "prop-types";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function SampleScatterChart({ data = [] }) {
  // Filter for valid range and msrp
  const chartData = data
    .filter((item) => item["Electric Range"] > 0 && item["Base MSRP"] > 0)
    .map((item) => ({
      range: item["Electric Range"],
      msrp: item["Base MSRP"],
      label: `${item.Make} ${item.Model} (${item["Model Year"]})`,
    }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={250}>
        <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="range" name="Range (mi)" stroke="#6b7280" />
          <YAxis dataKey="msrp" name="MSRP ($)" stroke="#6b7280" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1f2937', color: '#fff', border: 'none' }} />
          <Scatter name="EVs" data={chartData} fill="#06b6d4" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

SampleScatterChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

export default SampleScatterChart; 