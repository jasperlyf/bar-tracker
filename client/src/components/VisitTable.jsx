import { useEffect, useState } from "react";
import axios from "axios";

function VisitTable() {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/barvisits")
      .then(res => setVisits(res.data))
      .catch(err => console.error("❌ Failed to load visits:", err));
  }, []);

  if (!visits.length) return <p className="text-gray-600">No visits logged yet.</p>;

  return (
    <table className="table-auto w-full text-left border">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-3 py-2">Date</th>
          <th className="px-3 py-2">Bar</th>
          <th className="px-3 py-2">Location</th>
          <th className="px-3 py-2">Drink</th>
          <th className="px-3 py-2">Cost</th>
          <th className="px-3 py-2">People</th>
        </tr>
      </thead>
      <tbody>
        {visits.map((v) => (
          <tr key={v._id}>
            <td className="border px-3 py-2">{v.date?.slice(0, 10)}</td>
            <td className="border px-3 py-2">{v.bar}</td>
            <td className="border px-3 py-2">{v.location}</td>
            <td className="border px-3 py-2">{v.drink}</td>
            <td className="border px-3 py-2">${v.cost}</td>
            <td className="border px-3 py-2">{v.people}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default VisitTable;
