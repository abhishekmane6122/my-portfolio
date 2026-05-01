import os
import re

def sanitize_mermaid_block(content):
    lines = content.split('\n')
    sanitized_lines = []
    
    # We'll focus on graph/flowchart blocks for now as they are the most sensitive to unquoted labels
    is_flowchart = any(header in lines[0] for header in ['graph', 'flowchart'])
    
    for line in lines:
        if not is_flowchart:
            sanitized_lines.append(line)
            continue
            
        # Match nodes like ID[Label], ID(Label), ID([Label]), ID[[Label]], ID((Label)), ID>Label], ID{Label}
        # This regex looks for: 
        # 1. Node ID (alphanumeric + some chars)
        # 2. Bracket start ([, (, [[, ([, ((), {, >)
        # 3. Label (anything until bracket end)
        # 4. Bracket end
        
        # Pattern to find labels and wrap them in quotes if not already
        patterns = [
            (r'(\w+)(\[)([^"\]]+)(\])', r'\1\2"\3"\4'), # [Label]
            (r'(\w+)(\(\[)([^"\]]+)(\]\))', r'\1\2"\3"\4'), # ([Label])
            (r'(\w+)(\[\[)([^"\]]+)(\]\])', r'\1\2"\3"\4'), # [[Label]]
            (r'(\w+)(\(\()([^"\)]+)(\)\))', r'\1\2"\3"\4'), # ((Label))
            (r'(\w+)(\()([^"\)]+)(\))', r'\1\2"\3"\4'), # (Label)
            (r'(\w+)(\{)([^"\}]+)(\})', r'\1\2"\3"\4'), # {Label}
            (r'(\w+)(>)([^"\]]+)(\])', r'\1\2"\3"\4'), # >Label]
            (r'(-->|---|-\.>|==>)\s*\|([^"|]+)\|', r'\1|"\2"|'), # -->|Label|
            (r'(subgraph\s+)([a-zA-Z0-9_-]+)(\s+)', r'\1"\2"\3'), # subgraph ID (simple)
            (r'(subgraph\s+)(?=[^"])([^\n"]+)', r'\1"\2"'), # subgraph Label
        ]
        
        temp_line = line
        for pattern, replacement in patterns:
            temp_line = re.sub(pattern, replacement, temp_line)
            
        # Clean up double quotes if any were created
        while '""' in temp_line:
            temp_line = temp_line.replace('""', '"')
        
        sanitized_lines.append(temp_line)
        
    return '\n'.join(sanitized_lines)

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all mermaid blocks
    def repl(match):
        start = match.group(1)
        mermaid_content = match.group(2)
        end = match.group(3)
        return start + sanitize_mermaid_block(mermaid_content) + end
    
    # Regex to capture content between ```mermaid and ```
    sanitized_content = re.sub(r'(```mermaid\n)([\s\S]*?)(\n```)', repl, content)
    
    if content != sanitized_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(sanitized_content)
        print(f"Sanitized Mermaid diagrams in {os.path.basename(filepath)}")
    else:
        print(f"No changes needed for {os.path.basename(filepath)}")

if __name__ == "__main__":
    blog_dir = r"d:\Abhishek\Abhi_Portfolio\Blog"
    for filename in os.listdir(blog_dir):
        if filename.endswith(".md"):
            process_file(os.path.join(blog_dir, filename))
