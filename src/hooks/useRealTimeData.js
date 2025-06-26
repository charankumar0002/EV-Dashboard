import { useState, useEffect } from "react";
import axios from "axios";

const useRealTimeData = (url, intervalMs = 30000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timerId;

    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    timerId = setInterval(fetchData, intervalMs);

    return () => {
      clearInterval(timerId);
    };
  }, [url, intervalMs]);

  return { data, loading };
};

export default useRealTimeData;
