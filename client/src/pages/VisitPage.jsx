import { useEffect, useState } from "react";
import axios from "axios";

const VisitTable = () => {
  const [visits, setVisits] = useState([]);
  const [topBars, setTopBars] = useState([]);
  const [barPopup, setBarPopup] = useState(null);
  const [editingVisit, setEditingVisit] = useState(null);
  const [formData, setFormData] = useState({});
  const [showMore, setShowMore] = useState(false);

  const [newVisit, setNewVisit] = useState({
    bar: "",
    address: "",
    country: "",
    date: "",
    ratings: { vibe: 3, service: 3, drinks: 3 },
  });

  useEffect(() => {
    fetchVisits();
    axios
      .get("http://localhost:3001/api/topbars")
      .then((res) => setTopBars(res.data));
  }, []);

  const fetchVisits = async () => {
    const res = await axios.get("http://localhost:3001/api/barvisits");
    setVisits(res.data);
  };

  const handleBarSelect = (barName) => {
    const match = topBars.find((b) => b.name === barName);
    if (match) {
      setNewVisit({
        ...newVisit,
        bar: match.name,
        address: match.address,
        country: match.country,
      });
    } else {
      setNewVisit({
        ...newVisit,
        bar: barName,
        address: "",
        country: "",
      });
    }
  };

  const handleAddVisit = async () => {
    if (!newVisit.bar || !newVisit.date) {
      alert("Please enter both bar name and date.");
      return;
    }

    const payload = {
      bar: newVisit.bar,
      date: newVisit.date,
      ratings: newVisit.ratings,
      ...(newVisit.address && { address: newVisit.address }),
      ...(newVisit.country && { country: newVisit.country }),
    };

    try {
      await axios.post("http://localhost:3001/api/barvisits", payload);
      setNewVisit({
        bar: "",
        address: "",
        country: "",
        date: "",
        ratings: { vibe: 3, service: 3, drinks: 3 },
      });
      setShowMore(false);
      fetchVisits();
    } catch (err) {
      console.error(
        "❌ Failed to add visit:",
        err.response?.data || err.message
      );
      alert("Error adding visit. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this visit?")) {
      await axios.delete(`http://localhost:3001/api/barvisits/${id}`);
      fetchVisits();
    }
  };

  const handleEditClick = (visit) => {
    setEditingVisit(visit._id);
    setFormData({ ...visit });
  };

  const handleUpdate = async () => {
    const payload = {
      ...formData,
      ratings: formData.ratings || { vibe: 3, service: 3, drinks: 3 },
    };

    try {
      await axios.put(
        `http://localhost:3001/api/barvisits/${editingVisit}`,
        payload
      );
      setEditingVisit(null);
      fetchVisits();
    } catch (err) {
      console.error("❌ Update failed:", err);
    }
  };

  const renderStars = (n) => "⭐".repeat(n || 0);

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">📝 Bar Visits</h2>

      {/* Quick Add */}
      <div className="bg-gray-50 border rounded p-4 mb-6 shadow-sm">
        <h3 className="text-md font-medium mb-3">➕ Quick Add</h3>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <label className="block text-xs mb-1">Bar</label>
            <input
              list="bar-options"
              placeholder="Bar name"
              className="border rounded px-2 py-1 w-full"
              value={newVisit.bar}
              onChange={(e) => handleBarSelect(e.target.value)}
            />
            <datalist id="bar-options">
              {topBars.map((b, idx) => (
                <option key={idx} value={b.name} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-xs mb-1">Date</label>
            <input
              type="date"
              className="border rounded px-2 py-1 w-full"
              value={newVisit.date}
              onChange={(e) =>
                setNewVisit({ ...newVisit, date: e.target.value })
              }
            />
          </div>
        </div>

        {showMore && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-xs mb-1">Address</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={newVisit.address}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Country</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={newVisit.country}
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              {["vibe", "service", "drinks"].map((field) => (
                <div key={field}>
                  <label className="block text-xs mb-1 capitalize">
                    {field}
                  </label>
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={newVisit.ratings[field]}
                    onChange={(e) =>
                      setNewVisit({
                        ...newVisit,
                        ratings: {
                          ...newVisit.ratings,
                          [field]: Number(e.target.value),
                        },
                      })
                    }
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} ⭐
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setShowMore((prev) => !prev)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showMore ? "Hide More Options" : "Show More Options"}
          </button>
          <button
            onClick={handleAddVisit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Visit
          </button>
        </div>
      </div>

      {/* Visit Table */}
      <table className="w-full text-sm border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-left">Bar</th>
            <th className="px-3 py-2 text-left">Date</th>
            <th className="px-3 py-2 text-left">Vibe</th>
            <th className="px-3 py-2 text-left">Service</th>
            <th className="px-3 py-2 text-left">Drinks</th>
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((visit) => (
            <tr key={visit._id} className="border-t">
              <td className="px-3 py-2">
                <button
                  onClick={() => setBarPopup(visit)}
                  className="text-blue-600 hover:underline"
                >
                  {visit.bar}
                </button>
              </td>
              <td className="px-3 py-2">{visit.date}</td>
              <td className="px-3 py-2">{renderStars(visit.ratings?.vibe)}</td>
              <td className="px-3 py-2">
                {renderStars(visit.ratings?.service)}
              </td>
              <td className="px-3 py-2">
                {renderStars(visit.ratings?.drinks)}
              </td>
              <td className="px-3 py-2 space-x-2">
                <button onClick={() => handleEditClick(visit)} title="Edit">
                  ✏️
                </button>
                <button onClick={() => handleDelete(visit._id)} title="Delete">
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bar Details Popup */}
      {barPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow max-w-sm w-full space-y-2">
            <h3 className="text-xl font-semibold">{barPopup.bar}</h3>
            <p className="text-sm text-gray-600">{barPopup.address}</p>
            <p className="text-sm text-gray-600">{barPopup.country}</p>
            <p className="text-sm text-gray-700">
              Vibe: {renderStars(barPopup.ratings?.vibe)} <br />
              Service: {renderStars(barPopup.ratings?.service)} <br />
              Drinks: {renderStars(barPopup.ratings?.drinks)}
            </p>
            <div className="text-right">
              <button
                onClick={() => setBarPopup(null)}
                className="text-sm text-blue-600 hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Visit Modal */}
      {editingVisit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow max-w-sm w-full space-y-4">
            <h3 className="text-lg font-semibold">✏️ Edit Visit</h3>
            <div>
              <label className="block text-xs mb-1">Date</label>
              <input
                type="date"
                className="w-full border px-2 py-1 rounded"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["vibe", "service", "drinks"].map((field) => (
                <div key={field}>
                  <label className="block text-xs mb-1 capitalize">
                    {field}
                  </label>
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={formData.ratings?.[field] || 3}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ratings: {
                          ...formData.ratings,
                          [field]: Number(e.target.value),
                        },
                      })
                    }
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} ⭐
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingVisit(null)}
                className="text-sm text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitTable;
