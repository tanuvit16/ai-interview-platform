from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import os

def generate_scorecard_pdf(report_data: dict, interview_data: dict, output_path: str):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )

    styles = getSampleStyleSheet()
    story = []

    # Colors
    dark_bg = colors.HexColor('#0f172a')
    blue = colors.HexColor('#3b82f6')
    green = colors.HexColor('#22c55e')
    red = colors.HexColor('#ef4444')
    yellow = colors.HexColor('#eab308')
    gray = colors.HexColor('#94a3b8')
    white = colors.white

    # Title style
    title_style = ParagraphStyle(
        'Title', parent=styles['Normal'],
        fontSize=24, fontName='Helvetica-Bold',
        textColor=dark_bg, spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'Subtitle', parent=styles['Normal'],
        fontSize=12, fontName='Helvetica',
        textColor=gray, spaceAfter=20
    )
    heading_style = ParagraphStyle(
        'Heading', parent=styles['Normal'],
        fontSize=14, fontName='Helvetica-Bold',
        textColor=dark_bg, spaceBefore=16, spaceAfter=8
    )
    body_style = ParagraphStyle(
        'Body', parent=styles['Normal'],
        fontSize=10, fontName='Helvetica',
        textColor=colors.HexColor('#334155'),
        spaceAfter=6, leading=16
    )

    # Header
    story.append(Paragraph("AI Interview Platform", title_style))
    story.append(Paragraph("Hiring Scorecard Report", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=blue))
    story.append(Spacer(1, 0.2*inch))

    # Interview info table
    rec_color = {
        "Strong Hire": green,
        "Hire": blue,
        "Maybe": yellow,
        "No Hire": red
    }.get(report_data.get("recommendation", "Maybe"), gray)

    info_data = [
        ["Position", interview_data.get("job_role", "N/A"), "Candidate", interview_data.get("candidate_email", "N/A")],
        ["Interview", interview_data.get("title", "N/A"), "Score", f"{report_data.get('total_score', 0):.1f} / 10"],
    ]
    info_table = Table(info_data, colWidths=[1.2*inch, 2.5*inch, 1.2*inch, 2.5*inch])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#f1f5f9')),
        ('BACKGROUND', (2,0), (2,-1), colors.HexColor('#f1f5f9')),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('FONTNAME', (2,0), (2,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 10),
        ('PADDING', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('ROWBACKGROUNDS', (0,0), (-1,-1), [colors.white, colors.HexColor('#f8fafc')]),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 0.2*inch))

    # Recommendation badge
    story.append(Paragraph("Recommendation", heading_style))
    rec_data = [[report_data.get("recommendation", "N/A")]]
    rec_table = Table(rec_data, colWidths=[2*inch])
    rec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), rec_color),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 14),
        ('TEXTCOLOR', (0,0), (-1,-1), white),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('PADDING', (0,0), (-1,-1), 10),
        ('ROUNDEDCORNERS', [6,6,6,6]),
    ]))
    story.append(rec_table)
    story.append(Spacer(1, 0.15*inch))

    # Summary
    story.append(Paragraph("Overall Assessment", heading_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e2e8f0')))
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph(report_data.get("summary", "N/A"), body_style))

    # Strengths
    story.append(Paragraph("✓ Strengths", ParagraphStyle(
        'Green', parent=styles['Normal'],
        fontSize=13, fontName='Helvetica-Bold',
        textColor=green, spaceBefore=16, spaceAfter=8
    )))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e2e8f0')))
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph(report_data.get("strengths", "N/A"), body_style))

    # Weaknesses
    story.append(Paragraph("✗ Areas for Improvement", ParagraphStyle(
        'Red', parent=styles['Normal'],
        fontSize=13, fontName='Helvetica-Bold',
        textColor=red, spaceBefore=16, spaceAfter=8
    )))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e2e8f0')))
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph(report_data.get("weaknesses", "N/A"), body_style))

    # Footer
    story.append(Spacer(1, 0.3*inch))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e2e8f0')))
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph(
        "Generated by AI Interview Platform — Confidential Hiring Document",
        ParagraphStyle('Footer', parent=styles['Normal'],
            fontSize=8, textColor=gray, alignment=TA_CENTER)
    ))

    doc.build(story)
    return output_path