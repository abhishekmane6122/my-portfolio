import json
import os
import re

directory = 'src/data/blog_json'
files = [f for f in os.listdir(directory) if f.endswith('.json')]

def fix_content(content):
    # 1. Check if it's double escaped. 
    # If it has NO newline characters but many '\n' strings, it's likely double escaped.
    if '\n' not in content and '\\n' in content:
        # Replace \\n with actual newline
        content = content.replace('\\n', '\n')
        content = content.replace('\\r', '\r')
        content = content.replace('\\"', '"')
        content = content.replace('\\\\', '\\')
    
    # Now content has actual newline characters.
    # We need to fix the react-flow blocks because JSON.parse will fail on literal newlines in strings.
    
    def fix_react_flow(match):
        block_content = match.group(1)
        # We need to escape newlines inside the JSON string values.
        # But wait, if we just use json.loads and then json.dumps, it will fix it.
        # However, block_content might have literal newlines between keys, which is fine.
        # It's only newlines INSIDE strings that are bad.
        
        try:
            # Try to parse it. If it fails due to literal newlines in strings, we fix it.
            # json.loads handles literal newlines between keys, but NOT inside strings.
            # Wait, actually json.loads in Python handles literal newlines in strings IF strict=False?
            # No, it doesn't.
            
            # Simple fix: find all double-quoted strings and escape newlines in them.
            fixed_block = re.sub(r'("(?:\\.|[^"\\])*")', lambda m: m.group(1).replace('\n', '\\n'), block_content)
            return f'```react-flow\n{fixed_block}\n```'
        except Exception:
            return match.group(0)

    # Find react-flow blocks
    content = re.sub(r'```react-flow\s*([\s\S]*?)\s*```', fix_react_flow, content)
    
    return content

for filename in files:
    file_path = os.path.join(directory, filename)
    print(f"Processing {filename}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except Exception as e:
            print(f"Error loading {filename}: {e}")
            continue
            
    if 'content' in data:
        old_content = data['content']
        new_content = fix_content(old_content)
        
        if old_content != new_content:
            data['content'] = new_content
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4)
            print(f"Fixed {filename}")
        else:
            print(f"No changes needed for {filename}")

print("Done.")
