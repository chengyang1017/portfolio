from pathlib import Path

path = Path('scripts/globalize-portfolio-agent.py')
text = path.read_text(encoding='utf-8')
replacements = {
    "  agentFillEmpty: '补全空白字段',": "  agentFillEmpty: '补齐空白字段',",
    "  agentPlaceholder: '告诉 Agent 要怎么修改这个项目…',": "  agentPlaceholder: '直接告诉 Agent 这个项目要怎么改……',",
    "  agentDiscarded: '已丢弃 Agent 修改建议。',": "  agentDiscarded: '已丢弃 Agent 修改。',",
    "  agentFillEmpty: '補全空白欄位',": "  agentFillEmpty: '補齊空白欄位',",
    "  agentPlaceholder: '告訴 Agent 要怎麼修改這個專案…',": "  agentPlaceholder: '直接告訴 Agent 這個專案要怎麼改……',",
    "  agentDiscarded: '已丢棄 Agent 修改建議。',": "  agentDiscarded: '已捨棄 Agent 修改。',",
    "  agentFillEmpty: 'Điền các trường còn trống',": "  agentFillEmpty: 'Điền các trường trống',",
    "  agentPlaceholder: 'Hãy nói Agent cần sửa gì trong dự án này…',": "  agentPlaceholder: 'Nói trực tiếp với Agent bạn muốn sửa gì trong dự án này…',",
}
for old, new in replacements.items():
    text = text.replace(old, new)

text = text.replace(
    "copy = replace_once(copy, \"  agentFailed: 'Project agent failed.',\", \"  agentFailed: 'Portfolio agent failed.',\", 'vi failure')",
    "copy = replace_once(copy, \"  agentFailed: 'Project Agent thất bại.',\", \"  agentFailed: 'Portfolio agent failed.',\", 'vi failure')",
)
path.write_text(text, encoding='utf-8')
