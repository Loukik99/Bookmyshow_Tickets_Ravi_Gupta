export const SHOW = {
  name: "Kal Ki Chinta Nahi Karta",
  subtitle: "ft. Ravi Gupta",
  eventId: "ET00494827",
  venue: "Jawaharlal Nehru Memorial Hall",
  date: "Saturday, 23 May",
  time: "8:00 PM",
  organizer: "Team Designated",
  verifyUrl: "https://loukik99.github.io/Bookmyshow_Tickets_Ravi_Gupta/verify.html",
};

export const CATEGORIES = {
  PLATINUM: { accent: "#C0C0C0", labelBg: "#C0C0C0", labelText: "#1a1a2e", bar: "assets/platinum.png" },
  GOLD:     { accent: "#FFD700", labelBg: "#FFD700", labelText: "#1a1a2e", bar: "assets/gold.png" },
  SILVER:   { accent: "#C0C0C0", labelBg: "#C0C0C0", labelText: "#1a1a2e", bar: "assets/silver.png" },
  BALCONY:  { accent: "#E8975E", labelBg: "#E8975E", labelText: "#1a1a2e", bar: "assets/balcony.png" },
};

export function generateTicketId(category, seq) {
  const prefix = category.slice(0, 3).toUpperCase();
  const now = new Date();
  const y = String(now.getFullYear()).slice(2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${prefix}-${y}${m}${d}-${String(seq).padStart(4, "0")}`;
}

export function buildQrUrl(ticketData) {
  const payload = {
    id: ticketData.ticketId,
    show: SHOW.name,
    artist: "Ravi Gupta",
    name: ticketData.customerName,
    cat: ticketData.category,
    venue: SHOW.venue,
    date: SHOW.date,
    time: SHOW.time,
    org: SHOW.organizer,
  };
  const b64 = btoa(JSON.stringify(payload));
  return `${SHOW.verifyUrl}#${b64}`;
}
