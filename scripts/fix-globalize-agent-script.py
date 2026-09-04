from pathlib import Path

path = Path('scripts/globalize-portfolio-agent.py')
text = path.read_text(encoding='utf-8')

# Make the migration script's expected source strings match the current UI copy exactly.
replacements = {
    "copy = replace_once(copy, \"  agentFillEmpty: '补全空白字段',\",": "copy = replace_once(copy, \"  agentFillEmpty: '补齐空白字段',\",",
    "copy = replace_once(copy, \"  agentPlaceholder: '告诉 Agent 要怎么修改这个项目…',\",": "copy = replace_once(copy, \"  agentPlaceholder: '直接告诉 Agent 这个项目要怎么改……',\",",
    "copy = replace_once(copy, \"  agentDiscarded: '已丢弃 Agent 修改建议。',\",": "copy = replace_once(copy, \"  agentDiscarded: '已丢弃 Agent 修改。',\",",
    "copy = replace_once(copy, \"  agentFillEmpty: '補全空白欄位',\",": "copy = replace_once(copy, \"  agentFillEmpty: '補齊空白欄位',\",",
    "copy = replace_once(copy, \"  agentPlaceholder: '告訴 Agent 要怎麼修改這個專案…',\",": "copy = replace_once(copy, \"  agentPlaceholder: '直接告訴 Agent 這個專案要怎麼改……',\",",
    "copy = replace_once(copy, \"  agentDiscarded: '已丟棄 Agent 修改建議。',\",": "copy = replace_once(copy, \"  agentDiscarded: '已捨棄 Agent 修改。',\",",
    "copy = replace_once(copy, \"  agentFillEmpty: 'Điền các trường còn trống',\",": "copy = replace_once(copy, \"  agentFillEmpty: 'Điền các trường trống',\",",
    "copy = replace_once(copy, \"  agentPlaceholder: 'Hãy nói Agent cần sửa gì trong dự án này…',\",": "copy = replace_once(copy, \"  agentPlaceholder: 'Nói trực tiếp với Agent bạn muốn sửa gì trong dự án này…',\",",
    "copy = replace_once(copy, \"  agentFailed: 'Project agent failed.',\", \"  agentFailed: 'Portfolio agent failed.',\", 'vi failure')": "copy = replace_once(copy, \"  agentFailed: 'Project Agent thất bại.',\", \"  agentFailed: 'Portfolio agent failed.',\", 'vi failure')",
}
for old, new in replacements.items():
    text = text.replace(old, new)

path.write_text(text, encoding='utf-8')
