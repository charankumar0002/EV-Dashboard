import { useState, useEffect } from "react";  
import ElectricVehicleGraph from "../components/ElectricVehicleGraph";
import EVTypeDistribution from "../components/EVTypeDistribution";
import DynamicVehiclePopularity from "../components/DynamicVehiclePopularity";


const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `/EVPopulationData.json`
      );
      const newData = await response.json();
      setData(newData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  

  if (loading) return <div>Loading...</div>;

  return (
<div className="bg-gray-100 min-h-screen text-black">
  {/* Navbar */}
  <header className="bg-teal-600 text-white p-4 sm:p-6 shadow-lg">
    <h1 className="text-2xl sm:text-3xl font-bold text-center">
      Electric Vehicle Dashboard
    </h1>
  </header>

  {/* Main Content */}
  <main className="p-4 sm:p-6 lg:p-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {/* Card: Electric Vehicle Graph */}
      <div className="">
        <h2 className="text-lg font-semibold mb-4">Electric Vehicle Graph</h2>
        <ElectricVehicleGraph data={data} />
      </div>

      {/* Card: EV Type Distribution */}
      <div className="">
        <h2 className="text-lg font-semibold mb-4">EV Type Distribution</h2>
        <EVTypeDistribution data={data} />
      </div>

      {/* Card: Dynamic Vehicle Popularity */}
      <div className="">
        <h2 className="text-lg font-semibold mb-4">Dynamic Vehicle Popularity</h2>
        <DynamicVehiclePopularity data={data} />
      </div>
    </div>
  </main>
</div>


  );
};

export default Dashboard;
