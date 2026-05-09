from pypdf import PdfReader

reader = PdfReader("WEBSITE YANNA OFI.pdf")
text = ""
for page in reader.pages:
    text += page.extract_text() + "\n"

print(text)
