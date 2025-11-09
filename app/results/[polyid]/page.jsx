"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const ResultPage = () => {
  const params = useParams();
  const polyid = params.polyid;

  const [soilData, setSoilData] = useState(null);
  const [polygonData, setPolygonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState(null);

  useEffect(() => {
    if (!polyid) return;

    let isMounted = true; // prevent state updates if unmounted
    let attempts = 0;
    const maxAttempts = 5;
    const delay = 3000; // 3 seconds

    const fetchSoilData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/soil/${polyid}`);
        const data = await res.json();
        if (isMounted) setSoilData(data);
      } catch (err) {
        console.error("Error fetching soil data:", err);
      }
    };

    const fetchPolygonData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/soil/polygon/${polyid}`
        );
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          if (isMounted) {
            setPolygonData(data);
            setLoading(false);
          }
        } else {
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(fetchPolygonData, delay);
          } else if (isMounted) {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Error fetching polygon data:", err);
        if (isMounted) setLoading(false);
      }
    };

    const fetchAiData = async () => {
      try {
        if (aiSummary) return; // already fetched
        const res = await fetch(`http://localhost:5000/api/ai/${polyid}`, {
          method: "POST",
        });
        const data = await res.json();
        console.log("AI Response:", data);
        setAiSummary(data.summary);
      } catch (err) {
        console.error("Error fetching AI data:", err);
      }
    };

    if (!aiSummary) {
      fetchAiData();
    }
    fetchSoilData();
    fetchPolygonData();

    return () => {
      isMounted = false;
    };
  }, [polyid]);

  const goBackToMap = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Results for Polygon: <span className="text-indigo-600">{polyid}</span>
      </h1>

      {/* SOIL DATA */}
      <section className="mb-12 bg-white shadow-md rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Basic Soil Data
        </h2>

        {soilData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(soilData).map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col items-center justify-center bg-indigo-50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  {key}
                </p>
                <p className="text-lg font-semibold text-indigo-700 mt-1">
                  {String(value) || "N/A"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No soil data available</p>
        )}
      </section>

      {/* POLYGON DATA */}
      <section className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Polygon NDVI / Historical Data
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600 mb-4"></div>
            <p className="text-gray-700 text-sm">Loading NDVI data...</p>
            <p className="text-gray-400 text-xs mt-1">
              This may take a few seconds for new polygons.
            </p>
          </div>
        ) : Array.isArray(polygonData) && polygonData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {polygonData.map((entry, index) => (
              <div
                key={index}
                className="bg-green-50 border border-green-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200"
              >
                <h3 className="text-lg font-semibold text-green-700 mb-3">
                  Entry {index + 1}
                </h3>
                <div className="space-y-4">
                  {/* {entry.cl !== undefined && (
                    <div className="bg-white border border-gray-100 rounded-xl p-3">
                      <p className="text-xs text-gray-500 uppercase">
                        Approximate Percentage of Clouds
                      </p>
                      <p className="text-sm font-semibold text-gray-800 mt-1">
                        {entry.cl}%
                      </p>
                    </div>
                  )} */}

                  {entry.data && (
                    <div className="bg-white border border-gray-100 rounded-xl p-3">
                      <p className="text-xs text-gray-500 uppercase mb-2">
                        NDVI Data
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(entry.data)
                          .filter(([key]) =>
                            [
                              "min",
                              "max",
                              "median",
                              "mean",
                              "p25",
                              "p75",
                            ].includes(key)
                          )
                          .map(([key, val]) => {
                            const labels = {
                              min: "NDVI Minimum",
                              max: "NDVI Maximum",
                              median: "NDVI Median",
                              mean: "NDVI Mean",
                              p25: "NDVI First Quartile (25th Percentile)",
                              p75: "NDVI Third Quartile (75th Percentile)",
                            };
                            return (
                              <div
                                key={key}
                                className="flex justify-between text-sm text-gray-700"
                              >
                                <span className="font-medium">
                                  {labels[key]}:
                                </span>
                                <span>{Number(val).toFixed(4)}</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No polygon data available</p>
        )}
        <section className="mt-12 bg-white shadow-md rounded-2xl p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            AI Summary of <span className="underline">last month - now</span>{" "}
            vegetation growth.
          </h2>
          {aiSummary ? (
            <p className="text-gray-700">{aiSummary}</p>
          ) : (
            <p className="text-gray-500">Loading AI summary...</p>
          )}
        </section>
      </section>

      <button
        onClick={goBackToMap}
        className="px-4 py-2 bg-purple-600 text-white rounded mt-8 hover:bg-purple-700 transition-colors duration-200"
      >
        Go back to map
      </button>
    </div>
  );
};

export default ResultPage;
