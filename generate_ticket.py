import os
import sys
import json
import base64
import qrcode
from io import BytesIO
from datetime import datetime
from PIL import Image as PILImage
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

# ── Show Details ──────────────────────────────────────────────
SHOW_NAME = "Kal Ki Chinta Nahi Karta"
SHOW_SUBTITLE = "ft. Ravi Gupta"
EVENT_ID = "ET00494827"
VENUE = "Jawaharlal Nehru Memorial Hall"
SHOW_DATE = "Saturday, 23 May"
SHOW_TIME = "8:00 PM"
ORGANIZER = "Team Designated"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Category bar images & logo ────────────────────────────────
CATEGORY_BAR_FILES = {
    "PLATINUM": "platinum.png",
    "GOLD":     "gold ticket bar.png",
    "SILVER":   "silver.png",
    "BALCONY":  "balcony.png",
}
LOGO_FILE = "logo.jpeg"

# Category colors
CATEGORY_STYLES = {
    "PLATINUM": {"accent": "#C0C0C0", "label_bg": "#C0C0C0", "label_text": "#1a1a2e"},
    "GOLD":     {"accent": "#FFD700", "label_bg": "#FFD700", "label_text": "#1a1a2e"},
    "SILVER":   {"accent": "#C0C0C0", "label_bg": "#C0C0C0", "label_text": "#1a1a2e"},
    "BALCONY":  {"accent": "#E8975E", "label_bg": "#E8975E", "label_text": "#1a1a2e"},
}


def generate_ticket_id(category, seq_number):
    prefix = category[:3].upper()
    timestamp = datetime.now().strftime("%y%m%d")
    return f"{prefix}-{timestamp}-{seq_number:04d}"


def generate_qr_png(data_string, filepath):
    """Generate a high-resolution QR code PNG file."""
    qr = qrcode.QRCode(
        version=2,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=20,
        border=4,
    )
    qr.add_data(data_string)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filepath, "PNG")
    return filepath


def draw_rounded_rect(c, x, y, w, h, radius, fill_color=None, stroke_color=None):
    p = c.beginPath()
    p.moveTo(x + radius, y)
    p.lineTo(x + w - radius, y)
    p.arcTo(x + w - radius, y, x + w, y + radius, radius)
    p.lineTo(x + w, y + h - radius)
    p.arcTo(x + w, y + h - radius, x + w - radius, y + h, radius)
    p.lineTo(x + radius, y + h)
    p.arcTo(x + radius, y + h, x, y + h - radius, radius)
    p.lineTo(x, y + radius)
    p.arcTo(x, y + radius, x + radius, y, radius)
    p.close()
    if fill_color:
        c.setFillColor(fill_color)
    if stroke_color:
        c.setStrokeColor(stroke_color)
        c.drawPath(p, fill=1 if fill_color else 0, stroke=1 if stroke_color else 0)
    else:
        c.drawPath(p, fill=1 if fill_color else 0, stroke=0)


def create_ticket_pdf(customer_name, category, seq_number=1):
    category = category.upper()
    if category not in CATEGORY_STYLES:
        print(f"Invalid category: {category}. Choose from: {', '.join(CATEGORY_STYLES.keys())}")
        return None

    style = CATEGORY_STYLES[category]
    ticket_id = generate_ticket_id(category, seq_number)

    # ── QR Data ───────────────────────────────────────────────
    VERIFY_URL = "https://loukik99.github.io/Bookmyshow_Tickets_Ravi_Gupta/verify.html"
    qr_data = {
        "id": ticket_id,
        "show": SHOW_NAME,
        "artist": "Ravi Gupta",
        "name": customer_name,
        "cat": category,
        "venue": VENUE,
        "date": SHOW_DATE,
        "time": SHOW_TIME,
        "org": ORGANIZER
    }
    json_str = json.dumps(qr_data, separators=(",", ":"))
    b64 = base64.b64encode(json_str.encode()).decode()
    qr_string = f"{VERIFY_URL}#{b64}"

    # Output dirs
    output_dir = os.path.join(SCRIPT_DIR, "tickets")
    qr_dir = os.path.join(SCRIPT_DIR, "qr_codes")
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(qr_dir, exist_ok=True)

    safe_name = customer_name.replace(" ", "_").lower()

    # Generate high-res QR PNG
    qr_png_path = os.path.join(qr_dir, f"{ticket_id}_{safe_name}_qr.png")
    generate_qr_png(qr_string, qr_png_path)
    print(f"QR code saved: {qr_png_path}")

    # PDF path
    filename = f"{ticket_id}_{safe_name}.pdf"
    filepath = os.path.join(output_dir, filename)

    # ── Asset paths ───────────────────────────────────────────
    bar_path = os.path.join(SCRIPT_DIR, CATEGORY_BAR_FILES.get(category, ""))
    logo_path = os.path.join(SCRIPT_DIR, LOGO_FILE)

    has_bar = os.path.exists(bar_path)
    has_logo = os.path.exists(logo_path)

    if not has_bar:
        print(f"  WARNING: Bar image not found: {bar_path}")
    if not has_logo:
        print(f"  WARNING: Logo not found: {logo_path}")

    # ── PDF Setup ─────────────────────────────────────────────
    page_w, page_h = A4
    c = canvas.Canvas(filepath, pagesize=A4)

    # Ticket dimensions
    bar_w = 18 * mm        # width of category bar on left
    tw = 185 * mm          # total ticket width (slightly wider for bar)
    th = 80 * mm
    tx = (page_w - tw) / 2
    ty = (page_h - th) / 2

    stub_w = 55 * mm
    main_w = tw - stub_w - bar_w  # main content area between bar and stub

    bg = HexColor("#1a1a2e")
    accent = HexColor(style["accent"])
    label_bg = HexColor(style["label_bg"])
    label_text_color = HexColor(style["label_text"])

    # ── Page background ───────────────────────────────────────
    c.setFillColor(HexColor("#0f0f1a"))
    c.rect(0, 0, page_w, page_h, fill=1, stroke=0)

    # ── Ticket body ───────────────────────────────────────────
    draw_rounded_rect(c, tx, ty, tw, th, 8, fill_color=bg)

    # Border
    c.setStrokeColor(accent)
    c.setLineWidth(1.5)
    draw_rounded_rect(c, tx + 1, ty + 1, tw - 2, th - 2, 7, stroke_color=accent)

    # ── LEFT: Category Bar ────────────────────────────────────
    if has_bar:
        # Clip the bar image to fit within the rounded left edge
        c.saveState()
        # Draw bar image stretched to full ticket height
        bar_x = tx + 2
        bar_y = ty + 2
        bar_h = th - 4
        bar_draw_w = bar_w - 2

        # Create a clipping path for rounded left corners
        clip = c.beginPath()
        r = 7
        clip.moveTo(bar_x + r, bar_y)
        clip.lineTo(bar_x + bar_draw_w, bar_y)
        clip.lineTo(bar_x + bar_draw_w, bar_y + bar_h)
        clip.lineTo(bar_x + r, bar_y + bar_h)
        clip.arcTo(bar_x, bar_y + bar_h - 2 * r, bar_x + 2 * r, bar_y + bar_h, r)
        clip.lineTo(bar_x, bar_y + r)
        clip.arcTo(bar_x, bar_y, bar_x + 2 * r, bar_y + 2 * r, r)
        clip.close()
        c.clipPath(clip, stroke=0, fill=0)

        c.drawImage(bar_path, bar_x, bar_y, bar_draw_w, bar_h,
                     preserveAspectRatio=False, mask='auto')
        c.restoreState()

    # ── Dashed separator (before QR stub) ─────────────────────
    sep_x = tx + bar_w + main_w
    c.setStrokeColor(accent)
    c.setDash(6, 4)
    c.setLineWidth(1)
    c.line(sep_x, ty + 8, sep_x, ty + th - 8)
    c.setDash()

    # Perforation circles
    c.setFillColor(HexColor("#0f0f1a"))
    c.circle(sep_x, ty, 4, fill=1, stroke=0)
    c.circle(sep_x, ty + th, 4, fill=1, stroke=0)

    # ── MAIN CONTENT (between bar and stub) ───────────────────
    mx = tx + bar_w + 6 * mm  # left margin after bar
    top_y = ty + th - 12 * mm

    # Show name
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(mx, top_y, SHOW_NAME)

    # Subtitle
    c.setFont("Helvetica", 10)
    c.setFillColor(accent)
    c.drawString(mx, top_y - 14, SHOW_SUBTITLE)

    # ── TOP-RIGHT: Team Designated Logo ───────────────────────
    if has_logo:
        logo_h = 14 * mm
        pil_logo = PILImage.open(logo_path)
        logo_aspect = pil_logo.width / pil_logo.height
        logo_w = logo_h * logo_aspect

        logo_x = sep_x - logo_w - 2 * mm
        logo_y = ty + th - logo_h - 3 * mm

        c.drawImage(logo_path, logo_x, logo_y, logo_w, logo_h,
                     preserveAspectRatio=True, mask='auto')

    # Category badge — more gap after subtitle
    badge_y = top_y - 36
    badge_w = len(category) * 9 + 18
    draw_rounded_rect(c, mx, badge_y, badge_w, 18, 4, fill_color=label_bg)
    c.setFillColor(label_text_color)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(mx + 9, badge_y + 5, category)

    # Details grid — bigger fonts, more vertical spacing
    details_y = badge_y - 22
    col1_x = mx
    col2_x = mx + 50 * mm

    # Row 1: Guest Name & Date
    c.setFont("Helvetica", 8)
    c.setFillColor(HexColor("#888899"))
    c.drawString(col1_x, details_y, "GUEST NAME")
    c.drawString(col2_x, details_y, "DATE")

    c.setFont("Helvetica-Bold", 13)
    c.setFillColor(white)
    name_display = customer_name if len(customer_name) <= 22 else customer_name[:20] + ".."
    c.drawString(col1_x, details_y - 14, name_display)
    c.drawString(col2_x, details_y - 14, SHOW_DATE)

    # Row 2: Time & Venue — more gap from row 1
    row2_y = details_y - 32
    c.setFont("Helvetica", 8)
    c.setFillColor(HexColor("#888899"))
    c.drawString(col1_x, row2_y, "TIME")
    c.drawString(col2_x, row2_y, "VENUE")

    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(white)
    c.drawString(col1_x, row2_y - 13, SHOW_TIME)
    # Venue — smaller font to fit full name
    venue_display = VENUE
    if len(venue_display) > 28:
        c.setFont("Helvetica-Bold", 9)
    c.drawString(col2_x, row2_y - 13, venue_display)

    # Ticket ID bottom
    c.setFont("Helvetica", 6)
    c.setFillColor(HexColor("#555566"))
    c.drawString(mx, ty + 4, f"Ticket ID: {ticket_id}")

    # ── RIGHT: QR STUB ────────────────────────────────────────
    stub_cx = sep_x + stub_w / 2
    qr_size = 38 * mm
    qr_x = stub_cx - qr_size / 2
    qr_y = ty + th - 10 * mm - qr_size

    # White QR background
    draw_rounded_rect(c, qr_x - 3, qr_y - 3, qr_size + 6, qr_size + 6, 4, fill_color=white)
    c.drawImage(qr_png_path, qr_x, qr_y, qr_size, qr_size)

    # "SCAN TO VERIFY"
    c.setFont("Helvetica-Bold", 7)
    c.setFillColor(accent)
    c.drawCentredString(stub_cx, qr_y - 14, "SCAN TO VERIFY")

    # Ticket ID on stub
    c.setFont("Helvetica", 6)
    c.setFillColor(HexColor("#666677"))
    c.drawCentredString(stub_cx, ty + 5, ticket_id)

    # ── Save ──────────────────────────────────────────────────
    c.save()
    print(f"Ticket generated: {filepath}")
    return filepath


if __name__ == "__main__":
    print("=" * 55)
    print("  TICKET GENERATOR")
    print("  Kal Ki Chinta Nahi Karta ft. Ravi Gupta")
    print("  Jawaharlal Nehru Memorial Hall")
    print("  Saturday, 23 May | 8 PM")
    print("=" * 55)

    if len(sys.argv) > 1:
        name = sys.argv[1]
        cat = sys.argv[2] if len(sys.argv) > 2 else "GOLD"
        seq = int(sys.argv[3]) if len(sys.argv) > 3 else 1
        create_ticket_pdf(name, cat, seq)
    else:
        print(f"\nCategories: PLATINUM | GOLD | SILVER | BALCONY\n")
        name = input("  Customer Name : ").strip()
        cat = input("  Category      : ").strip().upper()
        seq = input("  Ticket # (1)  : ").strip()
        seq = int(seq) if seq else 1

        if name and cat:
            create_ticket_pdf(name, cat, seq)
        else:
            print("Name and category are required.")
