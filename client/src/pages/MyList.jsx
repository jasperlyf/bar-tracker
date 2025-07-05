import { useEffect, useState } from "react";
import axios from "axios";

const MyList = () => {
  const [savedBars, setSavedBars] = useState([]);
  const [filteredBars, setFilteredBars] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [visitPopupBar, setVisitPopupBar] = useState(null);
  const [infoPopupBar, setInfoPopupBar] = useState(null);
  const [visits, setVisits] = useState([]);
  const [newVisit, setNewVisit] = useState({
    bar: "",
    address: "",
    country: "",
    date: "",
    ratings: { vibe: 3, service: 3, drinks: 3 },
  });

  useEffect(() => {
    fetchSavedBars();
    fetchVisits();
  }, []);

  const fetchSavedBars = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/mylist");
      setSavedBars(res.data);
      setFilteredBars(res.data);
    } catch (err) {
      console.error("Failed to load saved bars:", err);
    }
  };

  const fetchVisits = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/barvisits");
      setVisits(res.data);
    } catch (err) {
      console.error("Failed to fetch visits:", err);
    }
  };

  const handleRemove = async (id) => {
    if (!confirm("Remove this bar from your list?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/mylist/${id}`);
      fetchSavedBars();
    } catch (err) {
      console.error("Failed to remove bar:", err);
    }
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setFilteredBars(
      country === "All"
        ? savedBars
        : savedBars.filter((bar) => bar.country === country)
    );
  };

  const handleAddVisit = async () => {
    if (!newVisit.bar || !newVisit.date) {
      alert("Please fill in the date.");
      return;
    }

    const barInfo = savedBars.find((b) => b.name === newVisit.bar);
    if (!barInfo) {
      alert("Bar details not found.");
      return;
    }

    const payload = {
      bar: newVisit.bar,
      address: barInfo.address,
      country: barInfo.country,
      date: newVisit.date,
      ratings: newVisit.ratings,
    };

    try {
      await axios.post("http://localhost:3001/api/barvisits", payload);
      setVisitPopupBar(null);
      fetchVisits();
      setNewVisit({
        bar: "",
        address: "",
        country: "",
        date: "",
        ratings: { vibe: 3, service: 3, drinks: 3 },
      });
    } catch (err) {
      console.error(
        "❌ Failed to add visit:",
        err.response?.data || err.message
      );
    }
  };

  const visitsByBar = visits.reduce((map, visit) => {
    if (!map[visit.bar]) map[visit.bar] = [];
    map[visit.bar].push(visit);
    return map;
  }, {});

  const uniqueCountries = [
    "All",
    ...new Set(savedBars.map((bar) => bar.country)),
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">📌 My List</h2>

      <div className="mb-4">
        <label className="text-sm font-medium mr-2">Filter by Country:</label>
        <select
          className="border px-2 py-1 rounded"
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
        >
          {uniqueCountries.map((country, idx) => (
            <option key={idx} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {filteredBars.length === 0 ? (
        <p className="text-gray-600">No bars found for selected country.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBars.map((bar) => {
            const visitsForBar = visitsByBar[bar.name] || [];
            const visited = visitsForBar.length > 0;
            const avgRating = visited
              ? (
                  visitsForBar.reduce((sum, v) => {
                    const r = v.ratings || {};
                    return (
                      sum +
                      ((r.vibe ?? 0) + (r.service ?? 0) + (r.drinks ?? 0)) / 3
                    );
                  }, 0) / visitsForBar.length
                ).toFixed(1)
              : null;

            const lastVisit = visited
              ? new Date(
                  visitsForBar
                    .map((v) => new Date(v.date))
                    .sort((a, b) => b - a)[0]
                ).toLocaleDateString()
              : null;

            return (
              <div
                key={bar._id}
                className={`relative rounded-lg shadow border p-4 cursor-pointer transition ${
                  visited ? "bg-green-50 border-green-300" : "bg-white"
                }`}
                onClick={() =>
                  visited
                    ? setInfoPopupBar({
                        ...bar,
                        avgRating,
                        lastVisit,
                        count: visitsForBar.length,
                      })
                    : null
                }
              >
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setVisitPopupBar(bar.name);
                      setNewVisit((prev) => ({
                        ...prev,
                        bar: bar.name,
                        date: "",
                      }));
                    }}
                    className="p-1 rounded-full bg-white shadow hover:bg-gray-100"
                    title="Add Visit"
                  >
                    <span className="text-xl font-bold text-green-700">＋</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(bar._id);
                    }}
                    className="p-1 rounded-full bg-white shadow hover:bg-gray-100"
                    title="Remove from My List"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      className="w-5 h-5 text-red-600"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <h3 className="text-lg font-semibold">{bar.name}</h3>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Visit Modal */}
      {visitPopupBar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 w-full max-w-md">
            <h3 className="text-lg font-semibold">
              ➕ Add Visit for {visitPopupBar}
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Visit
              </label>
              <input
                type="date"
                className="w-full border px-2 py-1 rounded"
                value={newVisit.date}
                onChange={(e) =>
                  setNewVisit({ ...newVisit, date: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {["vibe", "service", "drinks"].map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                    {key}
                  </label>
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={newVisit.ratings[key]}
                    onChange={(e) =>
                      setNewVisit({
                        ...newVisit,
                        ratings: {
                          ...newVisit.ratings,
                          [key]: Number(e.target.value),
                        },
                      })
                    }
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} ⭐
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setVisitPopupBar(null)}
                className="text-sm text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVisit}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Add Visit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {infoPopupBar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-2 w-full max-w-md">
            <h3 className="text-xl font-bold">{infoPopupBar.name}</h3>
            <p className="text-sm text-green-800">
              ✅ Visits: {infoPopupBar.count}
              <br />⭐ Avg Rating: {infoPopupBar.avgRating}
              <br />
              📅 Last Visit: {infoPopupBar.lastVisit}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInfoPopupBar(null)}
                className="text-sm text-gray-500 hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyList;
