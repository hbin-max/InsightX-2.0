with open('frontend/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(r"\'\'", "''").replace(r"\'2025-02-18\'", "'2025-02-18'")

with open('frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Cleaned quotes successfully!')
