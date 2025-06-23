import React, { useState } from "react";
import axios from "axios";

const BarForm = () => {
  const [form, setForm] = useState({
    bar: "",
    location: "",
    date: "",
    drink: "",
    cost: "",
    people: "",
    rating: {
      vibe: 3,
      service: 3,
      drinks: 3,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["vibe", "service", "drinks"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        rating: { ...prev.rating, [name]: Number(value) },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Split comma-separated people string into array
    const payload = {
      ...form,
      cost: Number(form.cost),
      people: form.people.split(",").map((p) => p.trim()),
    };

    try {
      const res = await axios.post("http://localhost:3001/api/barvisits", payload);
      alert("Bar visit saved!");
      console.log(res.data);
    } catch (err) {
      alert("Failed to save bar visit");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-xl space-y-4">
      <input name="bar" placeholder="Bar Name" onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="location" placeholder="Location" onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="date" type="date" onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="drink" placeholder="Drink (optional)" onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="cost" type="number" placeholder="Cost" onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="people" placeholder="People you went with (comma-separated)" onChange={handleChange} className="w-full p-2 border rounded" />

      <label className="block">Vibe Rating</label>
      <select name="vibe" onChange={handleChange} className="w-full p-2 border rounded">
        {[1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>{v}</option>)}
      </select>

      <label className="block">Service Rating</label>
      <select name="service" onChange={handleChange} className="w-full p-2 border rounded">
        {[1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>{v}</option>)}
      </select>

      <label className="block">Drinks Rating</label>
      <select name="drinks" onChange={handleChange} className="w-full p-2 border rounded">
        {[1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>{v}</option>)}
      </select>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Save Visit
      </button>
    </form>
  );
};

export default BarForm;
