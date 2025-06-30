import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [topBars, setTopBars] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/barvisits/top-rated")
      .then(res => setTopBars(res.data))
      .catch(err => console.error("Error loading top-rated bars", err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Top Rated Bars</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topBars.map((bar, idx) => (
          <li key={idx} className="border rounded-lg shadow-sm overflow-hidden">
            <img src={`https://source.unsplash.com/600x400/?bar,${bar.bar}`} alt={bar.bar} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="text-lg font-bold">{bar.bar}</h3>
                <p className="text-sm text-gray-600">
                Avg Rating: {bar.avgRating != null ? bar.avgRating.toFixed(1) : "N/A"} ⭐
                </p>
                <p className="text-sm text-gray-500">Visits: {bar.count}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
