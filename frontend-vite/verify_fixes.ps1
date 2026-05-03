
$files = @(
    "src/data/blog_json/01_multi_agent_systems_langgraph.json",
    "src/data/blog_json/02_context_engineering_complete.json",
    "src/data/blog_json/03_multimodal_ai_architecture.json",
    "src/data/blog_json/04_small_language_models.json",
    "src/data/blog_json/05_agentic_ai_production.json"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = [System.IO.File]::ReadAllText($file)
        Write-Host "File: $file"
        
        # Check for scaled coordinates (escaped)
        if ($content -match '\\"y\\": 150') { Write-Host "  [OK] Found y: 150" }
        elseif ($content -match '\\"y\\": 120') { Write-Host "  [OK] Found y: 120 (partial fix)" }
        
        # Check for escaped newlines in Article 01
        if ($file -like "*01_multi_agent_systems_langgraph.json") {
            if ($content -match 'Supervisor Agent\\n\(Orchestrator\)') { Write-Host "  [OK] Fixed JSON escapes" }
            else { Write-Warning "  [!!] JSON escapes NOT fixed in 01" }
        }
    }
}
