import { useState, useEffect } from "react";
import ElectricVehicleGraph from "../components/ElectricVehicleGraph";
import EVTypeDistribution from "../components/EVTypeDistribution";
import GeographicalInsights from "../components/GeographicalInsights";
import EligibilityAnalysis from "../components/EligibilityAnalysis";
import KPISummary from "../components/KPISummary";
import TopMakesModels from "../components/TopMakesModels";
import MakerBasedAnalysis from "../components/MakerBasedAnalysis";
import { FaChartBar, FaCar, FaMapMarkedAlt, FaIndustry, FaRegLightbulb } from 'react-icons/fa';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("EVGraph");

  const fetchData = async () => {
    try {
      const response = await fetch(`/EVPopulationData.json`);
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen text-black flex flex-col">

      <header className="bg-teal-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-center">Electric Vehicle Dashboard</h1>
      </header>

      <section className="p-4 sm:p-6">
        <KPISummary data={data} />
      </section>

      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Tab Navigation Buttons */}
        <section className="mb-6">
          <div className="flex justify-start space-x-4">
            <button
              onClick={() => handleTabChange("EVGraph")}
              className={`text-xl font-semibold px-4 py-2 rounded-lg ${activeTab === "EVGraph" ? "bg-teal-600 text-white" : "bg-white text-teal-600"}`}
            >
              <FaChartBar size={20} className="mr-2" />
              Electric Vehicle Graph
            </button>
            <button
              onClick={() => handleTabChange("EVTypeDistribution")}
              className={`text-xl font-semibold px-4 py-2 rounded-lg ${activeTab === "EVTypeDistribution" ? "bg-teal-600 text-white" : "bg-white text-teal-600"}`}
            >
              <FaCar size={20} className="mr-2" />
              EV Type Distribution
            </button>
            <button
              onClick={() => handleTabChange("TopMakesModels")}
              className={`text-xl font-semibold px-4 py-2 rounded-lg ${activeTab === "TopMakesModels" ? "bg-teal-600 text-white" : "bg-white text-teal-600"}`}
            >
              <FaIndustry size={20} className="mr-2" />
              Top Makes and Models
            </button>
            <button
              onClick={() => handleTabChange("CAFVEligibility")}
              className={`text-xl font-semibold px-4 py-2 rounded-lg ${activeTab === "CAFVEligibility" ? "bg-teal-600 text-white" : "bg-white text-teal-600"}`}
            >
              <FaRegLightbulb size={20} className="mr-2" />
              CAFV Eligibility Analysis
            </button>
            <button
              onClick={() => handleTabChange("GeographicalDistribution")}
              className={`text-xl font-semibold px-4 py-2 rounded-lg ${activeTab === "GeographicalDistribution" ? "bg-teal-600 text-white" : "bg-white text-teal-600"}`}
            >
              <FaMapMarkedAlt size={20} className="mr-2" />
              Geographical Distribution
            </button>
            <button
              onClick={() => handleTabChange("MakerBasedAnalysis")}
              className={`text-xl font-semibold px-4 py-2 rounded-lg ${activeTab === "MakerBasedAnalysis" ? "bg-teal-600 text-white" : "bg-white text-teal-600"}`}
            >
              <FaIndustry size={20} className="mr-2" />
              Maker Based Analysis
            </button>
          </div>
        </section>

        {/* Graph Rendering */}
        <section className="">
          <div className="h-72"> {/* Set a fixed height for the graphs */}
            {activeTab === "EVGraph" && <ElectricVehicleGraph data={data} />}
            {activeTab === "EVTypeDistribution" && <EVTypeDistribution data={data} />}
            {activeTab === "TopMakesModels" && <TopMakesModels data={data} />}
            {activeTab === "CAFVEligibility" && <EligibilityAnalysis data={data} />}
            {activeTab === "GeographicalDistribution" && <GeographicalInsights data={data} />}
            {activeTab === "MakerBasedAnalysis" && <MakerBasedAnalysis data={data} />}
          </div>
        </section>
      </main>

      <footer className="bg-teal-600 text-white p-4 text-center">
        <p>© 2025 Electric Vehicle Dashboard</p>
      </footer>
    </div>
  );
};

export default Dashboard;
