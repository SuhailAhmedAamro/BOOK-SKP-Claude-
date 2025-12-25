from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime
from io import BytesIO
import os

def generate_certificate(
    user_name: str,
    assessment_score: float,
    completion_date: datetime,
    background: str = "Software"
) -> BytesIO:
    """
    Generate a professional PDF certificate for course completion

    Args:
        user_name: Name of the student
        assessment_score: Final assessment score (0-100)
        completion_date: Date of course completion
        background: Student's background (Software/Hardware)

    Returns:
        BytesIO: PDF certificate as bytes
    """
    # Create PDF in memory
    buffer = BytesIO()

    # Use landscape orientation for certificate
    page_width, page_height = landscape(letter)
    c = canvas.Canvas(buffer, pagesize=landscape(letter))

    # Set title
    c.setTitle("Physical AI & Humanoid Robotics Certificate")

    # Draw border
    c.setStrokeColor(colors.HexColor("#10b981"))
    c.setLineWidth(4)
    c.rect(0.5 * inch, 0.5 * inch, page_width - 1 * inch, page_height - 1 * inch)

    # Inner decorative border
    c.setStrokeColor(colors.HexColor("#3b82f6"))
    c.setLineWidth(1)
    c.rect(0.75 * inch, 0.75 * inch, page_width - 1.5 * inch, page_height - 1.5 * inch)

    # Certificate Header
    c.setFillColor(colors.HexColor("#111827"))
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(page_width / 2, page_height - 1.5 * inch, "CERTIFICATE OF COMPLETION")

    # Subtitle
    c.setFont("Helvetica", 14)
    c.setFillColor(colors.HexColor("#6b7280"))
    c.drawCentredString(page_width / 2, page_height - 2 * inch, "This is to certify that")

    # Student Name (larger, emphasized)
    c.setFont("Helvetica-Bold", 32)
    c.setFillColor(colors.HexColor("#10b981"))
    c.drawCentredString(page_width / 2, page_height - 2.8 * inch, user_name)

    # Completion text
    c.setFont("Helvetica", 14)
    c.setFillColor(colors.HexColor("#6b7280"))
    c.drawCentredString(page_width / 2, page_height - 3.4 * inch, "has successfully completed the comprehensive course on")

    # Course Title
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(colors.HexColor("#3b82f6"))
    c.drawCentredString(page_width / 2, page_height - 4 * inch, "Physical AI & Humanoid Robotics")

    # Course details
    c.setFont("Helvetica", 12)
    c.setFillColor(colors.HexColor("#374151"))
    c.drawCentredString(page_width / 2, page_height - 4.5 * inch, "A comprehensive 13-chapter curriculum covering ROS 2, Simulation,")
    c.drawCentredString(page_width / 2, page_height - 4.8 * inch, "Computer Vision, AI/ML, Hardware Integration, and Advanced Robotics")

    # Assessment Score and Background
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(colors.HexColor("#111827"))

    # Score box
    score_y = page_height - 5.8 * inch
    c.drawString(page_width / 2 - 3 * inch, score_y, "Final Assessment Score:")
    c.setFillColor(colors.HexColor("#10b981"))
    c.drawString(page_width / 2 + 0.5 * inch, score_y, f"{assessment_score:.1f}%")

    # Background specialization
    c.setFillColor(colors.HexColor("#111827"))
    c.drawString(page_width / 2 - 3 * inch, score_y - 0.4 * inch, "Specialization:")
    c.setFillColor(colors.HexColor("#3b82f6"))
    c.drawString(page_width / 2 + 0.5 * inch, score_y - 0.4 * inch, f"{background} Focus")

    # Date
    c.setFillColor(colors.HexColor("#111827"))
    c.setFont("Helvetica", 12)
    date_str = completion_date.strftime("%B %d, %Y")
    c.drawCentredString(page_width / 2, page_height - 7 * inch, f"Completed on: {date_str}")

    # Footer - Signature line
    signature_y = 1.5 * inch
    c.setLineWidth(1)
    c.setStrokeColor(colors.HexColor("#9ca3af"))

    # Left signature line
    c.line(1.5 * inch, signature_y, 4 * inch, signature_y)
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.HexColor("#6b7280"))
    c.drawCentredString(2.75 * inch, signature_y - 0.3 * inch, "Program Director")
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(colors.HexColor("#374151"))
    c.drawCentredString(2.75 * inch, signature_y - 0.6 * inch, "Physical AI Academy")

    # Right signature line
    c.setStrokeColor(colors.HexColor("#9ca3af"))
    c.line(page_width - 4 * inch, signature_y, page_width - 1.5 * inch, signature_y)
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.HexColor("#6b7280"))
    c.drawCentredString(page_width - 2.75 * inch, signature_y - 0.3 * inch, "Certificate ID")
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(colors.HexColor("#374151"))
    cert_id = f"PAI-{datetime.now().strftime('%Y%m')}-{hash(user_name) % 10000:04d}"
    c.drawCentredString(page_width - 2.75 * inch, signature_y - 0.6 * inch, cert_id)

    # Footer text
    c.setFont("Helvetica-Oblique", 9)
    c.setFillColor(colors.HexColor("#9ca3af"))
    c.drawCentredString(
        page_width / 2,
        0.8 * inch,
        "This certificate validates the completion of a rigorous robotics curriculum and successful passing of the final assessment."
    )

    # Finalize PDF
    c.showPage()
    c.save()

    # Reset buffer position
    buffer.seek(0)
    return buffer
