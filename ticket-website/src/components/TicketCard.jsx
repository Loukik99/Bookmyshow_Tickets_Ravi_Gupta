import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { SHOW, CATEGORIES } from "../utils/ticketData";

const TicketCard = forwardRef(({ ticketData }, ref) => {
  const { customerName, category, ticketId, qrUrl } = ticketData;
  const style = CATEGORIES[category];

  return (
    <div
      ref={ref}
      className="relative flex rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#1a1a2e",
        border: `2px solid ${style.accent}`,
        width: "100%",
        maxWidth: 720,
        minHeight: 260,
      }}
    >
      {/* ── Left: Category Bar ────────────────────────── */}
      <div className="relative flex-shrink-0" style={{ width: 56 }}>
        <img
          src={style.bar}
          alt={category}
          className="absolute inset-0 w-full h-full object-cover"
          crossOrigin="anonymous"
        />
      </div>

      {/* ── Center: Main Content ──────────────────────── */}
      <div className="flex-1 flex flex-col justify-between p-5 sm:p-6 min-w-0">
        {/* Top row: Show name + Logo */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-white font-bold text-lg sm:text-xl leading-tight m-0">
              {SHOW.name}
            </h2>
            <p className="text-sm mt-1 m-0" style={{ color: style.accent }}>
              {SHOW.subtitle}
            </p>

            {/* Category Badge */}
            <span
              className="inline-block mt-3 px-4 py-1 rounded-md text-xs font-extrabold tracking-[2px]"
              style={{
                backgroundColor: style.labelBg,
                color: style.labelText,
              }}
            >
              {category}
            </span>
          </div>

          {/* Logo */}
          <img
            src="/assets/logo.jpeg"
            alt="Team Designated"
            className="w-16 h-12 sm:w-20 sm:h-14 object-contain flex-shrink-0 rounded"
            crossOrigin="anonymous"
          />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-5">
          <div>
            <p className="text-[10px] sm:text-xs tracking-[1.5px] m-0" style={{ color: "#888899" }}>
              GUEST NAME
            </p>
            <p className="text-white font-bold text-sm sm:text-base mt-0.5 m-0 truncate">
              {customerName}
            </p>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs tracking-[1.5px] m-0" style={{ color: "#888899" }}>
              DATE
            </p>
            <p className="text-white font-bold text-sm sm:text-base mt-0.5 m-0">
              {SHOW.date}
            </p>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs tracking-[1.5px] m-0" style={{ color: "#888899" }}>
              TIME
            </p>
            <p className="text-white font-bold text-sm sm:text-base mt-0.5 m-0">
              {SHOW.time}
            </p>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs tracking-[1.5px] m-0" style={{ color: "#888899" }}>
              VENUE
            </p>
            <p className="text-white font-bold text-[11px] sm:text-sm mt-0.5 m-0">
              {SHOW.venue}
            </p>
          </div>
        </div>

        {/* Ticket ID */}
        <p className="text-[10px] mt-4 m-0" style={{ color: "#555566" }}>
          Ticket ID: {ticketId}
        </p>
      </div>

      {/* ── Dashed Separator ──────────────────────────── */}
      <div className="relative flex-shrink-0 flex flex-col items-center justify-center" style={{ width: 1 }}>
        {/* Top circle */}
        <div
          className="absolute -top-2 w-4 h-4 rounded-full"
          style={{ backgroundColor: "#0f0f1a" }}
        />
        {/* Dashed line */}
        <div
          className="h-[85%] border-l-2 border-dashed"
          style={{ borderColor: style.accent }}
        />
        {/* Bottom circle */}
        <div
          className="absolute -bottom-2 w-4 h-4 rounded-full"
          style={{ backgroundColor: "#0f0f1a" }}
        />
      </div>

      {/* ── Right: QR Stub ────────────────────────────── */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center px-4 sm:px-6" style={{ width: 160 }}>
        <div className="bg-white rounded-lg p-2">
          <QRCodeSVG
            value={qrUrl}
            size={110}
            level="M"
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
        <p
          className="text-[10px] font-bold tracking-[1.5px] mt-3 m-0"
          style={{ color: style.accent }}
        >
          SCAN TO VERIFY
        </p>
        <p className="text-[9px] mt-2 m-0" style={{ color: "#666677" }}>
          {ticketId}
        </p>
      </div>
    </div>
  );
});

TicketCard.displayName = "TicketCard";
export default TicketCard;
