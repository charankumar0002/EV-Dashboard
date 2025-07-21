import PropTypes from "prop-types";

function KpiCard({ label, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
      <span className="text-gray-500 dark:text-gray-300">{label}</span>
      <span className="text-2xl font-bold text-gray-800 dark:text-white">{value}</span>
    </div>
  );
}

KpiCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

export default KpiCard; 