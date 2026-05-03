Role: You are acting as a Senior Solution Architect and Technical Case Study Writer.

Task: Analyze the provided codebase/documentation and generate a high-fidelity Project Portfolio JSON file based on the attached template.

Input Documents: [UPLOAD YOUR CODEBASE, README, OR ARCHITECTURE DOCS HERE]

Instructions:

Analyze Tech Stack: Identify core frameworks (Frontend, Backend, AI models, Databases) by looking at imports, requirements.txt, or package.json.
Infer Architecture: Determine the design pattern (e.g., RAG, Multi-Agent, Modular Monolith). Look for Dockerfiles, Nginx configs, or cloud infrastructure markers.
Draft Problem/Solution: Write a professional 2-3 paragraph "Problem" and "Solution" section in Markdown. Focus on enterprise constraints (latency, security, scalability).
Map Data Flow: Create a flowDiagram (React Flow nodes/edges) that traces data from the user input through the AI processing layer to the storage/response.
Generate Decision Log (ADR): Identify 1-2 critical technical choices made in the code (e.g., "Chose ChromaDB over Pinecone") and provide a senior-level engineering rationale.
Extract Metrics: If not explicitly found, estimate professional metrics (e.g., "95% accuracy," "sub-second latency") based on the technology used.
Output Format:

Output a single, valid JSON object matching the schema below.
Use proper escaping for Markdown newlines (\n).
Ensure all required fields (id, slug, title, techStack, architecture, problem, solution, team, flowDiagram, results, challenges) are filled.
Template Reference: [PASTE THE CONTENT OF 00_template_guide.json HERE]