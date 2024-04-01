"use client";

import { useEffect, useState } from "react";
import { api } from "../_utils/GlobalApi";

function useFetchData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(url);
  }, [url]);

  const fetchData = async (url) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(url);

      if (!response.status == 200) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.data;
      setData(jsonData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error };
}

export default useFetchData;
