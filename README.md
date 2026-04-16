# Ticket Generator - Kal Ki Chinta Nahi Karta ft. Ravi Gupta

Offline ticket generator for the comedy show **"Kal Ki Chinta Nahi Karta"** ft. **Ravi Gupta**, organized by **Team Designated** at **Jawaharlal Nehru Memorial Hall**.

## Live Website

**[Open Ticket Generator](https://loukik99.github.io/Bookmyshow_Tickets_Ravi_Gupta/)**

## Features

- Enter customer name and select category (Platinum / Gold / Silver / Balcony)
- Generates a styled ticket with QR code
- Download ticket as PDF
- QR code links to a verification page showing **VERIFIED** with ticket details
- Fully responsive (mobile, tablet, desktop)

## Project Structure

```
ticket-website/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── assets/
│       ├── logo.jpeg          (Team Designated logo)
│       ├── platinum.png       (category bar)
│       ├── gold.png           (category bar)
│       ├── silver.png         (category bar)
│       └── balcony.png        (category bar)
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx               (main page — form + ticket preview)
    ├── components/
    │   ├── TicketForm.jsx     (name input, category selector, generate button)
    │   └── TicketCard.jsx     (visual ticket matching PDF design)
    └── utils/
        ├── generatePdf.js    (jspdf logic to create downloadable PDF)
        └── ticketData.js     (show details + QR URL builder)
```

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** — responsive styling
- **qrcode.react** — QR code generation
- **jspdf + html2canvas** — PDF download
- No backend — everything runs client-side

## Run Locally

```bash
cd ticket-website
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Categories

| Category | Color |
|----------|-------|
| Platinum | Silver |
| Gold | Gold |
| Silver | Silver |
| Balcony | Copper |

## Verification

When a QR code on a ticket is scanned, it opens the [verification page](https://loukik99.github.io/Bookmyshow_Tickets_Ravi_Gupta/verify.html) showing a **VERIFIED** badge with all ticket details.

---

**Team Designated** &copy; 2025
