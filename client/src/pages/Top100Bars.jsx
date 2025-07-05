import { useEffect, useState } from "react";
import axios from "axios";

const TopBars = () => {
  const [topBars, setTopBars] = useState([]);
  const [visits, setVisits] = useState([]);
  const [myList, setMyList] = useState([]);
  const [countryFilter, setCountryFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [newVisit, setNewVisit] = useState({
    bar: "",
    address: "",
    country: "",
    date: "",
    ratings: { vibe: 3, service: 3, drinks: 3 },
  });
  const [modalBarData, setModalBarData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/topbars")
      .then((res) => setTopBars(res.data));
    axios
      .get("http://localhost:3001/api/barvisits")
      .then((res) => setVisits(res.data));
    axios
      .get("http://localhost:3001/api/mylist")
      .then((res) => setMyList(res.data));
  }, []);

  const visitsByBar = visits.reduce((map, visit) => {
    if (!map[visit.bar]) map[visit.bar] = [];
    map[visit.bar].push(visit);
    return map;
  }, {});

  const myListNames = new Set(myList.map((bar) => bar.name));
  const allCountries = Array.from(
    new Set(topBars.map((bar) => bar.country))
  ).sort();

  const getLastVisitDate = (visits) =>
    visits
      .map((v) => new Date(v.date))
      .sort((a, b) => b - a)[0]
      ?.toLocaleDateString();

  const calculateAvgRating = (barVisits) => {
    const total = barVisits.reduce((sum, v) => {
      const r = v.ratings || {};
      return sum + ((r.vibe || 0) + (r.service || 0) + (r.drinks || 0)) / 3;
    }, 0);
    return (total / barVisits.length).toFixed(1);
  };

  const handleSave = async (bar) => {
    const saved = myListNames.has(bar.name);
    try {
      if (saved) {
        const existing = myList.find((b) => b.name === bar.name);
        if (!existing) return;
        await axios.delete(`http://localhost:3001/api/mylist/${existing._id}`);
        setMyList((prev) => prev.filter((b) => b._id !== existing._id));
      } else {
        const res = await axios.post("http://localhost:3001/api/mylist", bar);
        setMyList((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.error("❌ Failed to toggle bookmark:", err);
    }
  };

  const openVisitModal = (bar) => {
    setNewVisit({
      bar: bar.name,
      address: bar.address,
      country: bar.country,
      date: "",
      ratings: { vibe: 3, service: 3, drinks: 3 },
    });
    setShowModal(true);
  };

  const openBarDetailModal = (bar) => {
    const barVisits = visitsByBar[bar.name] || [];
    setModalBarData({
      name: bar.name,
      address: bar.address,
      country: bar.country,
      visits: barVisits.length,
      avgRating: barVisits.length > 0 ? calculateAvgRating(barVisits) : "N/A",
      lastVisit: barVisits.length > 0 ? getLastVisitDate(barVisits) : "N/A",
    });
  };

  const submitVisit = async () => {
    try {
      const barInfo = topBars.find((b) => b.name === newVisit.bar);
      if (!barInfo) {
        alert("Bar info not found");
        return;
      }

      const payload = {
        bar: newVisit.bar,
        address: barInfo.address,
        country: barInfo.country,
        date: newVisit.date,
        ratings: newVisit.ratings,
      };

      await axios.post("http://localhost:3001/api/barvisits", payload);
      setShowModal(false);
      setNewVisit({
        bar: "",
        address: "",
        country: "",
        date: "",
        ratings: { vibe: 3, service: 3, drinks: 3 },
      });
    } catch (err) {
      console.error("❌ Failed to add visit:", err);
    }
  };

  const filteredBars =
    countryFilter === "All"
      ? topBars
      : topBars.filter((bar) => bar.country === countryFilter);

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">🍸 Asia’s Top 100 Bars</h2>
      <p className="text-sm text-gray-600">
        ✅ You've visited {Object.keys(visitsByBar).length} / {topBars.length}{" "}
        bars
      </p>

      {/* Filter */}
      <div className="mt-4">
        <label className="text-sm mr-2 font-medium">Filter by Country:</label>
        <select
          className="border px-2 py-1 rounded"
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
        >
          <option value="All">All</option>
          {allCountries.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBars.map((bar) => {
          const visited = visitsByBar[bar.name]?.length > 0;
          const saved = myListNames.has(bar.name);

          return (
            <div
              key={bar._id}
              className={`relative rounded-lg shadow border cursor-pointer transition overflow-hidden ${
                visited ? "bg-green-50 border-green-300" : "bg-white"
              }`}
              onClick={() => openBarDetailModal(bar)}
            >
              {/* Image disabled
              {bar.imageUrl && (
                <img
                  src={bar.imageUrl}
                  alt={bar.name}
                  className="w-full h-48 object-cover"
                />
              )} */}
              <div className="p-4 space-y-1">
                <h3 className="text-xl font-semibold">
                  #{bar.rank} {bar.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {bar.city}, {bar.country}
                </p>
                <p className="text-sm text-gray-500">{bar.address}</p>

                {/* Actions */}
                <div
                  className="absolute top-2 right-2 flex space-x-2 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleSave(bar)}
                    className="p-1 rounded-full bg-white shadow hover:bg-gray-100"
                    title={saved ? "Saved" : "Save to My List"}
                  >
                    {saved ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="w-5 h-5 text-blue-600"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 2a2 2 0 0 0-2 2v18l8-5.333L20 22V4a2 2 0 0 0-2-2H6z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-500"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 3v18l7-5 7 5V3H5z"
                        />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => openVisitModal(bar)}
                    className="p-1 rounded-full bg-white shadow hover:bg-gray-100"
                    title="Add Visit"
                  >
                    <span className="text-xl font-bold text-green-700">＋</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visit Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg space-y-4 w-full max-w-md">
            <h3 className="text-lg font-bold">Add Visit to {newVisit.bar}</h3>

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

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={submitVisit}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
              >
                Save Visit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {modalBarData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 w-full max-w-sm">
            <h3 className="text-xl font-bold">{modalBarData.name}</h3>
            <p className="text-sm text-gray-600">{modalBarData.address}</p>
            <p className="text-sm text-gray-600">{modalBarData.country}</p>
            <p className="text-sm text-gray-700">
              🧾 Visits: {modalBarData.visits}
              <br />⭐ Avg Rating: {modalBarData.avgRating}
              <br />
              📅 Last Visited: {modalBarData.lastVisit}
            </p>
            <div className="text-right">
              <button
                onClick={() => setModalBarData(null)}
                className="text-sm text-blue-600 hover:underline"
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

export default TopBars;
