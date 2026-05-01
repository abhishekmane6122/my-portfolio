import json
import os

def sync_blog(md_path, json_path):
    if not os.path.exists(md_path):
        print(f"Error: {md_path} not found")
        return
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found")
        return

    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    with open(json_path, 'r', encoding='utf-8') as f:
        blog_data = json.load(f)

    blog_data['content'] = content

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(blog_data, f, indent=4, ensure_ascii=False)
    print(f"Successfully synchronized {os.path.basename(json_path)}")

if __name__ == "__main__":
    # Pairs of (md_source, json_target)
    mappings = [
        (r"d:\Abhishek\Abhi_Portfolio\Blog\01_multi_agent_systems_langgraph.md", r"d:\Abhishek\Abhi_Portfolio\frontend-vite\src\data\blog_json\01_multi_agent_systems_langgraph.json"),
        (r"d:\Abhishek\Abhi_Portfolio\Blog\01_production_architecture_nginx_fastapi.md", r"d:\Abhishek\Abhi_Portfolio\frontend-vite\src\data\blog_json\01_production_architecture_nginx_fastapi.json"),
        (r"d:\Abhishek\Abhi_Portfolio\Blog\02_context_engineering_complete.md", r"d:\Abhishek\Abhi_Portfolio\frontend-vite\src\data\blog_json\02_context_engineering_complete.json"),
        (r"d:\Abhishek\Abhi_Portfolio\Blog\02_enterprise_rag_systems.md", r"d:\Abhishek\Abhi_Portfolio\frontend-vite\src\data\blog_json\02_enterprise_rag_systems.json"),
        (r"d:\Abhishek\Abhi_Portfolio\Blog\03_llmops_production.md", r"d:\Abhishek\Abhi_Portfolio\frontend-vite\src\data\blog_json\03_llmops_production.json"),
        (r"d:\Abhishek\Abhi_Portfolio\Blog\03_multimodal_ai_architecture.md", r"d:\Abhishek\Abhi_Portfolio\frontend-vite\src\data\blog_json\03_multimodal_ai_architecture.json"),
        (r"d:\Abhishek\Abhi_Portfolio\Blog\04_ai_agent_protocols_mcp.md", r"d:\Abhishek\Abhi_Portfolio\frontend-vite\src\data\blog_json\04_ai_agent_protocols_mcp.json"),
        (r"d:\Abhishek\Abhi_Portfolio\Blog\04_small_language_models.md", r"d:\Abhishek\Abhi_Portfolio\frontend-vite\src\data\blog_json\04_small_language_models.json"),
        (r"d:\Abhishek\Abhi_Portfolio\Blog\05_agentic_ai_production.md", r"d:\Abhishek\Abhi_Portfolio\frontend-vite\src\data\blog_json\05_agentic_ai_production.json"),
        (r"d:\Abhishek\Abhi_Portfolio\Blog\05_observability_monitoring_ai.md", r"d:\Abhishek\Abhi_Portfolio\frontend-vite\src\data\blog_json\05_observability_monitoring_ai.json"),
    ]

    for md, jsn in mappings:
        sync_blog(md, jsn)
