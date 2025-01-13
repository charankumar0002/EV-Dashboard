import React from "react";

const TopMakesModels = ( data ) => {
    const dataSet= data.data
  const makeCounts = dataSet.reduce((acc, item) => {
    acc[item.Make] = (acc[item.Make] || 0) + 1;
    return acc;
  }, {});

  const sortedMakes = Object.entries(makeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Top 5 Makes</h3>
      <ul>
        {sortedMakes.map(([make, count], index) => (
          <li key={index} className="flex justify-between py-1">
            <span>{make}</span>
            <span className="font-bold">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopMakesModels;
