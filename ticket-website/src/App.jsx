import { useState, useRef } from "react";
import TicketForm from "./components/TicketForm";
import TicketCard from "./components/TicketCard";
import { generateTicketId, buildQrUrl } from "./utils/ticketData";
import { downloadTicketPdf } from "./utils/generatePdf";

let ticketSeq = 1;

function App() {
  const [ticket, setTicket] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const ticketRef = useRef(null);

  const handleGenerate = ({ customerName, category }) => {
    const ticketId = generateTicketId(category, ticketSeq++);
    const data = { customerName, category, ticketId };
    data.qrUrl = buildQrUrl(data);
    setTicket(data);
  };

  const handleDownload = async () => {
    if (!ticketRef.current || !ticket) return;
    setDownloading(true);
    try {
      await downloadTicketPdf(ticketRef.current, ticket.ticketId, ticket.customerName);
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
    setDownloading(false);
  };

  const handleNewTicket = () => {
    setTicket(null);
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col">
      {/* Header */}
      <header className="text-center pt-8 sm:pt-12 pb-6 px-4">
        <img
          src="assets/logo.jpeg"
          alt="Team Designated"
          className="w-20 h-14 sm:w-24 sm:h-16 object-contain mx-auto rounded-lg mb-4"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
          Ticket Generator
        </h1>
        <p className="text-gray-500 text-sm mt-1 tracking-[1px]">
          Kal Ki Chinta Nahi Karta ft. Ravi Gupta
        </p>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-4 pb-12">
        {!ticket ? (
          /* ── Form View ──────────────────────────── */
          <div className="w-full max-w-lg mt-4 sm:mt-8">
            <TicketForm onGenerate={handleGenerate} />
          </div>
        ) : (
          /* ── Ticket Preview ─────────────────────── */
          <div className="w-full flex flex-col items-center gap-6 mt-4">
            {/* Ticket */}
            <div className="w-full max-w-[720px] overflow-x-auto">
              <TicketCard ref={ticketRef} ticketData={ticket} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 py-3 rounded-xl font-bold text-base tracking-[1.5px] transition-all
                           disabled:opacity-50 cursor-pointer"
                style={{
                  backgroundColor: "#FFD700",
                  color: "#1a1a2e",
                }}
              >
                {downloading ? "GENERATING PDF..." : "DOWNLOAD PDF"}
              </button>
              <button
                onClick={handleNewTicket}
                className="flex-1 py-3 rounded-xl font-bold text-base tracking-[1.5px] border-2
                           border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white
                           transition-all cursor-pointer bg-transparent"
              >
                NEW TICKET
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-600 text-xs tracking-[1px]">
        Team Designated &copy; 2025
      </footer>
    </div>
  );
}

export default App;
