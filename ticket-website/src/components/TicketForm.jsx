import { useState } from "react";
import { CATEGORIES } from "../utils/ticketData";

const categoryList = Object.keys(CATEGORIES);

export default function TicketForm({ onGenerate }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !category) return;
    onGenerate({ customerName: name.trim(), category });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      {/* Name Input */}
      <div className="mb-6">
        <label className="block text-sm tracking-[2px] text-gray-400 mb-2 uppercase">
          Customer Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter customer name"
          className="w-full px-4 py-3 bg-[#1a1a2e] border border-gray-700 rounded-xl text-white text-lg
                     focus:outline-none focus:border-[#FFD700] transition-colors placeholder-gray-500"
          required
        />
      </div>

      {/* Category Selector */}
      <div className="mb-8">
        <label className="block text-sm tracking-[2px] text-gray-400 mb-3 uppercase">
          Select Category
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categoryList.map((cat) => {
            const style = CATEGORIES[cat];
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className="relative px-4 py-3 rounded-xl text-sm font-bold tracking-[1.5px] transition-all duration-200 border-2 cursor-pointer"
                style={{
                  borderColor: isSelected ? style.accent : "#2a2a3e",
                  backgroundColor: isSelected ? style.accent + "20" : "#1a1a2e",
                  color: isSelected ? style.accent : "#888",
                  boxShadow: isSelected ? `0 0 20px ${style.accent}30` : "none",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate Button */}
      <button
        type="submit"
        disabled={!name.trim() || !category}
        className="w-full py-4 rounded-xl text-lg font-bold tracking-[2px] transition-all duration-200
                   disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        style={{
          backgroundColor: category ? CATEGORIES[category]?.accent : "#FFD700",
          color: "#1a1a2e",
        }}
      >
        GENERATE TICKET
      </button>
    </form>
  );
}
