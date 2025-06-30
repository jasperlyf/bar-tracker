import { useEffect, useState } from "react";
import axios from "axios";

const VisitTable = () => {
  const [visits, setVisits] = useState([]);
  const [editingVisit, setEditingVisit] = useState(null);
  const [formData, setFormData] = useState({});
  const [newVisit, setNewVisit] = useState({
    bar: "",
    address: "",
    country: "",
    date: "",
    drink: "",
    people: [],
    ratings: { vibe: 0, service: 0, drinks: 0 }
  });

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/barvisits");
      setVisits(res.data);
    } catch (err) {
      console.error("❌ Failed to load visits:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this visit?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/barvisits/${id}`);
      fetchVisits();
    } catch (err) {
      console.error("❌ Failed to delete visit:", err);
    }
  };

  const handleEditClick = (visit) => {
    setEditingVisit(visit._id);
    setFormData({
      ...visit,
      people: visit.people || [],
      ratings: visit.ratings || { vibe: 0, service: 0, drinks: 0 }
    });
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        bar: formData.bar,
        address: formData.address,
        country: formData.country,
        date: formData.date,
        drink: formData.drink,
        people: formData.people || [],
        ratings: formData.ratings || {}
      };

      await axios.put(`http://localhost:3001/api/barvisits/${editingVisit}`, payload);
      fetchVisits();
      setEditingVisit(null);
    } catch (err) {
      console.error("❌ Failed to update visit:", err.response?.data || err.message);
    }
  };

  const handleAddVisit = async () => {
    try {
      const payload = {
        ...newVisit,
        people: newVisit.people || [],
        ratings: newVisit.ratings || { vibe: 0, service: 0, drinks: 0 }
      };

      await axios.post("http://localhost:3001/api/barvisits", payload);
      setNewVisit({
        bar: "",
        address: "",
        country: "",
        date: "",
        drink: "",
        people: [],
        ratings: { vibe: 0, service: 0, drinks: 0 }
      });
      fetchVisits();
    } catch (err) {
      console.error("❌ Failed to add visit:", err.response?.data || err.message);
    }
  };

  return (
    <div className="overflow-x-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">📝 Bar Visits</h2>

      <div className="mb-6 border p-4 rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Add New Visit</h3>
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="Bar" value={newVisit.bar} onChange={e => setNewVisit({ ...newVisit, bar: e.target.value })} />
          <input placeholder="Address" value={newVisit.address} onChange={e => setNewVisit({ ...newVisit, address: e.target.value })} />
          <input placeholder="Country" value={newVisit.country} onChange={e => setNewVisit({ ...newVisit, country: e.target.value })} />
          <input placeholder="Date" value={newVisit.date} onChange={e => setNewVisit({ ...newVisit, date: e.target.value })} />
          <input placeholder="Drink" value={newVisit.drink} onChange={e => setNewVisit({ ...newVisit, drink: e.target.value })} />
          <input placeholder="People (comma separated)" value={newVisit.people.join(", ")} onChange={e => setNewVisit({ ...newVisit, people: e.target.value.split(",").map(p => p.trim()) })} />
          <input type="number" placeholder="Vibe" value={newVisit.ratings.vibe} onChange={e => setNewVisit({ ...newVisit, ratings: { ...newVisit.ratings, vibe: Number(e.target.value) } })} />
          <input type="number" placeholder="Service" value={newVisit.ratings.service} onChange={e => setNewVisit({ ...newVisit, ratings: { ...newVisit.ratings, service: Number(e.target.value) } })} />
          <input type="number" placeholder="Drinks" value={newVisit.ratings.drinks} onChange={e => setNewVisit({ ...newVisit, ratings: { ...newVisit.ratings, drinks: Number(e.target.value) } })} />
        </div>
        <button className="mt-2 bg-blue-600 text-white px-4 py-1 rounded" onClick={handleAddVisit}>Add Visit</button>
      </div>

      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-3 py-2 text-left">Bar</th>
            <th className="px-3 py-2 text-left">Address</th>
            <th className="px-3 py-2 text-left">Country</th>
            <th className="px-3 py-2 text-left">Date</th>
            <th className="px-3 py-2 text-left">Drink</th>
            <th className="px-3 py-2 text-left">People</th>
            <th className="px-3 py-2 text-left">Rating</th>
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {visits.map(visit => (
            <tr key={visit._id} className="border-t">
              <td className="px-3 py-2">
                {editingVisit === visit._id ? (
                  <input value={formData.bar} onChange={e => setFormData({ ...formData, bar: e.target.value })} />
                ) : visit.bar}
              </td>
              <td className="px-3 py-2">
                {editingVisit === visit._id ? (
                  <input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                ) : visit.address}
              </td>
              <td className="px-3 py-2">
                {editingVisit === visit._id ? (
                  <input value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} />
                ) : visit.country}
              </td>
              <td className="px-3 py-2">
                {editingVisit === visit._id ? (
                  <input value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                ) : visit.date}
              </td>
              <td className="px-3 py-2">
                {editingVisit === visit._id ? (
                  <input value={formData.drink || ''} onChange={e => setFormData({ ...formData, drink: e.target.value })} />
                ) : visit.drink || '-'}
              </td>
              <td className="px-3 py-2">
                {editingVisit === visit._id ? (
                  <input
                    value={formData.people?.join(', ') || ''}
                    onChange={e => setFormData({ ...formData, people: e.target.value.split(',').map(s => s.trim()) })}
                  />
                ) : visit.people?.join(", ") || '-'}
              </td>
              <td className="px-3 py-2">
                {editingVisit === visit._id ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Vibe"
                      value={formData.ratings?.vibe || ''}
                      onChange={e => setFormData({ ...formData, ratings: { ...formData.ratings, vibe: Number(e.target.value) } })}
                      className="w-12 border px-1"
                    />
                    <input
                      type="number"
                      placeholder="Service"
                      value={formData.ratings?.service || ''}
                      onChange={e => setFormData({ ...formData, ratings: { ...formData.ratings, service: Number(e.target.value) } })}
                      className="w-12 border px-1"
                    />
                    <input
                      type="number"
                      placeholder="Drinks"
                      value={formData.ratings?.drinks || ''}
                      onChange={e => setFormData({ ...formData, ratings: { ...formData.ratings, drinks: Number(e.target.value) } })}
                      className="w-12 border px-1"
                    />
                  </div>
                ) : visit.ratings ? `V: ${visit.ratings.vibe}, S: ${visit.ratings.service}, D: ${visit.ratings.drinks}` : "-"}
              </td>
              <td className="px-3 py-2 space-x-2">
                {editingVisit === visit._id ? (
                  <>
                    <button onClick={handleUpdate} className="text-sm text-blue-600 hover:underline">Save</button>
                    <button onClick={() => setEditingVisit(null)} className="text-sm text-gray-500 hover:underline">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(visit)} className="text-sm text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(visit._id)} className="text-sm text-red-600 hover:underline">Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitTable;
