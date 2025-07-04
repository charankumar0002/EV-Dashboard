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

const navItems = [
  { id: "EVGraph", label: "Electric Vehicle Graph", icon: FaChartBar },
  { id: "EVTypeDistribution", label: "EV Type Distribution", icon: FaCar },
  { id: "TopMakesModels", label: "Top Makes and Models", icon: FaIndustry },
  { id: "CAFVEligibility", label: "CAFV Eligibility Analysis", icon: FaRegLightbulb },
  { id: "GeographicalDistribution", label: "Geographical Distribution", icon: FaMapMarkedAlt },
  { id: "MakerBasedAnalysis", label: "Maker Based Analysis", icon: FaIndustry },
];

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

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-60 bg-white p-4 shadow-md space-y-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                activeTab === id ? "bg-teal-600 text-white" : "text-teal-600 hover:bg-teal-50"
              }`}
            >
              <Icon size={20} className="mr-2" />
              {label}
            </button>
          ))}
        </aside>

        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="min-h-[600px] flex items-center justify-center">
            {activeTab === "EVGraph" && <ElectricVehicleGraph data={data} />}
            {activeTab === "EVTypeDistribution" && <EVTypeDistribution data={data} />}
            {activeTab === "TopMakesModels" && <TopMakesModels data={data} />}
            {activeTab === "CAFVEligibility" && <EligibilityAnalysis data={data} />}
            {activeTab === "GeographicalDistribution" && <GeographicalInsights data={data} />}
            {activeTab === "MakerBasedAnalysis" && <MakerBasedAnalysis data={data} />}
            {activeTab === "AgeDistribution" && <VehicleAgeDistribution data={data} />}
            {activeTab === "RangeVsMSRP" && <RangeVsMSRPScatter data={data} />}
          </div>
        </main>
      </div>

      <footer className="bg-primary-600 text-white p-4 text-center">
        <p>© 2025 Electric Vehicle Dashboard</p>
      </footer>
    </div>
  );
};

export default Dashboard;
