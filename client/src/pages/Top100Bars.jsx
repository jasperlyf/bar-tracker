// src/pages/Top100Bars.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const Top100Bars = () => {
  const [bars, setBars] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/topbars")
      .then((res) => setBars(res.data))
      .catch((err) => console.error("Failed to fetch top bars", err));
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">🌟 Asia’s Top 100 Bars</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bars.map((bar) => (
          <div key={bar._id} className="border rounded-lg overflow-hidden shadow hover:shadow-md transition">
            {bar.imageUrl && (
              <img src={bar.imageUrl} alt={bar.name} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold">{bar.rank}. {bar.name}</h3>
              <p className="text-sm text-gray-600">{bar.address}, {bar.city}, {bar.country}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Top100Bars;
