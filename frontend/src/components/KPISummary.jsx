import React from "react";
import PropTypes from "prop-types";
import CountUp from 'react-countup';

const KPISummary = ( data ) => {
  const dataSet = data.data;
  const totalVehicles = dataSet.length;
  // The dataset stores eligibility information under
  // "Clean Alternative Fuel Vehicle (CAFV) Eligibility".
  // Using the wrong field name results in zero eligible vehicles.
  const cafvEligible = dataSet.filter(
    (item) => item["Clean Alternative Fuel Vehicle (CAFV) Eligibility"] ===
      "Clean Alternative Fuel Vehicle Eligible"
  ).length;
  const avgMsrp = (dataSet.reduce((sum, item) => sum + (item["Base MSRP"] || 0), 0) / totalVehicles).toFixed(2);
  const avgRange = (dataSet.reduce((sum, item) => sum + (item["Electric Range"] || 0), 0) / totalVehicles).toFixed(1);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Vehicles */}
      <div className="bg-white p-4 shadow rounded-lg text-center">
        <h3 className="text-xl font-semibold">Total Vehicles</h3>
        <CountUp start={0} end={totalVehicles} duration={2} separator="," className="text-2xl font-bold text-primary-600" />
      </div>

      {/* CAFV Eligible */}
      <div className="bg-white p-4 shadow rounded-lg text-center">
        <h3 className="text-xl font-semibold">CAFV Eligible (%)</h3>
        <CountUp start={0} end={((cafvEligible / totalVehicles) * 100).toFixed(1)} duration={2} decimals={1} className="text-2xl font-bold text-primary-600" />
      </div>

      {/* Average MSRP */}
      <div className="bg-white p-4 shadow rounded-lg text-center">
        <h3 className="text-xl font-semibold">Average MSRP</h3>
        <CountUp start={0} end={avgMsrp} duration={2} decimals={2} prefix="$" className="text-2xl font-bold text-primary-600" />
      </div>

      {/* Average Electric Range */}
      <div className="bg-white p-4 shadow rounded-lg text-center">
        <h3 className="text-xl font-semibold">Average Electric Range</h3>
        <CountUp start={0} end={avgRange} duration={2} decimals={1} suffix=" miles" className="text-2xl font-bold text-primary-600" />
      </div>
    </div>
  );
};

KPISummary.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default KPISummary;
