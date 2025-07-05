import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [topRated, setTopRated] = useState([]);
  const [mostVisited, setMostVisited] = useState([]);
  const [countryFilter, setCountryFilter] = useState("All");
  const [allCountries, setAllCountries] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/barvisits/top-rated")
      .then((res) => {
        setTopRated(res.data);
      })
      .catch((err) => console.error("❌ Error loading top-rated bars", err));

    axios
      .get("http://localhost:3001/api/barvisits")
      .then((res) => {
        const countMap = {};
        const countrySet = new Set();

        res.data.forEach((visit) => {
          countrySet.add(visit.country);
          if (!countMap[visit.bar]) countMap[visit.bar] = [];
          countMap[visit.bar].push(visit);
        });

        const sorted = Object.entries(countMap)
          .map(([bar, visits]) => ({
            bar,
            country: visits[0].country,
            count: visits.length,
            avgRating: (
              visits.reduce(
                (sum, v) =>
                  sum +
                  ((v.ratings?.vibe ?? 0) +
                    (v.ratings?.service ?? 0) +
                    (v.ratings?.drinks ?? 0)) /
                    3,
                0
              ) / visits.length
            ).toFixed(1),
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        setMostVisited(sorted);
        setAllCountries(["All", ...Array.from(countrySet).sort()]);
      })
      .catch((err) => console.error("❌ Error loading most visited bars", err));
  }, []);

  const filteredTopRated =
    countryFilter === "All"
      ? topRated
      : topRated.filter((bar) => bar.country === countryFilter);

  const filteredMostVisited =
    countryFilter === "All"
      ? mostVisited
      : mostVisited.filter((bar) => bar.country === countryFilter);

  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-bold text-gray-800">🏠 Home</h2>

      {/* Country Filter */}
      <div className="mb-6">
        <label className="text-sm font-medium mr-2">Filter by Country:</label>
        <select
          className="border px-2 py-1 rounded"
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
        >
          {allCountries.map((country, idx) => (
            <option key={idx} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* Top Rated Bars */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800">
          ⭐ Top Rated Bars
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopRated.map((bar, idx) => (
            <div
              key={idx}
              className="bg-white border rounded-lg shadow-md hover:shadow-lg transition p-4"
            >
              {/* <img
                src={`https://source.unsplash.com/600x400/?bar,${bar.bar}`}
                alt={bar.bar}
                className="w-full h-48 object-cover rounded-t"
              /> */}
              <h4 className="text-lg font-bold">{bar.bar}</h4>
              <p className="text-sm text-gray-600">Country: {bar.country}</p>
              <p className="text-sm text-gray-600">
                Avg Rating: {bar.avgRating?.toFixed(1) ?? "N/A"} ⭐
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Most Visited Bars */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800">
          🔥 Most Visited Bars
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMostVisited.map((bar, idx) => (
            <div
              key={idx}
              className="bg-white border rounded-lg shadow-md hover:shadow-lg transition p-4"
            >
              {/* <img
                src={`https://source.unsplash.com/600x400/?bar,${bar.bar}`}
                alt={bar.bar}
                className="w-full h-48 object-cover rounded-t"
              /> */}
              <h4 className="text-lg font-bold">{bar.bar}</h4>
              <p className="text-sm text-gray-600">Country: {bar.country}</p>
              <p className="text-sm text-gray-600">Visits: {bar.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
