"use client";
import { useState } from "react";
import { api } from "../_utils/GlobalApi";

const usePostData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (url, requestData) => {
    try {
      setLoading(true);
      const response = await api.post(url, requestData);

      if (!response.status == 200) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.data;
      setData(responseData);
      setError(null);
    } catch (error) {
      setError(error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postData };
};

export default usePostData;
