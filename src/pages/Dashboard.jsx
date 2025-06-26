import { useState } from "react";
import ElectricVehicleGraph from "../components/ElectricVehicleGraph";
import EVTypeDistribution from "../components/EVTypeDistribution";
import GeographicalInsights from "../components/GeographicalInsights";
import EligibilityAnalysis from "../components/EligibilityAnalysis";
import KPISummary from "../components/KPISummary";
import TopMakesModels from "../components/TopMakesModels";
import MakerBasedAnalysis from "../components/MakerBasedAnalysis";
import { FaChartBar, FaCar, FaMapMarkedAlt, FaIndustry, FaRegLightbulb, FaLayerGroup, FaChartLine } from 'react-icons/fa';
import VehicleAgeDistribution from "../components/VehicleAgeDistribution";
import RangeVsMSRPScatter from "../components/RangeVsMSRPScatter";
import useRealTimeData from "../hooks/useRealTimeData";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("EVGraph");
  const apiUrl = import.meta.env.VITE_EV_API_URL || "/EVPopulationData.json";
  const { data, loading } = useRealTimeData(apiUrl, 30000);

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

      <header className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-center tracking-wide">Electric Vehicle Dashboard</h1>
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
              className={`text-xl font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${activeTab === "EVGraph" ? "bg-teal-600 text-white" : "bg-white text-teal-600 hover:bg-teal-50"}`}
            >
              <FaChartBar size={20} className="mr-2" />
              Electric Vehicle Graph
            </button>
            <button
              onClick={() => handleTabChange("EVTypeDistribution")}
              className={`text-xl font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${activeTab === "EVTypeDistribution" ? "bg-teal-600 text-white" : "bg-white text-teal-600 hover:bg-teal-50"}`}
            >
              <FaCar size={20} className="mr-2" />
              EV Type Distribution
            </button>
            <button
              onClick={() => handleTabChange("TopMakesModels")}
              className={`text-xl font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${activeTab === "TopMakesModels" ? "bg-teal-600 text-white" : "bg-white text-teal-600 hover:bg-teal-50"}`}
            >
              <FaIndustry size={20} className="mr-2" />
              Top Makes and Models
            </button>
            <button
              onClick={() => handleTabChange("CAFVEligibility")}
              className={`text-xl font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${activeTab === "CAFVEligibility" ? "bg-teal-600 text-white" : "bg-white text-teal-600 hover:bg-teal-50"}`}
            >
              <FaRegLightbulb size={20} className="mr-2" />
              CAFV Eligibility Analysis
            </button>
            <button
              onClick={() => handleTabChange("GeographicalDistribution")}
              className={`text-xl font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${activeTab === "GeographicalDistribution" ? "bg-teal-600 text-white" : "bg-white text-teal-600 hover:bg-teal-50"}`}
            >
              <FaMapMarkedAlt size={20} className="mr-2" />
              Geographical Distribution
            </button>
            <button
              onClick={() => handleTabChange("MakerBasedAnalysis")}
              className={`text-xl font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${activeTab === "MakerBasedAnalysis" ? "bg-teal-600 text-white" : "bg-white text-teal-600 hover:bg-teal-50"}`}
            >
              <FaIndustry size={20} className="mr-2" />
              Maker Based Analysis
            </button>
            <button
              onClick={() => handleTabChange("AgeDistribution")}
              className={`text-xl font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${activeTab === "AgeDistribution" ? "bg-teal-600 text-white" : "bg-white text-teal-600 hover:bg-teal-50"}`}
            >
              <FaLayerGroup size={20} className="mr-2" />
              Vehicle Age Distribution
            </button>
            <button
              onClick={() => handleTabChange("RangeVsMSRP")}
              className={`text-xl font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${activeTab === "RangeVsMSRP" ? "bg-teal-600 text-white" : "bg-white text-teal-600 hover:bg-teal-50"}`}
            >
              <FaChartLine size={20} className="mr-2" />
              Range vs MSRP
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
            {activeTab === "AgeDistribution" && <VehicleAgeDistribution data={data} />}
            {activeTab === "RangeVsMSRP" && <RangeVsMSRPScatter data={data} />}
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
