import { useEffect, useState } from "react";
import axios from "axios";

const TopBars = () => {
  const [topBars, setTopBars] = useState([]);
  const [visitedBars, setVisitedBars] = useState([]);

  useEffect(() => {
    // Fetch top 100 bars
    axios.get("http://localhost:3001/api/topbars")
      .then(res => setTopBars(res.data))
      .catch(err => console.error("❌ Failed to fetch top bars:", err));

    // Fetch all visited bars
    axios.get("http://localhost:3001/api/barvisits")
      .then(res => {
        const visitedNames = res.data.map(v => v.bar);
        setVisitedBars(visitedNames);
      })
      .catch(err => console.error("❌ Failed to fetch visited bars:", err));
  }, []);

  const isVisited = (barName) => visitedBars.includes(barName);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">🍸 Asia’s Top 100 Bars</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topBars.map((bar, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg shadow transition-all ${
              isVisited(bar.name) ? "bg-green-100 border border-green-400" : "bg-white"
            }`}
          >
            <h3 className="font-bold text-lg mb-1">
              #{bar.rank} — {bar.name}
            </h3>
            <p className="text-sm text-gray-700">{bar.address}</p>
            <p className="text-sm text-gray-500">{bar.city}, {bar.country}</p>
            {bar.imageUrl && (
              <img src={bar.imageUrl} alt={bar.name} className="mt-2 rounded shadow-md h-40 object-cover w-full" />
            )}
            {isVisited(bar.name) && (
              <span className="mt-2 inline-block text-sm font-medium text-green-700">✅ Visited</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBars;
