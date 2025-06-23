import { useEffect, useState } from "react";
import axios from "axios";

function TopBars() {
  const [bars, setBars] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/topbars")
      .then(res => setBars(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">🌏 Asia's Top 100 Bars</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2">Rank</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">City</th>
              <th className="px-3 py-2">Country</th>
              <th className="px-3 py-2">Address</th>
            </tr>
          </thead>
          <tbody>
            {bars.map((bar) => (
              <tr key={bar._id}>
                <td className="border px-3 py-2">{bar.rank}</td>
                <td className="border px-3 py-2">{bar.name}</td>
                <td className="border px-3 py-2">{bar.city}</td>
                <td className="border px-3 py-2">{bar.country}</td>
                <td className="border px-3 py-2">{bar.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopBars;
