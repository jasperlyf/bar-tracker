import React, { useEffect, useState } from "react";
import axios from "axios";

const BarForm = () => {
  const [form, setForm] = useState({
    bar: "",
    address: "",
    country: "",
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

  const [suggestions, setSuggestions] = useState([]);
  const [topBars, setTopBars] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/topbars")
      .then(res => {
        setTopBars(res.data);
        setSuggestions(res.data.map(bar => bar.name));
      })
      .catch(err => console.error("Failed to fetch suggestions:", err));
  }, []);

 const handleChange = (e) => {
  const { name, value } = e.target;
  const updated = { ...form, [name]: value };

  if (name === "bar") {
    if (value.trim() === "") {
      // 🔄 Clear autofill fields if bar is cleared
      updated.address = "";
      updated.country = "";
    } else {
      // 🔍 Try to autofill address/country if matching bar is found
      const match = topBars.find(b => b.name.toLowerCase() === value.toLowerCase());
      if (match) {
        updated.address = match.address || "";
        updated.country = match.country || "";
      }
    }
  }

  if (["vibe", "service", "drinks"].includes(name)) {
    setForm(prev => ({
      ...prev,
      rating: { ...prev.rating, [name]: Number(value) },
    }));
  } else {
    setForm(updated);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      cost: Number(form.cost),
      people: form.people.split(",").map(p => p.trim()),
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
      <input
        list="bar-suggestions"
        name="bar"
        placeholder="Bar Name"
        value={form.bar}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <datalist id="bar-suggestions">
        {suggestions.map((name, i) => (
          <option key={i} value={name} />
        ))}
      </datalist>

      <input
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        name="country"
        placeholder="Country"
        value={form.country}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        name="drink"
        placeholder="Drink (optional)"
        value={form.drink}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <input
        name="cost"
        type="number"
        placeholder="Cost"
        value={form.cost}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <input
        name="people"
        placeholder="People you went with (comma-separated)"
        value={form.people}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <label className="block">Vibe Rating</label>
      <select name="vibe" onChange={handleChange} className="w-full p-2 border rounded">
        {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
      </select>

      <label className="block">Service Rating</label>
      <select name="service" onChange={handleChange} className="w-full p-2 border rounded">
        {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
      </select>

      <label className="block">Drinks Rating</label>
      <select name="drinks" onChange={handleChange} className="w-full p-2 border rounded">
        {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
      </select>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Save Visit
      </button>
    </form>
  );
};

export default BarForm;
