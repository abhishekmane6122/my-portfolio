import json

file_path = 'src/data/blog_json/01_multi_agent_systems_langgraph.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

content = data['content']

# Unescape multiple times if necessary
# If it has \\n, we want \n
# If it has \n (actual newline), we keep it (though JSON shouldn't have it)

# The issue is that the content string itself has literal \n instead of newlines.
content = content.replace('\\n', '\n')
content = content.replace('\\r', '\r')
content = content.replace('\\"', '"')

data['content'] = content

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4)
