import PropTypes from "prop-types";

function Insights({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="text-gray-500">No data available for insights.</div>;
  }

  // Market Share: Top Make
  const makeCounts = data.reduce((acc, item) => {
    acc[item.Make] = (acc[item.Make] || 0) + 1;
    return acc;
  }, {});
  const [topMake, topMakeCount] = Object.entries(makeCounts).sort((a, b) => b[1] - a[1])[0] || ["-", 0];
  const marketShare = ((topMakeCount / data.length) * 100).toFixed(1);

  // Year-over-Year Growth
  const yearCounts = data.reduce((acc, item) => {
    const year = item["Model Year"];
    if (!year) return acc;
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});
  const years = Object.keys(yearCounts).sort();
  const lastYear = years[years.length - 1];
  const prevYear = years[years.length - 2];
  const yoyGrowth = prevYear && lastYear ? (((yearCounts[lastYear] - yearCounts[prevYear]) / yearCounts[prevYear]) * 100).toFixed(1) : null;

  // Cost Efficiency: Best Range per Dollar
  const bestEfficiency = data
    .filter((item) => item["Electric Range"] > 0 && item["Base MSRP"] > 0)
    .map((item) => ({
      model: `${item.Make} ${item.Model}`,
      value: item["Electric Range"] / item["Base MSRP"],
    }))
    .sort((a, b) => b.value - a.value)[0];

  // Regional Hotspot: Most Popular County
  const regionCounts = data.reduce((acc, item) => {
    const region = item.County || item.City || item.State;
    if (!region) return acc;
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {});
  const [topRegion, topRegionCount] = Object.entries(regionCounts).sort((a, b) => b[1] - a[1])[0] || ["-", 0];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Market Share */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Market Share Leader</h3>
        <p className="text-2xl font-semibold text-teal-600 dark:text-teal-400">{topMake} <span className="text-base font-normal">({marketShare}% of all EVs)</span></p>
        <p className="text-gray-500 mt-1">{topMake} is the most popular make in the dataset, representing {marketShare}% of all EVs.</p>
      </div>
      {/* Year-over-Year Growth */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Year-over-Year Growth</h3>
        {yoyGrowth !== null ? (
          <>
            <p className="text-2xl font-semibold text-teal-600 dark:text-teal-400">{yoyGrowth}%</p>
            <p className="text-gray-500 mt-1">EV registrations grew {yoyGrowth}% from {prevYear} to {lastYear}.</p>
          </>
        ) : (
          <p className="text-gray-500">Not enough data for year-over-year growth.</p>
        )}
      </div>
      {/* Cost Efficiency */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Best Range per Dollar</h3>
        {bestEfficiency ? (
          <>
            <p className="text-2xl font-semibold text-teal-600 dark:text-teal-400">{bestEfficiency.model}</p>
            <p className="text-gray-500 mt-1">Offers the best range per dollar: {(bestEfficiency.value * 1000).toFixed(1)} mi per $1,000.</p>
          </>
        ) : (
          <p className="text-gray-500">Not enough data for cost efficiency analysis.</p>
        )}
      </div>
      {/* Regional Hotspot */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Regional Hotspot</h3>
        <p className="text-2xl font-semibold text-teal-600 dark:text-teal-400">{topRegion}</p>
        <p className="text-gray-500 mt-1">This region has the highest number of EVs ({topRegionCount}).</p>
      </div>
    </section>
  );
}

Insights.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

export default Insights; 