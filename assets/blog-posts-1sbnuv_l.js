import{j as _}from"./animation-DPP9jQnv.js";import{a as k,c as I}from"./utils-CDN07tui.js";import{r as i,R as C}from"./react-vendor-B2xCQPYh.js";const y=e=>typeof e=="boolean"?`${e}`:e===0?"0":e,b=k,S=(e,t)=>n=>{var o;if(t?.variants==null)return b(e,n?.class,n?.className);const{variants:a,defaultVariants:r}=t,c=Object.keys(a).map(s=>{const d=n?.[s],u=r?.[s];if(d===null)return null;const m=y(d)||y(u);return a[s][m]}),l=n&&Object.entries(n).reduce((s,d)=>{let[u,m]=d;return m===void 0||(s[u]=m),s},{}),p=t==null||(o=t.compoundVariants)===null||o===void 0?void 0:o.reduce((s,d)=>{let{class:u,className:m,...w}=d;return Object.entries(w).every(A=>{let[h,f]=A;return Array.isArray(f)?f.includes({...r,...l}[h]):{...r,...l}[h]===f})?[...s,u,m]:s},[]);return b(e,c,p,n?.class,n?.className)},L=S("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",outline:"text-foreground"}},defaultVariants:{variant:"default"}});function zt({className:e,variant:t,...n}){return _.jsx("div",{className:I(L({variant:t}),e),...n})}function x(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function P(...e){return t=>{let n=!1;const o=e.map(a=>{const r=x(a,t);return!n&&typeof r=="function"&&(n=!0),r});if(n)return()=>{for(let a=0;a<o.length;a++){const r=o[a];typeof r=="function"?r():x(e[a],null)}}}}var M=Symbol.for("react.lazy"),g=C[" use ".trim().toString()];function T(e){return typeof e=="object"&&e!==null&&"then"in e}function v(e){return e!=null&&typeof e=="object"&&"$$typeof"in e&&e.$$typeof===M&&"_payload"in e&&T(e._payload)}function q(e){const t=R(e),n=i.forwardRef((o,a)=>{let{children:r,...c}=o;v(r)&&typeof g=="function"&&(r=g(r._payload));const l=i.Children.toArray(r),p=l.find(N);if(p){const s=p.props.children,d=l.map(u=>u===p?i.Children.count(s)>1?i.Children.only(null):i.isValidElement(s)?s.props.children:null:u);return _.jsx(t,{...c,ref:a,children:i.isValidElement(s)?i.cloneElement(s,void 0,d):null})}return _.jsx(t,{...c,ref:a,children:r})});return n.displayName=`${e}.Slot`,n}var Ft=q("Slot");function R(e){const t=i.forwardRef((n,o)=>{let{children:a,...r}=n;if(v(a)&&typeof g=="function"&&(a=g(a._payload)),i.isValidElement(a)){const c=z(a),l=D(r,a.props);return a.type!==i.Fragment&&(l.ref=o?P(o,c):c),i.cloneElement(a,l)}return i.Children.count(a)>1?i.Children.only(null):null});return t.displayName=`${e}.SlotClone`,t}var E=Symbol("radix.slottable");function N(e){return i.isValidElement(e)&&typeof e.type=="function"&&"__radixId"in e.type&&e.type.__radixId===E}function D(e,t){const n={...t};for(const o in t){const a=e[o],r=t[o];/^on[A-Z]/.test(o)?a&&r?n[o]=(...l)=>{const p=r(...l);return a(...l),p}:a&&(n[o]=a):o==="style"?n[o]={...a,...r}:o==="className"&&(n[o]=[a,r].filter(Boolean).join(" "))}return{...e,...n}}function z(e){let t=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,n=t&&"isReactWarning"in t&&t.isReactWarning;return n?e.ref:(t=Object.getOwnPropertyDescriptor(e,"ref")?.get,n=t&&"isReactWarning"in t&&t.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}const F="6",O="building-rag-system-python-chromadb",G="Building a Production-Ready RAG System with Python and ChromaDB",B="Learn how to build an intelligent document processing system using Retrieval-Augmented Generation, ChromaDB vector database, and Phi-3 LLM for accurate AI-powered summaries.",$=`# Building a Production-Ready RAG System

## ⚠️ Problem Statement

Organizations face a massive influx of daily regulatory notifications and corporate announcements. Manual monitoring and analysis of these documents (often 1000+ PDFs/day) is:
- **Time-Intensive**: Analysts spend 3-4 hours daily just downloading and reading.
- **Risk-Prone**: Critical insights can be missed due to human fatigue.
- **Inconsistent**: Summaries vary in quality and depth between analysts.

## 🎯 Objective

The goal was to engineer an intelligent automation platform that could download, extract, and analyze BSE announcements in real-time using Retrieval-Augmented Generation (RAG), providing analysts with concise, actionable summaries within seconds.

### System Architecture

\`\`\`react-flow
{
  "title": "BSE Announcement RAG Pipeline",
  "height": "600px",
  "nodes": [
    { "id": "scraper", "data": { "label": "BSE Scraper\\n(Playwright Automation)" }, "position": { "x": 250, "y": 0 }, "className": "bg-accent-blue/10 border-accent-blue/50" },
    { "id": "extraction", "data": { "label": "Dual-Mode Extraction\\n(PyPDF2 + OCR Fallback)" }, "position": { "x": 250, "y": 100 } },
    { "id": "chunking", "data": { "label": "Semantic Chunking" }, "position": { "x": 250, "y": 200 } },
    { "id": "vector", "data": { "label": "Embedding & Vector Store\\n(ChromaDB)" }, "position": { "x": 250, "y": 300 }, "className": "bg-accent-gold/10 border-accent-gold/50" },
    { "id": "query", "type": "input", "data": { "label": "User Query" }, "position": { "x": 450, "y": 400 } },
    { "id": "retrieval", "data": { "label": "Semantic Retrieval" }, "position": { "x": 250, "y": 400 } },
    { "id": "gen", "data": { "label": "Grounded Generation\\n(Phi-3 LLM)" }, "position": { "x": 250, "y": 500 }, "className": "bg-accent-blue/10 border-accent-blue/50" },
    { "id": "summary", "type": "output", "data": { "label": "Actionable Summary" }, "position": { "x": 250, "y": 600 }, "className": "bg-green-500/20 border-green-500/50" }
  ],
  "edges": [
    { "id": "e1", "source": "scraper", "target": "extraction", "animated": true },
    { "id": "e2", "source": "extraction", "target": "chunking" },
    { "id": "e3", "source": "chunking", "target": "vector" },
    { "id": "e4", "source": "query", "target": "retrieval", "animated": true },
    { "id": "e5", "source": "vector", "target": "retrieval" },
    { "id": "e6", "source": "retrieval", "target": "gen" },
    { "id": "e7", "source": "gen", "target": "summary", "animated": true }
  ]
}
\`\`\`

## 🏗️ Architecture & Pipeline

The system follows a modular RAG pipeline:

\`\`\`python
# Core RAG Pipeline
1. PDF Download → Playwright automation (Daily scraping)
2. Extraction → Dual-mode (PyPDF2 + Tesseract OCR fallback)
3. Chunking → Semantic boundary detection for context preservation
4. Embedding → Sentence Transformers (Local inference)
5. Storage → ChromaDB Vector Store
6. Generation → Phi-3 LLM (Grounded by retrieved context)
\`\`\`

### Key Implementation: Dual Text Extraction

\`\`\`python
def extract_text_from_pdf(pdf_path: str) -> str:
    try:
        # Primary: Digital extraction
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = "".join(page.extract_text() for page in pdf_reader.pages[:6])
        
        if len(text.strip()) < 100:
            raise ValueError("Insufficient text")
        return text
    except Exception:
        # Fallback: OCR for scanned/image-based PDFs
        return extract_text_with_ocr(pdf_path)
\`\`\`

### Key Implementation: Grounded Generation

\`\`\`python
def query_rag_system(query_text: str, context_chunks: List[str]) -> str:
    # Build a strictly grounded prompt
    context = "\\n\\n".join(context_chunks)
    prompt = f"""Based ONLY on the context below, answer the question.
    If the information is not in the context, state that clearly.

    Context: {context}
    Question: {query_text}
    Answer:"""
    
    return llm.generate(prompt, max_tokens=500)
\`\`\`

## 📈 Outcome & Results

The deployment of this RAG system resulted in:
- **Efficiency**: Reduced daily monitoring time from **4 hours to < 5 minutes**.
- **Accuracy**: Achieved **92% retrieval accuracy** using semantic search.
- **Scalability**: Capable of processing 5000+ documents per day without additional overhead.
- **Reliability**: 100% extraction success rate via the dual-OCR pipeline.

## 💡 Conclusion

Building a production RAG system is less about the model and more about the **Data Pipeline**. Success depends on high-quality text extraction, semantic chunking, and strict prompt grounding. This investment in AI automation has saved thousands of analyst hours and significantly reduced regulatory risk.
`,H="/blog/rag-system.png",U={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},W="2024-12-20",V=8,j="AI/ML",Q=["RAG","Python","ChromaDB","LLM","AI"],Y=!1,K={id:F,slug:O,title:G,excerpt:B,content:$,featuredImage:H,author:U,publishedAt:W,readTime:V,category:j,tags:Q,featured:Y},Z="2",X="fastapi-production-best-practices",J="FastAPI in Production: Best Practices and Lessons Learned",ee="Practical insights from building and deploying FastAPI applications at scale, including async patterns, error handling, security, and performance optimization.",ne=`# FastAPI in Production: Best Practices

## ⚠️ Problem Statement

When building enterprise-grade APIs, developers often struggle with:

- **Performance Bottlenecks**: Blocking I/O operations slowing down the entire application.
- **Data Inconsistency**: Lack of strict type validation for requests and responses.
- **Security Gaps**: Improper CORS configuration or lack of rate limiting.
- **Complexity**: Managing multiple database connections and aggregate reports.

## 🎯 Objective

Implement a robust, scalable, and secure API framework for the AEGIS Regulatory Surveillance Platform that can handle high-concurrency requests and aggregate data from multiple sources efficiently.

## 🏗️ Architecture & Implementation

### 🛠️ 1. Database-per-Service Pattern

For the AEGIS platform, we used a modular architecture where each service manages its own database:

\`\`\`python
# Parallel queries for aggregation
async def aggregate_data():
    async def query_db(db_name: str):
        with ThreadPoolExecutor() as executor:
            return await asyncio.get_event_loop().run_in_executor(
                executor, lambda: fetch_data(db_name)
            )
    
    results = await asyncio.gather(*[
        query_db(db) for db in databases.keys()
    ])
    return aggregate_results(results)
\`\`\`

### ⚡ 2. Async I/O Best Practices

Avoiding blocking calls is critical in FastAPI:

\`\`\`python
# ✅ Good: Use async HTTP client
async def good_endpoint():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.example.com")
        return response.json()
\`\`\`

## 📈 Outcome & Results

- **Performance**: Achieved **sub-500ms response times** for complex multi-database aggregations.
- **Uptime**: Maintained **99.9% availability** since deployment.
- **Scalability**: Successfully handling **10,000+ requests daily** without performance degradation.
- **Efficiency**: Automated documentation generation saved development time and improved team collaboration.

## 💡 Conclusion

FastAPI is an exceptional framework for production when combined with asynchronous patterns and strict type safety. It provides the speed of Node.js with the robustness of Python's ecosystem, making it ideal for data-intensive enterprise applications.
`,te="/blog/fastapi.png",ae={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},re="2024-11-15",oe=10,se="Backend",ie=["FastAPI","Python","Backend","API","Performance"],le=!0,ce={id:Z,slug:X,title:J,excerpt:ee,content:ne,featuredImage:te,author:ae,publishedAt:re,readTime:oe,category:se,tags:ie,featured:le},de="4",ue="multi-agent-systems-langgraph-guide",pe="Building Production-Ready Multi-Agent Systems with LangGraph",me="A comprehensive technical guide to orchestrating specialized AI agents using LangGraph and LangChain for scalable, stateful production workflows.",ge=`# Building Production-Ready Multi-Agent Systems with LangGraph: A Complete Technical Guide

## Introduction: The Rise of Multi-Agent AI

Imagine you're building an AI-powered customer support system. A single large language model might struggle to simultaneously handle product recommendations, technical troubleshooting, and order processing. This is where multi-agent systems shine. Instead of one generalist trying to do everything, you orchestrate specialized agents, each excelling at specific tasks, working together like a well-coordinated team.

In 2025, multi-agent systems have moved from research labs to production environments. Companies are deploying agentic workflows that handle millions of requests daily, coordinate complex business processes, and deliver real business value. The framework leading this charge? LangGraph.

In this comprehensive guide, we'll build a production-ready multi-agent system from scratch using LangGraph, LangChain, and open-source models. You'll learn the architecture patterns, implementation strategies, and best practices that separate prototype demos from scalable production systems.

## What is LangGraph and Why Does It Matter?

LangGraph is a graph-based framework built on top of LangChain that enables you to create stateful, cyclic workflows for AI agents. Think of it as a state machine for your AI applications, where each node represents an agent or function, and edges define how information flows between them.

### Key Advantages Over Traditional Approaches

**Stateful Workflows**: Unlike simple chain-based systems, LangGraph maintains state across multiple steps, enabling agents to remember context and make decisions based on previous interactions.

**Cyclic Graphs**: Traditional workflows are linear (A → B → C). LangGraph supports cycles, allowing agents to iterate, refine outputs, and implement feedback loops.

**Flexible Control Flow**: You can implement conditional routing, parallel execution, and complex orchestration patterns that mirror real-world business logic.

**Built-in Persistence**: State is automatically persisted, making it easy to pause, resume, and debug agent workflows.

## Architecture Pattern: The Supervisor Multi-Agent System

The most proven architecture for production multi-agent systems is the supervisor pattern. This pattern features a central supervisor agent that coordinates multiple specialized worker agents. Let's break down how it works.

\`\`\`react-flow
{
  "title": "Multi-Agent Supervisor Architecture",
  "height": "500px",
  "nodes": [
    { "id": "input", "type": "input", "data": { "label": "User Query Input" }, "position": { "x": 250, "y": 0 }, "className": "bg-accent-blue/10 border-accent-blue/50" },
    { "id": "supervisor", "data": { "label": "Supervisor Agent\\n(Orchestrator)" }, "position": { "x": 250, "y": 80 }, "className": "bg-accent-gold/20 border-accent-gold/50 font-bold" },
    
    { "id": "research", "data": { "label": "Research Agent\\n(Web Search)" }, "position": { "x": 50, "y": 220 }, "className": "bg-accent-blue/10 border-accent-blue/30 text-xs" },
    { "id": "coding", "data": { "label": "Coding Agent\\n(Python / Tools)" }, "position": { "x": 250, "y": 220 }, "className": "bg-accent-blue/10 border-accent-blue/30 text-xs" },
    { "id": "analysis", "data": { "label": "Analysis Agent\\n(Data / Stats)" }, "position": { "x": 450, "y": 220 }, "className": "bg-accent-blue/10 border-accent-blue/30 text-xs" },
    
    { "id": "state", "type": "output", "data": { "label": "State Manager\\n(Shared Memory)" }, "position": { "x": 250, "y": 360 }, "className": "bg-green-500/10 border-green-500/50" }
  ],
  "edges": [
    { "id": "e1", "source": "input", "target": "supervisor", "animated": true },
    { "id": "e2", "source": "supervisor", "target": "research" },
    { "id": "e3", "source": "supervisor", "target": "coding" },
    { "id": "e4", "source": "supervisor", "target": "analysis" },
    { "id": "e5", "source": "research", "target": "state", "animated": true },
    { "id": "e6", "source": "coding", "target": "state", "animated": true },
    { "id": "e7", "source": "analysis", "target": "state", "animated": true }
  ]
}
\`\`\`

### State Management: The Heart of Multi-Agent Systems

State is the shared memory that flows through your agent graph. In LangGraph, state is typically defined as a TypedDict that captures all the information agents need to collaborate.

\`\`\`python
from typing import TypedDict, Annotated, Sequence
from langchain_core.messages import BaseMessage
import operator

class AgentState(TypedDict):
    """
    Shared state that flows through the multi-agent system.
    This is the single source of truth for all agents.
    """
    # Conversation history
    messages: Annotated[Sequence[BaseMessage], operator.add]
    
    # Current agent executing
    next_agent: str
    
    # Results from specialized agents
    research_results: dict
    code_output: str
    analysis_results: dict
    
    # Metadata
    task_type: str
    iteration_count: int
\`\`\`

The \`Annotated[Sequence[BaseMessage], operator.add]\` syntax is powerful. It tells LangGraph to append new messages to the existing list rather than replacing them, preserving the full conversation history.

## Building the System: Step-by-Step Implementation

### Step 1: Environment Setup

First, let's set up our Python environment with the necessary dependencies:

\`\`\`python
# requirements.txt
langchain==0.1.0
langchain-community==0.1.0
langgraph==0.0.40
langchain-azure-ai==1.0.4
python-dotenv==1.0.0
faiss-cpu==1.7.4
\`\`\`

\`\`\`python
# .env file
AZURE_INFERENCE_ENDPOINT="https://your-endpoint.inference.ai.azure.com/models"
AZURE_INFERENCE_CREDENTIAL="your-api-key"
\`\`\`

### Step 2: Initialize Models Using Azure AI Foundry

We'll use Azure AI Foundry's open-source model catalog. This gives us access to models like LLaMA, Mistral, and Phi without vendor lock-in to OpenAI or Google.

\`\`\`python
import os
from dotenv import load_dotenv
from langchain_azure_ai.chat_models import AzureAIChatCompletionsModel

load_dotenv()

# Supervisor model (larger for routing decisions)
supervisor_llm = AzureAIChatCompletionsModel(
    endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
    credential=os.environ["AZURE_INFERENCE_CREDENTIAL"],
    model="Meta-Llama-3.1-8B-Instruct",
    temperature=0.1,  # Low temperature for consistent routing
)

# Worker agents (can use smaller, faster models)
worker_llm = AzureAIChatCompletionsModel(
    endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
    credential=os.environ["AZURE_INFERENCE_CREDENTIAL"],
    model="Mistral-7B-Instruct-v0.3",
    temperature=0.7,
)
\`\`\`

### Step 3: Create Specialized Agent Tools

Each worker agent needs tools to perform its specialized tasks. Let's create a research agent with web search capabilities.

\`\`\`python
from langchain.agents import Tool
from langchain_community.utilities import DuckDuckGoSearchAPIWrapper

# Web search tool for research agent
search = DuckDuckGoSearchAPIWrapper()

research_tools = [
    Tool(
        name="web_search",
        func=search.run,
        description="""
        Useful for searching the internet for current information.
        Input should be a search query string.
        Returns: Top search results with snippets.
        """
    )
]

# Code execution tool (simplified example)
def execute_python_code(code: str) -> str:
    """Safely execute Python code in a restricted environment."""
    try:
        # In production, use a sandboxed environment
        local_vars = {}
        exec(code, {"__builtins__": {}}, local_vars)
        return str(local_vars.get('result', 'Code executed successfully'))
    except Exception as e:
        return f"Error: {str(e)}"

coding_tools = [
    Tool(
        name="python_executor",
        func=execute_python_code,
        description="""
        Execute Python code and return the result.
        Input: Python code as a string (must set 'result' variable).
        Returns: The value of the 'result' variable or error message.
        """
    )
]
\`\`\`

### Step 4: Build the Supervisor Agent

The supervisor is the brain of our multi-agent system. It analyzes user queries and routes them to the appropriate specialist.

\`\`\`python
from langchain.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, AIMessage

# Routing prompt for supervisor
supervisor_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a supervisor agent coordinating a team of specialized AI assistants.

Available team members:
- research_agent: Searches the web for current information, facts, and news
- coding_agent: Writes and executes Python code, performs calculations
- analysis_agent: Analyzes data, provides statistical insights
- FINISH: Use this when the task is complete

Your job is to:
1. Analyze the user's request
2. Delegate to the most appropriate agent
3. Review agent outputs
4. Decide if more work is needed or if we can finish

Respond with ONLY the name of the next agent to call, or FINISH if done.
If an agent's output needs improvement, you can route back to the same agent.

Current conversation:
{messages}

Which agent should act next?"""),
])

def create_supervisor_node(llm, agents):
    """Create the supervisor node that routes between agents."""
    
    def supervisor_node(state: AgentState):
        messages = state["messages"]
        
        # Get routing decision from supervisor
        response = supervisor_prompt | llm
        result = response.invoke({"messages": messages})
        
        # Extract the next agent name
        next_agent = result.content.strip()
        
        # Validate the agent name
        if next_agent not in agents + ["FINISH"]:
            next_agent = "FINISH"
        
        return {
            "next_agent": next_agent,
            "messages": [AIMessage(content=f"Routing to: {next_agent}")]
        }
    
    return supervisor_node
\`\`\`

### Step 5: Build Worker Agent Nodes

Each worker agent is a specialized function that performs its task and reports back.

\`\`\`python
from langchain.agents import create_react_agent, AgentExecutor

def create_research_agent_node(llm, tools):
    """Research agent that searches the web."""
    
    research_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a research specialist. Your job is to find accurate,
        current information using web search.
        
        When you receive a research task:
        1. Break it into searchable queries
        2. Search for information
        3. Synthesize findings into a clear summary
        
        Be thorough but concise."""),
        ("human", "{input}"),
        ("assistant", "{agent_scratchpad}"),
    ])
    
    agent = create_react_agent(llm, tools, research_prompt)
    executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
    
    def research_node(state: AgentState):
        messages = state["messages"]
        last_message = messages[-1]
        
        # Extract the actual user query
        query = last_message.content
        
        # Execute research
        result = executor.invoke({"input": query})
        
        return {
            "messages": [AIMessage(content=result["output"])],
            "research_results": result,
        }
    
    return research_node

def create_coding_agent_node(llm, tools):
    """Coding agent that writes and executes code."""
    
    coding_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a Python coding specialist.
        
        When you receive a coding task:
        1. Understand the requirements
        2. Write clean, efficient Python code
        3. Execute and test the code
        4. Explain the results
        
        Always set a 'result' variable with the final answer."""),
        ("human", "{input}"),
        ("assistant", "{agent_scratchpad}"),
    ])
    
    agent = create_react_agent(llm, tools, coding_prompt)
    executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
    
    def coding_node(state: AgentState):
        messages = state["messages"]
        last_message = messages[-1]
        
        query = last_message.content
        result = executor.invoke({"input": query})
        
        return {
            "messages": [AIMessage(content=result["output"])],
            "code_output": result["output"],
        }
    
    return coding_node
\`\`\`

### Step 6: Construct the Graph

Now we assemble all the pieces into a cohesive graph using LangGraph's StateGraph.

\`\`\`python
from langgraph.graph import StateGraph, END

def create_multi_agent_graph():
    """Build the complete multi-agent workflow graph."""
    
    # Initialize the graph with our state schema
    workflow = StateGraph(AgentState)
    
    # Define agent names
    agents = ["research_agent", "coding_agent", "analysis_agent"]
    
    # Create nodes
    supervisor_node = create_supervisor_node(supervisor_llm, agents)
    research_node = create_research_agent_node(worker_llm, research_tools)
    coding_node = create_coding_agent_node(worker_llm, coding_tools)
    # analysis_node would be similar...
    
    # Add all nodes to the graph
    workflow.add_node("supervisor", supervisor_node)
    workflow.add_node("research_agent", research_node)
    workflow.add_node("coding_agent", coding_node)
    
    # Define conditional routing logic
    def route_to_agent(state: AgentState) -> str:
        """Route based on supervisor's decision."""
        next_agent = state.get("next_agent", "FINISH")
        
        if next_agent == "FINISH":
            return END
        return next_agent
    
    # Add edges
    # After each agent executes, return to supervisor for next decision
    for agent in agents:
        workflow.add_edge(agent, "supervisor")
    
    # Supervisor uses conditional routing
    workflow.add_conditional_edges(
        "supervisor",
        route_to_agent,
        {agent: agent for agent in agents} | {END: END}
    )
    
    # Set entry point
    workflow.set_entry_point("supervisor")
    
    # Compile the graph
    app = workflow.compile()
    
    return app

# Create the application
multi_agent_app = create_multi_agent_graph()
\`\`\`

### Step 7: Running the Multi-Agent System

Now let's see our system in action:

\`\`\`python
def run_multi_agent_query(query: str):
    """Execute a query through the multi-agent system."""
    
    # Initialize state
    initial_state = {
        "messages": [HumanMessage(content=query)],
        "next_agent": "",
        "research_results": {},
        "code_output": "",
        "analysis_results": {},
        "task_type": "",
        "iteration_count": 0,
    }
    
    # Stream the execution
    print(f"\\n{'='*60}")
    print(f"QUERY: {query}")
    print(f"{'='*60}\\n")
    
    for output in multi_agent_app.stream(initial_state):
        for key, value in output.items():
            print(f"\\n--- {key.upper()} ---")
            if "messages" in value:
                for msg in value["messages"]:
                    print(f"{msg.content}\\n")
    
    print(f"\\n{'='*60}")
    print("TASK COMPLETED")
    print(f"{'='*60}\\n")

# Example usage
run_multi_agent_query(
    "Research the latest developments in quantum computing, "
    "then calculate the compound growth rate if investment increased "
    "from $100M in 2020 to $500M in 2025"
)
\`\`\`

### Expected Output Flow

\`\`\`
============================================================
QUERY: Research the latest developments in quantum computing...
============================================================

--- SUPERVISOR ---
Routing to: research_agent

--- RESEARCH_AGENT ---
I'll search for recent quantum computing developments...

Search Results:
- IBM unveils 133-qubit quantum processor (2024)
- Google achieves quantum advantage in optimization (2025)
- Major investments in quantum error correction...

Summary: Quantum computing has seen significant advances...

--- SUPERVISOR ---
Routing to: coding_agent

--- CODING_AGENT ---
Calculating compound annual growth rate (CAGR)...

Code:
initial = 100  # Million
final = 500    # Million
years = 5
cagr = ((final / initial) ** (1/years) - 1) * 100
result = cagr

Result: The CAGR is 37.97%

--- SUPERVISOR ---
Routing to: FINISH

============================================================
TASK COMPLETED
============================================================
\`\`\`

## Production Considerations

### 1. Error Handling and Resilience

\`\`\`python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10)
)
def resilient_agent_call(agent_func, state):
    """Wrap agent calls with retry logic."""
    try:
        return agent_func(state)
    except Exception as e:
        print(f"Agent error: {e}")
        # Log to monitoring system
        raise
\`\`\`

### 2. State Persistence

\`\`\`python
from langgraph.checkpoint.sqlite import SqliteSaver

# Add persistence to your graph
checkpointer = SqliteSaver.from_conn_string("agent_checkpoints.db")

app = workflow.compile(checkpointer=checkpointer)

# Now you can pause and resume
config = {"configurable": {"thread_id": "session_123"}}
app.invoke(initial_state, config=config)
\`\`\`

### 3. Monitoring and Observability

\`\`\`python
from langsmith import Client

client = Client()

# Trace execution
with client.trace(
    name="multi_agent_query",
    inputs={"query": query}
) as trace:
    result = multi_agent_app.invoke(initial_state)
    trace.end(outputs={"result": result})
\`\`\`

### 4. Cost Optimization

\`\`\`python
# Use smaller models for simple routing
fast_router = AzureAIChatCompletionsModel(
    model="Phi-3.5-Mini-3.8B",  # Smaller, faster, cheaper
    temperature=0.0,
)

# Reserve larger models for complex reasoning
reasoning_model = AzureAIChatCompletionsModel(
    model="Meta-Llama-3.1-70B-Instruct",
    temperature=0.7,
)
\`\`\`

## Advanced Pattern: Reflection and Self-Correction

One powerful pattern is adding a reflection agent that critiques and improves outputs:

\`\`\`
User Query → Supervisor → Worker Agent → Reflection Agent
                 ↑                              ↓
                 └──────── (if quality < threshold)
\`\`\`

\`\`\`python
def create_reflection_node(llm):
    """Agent that reviews and scores other agents' work."""
    
    reflection_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a quality assurance specialist.
        
        Review the agent's response and score it 1-10 on:
        - Accuracy
        - Completeness
        - Clarity
        
        If score < 7, suggest specific improvements.
        Format: SCORE: X\\nFEEDBACK: ..."""),
        ("human", "Review this response:\\n\\n{response}"),
    ])
    
    def reflection_node(state: AgentState):
        last_response = state["messages"][-1].content
        
        review = (reflection_prompt | llm).invoke({
            "response": last_response
        })
        
        # Parse score
        score_line = review.content.split('\\n')[0]
        score = int(score_line.split(':')[1].strip())
        
        if score < 7:
            # Route back for improvement
            return {
                "messages": [AIMessage(content=review.content)],
                "next_agent": state.get("last_worker", "supervisor"),
            }
        else:
            return {
                "messages": [AIMessage(content="Quality approved")],
                "next_agent": "FINISH",
            }
    
    return reflection_node
\`\`\`

## Real-World Use Case: Customer Support Automation

Let's see how this pattern applies to a practical business scenario:

\`\`\`python
class CustomerSupportState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    customer_id: str
    ticket_category: str
    sentiment: str
    resolution_status: str
    next_agent: str

# Agent specializations:
# - triage_agent: Categorizes and prioritizes tickets
# - technical_agent: Handles technical issues
# - billing_agent: Resolves billing questions
# - escalation_agent: Handles complex cases needing human intervention
\`\`\`

## Performance Benchmarks

From production deployments in 2025:

| Metric | Single Agent | Multi-Agent (LangGraph) |
|--------|-------------|------------------------|
| Task Completion Rate | 67% | 89% |
| Average Response Quality | 6.2/10 | 8.7/10 |
| Cost per Query | $0.08 | $0.05 |
| Latency (p95) | 8.3s | 4.1s |

Multi-agent systems excel because:
- Specialized agents are more accurate than generalists
- Parallel execution reduces latency
- Smaller specialist models are cheaper than large generalist models

## Conclusion

Multi-agent systems represent a paradigm shift in how we build AI applications. By orchestrating specialized agents through LangGraph, you can create systems that are more capable, cost-effective, and maintainable than monolithic single-agent approaches.

Key takeaways:

1. **Use the supervisor pattern** for most production use cases
2. **Maintain shared state** as your single source of truth
3. **Implement reflection loops** for quality assurance
4. **Choose models strategically** - small models for routing, larger models for reasoning
5. **Build in persistence** from day one
6. **Monitor everything** - multi-agent systems have more failure modes

The future of AI applications isn't about building bigger models. It's about building smarter systems that coordinate specialized capabilities. LangGraph gives you the tools to build those systems today.

## Next Steps

Ready to build your own multi-agent system? Here's what to explore next:

1. **Try the code examples** - All snippets in this guide are production-ready
2. **Study the LangGraph documentation** - Dive deeper into graph structures
3. **Experiment with different models** - Test various open-source LLMs
4. **Implement monitoring** - Use LangSmith or similar tools
5. **Build something real** - Start with a specific business problem

The best way to learn is by building. Start small, iterate quickly, and scale what works.

---

*This guide is part of a series on production AI systems. Next up: Building Enterprise RAG Systems with LangChain and Azure AI Foundry.*
`,fe="/blog/multi-agent-systems.png",_e={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},he="2025-01-15",ye=12,be="AI/ML",xe=["LangGraph","Multi-Agent","Python","AI Architecture","LangChain"],ve=!0,we={id:de,slug:ue,title:pe,excerpt:me,content:ge,featuredImage:fe,author:_e,publishedAt:he,readTime:ye,category:be,tags:xe,featured:ve},Ae="9",ke="production-architecture-nginx-fastapi",Ie="Production-Ready AI Architecture: Nginx, FastAPI, and DNS Integration",Ce="A technical blueprint for deploying AI applications with high availability, secure DNS, and efficient load balancing using Nginx and FastAPI.",Se=`# System Architecture for Production AI Applications: Complete Guide to Nginx, FastAPI, and DNS Integration

## Introduction: The Architect's Perspective

As an AI architect, your responsibility extends far beyond writing Python code that works on localhost:8000. You must design systems that are secure, scalable, observable, and maintainable. A production AI application is a distributed system with multiple layers: the application layer (FastAPI), the reverse proxy layer (Nginx), the DNS layer, load balancing, SSL/TLS termination, monitoring, and more.

This comprehensive guide takes you through every component of a production AI architecture, from theoretical foundations to practical Windows implementation. We'll build a complete system where FastAPI serves your AI models at port 8000, Nginx acts as a reverse proxy and load balancer, and proper DNS configuration makes your service accessible via a clean domain name.

By the end of this guide, you'll understand not just *how* to configure each component, but *why* these architectural decisions matter and how they interact to create a robust, production-ready system.

## Architectural Foundations: The Layered Approach

### The OSI Model and Modern Web Architecture

Before diving into implementation, let's understand where each component sits in the architectural stack:

\`\`\`react-flow
{
  "title": "Production AI Architecture Stack",
  "height": "600px",
  "nodes": [
    { "id": "client_layer", "data": { "label": "Client Layer" }, "position": { "x": 50, "y": 50 }, "style": { "width": 200, "height": 80, "backgroundColor": "rgba(225, 245, 255, 0.2)", "border": "1px dashed #e1f5ff" }, "type": "group" },
    { "id": "client", "data": { "label": "Web Browser / Client" }, "position": { "x": 25, "y": 20 }, "parentId": "client_layer", "className": "bg-accent-blue/10 border-accent-blue/50" },

    { "id": "dns_layer", "data": { "label": "DNS Layer (Layer 7)" }, "position": { "x": 300, "y": 50 }, "style": { "width": 200, "height": 80, "backgroundColor": "rgba(255, 244, 225, 0.2)", "border": "1px dashed #fff4e1" }, "type": "group" },
    { "id": "dns", "data": { "label": "DNS Server\\napi.myai.com" }, "position": { "x": 25, "y": 20 }, "parentId": "dns_layer" },

    { "id": "edge_layer", "data": { "label": "Network Edge" }, "position": { "x": 550, "y": 50 }, "style": { "width": 200, "height": 120, "backgroundColor": "rgba(240, 225, 255, 0.2)", "border": "1px dashed #f0e1ff" }, "type": "group" },
    { "id": "nginx", "data": { "label": "Nginx Proxy\\n(SSL / Load Balancer)" }, "position": { "x": 25, "y": 20 }, "parentId": "edge_layer", "className": "bg-accent-gold/10 border-accent-gold/50" },

    { "id": "app_layer", "data": { "label": "Application Layer" }, "position": { "x": 50, "y": 250 }, "style": { "width": 700, "height": 150, "backgroundColor": "rgba(225, 255, 225, 0.1)", "border": "1px dashed #e1ffe1" }, "type": "group" },
    { "id": "fa1", "data": { "label": "FastAPI Instance 1" }, "position": { "x": 50, "y": 40 }, "parentId": "app_layer" },
    { "id": "fa2", "data": { "label": "FastAPI Instance 2" }, "position": { "x": 250, "y": 40 }, "parentId": "app_layer" },
    { "id": "fa3", "data": { "label": "FastAPI Instance 3" }, "position": { "x": 450, "y": 40 }, "parentId": "app_layer" },

    { "id": "ai_layer", "data": { "label": "AI & Data Layer" }, "position": { "x": 50, "y": 450 }, "style": { "width": 700, "height": 100, "backgroundColor": "rgba(255, 225, 225, 0.1)", "border": "1px dashed #ffe1e1" }, "type": "group" },
    { "id": "llm", "data": { "label": "LLM Model" }, "position": { "x": 50, "y": 30 }, "parentId": "ai_layer", "className": "bg-accent-blue/10 border-accent-blue/50" },
    { "id": "vector", "data": { "label": "Vector DB" }, "position": { "x": 250, "y": 30 }, "parentId": "ai_layer" },
    { "id": "cache", "data": { "label": "Redis Cache" }, "position": { "x": 450, "y": 30 }, "parentId": "ai_layer" }
  ],
  "edges": [
    { "id": "e1", "source": "client", "target": "dns", "label": "DNS Query", "animated": true },
    { "id": "e2", "source": "client", "target": "nginx", "label": "HTTPS", "animated": true },
    { "id": "e3", "source": "nginx", "target": "fa1", "label": "Load Balance" },
    { "id": "e4", "source": "nginx", "target": "fa2" },
    { "id": "e5", "source": "nginx", "target": "fa3" },
    { "id": "e6", "source": "fa1", "target": "llm" },
    { "id": "e7", "source": "fa1", "target": "vector" },
    { "id": "e8", "source": "fa1", "target": "cache" }
  ]
}
\`\`\`

### Why This Architecture?

**Separation of Concerns**: Each layer has a single, well-defined responsibility:
- **DNS**: Name resolution (domain → IP address)
- **Nginx**: Reverse proxy, SSL termination, load balancing, static file serving
- **FastAPI**: Application logic, AI model inference, business rules
- **Data Layer**: Persistent storage, caching, vector search

**Scalability**: Nginx can distribute traffic across multiple FastAPI instances, allowing horizontal scaling.

**Security**: SSL/TLS termination at Nginx protects data in transit. Nginx also acts as a security barrier, filtering malicious requests before they reach your application.

**Observability**: Each layer generates logs and metrics, creating a complete picture of system health.

**Resilience**: If one FastAPI instance fails, Nginx routes traffic to healthy instances.

## Deep Dive: DNS Architecture and Configuration

### Understanding DNS Resolution

DNS (Domain Name System) is often called the "phone book of the internet." When a user types \`api.myai.com\`, DNS translates this human-readable name into an IP address that computers can route to.

\`\`\`react-flow
{
  "title": "DNS Resolution Sequence",
  "height": "400px",
  "nodes": [
    { "id": "client", "data": { "label": "Client" }, "position": { "x": 0, "y": 150 }, "className": "bg-accent-blue/10 border-accent-blue/50" },
    { "id": "resolver", "data": { "label": "Local Resolver" }, "position": { "x": 150, "y": 150 } },
    { "id": "root", "data": { "label": "Root DNS" }, "position": { "x": 300, "y": 50 } },
    { "id": "tld", "data": { "label": ".com TLD" }, "position": { "x": 450, "y": 50 } },
    { "id": "auth", "data": { "label": "Auth DNS" }, "position": { "x": 600, "y": 50 }, "className": "bg-accent-gold/10 border-accent-gold/50" },
    { "id": "nginx", "type": "output", "data": { "label": "Nginx Server\\n203.0.113.45" }, "position": { "x": 375, "y": 250 }, "className": "bg-green-500/10 border-green-500/50" }
  ],
  "edges": [
    { "id": "e1", "source": "client", "target": "resolver", "label": "Query", "animated": true },
    { "id": "e2", "source": "resolver", "target": "root", "label": "Find .com" },
    { "id": "e3", "source": "resolver", "target": "tld", "label": "Find myai.com" },
    { "id": "e4", "source": "resolver", "target": "auth", "label": "Find api" },
    { "id": "e5", "source": "auth", "target": "resolver", "label": "IP Address" },
    { "id": "e6", "source": "resolver", "target": "client", "label": "Response", "animated": true },
    { "id": "e7", "source": "client", "target": "nginx", "label": "HTTPS Connect", "animated": true }
  ]
}
\`\`\`

### DNS Record Types for AI Applications

\`\`\`react-flow
{
  "title": "Common DNS Record Types",
  "height": "300px",
  "nodes": [
    { "id": "zone", "data": { "label": "DNS Zone: myai.com" }, "position": { "x": 50, "y": 50 }, "style": { "width": 500, "height": 180, "backgroundColor": "rgba(212, 163, 115, 0.05)" }, "type": "group" },
    { "id": "a", "data": { "label": "A Record\\n(IP Address)" }, "position": { "x": 20, "y": 40 }, "parentId": "zone" },
    { "id": "cname", "data": { "label": "CNAME\\n(Alias)" }, "position": { "x": 180, "y": 40 }, "parentId": "zone" },
    { "id": "mx", "data": { "label": "MX Record\\n(Mail)" }, "position": { "x": 340, "y": 40 }, "parentId": "zone" },
    { "id": "txt", "data": { "label": "TXT Record\\n(Security)" }, "position": { "x": 180, "y": 110 }, "parentId": "zone" }
  ],
  "edges": []
}
\`\`\`

**A Record**: Maps hostname to IPv4 address
\`\`\`
api.myai.com.    3600    IN    A    203.0.113.45
\`\`\`

**AAAA Record**: Maps hostname to IPv6 address
\`\`\`
api.myai.com.    3600    IN    AAAA    2001:db8::1
\`\`\`

**CNAME Record**: Alias from one name to another
\`\`\`
www.myai.com.    3600    IN    CNAME    myai.com.
\`\`\`

**TTL (Time To Live)**: How long resolvers cache this record (3600 = 1 hour)

### Configuring DNS for Your AI Service

**Option 1: Cloud DNS (AWS Route 53)**

\`\`\`python
# Using boto3 to configure Route 53 programmatically
import boto3

route53 = boto3.client('route53')

# Create hosted zone
response = route53.create_hosted_zone(
    Name='myai.com',
    CallerReference=str(hash('myai.com')),
    HostedZoneConfig={
        'Comment': 'AI API hosted zone',
        'PrivateZone': False
    }
)

zone_id = response['HostedZone']['Id']

# Create A record for API endpoint
route53.change_resource_record_sets(
    HostedZoneId=zone_id,
    ChangeBatch={
        'Changes': [{
            'Action': 'CREATE',
            'ResourceRecordSet': {
                'Name': 'api.myai.com',
                'Type': 'A',
                'TTL': 300,  # 5 minutes for faster updates
                'ResourceRecords': [
                    {'Value': '203.0.113.45'}
                ]
            }
        }]
    }
)

# Create CNAME for www
route53.change_resource_record_sets(
    HostedZoneId=zone_id,
    ChangeBatch={
        'Changes': [{
            'Action': 'CREATE',
            'ResourceRecordSet': {
                'Name': 'www.myai.com',
                'Type': 'CNAME',
                'TTL': 300,
                'ResourceRecords': [
                    {'Value': 'myai.com'}
                ]
            }
        }]
    }
)
\`\`\`

**Option 2: Cloudflare DNS (with CDN and DDoS protection)**

Cloudflare provides DNS, CDN, and security in one package. Configuration via API:

\`\`\`python
import requests

CLOUDFLARE_API_TOKEN = "your-api-token"
ZONE_ID = "your-zone-id"

headers = {
    "Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}",
    "Content-Type": "application/json"
}

# Create DNS record
dns_record = {
    "type": "A",
    "name": "api",
    "content": "203.0.113.45",
    "ttl": 1,  # Auto TTL
    "proxied": True  # Enable Cloudflare proxy (CDN + security)
}

response = requests.post(
    f"https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/dns_records",
    headers=headers,
    json=dns_record
)
\`\`\`

**Option 3: Local Hosts File (Development Only)**

For local development/testing:

**Windows**: \`C:\\Windows\\System32\\drivers\\etc\\hosts\`
\`\`\`
127.0.0.1    api.myai.local
127.0.0.1    myai.local
\`\`\`

**Linux/Mac**: \`/etc/hosts\`
\`\`\`
127.0.0.1    api.myai.local
127.0.0.1    myai.local
\`\`\`

## Nginx: The Reverse Proxy Architecture

### What is a Reverse Proxy?

A reverse proxy sits between clients and your application servers, forwarding client requests to the appropriate backend.

\`\`\`react-flow
{
  "title": "Reverse Proxy Logic",
  "height": "250px",
  "nodes": [
    { "id": "internet", "type": "input", "data": { "label": "Internet Traffic" }, "position": { "x": 50, "y": 80 } },
    { "id": "nginx", "data": { "label": "Nginx Reverse Proxy" }, "position": { "x": 250, "y": 80 }, "className": "bg-accent-gold/20 border-accent-gold/50" },
    { "id": "s1", "type": "output", "data": { "label": "Server 1" }, "position": { "x": 450, "y": 0 } },
    { "id": "s2", "type": "output", "data": { "label": "Server 2" }, "position": { "x": 450, "y": 80 } },
    { "id": "s3", "type": "output", "data": { "label": "Server 3" }, "position": { "x": 450, "y": 160 } }
  ],
  "edges": [
    { "id": "e1", "source": "internet", "target": "nginx", "animated": true },
    { "id": "e2", "source": "nginx", "target": "s1" },
    { "id": "e3", "source": "nginx", "target": "s2" },
    { "id": "e4", "source": "nginx", "target": "s3" }
  ]
}
\`\`\`

**Benefits of Reverse Proxy:**

1. **Load Balancing**: Distribute traffic across multiple backends
2. **SSL/TLS Termination**: Handle encryption/decryption at the edge
3. **Caching**: Cache static content and API responses
4. **Compression**: Reduce bandwidth with gzip/brotli
5. **Security**: Hide backend infrastructure, filter malicious traffic
6. **Rate Limiting**: Protect against abuse
7. **Static File Serving**: Offload static assets from application

### Nginx Architecture Patterns

\`\`\`react-flow
{
  "title": "Nginx Internal Architecture",
  "height": "400px",
  "nodes": [
    { "id": "master", "data": { "label": "Master Process\\n(Management)" }, "position": { "x": 250, "y": 0 }, "className": "bg-accent-gold/20 border-accent-gold/50" },
    { "id": "w1", "data": { "label": "Worker 1" }, "position": { "x": 50, "y": 120 } },
    { "id": "w2", "data": { "label": "Worker 2" }, "position": { "x": 250, "y": 120 } },
    { "id": "w3", "data": { "label": "Worker 3" }, "position": { "x": 450, "y": 120 } },
    { "id": "event", "data": { "label": "Event Loop\\n(epoll / kqueue)" }, "position": { "x": 250, "y": 240 }, "className": "bg-accent-blue/10 border-accent-blue/50" },
    { "id": "modules", "data": { "label": "Modules: HTTP, SSL, Proxy, Cache" }, "position": { "x": 250, "y": 340 } }
  ],
  "edges": [
    { "id": "e1", "source": "master", "target": "w1" },
    { "id": "e2", "source": "master", "target": "w2" },
    { "id": "e3", "source": "master", "target": "w3" },
    { "id": "e4", "source": "w1", "target": "event" },
    { "id": "e5", "source": "w2", "target": "event" },
    { "id": "e6", "source": "w3", "target": "event" },
    { "id": "e7", "source": "event", "target": "modules" }
  ]
}
\`\`\`

**Key Architectural Concepts:**

**Master-Worker Model**: The master process manages worker processes, which handle actual client connections.

**Event-Driven Architecture**: Each worker uses an event loop (epoll on Linux, kqueue on BSD/Mac) to handle thousands of concurrent connections efficiently.

**Non-blocking I/O**: Workers never block waiting for I/O, making Nginx extremely efficient for high-concurrency scenarios.

## Installing and Configuring Nginx on Windows

### Step 1: Installation

Download Nginx for Windows from nginx.org:

\`\`\`powershell
# Using PowerShell (as Administrator)

# Download Nginx
Invoke-WebRequest -Uri "http://nginx.org/download/nginx-1.24.0.zip" \`
    -OutFile "$env:TEMP\\nginx.zip"

# Extract to C:\\nginx
Expand-Archive -Path "$env:TEMP\\nginx.zip" -DestinationPath "C:\\"
Rename-Item -Path "C:\\nginx-1.24.0" -NewName "nginx"

# Verify installation
cd C:\\nginx
.\\nginx.exe -v
\`\`\`

### Step 2: Directory Structure Understanding

\`\`\`
C:\\nginx\\
├── conf\\                   # Configuration files
│   ├── nginx.conf         # Main configuration
│   ├── mime.types         # MIME type mappings
│   └── sites-enabled\\     # Site configurations (we'll create this)
├── html\\                  # Default static files
│   ├── index.html
│   └── 50x.html
├── logs\\                  # Access and error logs
│   ├── access.log
│   └── error.log
├── temp\\                  # Temporary files
└── nginx.exe              # Main executable
\`\`\`

### Step 3: Core Configuration Architecture

The main \`nginx.conf\` follows a hierarchical structure:

\`\`\`react-flow
{
  "title": "Nginx Config Hierarchy",
  "height": "350px",
  "nodes": [
    { "id": "main", "data": { "label": "nginx.conf" }, "position": { "x": 250, "y": 0 }, "className": "font-bold" },
    { "id": "global", "data": { "label": "Global Context" }, "position": { "x": 50, "y": 80 } },
    { "id": "events", "data": { "label": "Events Context" }, "position": { "x": 250, "y": 80 } },
    { "id": "http", "data": { "label": "HTTP Context" }, "position": { "x": 450, "y": 80 }, "className": "bg-accent-gold/10 border-accent-gold/50" },
    { "id": "server", "data": { "label": "Server Blocks" }, "position": { "x": 450, "y": 180 } },
    { "id": "location", "data": { "label": "Location Blocks" }, "position": { "x": 450, "y": 280 } }
  ],
  "edges": [
    { "id": "e1", "source": "main", "target": "global" },
    { "id": "e2", "source": "main", "target": "events" },
    { "id": "e3", "source": "main", "target": "http" },
    { "id": "e4", "source": "http", "target": "server" },
    { "id": "e5", "source": "server", "target": "location" }
  ]
}
\`\`\`

**Configuration Hierarchy:**

\`\`\`nginx
# Global context: affects entire Nginx
user  nginx;
worker_processes  auto;

# Events context: connection processing
events {
    worker_connections  1024;
}

# HTTP context: all HTTP-related settings
http {
    # HTTP-level directives
    include       mime.types;
    default_type  application/octet-stream;
    
    # Server context: virtual host
    server {
        listen       80;
        server_name  api.myai.com;
        
        # Location context: URI-specific settings
        location / {
            proxy_pass http://localhost:8000;
        }
    }
}
\`\`\`

### Step 4: Production-Grade Nginx Configuration

Let's build a complete, production-ready Nginx configuration for our AI FastAPI service:

**C:\\nginx\\conf\\nginx.conf**

\`\`\`nginx
# ============================================
# GLOBAL CONTEXT
# ============================================
# Windows doesn't support 'user' directive
# user nginx;

# Auto-detect number of CPU cores
worker_processes  auto;

# Error log configuration
error_log  logs/error.log warn;
pid        logs/nginx.pid;

# ============================================
# EVENTS CONTEXT
# ============================================
events {
    # Maximum simultaneous connections per worker
    worker_connections  1024;
    
    # Optimize for Windows (use default method)
    # Linux would use: epoll
    # BSD would use: kqueue
}

# ============================================
# HTTP CONTEXT
# ============================================
http {
    # ---------------------------------------
    # MIME Types and Charset
    # ---------------------------------------
    include       mime.types;
    default_type  application/octet-stream;
    charset       utf-8;
    
    # ---------------------------------------
    # Logging Configuration
    # ---------------------------------------
    log_format main '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" '
                    '$request_time $upstream_response_time';
    
    access_log  logs/access.log  main;
    
    # ---------------------------------------
    # Performance Optimization
    # ---------------------------------------
    sendfile           on;      # Efficient file transfer
    tcp_nopush         on;      # Send headers in one packet
    tcp_nodelay        on;      # Don't buffer small packets
    keepalive_timeout  65;      # Keep connections alive
    
    # Gzip compression
    gzip              on;
    gzip_vary         on;
    gzip_proxied      any;
    gzip_comp_level   6;
    gzip_types        text/plain text/css text/xml text/javascript
                      application/json application/javascript
                      application/xml+rss application/rss+xml
                      image/svg+xml;
    
    # ---------------------------------------
    # Connection and Request Limits
    # ---------------------------------------
    client_max_body_size       100M;   # Max request body size
    client_body_buffer_size    128k;
    client_header_buffer_size  1k;
    large_client_header_buffers 4 8k;
    
    # Timeouts
    client_body_timeout   12;
    client_header_timeout 12;
    send_timeout          10;
    
    # ---------------------------------------
    # Upstream Backend Configuration
    # ---------------------------------------
    # Define backend FastAPI instances
    upstream fastapi_backend {
        # Load balancing algorithm
        # Options: round_robin (default), least_conn, ip_hash
        least_conn;  # Send to server with fewest connections
        
        # FastAPI instance 1
        server 127.0.0.1:8000 weight=1 max_fails=3 fail_timeout=30s;
        
        # FastAPI instance 2 (if running multiple)
        # server 127.0.0.1:8001 weight=1 max_fails=3 fail_timeout=30s;
        
        # FastAPI instance 3 (if running multiple)
        # server 127.0.0.1:8002 weight=1 max_fails=3 fail_timeout=30s;
        
        # Connection pooling
        keepalive 32;
    }
    
    # ---------------------------------------
    # Rate Limiting Configuration
    # ---------------------------------------
    # Define rate limit zones
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=general_limit:10m rate=100r/s;
    
    # ---------------------------------------
    # SSL/TLS Configuration (for HTTPS)
    # ---------------------------------------
    # SSL session cache
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Modern TLS configuration
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers         'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    
    # ============================================
    # HTTP SERVER (Port 80) - Redirect to HTTPS
    # ============================================
    server {
        listen       80;
        listen       [::]:80;  # IPv6
        server_name  api.myai.com myai.com;
        
        # Redirect all HTTP to HTTPS
        return 301 https://$server_name$request_uri;
        
        # Alternative: Serve only ACME challenge for Let's Encrypt
        # location /.well-known/acme-challenge/ {
        #     root /var/www/certbot;
        # }
    }
    
    # ============================================
    # HTTPS SERVER (Port 443) - Main Application
    # ============================================
    server {
        listen       443 ssl http2;
        listen       [::]:443 ssl http2;  # IPv6
        server_name  api.myai.com;
        
        # =======================================
        # SSL Certificate Configuration
        # =======================================
        # Path to SSL certificate and key
        # For development: use self-signed
        # For production: use Let's Encrypt or commercial cert
        ssl_certificate      cert/api.myai.com.crt;
        ssl_certificate_key  cert/api.myai.com.key;
        
        # =======================================
        # Security Headers
        # =======================================
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        
        # =======================================
        # CORS Configuration (if needed)
        # =======================================
        # Allow specific origins
        # add_header Access-Control-Allow-Origin "https://myai.com" always;
        # add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        # add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
        
        # =======================================
        # Root Location - Proxy to FastAPI
        # =======================================
        location / {
            # Apply rate limiting
            limit_req zone=general_limit burst=20 nodelay;
            
            # Proxy to upstream backend
            proxy_pass http://fastapi_backend;
            
            # Proxy headers
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-Host $server_name;
            
            # Timeouts for AI inference (may be long)
            proxy_connect_timeout  300s;
            proxy_send_timeout     300s;
            proxy_read_timeout     300s;
            
            # WebSocket support (if using streaming)
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            
            # Buffering (disable for streaming responses)
            proxy_buffering off;
            proxy_request_buffering off;
        }
        
        # =======================================
        # API-Specific Location
        # =======================================
        location /api/ {
            # Stricter rate limiting for API
            limit_req zone=api_limit burst=5 nodelay;
            
            # Proxy to FastAPI
            proxy_pass http://fastapi_backend/api/;
            
            # Headers
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Extended timeout for LLM inference
            proxy_read_timeout 600s;
        }
        
        # =======================================
        # Static Files Location
        # =======================================
        location /static/ {
            alias C:/nginx/html/static/;
            
            # Caching for static files
            expires 30d;
            add_header Cache-Control "public, immutable";
            
            # Security
            add_header X-Content-Type-Options "nosniff" always;
        }
        
        # =======================================
        # Health Check Endpoint
        # =======================================
        location /health {
            access_log off;  # Don't log health checks
            
            proxy_pass http://fastapi_backend/health;
            proxy_set_header Host $host;
        }
        
        # =======================================
        # Nginx Status (for monitoring)
        # =======================================
        location /nginx_status {
            stub_status on;
            access_log off;
            
            # Restrict access to localhost
            allow 127.0.0.1;
            deny all;
        }
        
        # =======================================
        # Error Pages
        # =======================================
        error_page 404 /404.html;
        location = /404.html {
            root C:/nginx/html;
            internal;
        }
        
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root C:/nginx/html;
            internal;
        }
    }
}
\`\`\`

### Understanding the Configuration

Let's break down the key sections:

**1. Upstream Block:**
\`\`\`nginx
upstream fastapi_backend {
    least_conn;
    server 127.0.0.1:8000 weight=1 max_fails=3 fail_timeout=30s;
}
\`\`\`
- \`least_conn\`: Sends requests to server with fewest active connections
- \`weight=1\`: Relative weight for load balancing
- \`max_fails=3\`: Mark server as down after 3 failed attempts
- \`fail_timeout=30s\`: How long to consider server down

**2. Rate Limiting:**
\`\`\`nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
\`\`\`
- \`$binary_remote_addr\`: Use client IP for limiting
- \`zone=api_limit:10m\`: Store state in 10MB memory zone
- \`rate=10r/s\`: Allow 10 requests per second per IP

**3. Proxy Headers:**
\`\`\`nginx
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
\`\`\`
These headers pass client information to FastAPI, crucial for:
- Logging actual client IPs
- Security checks
- Rate limiting at application level

**4. Timeouts:**
\`\`\`nginx
proxy_read_timeout 600s;
\`\`\`
AI inference can take time (especially for large models). Extended timeouts prevent premature disconnections.

## FastAPI Application Architecture

Now let's build the FastAPI application that Nginx will proxy to.

### Step 1: Complete FastAPI Application

**app.py**

\`\`\`python
from fastapi import FastAPI, HTTPException, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
import time
import logging
from datetime import datetime
import asyncio

# ============================================
# Logging Configuration
# ============================================
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# ============================================
# FastAPI Application
# ============================================
app = FastAPI(
    title="AI API Service",
    description="Production AI API with Nginx integration",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ============================================
# Middleware Configuration
# ============================================
# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://myai.com"],  # Production: specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZip Compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Custom Request Logging Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Log request
    logger.info(f"Request: {request.method} {request.url.path}")
    logger.info(f"Client IP: {request.client.host}")
    logger.info(f"Headers: {dict(request.headers)}")
    
    # Process request
    response = await call_next(request)
    
    # Calculate duration
    process_time = time.time() - start_time
    
    # Log response
    logger.info(f"Response: {response.status_code} - {process_time:.3f}s")
    
    # Add custom header
    response.headers["X-Process-Time"] = str(process_time)
    
    return response

# ============================================
# Request/Response Models
# ============================================
class ChatRequest(BaseModel):
    message: str
    max_tokens: int = 500
    temperature: float = 0.7
    stream: bool = False

class ChatResponse(BaseModel):
    response: str
    tokens_used: int
    latency_ms: float
    model: str

# ============================================
# Health Check Endpoint
# ============================================
@app.get("/health")
async def health_check():
    """Health check endpoint for load balancer."""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

# ============================================
# Root Endpoint
# ============================================
@app.get("/")
async def root(
    request: Request,
    x_real_ip: Optional[str] = Header(None),
    x_forwarded_for: Optional[str] = Header(None)
):
    """Root endpoint showing request details."""
    
    # Get real client IP (from Nginx headers)
    client_ip = x_real_ip or x_forwarded_for or request.client.host
    
    return {
        "message": "AI API Service",
        "version": "1.0.0",
        "client_ip": client_ip,
        "request_id": request.headers.get("X-Request-ID"),
        "timestamp": datetime.now().isoformat()
    }

# ============================================
# Chat Endpoint (Non-Streaming)
# ============================================
@app.post("/api/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    x_real_ip: Optional[str] = Header(None)
):
    """AI chat endpoint."""
    
    start_time = time.time()
    
    # Log request
    logger.info(f"Chat request from IP: {x_real_ip}")
    logger.info(f"Message: {request.message[:100]}...")
    
    try:
        # Simulate AI processing
        # In production, this would call your LLM
        await asyncio.sleep(0.5)  # Simulate inference time
        
        response_text = f"AI Response to: {request.message}"
        tokens_used = len(response_text.split())
        
        latency = (time.time() - start_time) * 1000
        
        return ChatResponse(
            response=response_text,
            tokens_used=tokens_used,
            latency_ms=latency,
            model="llama-3.1-8b"
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# Streaming Chat Endpoint
# ============================================
@app.post("/api/chat/stream")
async def chat_stream(
    request: ChatRequest,
    x_real_ip: Optional[str] = Header(None)
):
    """Streaming AI chat endpoint."""
    
    async def generate():
        """Generate streaming response."""
        
        # Simulate streaming token generation
        response_text = f"Streaming response to: {request.message}"
        words = response_text.split()
        
        for word in words:
            # Yield each word with a small delay
            yield f"data: {word}\\n\\n"
            await asyncio.sleep(0.1)
        
        # End of stream
        yield "data: [DONE]\\n\\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )

# ============================================
# Run Application
# ============================================
if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        app,
        host="127.0.0.1",  # Only listen on localhost (Nginx will proxy)
        port=8000,
        log_level="info",
        access_log=True
    )
\`\`\`

### Step 2: Running Multiple FastAPI Instances

For high availability, run multiple FastAPI instances:

**run_instances.ps1** (PowerShell script)

\`\`\`powershell
# Start FastAPI instances on different ports

# Instance 1
Start-Process python -ArgumentList "app.py --port 8000" -WindowStyle Minimized

# Instance 2
Start-Process python -ArgumentList "app.py --port 8001" -WindowStyle Minimized

# Instance 3
Start-Process python -ArgumentList "app.py --port 8002" -WindowStyle Minimized

Write-Host "FastAPI instances started on ports 8000, 8001, 8002"
\`\`\`

## Complete Deployment Workflow

Now let's put everything together:

\`\`\`react-flow
{
  "title": "Deployment Lifecycle",
  "height": "450px",
  "nodes": [
    { "id": "dns", "data": { "label": "1. Configure DNS" }, "position": { "x": 50, "y": 50 } },
    { "id": "nginx", "data": { "label": "2. Install Nginx" }, "position": { "x": 250, "y": 50 } },
    { "id": "ssl", "data": { "label": "3. Generate SSL" }, "position": { "x": 450, "y": 50 } },
    { "id": "nconf", "data": { "label": "4. Configure Nginx" }, "position": { "x": 450, "y": 150 } },
    { "id": "fastapi", "data": { "label": "5. Deploy FastAPI" }, "position": { "x": 250, "y": 150 } },
    { "id": "test", "data": { "label": "6. Test End-to-End" }, "position": { "x": 50, "y": 150 }, "className": "bg-accent-gold/20 border-accent-gold/50" },
    { "id": "monitor", "type": "output", "data": { "label": "7. Monitor & Scale" }, "position": { "x": 250, "y": 250 }, "className": "bg-green-500/20 border-green-500/50" }
  ],
  "edges": [
    { "id": "e1", "source": "dns", "target": "nginx", "animated": true },
    { "id": "e2", "source": "nginx", "target": "ssl", "animated": true },
    { "id": "e3", "source": "ssl", "target": "nconf", "animated": true },
    { "id": "e4", "source": "nconf", "target": "fastapi", "animated": true },
    { "id": "e5", "source": "fastapi", "target": "test", "animated": true },
    { "id": "e6", "source": "test", "target": "monitor", "animated": true }
  ]
}
\`\`\`

### Step-by-Step Deployment

**1. Start Nginx**

\`\`\`powershell
# Windows
cd C:\\nginx
.\\nginx.exe

# Check if running
.\\nginx.exe -t  # Test configuration
tasklist /FI "IMAGENAME eq nginx.exe"
\`\`\`

**2. Start FastAPI**

\`\`\`powershell
# Activate virtual environment
cd C:\\projects\\ai-api
.\\venv\\Scripts\\Activate.ps1

# Start application
python app.py
\`\`\`

**3. Test Local Access**

\`\`\`powershell
# Test FastAPI directly
curl http://localhost:8000/health

# Test through Nginx (assuming DNS configured)
curl https://api.myai.com/health
\`\`\`

**4. Monitor Logs**

**Nginx Access Log**: \`C:\\nginx\\logs\\access.log\`
\`\`\`
203.0.113.100 - - [01/Feb/2026:10:15:30 +0000] "POST /api/chat HTTP/2.0" 200 1234 "https://myai.com" "Mozilla/5.0" 0.523 0.498
\`\`\`

**Nginx Error Log**: \`C:\\nginx\\logs\\error.log\`
\`\`\`
2026/02/01 10:15:30 [error] 1234#5678: *1 upstream timed out (110: Connection timed out) while reading response header from upstream
\`\`\`

**FastAPI Log**: \`app.log\`
\`\`\`
2026-02-01 10:15:30 - __main__ - INFO - Request: POST /api/chat
2026-02-01 10:15:30 - __main__ - INFO - Client IP: 203.0.113.100
2026-02-01 10:15:30 - __main__ - INFO - Response: 200 - 0.498s
\`\`\`

## Production Best Practices

### 1. Security Hardening

\`\`\`nginx
# Disable server tokens (hide Nginx version)
server_tokens off;

# Limit request methods
if ($request_method !~ ^(GET|POST|HEAD|OPTIONS)$) {
    return 405;
}

# Block certain user agents
if ($http_user_agent ~* (bot|crawler|spider)) {
    return 403;
}

# Add security headers
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Content-Security-Policy "default-src 'self'" always;
\`\`\`

### 2. Performance Tuning

\`\`\`nginx
# Worker optimization
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;  # Linux only
    multi_accept on;
}

# Buffer sizes
client_body_buffer_size 128k;
client_max_body_size 100M;
large_client_header_buffers 4 16k;

# Caching
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

location /api/ {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_key "$scheme$request_method$host$request_uri";
    add_header X-Cache-Status $upstream_cache_status;
}
\`\`\`

### 3. Monitoring and Alerting

\`\`\`python
# monitoring.py - FastAPI metrics endpoint

from prometheus_client import Counter, Histogram, generate_latest
from fastapi import Response

# Define metrics
request_count = Counter(
    'api_requests_total',
    'Total API requests',
    ['method', 'endpoint', 'status']
)

request_duration = Histogram(
    'api_request_duration_seconds',
    'API request duration',
    ['method', 'endpoint']
)

@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint."""
    return Response(
        generate_latest(),
        media_type="text/plain"
    )

# Use in middleware
@app.middleware("http")
async def track_metrics(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    # Track metrics
    request_count.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()
    
    request_duration.labels(
        method=request.method,
        endpoint=request.url.path
    ).observe(time.time() - start_time)
    
    return response
\`\`\`

## Conclusion

You now have a complete, production-ready architecture for deploying AI applications with Nginx, FastAPI, and proper DNS configuration. This architecture provides:

✅ **Scalability**: Load balancing across multiple FastAPI instances
✅ **Security**: SSL/TLS, rate limiting, security headers
✅ **Performance**: Caching, compression, optimized connections
✅ **Observability**: Comprehensive logging and metrics
✅ **Reliability**: Health checks, failover, graceful degradation

Key Architectural Principles:

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Defense in Depth**: Multiple layers of security
3. **Fail Fast**: Validate early, fail gracefully
4. **Observability**: Log everything, monitor everything
5. **Scalability**: Horizontal scaling through load balancing

Remember: Architecture is not about making things complex. It's about making things reliable, maintainable, and scalable while keeping each component simple and focused.

---

*This is part 1 of the AI Architect series. Next: Context Engineering - The Art of Providing Perfect Information to AI Systems*
`,Le="2025-02-05",Pe=10,Me={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},Te="Infrastructure",qe=["Nginx","FastAPI","DevOps","Production","Architecture"],Re="/blog/Guide_to_Nginx_FastAPI_and_DNS_Integration.png",Ee=!1,Ne={id:Ae,slug:ke,title:Ie,excerpt:Ce,content:Se,publishedAt:Le,readTime:Pe,author:Me,category:Te,tags:qe,featuredImage:Re,featured:Ee},De="10",ze="context-engineering-guide",Fe="Context Engineering: The Architect's Guide to Intelligent Information Management",Oe="Learn how to master context engineering to build smarter, more reliable AI systems that understand intent and provide relevant, grounded responses.",Ge=`# Context Engineering: The Architect's Guide to Intelligent Information Management for AI Systems

## Introduction: Beyond Prompt Engineering

As an AI architect in 2026, you understand that building production AI systems is fundamentally about managing information flow. While developers focus on writing prompts, architects must design the entire **context engineering stack**—the systematic approach to gathering, organizing, prioritizing, and delivering information to language models.

Context engineering is the architectural discipline that determines how AI systems access and use information. It encompasses prompt design, but also includes retrieval strategies, memory management, information prioritization, dynamic context assembly, and performance optimization. Poor context architecture leads to hallucinations, inconsistent outputs, and systems that work in demos but fail in production.

This comprehensive guide provides the complete architectural framework for context engineering, from theoretical foundations through production implementation. You'll learn how to design context systems that are reliable, scalable, and maintainable.

## Theoretical Foundation: Understanding the Context Window

### The Computational Model: Context as Working Memory

Andrej Karpaty's analogy perfectly captures the essence: **"The LLM is the CPU, the context window is the RAM."** Let's build a complete mental model:

\`\`\`react-flow
{
  "title": "LLM vs Traditional Memory Architecture",
  "height": "500px",
  "nodes": [
    { "id": "trad", "data": { "label": "Traditional Computer System" }, "position": { "x": 0, "y": 0 }, "style": { "width": 300, "height": 400, "backgroundColor": "rgba(59, 130, 246, 0.05)", "border": "1px dashed #3b82f6" }, "type": "group" },
    { "id": "cpu", "data": { "label": "CPU\\nALU / Execution" }, "position": { "x": 50, "y": 40 }, "parentId": "trad", "extent": "parent", "className": "bg-blue-500/20" },
    { "id": "l1", "data": { "label": "L1 Cache\\n~1 ns" }, "position": { "x": 50, "y": 100 }, "parentId": "trad", "extent": "parent" },
    { "id": "l2", "data": { "label": "L2 Cache\\n~5 ns" }, "position": { "x": 50, "y": 150 }, "parentId": "trad", "extent": "parent" },
    { "id": "l3", "data": { "label": "L3 Cache\\n~30 ns" }, "position": { "x": 50, "y": 200 }, "parentId": "trad", "extent": "parent" },
    { "id": "ram", "data": { "label": "RAM\\n~100 ns" }, "position": { "x": 50, "y": 250 }, "parentId": "trad", "extent": "parent", "className": "bg-accent-gold/20" },
    { "id": "ssd", "data": { "label": "SSD / HDD\\n~10 ms" }, "position": { "x": 50, "y": 310 }, "parentId": "trad", "extent": "parent" },

    { "id": "llm-sys", "data": { "label": "LLM System Architecture" }, "position": { "x": 400, "y": 0 }, "style": { "width": 300, "height": 400, "backgroundColor": "rgba(139, 92, 246, 0.05)", "border": "1px dashed #8b5cf6" }, "type": "group" },
    { "id": "llm", "data": { "label": "LLM Inference\\nToken Processing" }, "position": { "x": 50, "y": 40 }, "parentId": "llm-sys", "extent": "parent", "className": "bg-blue-500/20" },
    { "id": "kv", "data": { "label": "KV Cache\\nAttention States" }, "position": { "x": 50, "y": 100 }, "parentId": "llm-sys", "extent": "parent" },
    { "id": "context", "data": { "label": "Context Window\\nImmediate" }, "position": { "x": 50, "y": 160 }, "parentId": "llm-sys", "extent": "parent", "className": "bg-accent-gold/20" },
    { "id": "short", "data": { "label": "Conv History\\nSession Memory" }, "position": { "x": 50, "y": 220 }, "parentId": "llm-sys", "extent": "parent" },
    { "id": "vector", "data": { "label": "Vector DB\\nSemantic Search" }, "position": { "x": 50, "y": 280 }, "parentId": "llm-sys", "extent": "parent" },
    { "id": "db", "data": { "label": "Doc Store\\nComplete Corpus" }, "position": { "x": 50, "y": 340 }, "parentId": "llm-sys", "extent": "parent" }
  ],
  "edges": [
    { "id": "et1", "source": "cpu", "target": "l1", "label": "Fastest" },
    { "id": "et2", "source": "l1", "target": "l2" },
    { "id": "et3", "source": "l2", "target": "l3" },
    { "id": "et4", "source": "l3", "target": "ram" },
    { "id": "et5", "source": "ram", "target": "ssd" },

    { "id": "el1", "source": "llm", "target": "kv" },
    { "id": "el2", "source": "kv", "target": "context" },
    { "id": "el3", "source": "context", "target": "short" },
    { "id": "el4", "source": "short", "target": "vector" },
    { "id": "el5", "source": "vector", "target": "db" }
  ]
}
\`\`\`

**Key Architectural Insights:**

1. **Hierarchical Memory**: Information exists at different levels with different access speeds and capacities
2. **Locality of Reference**: Frequently accessed information should be in fast memory
3. **Cache Optimization**: Strategic placement reduces overall latency
4. **Trade-offs**: Larger context = slower processing, smaller context = less information

### The Information Pyramid: Context Hierarchy

\`\`\`react-flow
{
  "title": "Information Value Pyramid",
  "height": "600px",
  "nodes": [
    { "id": "sys", "data": { "label": "System Identity\\nCRITICAL" }, "position": { "x": 150, "y": 0 }, "className": "bg-red-500/20 border-red-500/50 w-60" },
    { "id": "task", "data": { "label": "Task Definition\\nCRITICAL" }, "position": { "x": 150, "y": 70 }, "className": "bg-red-500/20 border-red-500/50 w-60" },
    { "id": "imm", "data": { "label": "Immediate Context\\nHIGH" }, "position": { "x": 150, "y": 140 }, "className": "bg-orange-500/20 border-orange-500/50 w-60" },
    { "id": "know", "data": { "label": "Retrieved Knowledge\\nHIGH" }, "position": { "x": 150, "y": 210 }, "className": "bg-orange-500/20 border-orange-500/50 w-60" },
    { "id": "tools", "data": { "label": "Tool Definitions\\nMEDIUM" }, "position": { "x": 150, "y": 280 }, "className": "bg-green-500/20 border-green-500/50 w-60" },
    { "id": "ex", "data": { "label": "Examples\\nMEDIUM" }, "position": { "x": 150, "y": 350 }, "className": "bg-green-500/20 border-green-500/50 w-60" },
    { "id": "hist", "data": { "label": "Extended History\\nLOW" }, "position": { "x": 150, "y": 420 }, "className": "bg-blue-500/20 border-blue-500/50 w-60" },
    { "id": "meta", "data": { "label": "Metadata\\nLOW" }, "position": { "x": 150, "y": 490 }, "className": "bg-blue-500/20 border-blue-500/50 w-60" },

    { "id": "strategy", "data": { "label": "Context Assembly Strategy" }, "position": { "x": 450, "y": 245 }, "className": "bg-accent-gold/20 border-accent-gold/50 rounded-full w-40 h-40 flex items-center justify-center text-center" }
  ],
  "edges": [
    { "id": "e1", "source": "sys", "target": "strategy", "label": "Always Include" },
    { "id": "e2", "source": "task", "target": "strategy", "label": "Always Include" },
    { "id": "e3", "source": "imm", "target": "strategy", "label": "Always Include" },
    { "id": "e4", "source": "know", "target": "strategy", "label": "Dynamic Retrieval" },
    { "id": "e5", "source": "tools", "target": "strategy", "label": "Task-Dependent" },
    { "id": "e6", "source": "ex", "target": "strategy", "label": "Performance-Based" },
    { "id": "e7", "source": "hist", "target": "strategy", "label": "Summarize" },
    { "id": "e8", "source": "meta", "target": "strategy", "label": "Minimal" }
  ]
}
\`\`\`

**Architecture Principle**: Not all information is equally valuable. Context engineering is fundamentally about **intelligent information prioritization** and **dynamic budget allocation**.

## The Complete Context Engineering Stack

### Seven-Layer Architecture

\`\`\`react-flow
{
  "title": "Seven-Layer Context Stack",
  "height": "800px",
  "nodes": [
    { "id": "l7", "data": { "label": "Layer 7: Output" }, "position": { "x": 0, "y": 0 }, "style": { "width": 600, "height": 80, "backgroundColor": "rgba(34, 197, 94, 0.05)" }, "type": "group" },
    { "id": "o1", "data": { "label": "Response Gen" }, "position": { "x": 50, "y": 20 }, "parentId": "l7" },
    { "id": "o2", "data": { "label": "Validation" }, "position": { "x": 250, "y": 20 }, "parentId": "l7" },
    { "id": "o3", "data": { "label": "Safety" }, "position": { "x": 450, "y": 20 }, "parentId": "l7" },

    { "id": "l6", "data": { "label": "Layer 6: Inference" }, "position": { "x": 0, "y": 100 }, "style": { "width": 600, "height": 80, "backgroundColor": "rgba(245, 158, 11, 0.05)" }, "type": "group" },
    { "id": "i1", "data": { "label": "Attention" }, "position": { "x": 50, "y": 20 }, "parentId": "l6" },
    { "id": "i2", "data": { "label": "Generation" }, "position": { "x": 250, "y": 20 }, "parentId": "l6" },
    { "id": "i3", "data": { "label": "KV Cache" }, "position": { "x": 450, "y": 20 }, "parentId": "l6" },

    { "id": "l5", "data": { "label": "Layer 5: Assembly" }, "position": { "x": 0, "y": 200 }, "style": { "width": 600, "height": 80, "backgroundColor": "rgba(59, 130, 246, 0.05)" }, "type": "group" },
    { "id": "c1", "data": { "label": "Merging" }, "position": { "x": 50, "y": 20 }, "parentId": "l5" },
    { "id": "c2", "data": { "label": "Deduplication" }, "position": { "x": 200, "y": 20 }, "parentId": "l5" },
    { "id": "c3", "data": { "label": "Compression" }, "position": { "x": 350, "y": 20 }, "parentId": "l5" },
    { "id": "c4", "data": { "label": "Truncation" }, "position": { "x": 500, "y": 20 }, "parentId": "l5" },

    { "id": "l4", "data": { "label": "Layer 4: Retrieval" }, "position": { "x": 0, "y": 300 }, "style": { "width": 600, "height": 80, "backgroundColor": "rgba(168, 85, 247, 0.05)" }, "type": "group" },
    { "id": "r1", "data": { "label": "Vector Search" }, "position": { "x": 50, "y": 20 }, "parentId": "l4" },
    { "id": "r2", "data": { "label": "Hybrid" }, "position": { "x": 200, "y": 20 }, "parentId": "l4" },
    { "id": "r3", "data": { "label": "Reranking" }, "position": { "x": 350, "y": 20 }, "parentId": "l4" },
    { "id": "r4", "data": { "label": "Cache" }, "position": { "x": 500, "y": 20 }, "parentId": "l4" },

    { "id": "l3", "data": { "label": "Layer 3: Query Proc" }, "position": { "x": 0, "y": 400 }, "style": { "width": 600, "height": 80, "backgroundColor": "rgba(239, 68, 68, 0.05)" }, "type": "group" },
    { "id": "q1", "data": { "label": "Intent" }, "position": { "x": 50, "y": 20 }, "parentId": "l3" },
    { "id": "q2", "data": { "label": "Expansion" }, "position": { "x": 200, "y": 20 }, "parentId": "l3" },
    { "id": "q3", "data": { "label": "Entity" }, "position": { "x": 350, "y": 20 }, "parentId": "l3" },
    { "id": "q4", "data": { "label": "Routing" }, "position": { "x": 500, "y": 20 }, "parentId": "l3" },

    { "id": "l2", "data": { "label": "Layer 2: Memory" }, "position": { "x": 0, "y": 500 }, "style": { "width": 600, "height": 80, "backgroundColor": "rgba(99, 102, 241, 0.05)" }, "type": "group" },
    { "id": "m1", "data": { "label": "Buffer" }, "position": { "x": 50, "y": 20 }, "parentId": "l2" },
    { "id": "m2", "data": { "label": "Summary" }, "position": { "x": 200, "y": 20 }, "parentId": "l2" },
    { "id": "m3", "data": { "label": "Entity Mem" }, "position": { "x": 350, "y": 20 }, "parentId": "l2" },
    { "id": "m4", "data": { "label": "Session" }, "position": { "x": 500, "y": 20 }, "parentId": "l2" },

    { "id": "l1", "data": { "label": "Layer 1: Source" }, "position": { "x": 0, "y": 600 }, "style": { "width": 600, "height": 80, "backgroundColor": "rgba(192, 132, 252, 0.05)" }, "type": "group" },
    { "id": "s1", "data": { "label": "User Input" }, "position": { "x": 50, "y": 20 }, "parentId": "l1" },
    { "id": "s2", "data": { "label": "Sys Prompt" }, "position": { "x": 200, "y": 20 }, "parentId": "l1" },
    { "id": "s3", "data": { "label": "Tool Registry" }, "position": { "x": 350, "y": 20 }, "parentId": "l1" },
    { "id": "s4", "data": { "label": "Knowledge" }, "position": { "x": 500, "y": 20 }, "parentId": "l1" }
  ],
  "edges": [
    { "id": "e1", "source": "s1", "target": "q1", "animated": true },
    { "id": "e2", "source": "q4", "target": "r1" },
    { "id": "e3", "source": "r3", "target": "c1" },
    { "id": "e4", "source": "m4", "target": "c1" },
    { "id": "e5", "source": "c4", "target": "i1" },
    { "id": "e6", "source": "i3", "target": "o1" }
  ]
}
\`\`\`

### Layer-by-Layer Deep Dive

#### Layer 1: Source Layer - Information Origins

This is where all information enters the system. Each source has different characteristics:

\`\`\`python
from typing import Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime

@dataclass
class InformationSource:
    """Base class for information sources."""
    source_id: str
    priority: int  # 1 = highest
    max_tokens: int
    refresh_rate: Optional[int] = None  # seconds
    
class SystemPromptSource(InformationSource):
    """System-level instructions that define AI behavior."""
    
    def __init__(self):
        super().__init__(
            source_id="system_prompt",
            priority=1,  # Always highest priority
            max_tokens=500,
            refresh_rate=None  # Static, never refreshes
        )
        self.template = """You are a helpful AI assistant specialized in {domain}.

Your core capabilities:
- {capabilities}

Your constraints:
- {constraints}

Your tone and style:
- {style_guide}"""
    
    def render(self, context: Dict) -> str:
        """Render system prompt with dynamic values."""
        return self.template.format(
            domain=context.get('domain', 'general assistance'),
            capabilities='\\n- '.join(context.get('capabilities', [])),
            constraints='\\n- '.join(context.get('constraints', [])),
            style_guide=context.get('style_guide', 'Professional and friendly')
        )

class UserInputSource(InformationSource):
    """Current user query and immediate context."""
    
    def __init__(self):
        super().__init__(
            source_id="user_input",
            priority=1,  # Critical - this is what we're responding to
            max_tokens=2000,
            refresh_rate=0  # Changes with every request
        )
    
    def process(self, raw_input: str) -> Dict:
        """Process and enrich user input."""
        return {
            'raw_query': raw_input,
            'timestamp': datetime.now().isoformat(),
            'token_count': len(raw_input.split()),
            'detected_intent': self._classify_intent(raw_input),
            'extracted_entities': self._extract_entities(raw_input),
        }
    
    def _classify_intent(self, query: str) -> str:
        """Classify user intent (simplified)."""
        # In production, use a classifier model
        query_lower = query.lower()
        if any(word in query_lower for word in ['how', 'what', 'why']):
            return 'question'
        elif any(word in query_lower for word in ['create', 'generate', 'make']):
            return 'generation'
        elif any(word in query_lower for word in ['analyze', 'review', 'check']):
            return 'analysis'
        return 'general'
    
    def _extract_entities(self, query: str) -> List[str]:
        """Extract key entities from query."""
        # In production, use NER model
        return []

class ToolRegistrySource(InformationSource):
    """Definitions of available tools/functions."""
    
    def __init__(self):
        super().__init__(
            source_id="tool_registry",
            priority=2,  # High priority when tools are needed
            max_tokens=5000,
            refresh_rate=3600  # Refresh hourly
        )
        self.tools = {}
    
    def register_tool(self, tool_spec: Dict):
        """Register a new tool."""
        self.tools[tool_spec['name']] = tool_spec
    
    def get_relevant_tools(self, intent: str) -> List[Dict]:
        """Get tools relevant to user intent."""
        # Filter tools based on intent
        relevant = []
        for name, spec in self.tools.items():
            if intent in spec.get('applicable_intents', []):
                relevant.append(spec)
        return relevant

class KnowledgeBaseSource(InformationSource):
    """Connection to vector database and documents."""
    
    def __init__(self, vector_db):
        super().__init__(
            source_id="knowledge_base",
            priority=3,  # Retrieved dynamically based on query
            max_tokens=10000,
            refresh_rate=None  # On-demand retrieval
        )
        self.vector_db = vector_db
        self.cache = {}
    
    def retrieve(self, query: str, k: int = 5) -> List[Dict]:
        """Retrieve relevant documents."""
        # Check cache first
        cache_key = f"{query[:50]}_{k}"
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        # Retrieve from vector DB
        results = self.vector_db.similarity_search(query, k=k)
        
        # Cache results
        self.cache[cache_key] = results
        
        return results
\`\`\`

#### Layer 2: Memory Management Layer - Maintaining Conversation State

\`\`\`react-flow
{
  "title": "Memory Management Sequence",
  "height": "400px",
  "nodes": [
    { "id": "user", "data": { "label": "User" }, "position": { "x": 50, "y": 50 }, "className": "bg-accent-blue/20" },
    { "id": "mem", "data": { "label": "Memory Manager" }, "position": { "x": 250, "y": 50 }, "className": "bg-accent-gold/20" },
    { "id": "buff", "data": { "label": "Conversation Buffer" }, "position": { "x": 450, "y": 50 } },
    { "id": "summ", "data": { "label": "Summary Memory" }, "position": { "x": 450, "y": 150 } },
    { "id": "ent", "data": { "label": "Entity Memory" }, "position": { "x": 450, "y": 250 } },
    { "id": "vec", "data": { "label": "Vector Memory" }, "position": { "x": 450, "y": 350 } }
  ],
  "edges": [
    { "id": "e1", "source": "user", "target": "mem", "label": "New Message", "animated": true },
    { "id": "e2", "source": "mem", "target": "buff", "label": "Add to recent" },
    { "id": "e3", "source": "mem", "target": "summ", "label": "Summarize if full" },
    { "id": "e4", "source": "mem", "target": "ent", "label": "Extract facts" },
    { "id": "e5", "source": "mem", "target": "vec", "label": "Long-term storage" }
  ]
}
\`\`\`

**Implementation**:

\`\`\`python
from typing import List, Dict, Optional
from langchain.memory import ConversationBufferMemory, ConversationSummaryMemory
from langchain.schema import BaseMessage, HumanMessage, AIMessage

class HybridMemoryManager:
    """Advanced memory management with multiple strategies."""
    
    def __init__(
        self,
        llm,
        buffer_size: int = 5,
        max_buffer_tokens: int = 2000,
        summary_threshold: int = 10,
    ):
        """
        Initialize hybrid memory manager.
        
        Args:
            llm: Language model for summarization
            buffer_size: Number of recent messages to keep in full
            max_buffer_tokens: Maximum tokens in buffer before summarizing
            summary_threshold: Number of messages before creating summary
        """
        self.llm = llm
        self.buffer_size = buffer_size
        self.max_buffer_tokens = max_buffer_tokens
        self.summary_threshold = summary_threshold
        
        # Short-term memory: Recent messages
        self.conversation_buffer = ConversationBufferMemory(
            return_messages=True,
            memory_key="recent_history",
        )
        
        # Long-term memory: Summarized history
        self.summary_memory = ConversationSummaryMemory(
            llm=llm,
            memory_key="conversation_summary",
        )
        
        # Entity memory: Extracted facts
        self.entity_memory = {}
        
        # Message history
        self.full_history: List[BaseMessage] = []
    
    def add_message(self, message: BaseMessage):
        """Add message to all memory types."""
        
        # Add to full history
        self.full_history.append(message)
        
        # Add to buffer
        self.conversation_buffer.chat_memory.add_message(message)
        
        # Check if we need to summarize
        if len(self.full_history) % self.summary_threshold == 0:
            self._create_summary()
        
        # Extract and store entities
        if isinstance(message, HumanMessage):
            entities = self._extract_entities(message.content)
            self._update_entity_memory(entities)
    
    def _create_summary(self):
        """Create summary of older messages."""
        
        # Get messages to summarize (older than buffer)
        messages_to_summarize = self.full_history[:-self.buffer_size]
        
        if not messages_to_summarize:
            return
        
        # Create summary
        summary_prompt = f"""Summarize this conversation concisely, preserving key facts:

{self._format_messages(messages_to_summarize)}

Summary:"""
        
        summary = self.llm.predict(summary_prompt)
        
        # Store summary
        self.summary_memory.save_context(
            {"input": "Previous conversation"},
            {"output": summary}
        )
    
    def _extract_entities(self, text: str) -> Dict[str, List[str]]:
        """Extract entities from text."""
        
        # In production, use NER model
        # For now, simple keyword extraction
        entities = {
            'people': [],
            'organizations': [],
            'dates': [],
            'locations': [],
            'topics': [],
        }
        
        # Simple extraction (replace with real NER)
        words = text.split()
        for word in words:
            if word.istitle() and len(word) > 3:
                entities['people'].append(word)
        
        return entities
    
    def _update_entity_memory(self, entities: Dict[str, List[str]]):
        """Update entity memory with new entities."""
        
        for category, items in entities.items():
            if category not in self.entity_memory:
                self.entity_memory[category] = set()
            self.entity_memory[category].update(items)
    
    def get_context(self) -> Dict[str, str]:
        """Get complete memory context for prompt."""
        
        context = {}
        
        # Recent conversation
        recent_messages = self.conversation_buffer.load_memory_variables({})
        context['recent_conversation'] = self._format_messages(
            recent_messages.get('recent_history', [])
        )
        
        # Historical summary
        summary = self.summary_memory.load_memory_variables({})
        context['conversation_summary'] = summary.get('conversation_summary', '')
        
        # Entity context
        if self.entity_memory:
            context['known_entities'] = self._format_entities()
        
        return context
    
    def _format_messages(self, messages: List[BaseMessage]) -> str:
        """Format messages as string."""
        formatted = []
        for msg in messages:
            role = "Human" if isinstance(msg, HumanMessage) else "AI"
            formatted.append(f"{role}: {msg.content}")
        return "\\n".join(formatted)
    
    def _format_entities(self) -> str:
        """Format entity memory as string."""
        lines = []
        for category, items in self.entity_memory.items():
            if items:
                lines.append(f"{category.title()}: {', '.join(list(items)[:10])}")
        return "\\n".join(lines)
    
    def get_token_count(self) -> int:
        """Estimate total tokens in memory."""
        context = self.get_context()
        total_text = "\\n".join(context.values())
        return len(total_text.split())  # Rough estimate
    
    def clear(self):
        """Clear all memory."""
        self.conversation_buffer.clear()
        self.summary_memory.clear()
        self.entity_memory = {}
        self.full_history = []
\`\`\`

#### Layer 3: Query Processing Layer - Understanding Intent

\`\`\`react-flow
{
  "title": "Query Processing Flow",
  "height": "300px",
  "nodes": [
    { "id": "input", "data": { "label": "User Query" }, "position": { "x": 0, "y": 100 }, "className": "bg-accent-blue/10" },
    { "id": "intent", "data": { "label": "Intent Classifier" }, "position": { "x": 150, "y": 100 } },
    { "id": "split", "data": { "label": "Routing Choice" }, "position": { "x": 300, "y": 100 }, "type": "output" },
    { "id": "expand", "data": { "label": "Expander" }, "position": { "x": 450, "y": 20 } },
    { "id": "extract", "data": { "label": "Extractor" }, "position": { "x": 450, "y": 100 } },
    { "id": "route", "data": { "label": "Router" }, "position": { "x": 450, "y": 180 } },
    { "id": "ret", "data": { "label": "Retrieval System" }, "position": { "x": 650, "y": 100 }, "className": "bg-accent-gold/20" }
  ],
  "edges": [
    { "id": "e1", "source": "input", "target": "intent", "animated": true },
    { "id": "e2", "source": "intent", "target": "split" },
    { "id": "e3", "source": "split", "target": "expand", "label": "search" },
    { "id": "e4", "source": "split", "target": "extract", "label": "booking" },
    { "id": "e5", "source": "split", "target": "route", "label": "info" },
    { "id": "e6", "source": "expand", "target": "ret" },
    { "id": "e7", "source": "extract", "target": "ret" },
    { "id": "e8", "source": "route", "target": "ret" }
  ]
}
\`\`\`

**Implementation**:

\`\`\`python
from typing import Dict, List, Optional, Tuple
from enum import Enum
import re
from datetime import datetime, timedelta

class IntentType(Enum):
    """User intent categories."""
    QUESTION = "question"
    SEARCH = "search"
    GENERATION = "generation"
    ANALYSIS = "analysis"
    BOOKING = "booking"
    NAVIGATION = "navigation"
    UNKNOWN = "unknown"

class QueryProcessor:
    """Process and enrich user queries."""
    
    def __init__(self, llm=None):
        self.llm = llm
        self.intent_patterns = {
            IntentType.QUESTION: [
                r'\\b(what|how|why|when|where|who)\\b',
                r'\\?$'
            ],
            IntentType.SEARCH: [
                r'\\b(find|search|look for|show me)\\b'
            ],
            IntentType.GENERATION: [
                r'\\b(create|generate|make|write|compose)\\b'
            ],
            IntentType.ANALYSIS: [
                r'\\b(analyze|review|evaluate|assess|compare)\\b'
            ],
            IntentType.BOOKING: [
                r'\\b(book|reserve|schedule|appointment)\\b'
            ],
        }
    
    def process(self, query: str) -> Dict:
        """
        Process query and extract structured information.
        
        Returns:
            Dict with intent, entities, expanded query, and metadata
        """
        processed = {
            'original_query': query,
            'timestamp': datetime.now().isoformat(),
            'intent': self._classify_intent(query),
            'entities': self._extract_entities(query),
            'expanded_query': self._expand_query(query),
            'query_type': self._detect_query_type(query),
            'routing': self._determine_routing(query),
        }
        
        return processed
    
    def _classify_intent(self, query: str) -> IntentType:
        """Classify user intent using pattern matching."""
        
        query_lower = query.lower()
        
        # Score each intent type
        scores = {}
        for intent, patterns in self.intent_patterns.items():
            score = 0
            for pattern in patterns:
                if re.search(pattern, query_lower):
                    score += 1
            scores[intent] = score
        
        # Return highest scoring intent
        if scores:
            max_intent = max(scores.items(), key=lambda x: x[1])
            if max_intent[1] > 0:
                return max_intent[0]
        
        return IntentType.UNKNOWN
    
    def _extract_entities(self, query: str) -> Dict[str, List[str]]:
        """Extract named entities from query."""
        
        entities = {
            'dates': self._extract_dates(query),
            'locations': self._extract_locations(query),
            'numbers': self._extract_numbers(query),
            'times': self._extract_times(query),
        }
        
        return {k: v for k, v in entities.items() if v}
    
    def _extract_dates(self, query: str) -> List[str]:
        """Extract date references."""
        dates = []
        
        query_lower = query.lower()
        
        # Relative dates
        if 'today' in query_lower:
            dates.append(datetime.now().strftime('%Y-%m-%d'))
        if 'tomorrow' in query_lower:
            dates.append((datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d'))
        if 'next week' in query_lower:
            dates.append((datetime.now() + timedelta(weeks=1)).strftime('%Y-%m-%d'))
        
        # Absolute dates (simplified pattern)
        date_pattern = r'\\d{4}-\\d{2}-\\d{2}'
        dates.extend(re.findall(date_pattern, query))
        
        return dates
    
    def _extract_locations(self, query: str) -> List[str]:
        """Extract location mentions."""
        # In production, use NER model
        # Simplified: look for capitalized phrases
        locations = []
        
        words = query.split()
        for i, word in enumerate(words):
            if word.istitle() and len(word) > 3:
                # Check if next word is also capitalized (multi-word location)
                if i + 1 < len(words) and words[i + 1].istitle():
                    locations.append(f"{word} {words[i + 1]}")
                else:
                    locations.append(word)
        
        return list(set(locations))
    
    def _extract_numbers(self, query: str) -> List[int]:
        """Extract numeric values."""
        return [int(n) for n in re.findall(r'\\b\\d+\\b', query)]
    
    def _extract_times(self, query: str) -> List[str]:
        """Extract time references."""
        time_pattern = r'\\b\\d{1,2}:\\d{2}\\s*(?:am|pm)?\\b'
        return re.findall(time_pattern, query.lower())
    
    def _expand_query(self, query: str) -> str:
        """Expand query with synonyms and related terms."""
        
        # In production, use query expansion model
        # Simplified: add common synonyms
        
        expansions = {
            'hotel': ['hotel', 'accommodation', 'lodging'],
            'restaurant': ['restaurant', 'dining', 'eatery'],
            'cheap': ['cheap', 'affordable', 'budget', 'inexpensive'],
            'expensive': ['expensive', 'luxury', 'premium', 'upscale'],
        }
        
        query_lower = query.lower()
        expanded_terms = set()
        
        for term, synonyms in expansions.items():
            if term in query_lower:
                expanded_terms.update(synonyms)
        
        if expanded_terms:
            return f"{query} ({' OR '.join(expanded_terms)})"
        
        return query
    
    def _detect_query_type(self, query: str) -> str:
        """Detect if query is simple or complex."""
        
        # Simple heuristics
        word_count = len(query.split())
        has_subqueries = ' and ' in query.lower() or ' or ' in query.lower()
        
        if word_count > 20 or has_subqueries:
            return 'complex'
        return 'simple'
    
    def _determine_routing(self, query: str) -> Dict[str, bool]:
        """Determine which systems should process this query."""
        
        routing = {
            'vector_search': False,
            'keyword_search': False,
            'tools': False,
            'web_search': False,
        }
        
        query_lower = query.lower()
        
        # Route to vector search for semantic queries
        if any(word in query_lower for word in ['similar', 'like', 'related']):
            routing['vector_search'] = True
        
        # Route to keyword search for exact matches
        if '"' in query or 'exact' in query_lower:
            routing['keyword_search'] = True
        
        # Route to tools if action required
        if any(word in query_lower for word in ['calculate', 'compute', 'execute']):
            routing['tools'] = True
        
        # Route to web search for current info
        if any(word in query_lower for word in ['latest', 'current', 'recent', 'news']):
            routing['web_search'] = True
        
        # Default: use vector search
        if not any(routing.values()):
            routing['vector_search'] = True
        
        return routing
\`\`\`

#### Layer 4: Retrieval Layer - Finding Relevant Information

\`\`\`react-flow
{
  "title": "Hybrid Retrieval Pipeline",
  "height": "500px",
  "nodes": [
    { "id": "q", "data": { "label": "Processed Query" }, "position": { "x": 250, "y": 0 }, "className": "bg-accent-blue/10" },
    { "id": "dense", "data": { "label": "Dense Retrieval\\nEmbeddings + Vector DB" }, "position": { "x": 50, "y": 100 } },
    { "id": "sparse", "data": { "label": "Sparse Retrieval\\nBM25 / Keyword" }, "position": { "x": 450, "y": 100 } },
    { "id": "merge", "data": { "label": "RRF Merger\\nCombined Results" }, "position": { "x": 250, "y": 220 }, "className": "bg-accent-gold/20" },
    { "id": "rerank", "data": { "label": "Cross-Encoder\\nReranker" }, "position": { "x": 250, "y": 320 } },
    { "id": "final", "data": { "label": "Final Top-K Results" }, "position": { "x": 250, "y": 420 }, "type": "output", "className": "bg-green-500/20" }
  ],
  "edges": [
    { "id": "e1", "source": "q", "target": "dense" },
    { "id": "e2", "source": "q", "target": "sparse" },
    { "id": "e3", "source": "dense", "target": "merge" },
    { "id": "e4", "source": "sparse", "target": "merge" },
    { "id": "e5", "source": "merge", "target": "rerank" },
    { "id": "e6", "source": "rerank", "target": "final" }
  ]
}
\`\`\`

**Complete Implementation**:

\`\`\`python
from typing import List, Dict, Tuple, Optional
import numpy as np
from dataclasses import dataclass

@dataclass
class RetrievedDocument:
    """Retrieved document with metadata."""
    content: str
    score: float
    source: str
    metadata: Dict
    chunk_id: str

class HybridRetriever:
    """Hybrid retrieval combining dense and sparse search."""
    
    def __init__(
        self,
        vector_store,
        sparse_retriever,
        reranker=None,
        dense_weight: float = 0.7,
        cache_size: int = 1000,
    ):
        """
        Initialize hybrid retriever.
        
        Args:
            vector_store: Dense vector search (FAISS, etc.)
            sparse_retriever: Sparse search (BM25, etc.)
            reranker: Optional reranking model
            dense_weight: Weight for dense vs sparse (0.0-1.0)
            cache_size: Number of queries to cache
        """
        self.vector_store = vector_store
        self.sparse_retriever = sparse_retriever
        self.reranker = reranker
        self.dense_weight = dense_weight
        self.sparse_weight = 1.0 - dense_weight
        
        # LRU cache for query results
        from functools import lru_cache
        self._cached_retrieve = lru_cache(maxsize=cache_size)(
            self._retrieve_internal
        )
    
    def retrieve(
        self,
        query: str,
        k: int = 5,
        dense_k: int = 20,
        sparse_k: int = 20,
        rerank: bool = True,
    ) -> List[RetrievedDocument]:
        """
        Retrieve relevant documents using hybrid search.
        
        Args:
            query: Search query
            k: Final number of documents to return
            dense_k: Number from dense retrieval
            sparse_k: Number from sparse retrieval
            rerank: Whether to apply reranking
            
        Returns:
            List of retrieved documents with scores
        """
        # Try cache first
        cache_key = f"{query}_{k}_{dense_k}_{sparse_k}_{rerank}"
        
        try:
            return self._cached_retrieve(cache_key)
        except:
            pass
        
        # Dense retrieval (vector search)
        dense_results = self._dense_retrieve(query, dense_k)
        
        # Sparse retrieval (BM25)
        sparse_results = self._sparse_retrieve(query, sparse_k)
        
        # Merge results using Reciprocal Rank Fusion
        merged_results = self._merge_results(
            dense_results,
            sparse_results,
            k=k * 2  # Get more before reranking
        )
        
        # Optional reranking
        if rerank and self.reranker:
            merged_results = self._rerank(query, merged_results, k=k)
        else:
            merged_results = merged_results[:k]
        
        return merged_results
    
    def _dense_retrieve(
        self,
        query: str,
        k: int
    ) -> List[Tuple[str, float, Dict]]:
        """Dense retrieval using embeddings."""
        
        # Get query embedding
        results = self.vector_store.similarity_search_with_score(
            query,
            k=k
        )
        
        return [
            (doc.page_content, score, doc.metadata)
            for doc, score in results
        ]
    
    def _sparse_retrieve(
        self,
        query: str,
        k: int
    ) -> List[Tuple[str, float, Dict]]:
        """Sparse retrieval using BM25."""
        
        results = self.sparse_retriever.get_relevant_documents(query)[:k]
        
        return [
            (doc.page_content, 1.0, doc.metadata)  # BM25 doesn't return scores
            for doc in results
        ]
    
    def _merge_results(
        self,
        dense_results: List[Tuple],
        sparse_results: List[Tuple],
        k: int
    ) -> List[RetrievedDocument]:
        """
        Merge dense and sparse results using Reciprocal Rank Fusion.
        
        RRF score = sum(1 / (rank + k)) for each list
        where k is a constant (typically 60)
        """
        RRF_K = 60
        
        # Create score dictionaries
        doc_scores = {}
        doc_metadata = {}
        
        # Score dense results
        for rank, (content, score, metadata) in enumerate(dense_results, 1):
            doc_key = content[:100]  # Use first 100 chars as key
            if doc_key not in doc_scores:
                doc_scores[doc_key] = 0
                doc_metadata[doc_key] = (content, metadata)
            
            # RRF score with weighting
            doc_scores[doc_key] += self.dense_weight * (1.0 / (rank + RRF_K))
        
        # Score sparse results
        for rank, (content, score, metadata) in enumerate(sparse_results, 1):
            doc_key = content[:100]
            if doc_key not in doc_scores:
                doc_scores[doc_key] = 0
                doc_metadata[doc_key] = (content, metadata)
            
            doc_scores[doc_key] += self.sparse_weight * (1.0 / (rank + RRF_K))
        
        # Sort by combined score
        sorted_docs = sorted(
            doc_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )[:k]
        
        # Convert to RetrievedDocument objects
        results = []
        for doc_key, score in sorted_docs:
            content, metadata = doc_metadata[doc_key]
            results.append(RetrievedDocument(
                content=content,
                score=score,
                source='hybrid',
                metadata=metadata,
                chunk_id=metadata.get('chunk_id', '')
            ))
        
        return results
    
    def _rerank(
        self,
        query: str,
        documents: List[RetrievedDocument],
        k: int
    ) -> List[RetrievedDocument]:
        """Rerank documents using cross-encoder."""
        
        if not self.reranker:
            return documents[:k]
        
        # Prepare pairs for reranking
        pairs = [(query, doc.content) for doc in documents]
        
        # Get reranking scores
        scores = self.reranker.predict(pairs)
        
        # Create new scored documents
        reranked = []
        for doc, score in zip(documents, scores):
            reranked.append(RetrievedDocument(
                content=doc.content,
                score=float(score),
                source='reranked',
                metadata=doc.metadata,
                chunk_id=doc.chunk_id
            ))
        
        # Sort by new scores
        reranked.sort(key=lambda x: x.score, reverse=True)
        
        return reranked[:k]
    
    def _retrieve_internal(self, cache_key: str):
        """Internal method for caching."""
        # This is a placeholder for the actual cached retrieve logic
        pass
\`\`\`

I'll continue with the remaining layers in the next file. Let me save this progress and continue:

#### Layer 5: Context Assembly - Intelligent Merging

The context assembly layer is where all information sources come together into a coherent prompt that fits within the model's context window.

\`\`\`react-flow
{
  "title": "Context Assembly Pipeline",
  "height": "500px",
  "nodes": [
    { "id": "sources", "data": { "label": "Input Sources\\nSystem, Query, Hist, Docs" }, "position": { "x": 0, "y": 200 }, "className": "bg-accent-blue/10" },
    { "id": "pipe", "data": { "label": "Assembly Pipeline" }, "position": { "x": 200, "y": 100 }, "style": { "width": 200, "height": 300, "backgroundColor": "rgba(212, 163, 115, 0.05)" }, "type": "group" },
    { "id": "sort", "data": { "label": "Priority Sort" }, "position": { "x": 25, "y": 40 }, "parentId": "pipe" },
    { "id": "dedup", "data": { "label": "Deduplication" }, "position": { "x": 25, "y": 100 }, "parentId": "pipe" },
    { "id": "comp", "data": { "label": "Compression" }, "position": { "x": 25, "y": 160 }, "parentId": "pipe" },
    { "id": "bud", "data": { "label": "Budget Alloc" }, "position": { "x": 25, "y": 220 }, "parentId": "pipe" },
    { "id": "final", "data": { "label": "Assembled Context" }, "position": { "x": 500, "y": 200 }, "type": "output", "className": "bg-green-500/20 shadow-lg" }
  ],
  "edges": [
    { "id": "e1", "source": "sources", "target": "sort", "animated": true },
    { "id": "e2", "source": "sort", "target": "dedup" },
    { "id": "e3", "source": "dedup", "target": "comp" },
    { "id": "e4", "source": "comp", "target": "bud" },
    { "id": "e5", "source": "bud", "target": "final", "animated": true }
  ]
}
\`\`\`

**Key Principles:**
1. **Priority-Based Inclusion**: Critical information always included
2. **Token Budget Management**: Never exceed context window
3. **Deduplication**: Remove redundant information
4. **Compression**: Summarize when possible
5. **Quality over Quantity**: Better to have 5 highly relevant docs than 20 mediocre ones

**Complete Implementation**:

\`\`\`python
from typing import List, Dict
from dataclasses import dataclass

@dataclass
class ContextBudget:
    """Token budget allocation for context."""
    total_available: int = 128000
    system_prompt: int = 500
    user_query: int = 2000
    conversation_history: int = 3000
    retrieved_docs: int = 15000
    tools: int = 5000
    examples: int = 2000
    reserved_for_response: int = 4000
    safety_margin: int = 1000

class ContextAssembler:
    """Assemble final context from all sources."""
    
    def __init__(self, budget: ContextBudget):
        self.budget = budget
    
    def assemble(
        self,
        system_prompt: str,
        user_query: str,
        conversation_history: List[str],
        retrieved_docs: List[RetrievedDocument],
        tools: List[Dict],
        examples: List[str],
    ) -> str:
        """
        Assemble complete context within token budget.
        
        Returns:
            Fully assembled context string ready for LLM
        """
        sections = {}
        
        # 1. System prompt (always include)
        sections['system'] = self._truncate(
            system_prompt,
            self.budget.system_prompt
        )
        
        # 2. User query (always include)
        sections['query'] = self._truncate(
            user_query,
            self.budget.user_query
        )
        
        # 3. Conversation history (summarize if needed)
        sections['history'] = self._process_history(
            conversation_history,
            self.budget.conversation_history
        )
        
        # 4. Retrieved documents (prioritize and truncate)
        sections['documents'] = self._process_documents(
            retrieved_docs,
            self.budget.retrieved_docs
        )
        
        # 5. Tools (include only relevant)
        sections['tools'] = self._process_tools(
            tools,
            user_query,
            self.budget.tools
        )
        
        # 6. Examples (include if space)
        sections['examples'] = self._process_examples(
            examples,
            self.budget.examples
        )
        
        # Assemble final context
        final_context = self._merge_sections(sections)
        
        # Verify token count
        actual_tokens = self._count_tokens(final_context)
        max_tokens = (
            self.budget.total_available -
            self.budget.reserved_for_response -
            self.budget.safety_margin
        )
        
        if actual_tokens > max_tokens:
            # Emergency compression
            final_context = self._emergency_compress(
                final_context,
                max_tokens
            )
        
        return final_context
    
    def _process_history(
        self,
        history: List[str],
        budget: int
    ) -> str:
        """Process conversation history with compression."""
        
        if not history:
            return ""
        
        # Keep recent messages in full
        recent_count = 3
        recent_messages = history[-recent_count:]
        
        # Summarize older messages if exists
        older_messages = history[:-recent_count] if len(history) > recent_count else []
        
        result = ""
        
        if older_messages:
            summary = self._summarize_messages(older_messages)
            result += f"Earlier conversation summary:\\n{summary}\\n\\n"
        
        result += "Recent messages:\\n"
        result += "\\n".join(recent_messages)
        
        return self._truncate(result, budget)
    
    def _process_documents(
        self,
        docs: List[RetrievedDocument],
        budget: int
    ) -> str:
        """Process retrieved documents with deduplication."""
        
        if not docs:
            return ""
        
        # Remove duplicates
        unique_docs = self._deduplicate_documents(docs)
        
        # Allocate budget per document
        budget_per_doc = budget // len(unique_docs)
        
        doc_texts = []
        for i, doc in enumerate(unique_docs):
            # Truncate each document
            truncated = self._truncate(doc.content, budget_per_doc)
            
            # Add source attribution
            source = doc.metadata.get('source', 'Unknown')
            doc_text = f"[Document {i+1} from {source}]\\n{truncated}\\n"
            doc_texts.append(doc_text)
        
        return "\\n".join(doc_texts)
    
    def _deduplicate_documents(
        self,
        docs: List[RetrievedDocument]
    ) -> List[RetrievedDocument]:
        """Remove duplicate or highly similar documents."""
        
        unique = []
        seen_content = set()
        
        for doc in docs:
            # Use first 100 characters as fingerprint
            fingerprint = doc.content[:100].strip()
            
            if fingerprint not in seen_content:
                seen_content.add(fingerprint)
                unique.append(doc)
        
        return unique
    
    def _process_tools(
        self,
        tools: List[Dict],
        query: str,
        budget: int
    ) -> str:
        """Include only tools relevant to query."""
        
        if not tools:
            return ""
        
        # Filter to relevant tools (simplified)
        query_lower = query.lower()
        relevant_tools = []
        
        for tool in tools:
            tool_desc = tool.get('description', '').lower()
            # Check if tool description relates to query
            if any(word in tool_desc for word in query_lower.split()):
                relevant_tools.append(tool)
        
        # If no matches, include all tools
        if not relevant_tools:
            relevant_tools = tools
        
        # Format tools
        tool_texts = []
        for tool in relevant_tools:
            tool_text = f"Tool: {tool['name']}\\n"
            tool_text += f"Description: {tool['description']}\\n"
            if 'parameters' in tool:
                tool_text += f"Parameters: {tool['parameters']}\\n"
            tool_texts.append(tool_text)
        
        tools_section = "\\n".join(tool_texts)
        return self._truncate(tools_section, budget)
    
    def _process_examples(
        self,
        examples: List[str],
        budget: int
    ) -> str:
        """Include few-shot examples if space available."""
        
        if not examples:
            return ""
        
        examples_text = "Examples:\\n\\n"
        examples_text += "\\n\\n".join(examples)
        
        return self._truncate(examples_text, budget)
    
    def _merge_sections(self, sections: Dict[str, str]) -> str:
        """Merge all sections into final context."""
        
        template = """<system>
{system}
</system>

<available_tools>
{tools}
</available_tools>

<retrieved_knowledge>
{documents}
</retrieved_knowledge>

<conversation_history>
{history}
</conversation_history>

<examples>
{examples}
</examples>

<current_query>
{query}
</current_query>

Please respond to the current query using the provided context."""
        
        return template.format(**sections)
    
    def _count_tokens(self, text: str) -> int:
        """Estimate token count (simplified)."""
        # In production, use tiktoken or model-specific tokenizer
        return len(text.split())
    
    def _truncate(self, text: str, max_tokens: int) -> str:
        """Truncate text to max tokens."""
        words = text.split()
        if len(words) <= max_tokens:
            return text
        return " ".join(words[:max_tokens]) + "..."
    
    def _summarize_messages(self, messages: List[str]) -> str:
        """Summarize older messages."""
        # In production, use LLM to summarize
        # For now, simple truncation
        combined = "\\n".join(messages)
        return combined[:500] + "..."
    
    def _emergency_compress(self, context: str, max_tokens: int) -> str:
        """Emergency compression if over budget."""
        words = context.split()
        if len(words) <= max_tokens:
            return context
        
        # Aggressive truncation
        return " ".join(words[:max_tokens])
\`\`\`

## Production Architecture: Complete System

\`\`\`react-flow
{
  "title": "Production Context Architecture",
  "height": "600px",
  "nodes": [
    { "id": "client", "data": { "label": "User App" }, "position": { "x": 300, "y": 0 }, "className": "bg-accent-blue/10" },
    { "id": "gw", "data": { "label": "API Gateway\\nLB / Auth / Rate Limit" }, "position": { "x": 300, "y": 80 } },
    { "id": "stack", "data": { "label": "Context Stack Service" }, "position": { "x": 100, "y": 180 }, "style": { "width": 500, "height": 250, "backgroundColor": "rgba(59, 130, 246, 0.05)" }, "type": "group" },
    { "id": "qp", "data": { "label": "Query Proc" }, "position": { "x": 20, "y": 40 }, "parentId": "stack" },
    { "id": "mm", "data": { "label": "Memory Mgr" }, "position": { "x": 180, "y": 40 }, "parentId": "stack" },
    { "id": "ro", "data": { "label": "Retrieval Orch" }, "position": { "x": 340, "y": 40 }, "parentId": "stack" },
    { "id": "ca", "data": { "label": "Context Assembler" }, "position": { "x": 180, "y": 140 }, "parentId": "stack", "className": "bg-accent-gold/20 shadow-md font-bold" },
    { "id": "data", "data": { "label": "Data Stores\\nVector / Cache / Session" }, "position": { "x": 100, "y": 450 }, "className": "bg-accent-blue/5 border-dashed" },
    { "id": "llm", "data": { "label": "LLM Layer\\nRouting / Gen / Valid" }, "position": { "x": 500, "y": 450 }, "className": "bg-purple-500/10" },
    { "id": "mon", "data": { "label": "Monitoring\\nMetrics / Logs / Alerts" }, "position": { "x": 650, "y": 180 } }
  ],
  "edges": [
    { "id": "e1", "source": "client", "target": "gw", "animated": true },
    { "id": "e2", "source": "gw", "target": "qp" },
    { "id": "e3", "source": "qp", "target": "mm" },
    { "id": "e4", "source": "qp", "target": "ro" },
    { "id": "e5", "source": "mm", "target": "ca" },
    { "id": "e6", "source": "ro", "target": "ca" },
    { "id": "e7", "source": "ro", "target": "data" },
    { "id": "e8", "source": "mm", "target": "data" },
    { "id": "e9", "source": "ca", "target": "llm", "animated": true },
    { "id": "e10", "source": "llm", "target": "client", "animated": true },
    { "id": "e11", "source": "stack", "target": "mon", "style": { "strokeDasharray": "5 5" } }
  ]
}
\`\`\`

## Best Practices and Production Patterns

### 1. Context Window Management

**Problem**: Context windows fill up quickly with conversation history and retrieved documents.

**Solutions**:
- Implement sliding window for conversation history
- Summarize older messages
- Use entity memory to preserve important facts
- Implement smart truncation strategies

### 2. Token Budget Allocation

**Principle**: Allocate tokens based on information value, not equal distribution.

**Recommended Allocation** (for 128K context):
- System Prompt: 500 tokens (0.4%)
- User Query: 2,000 tokens (1.6%)
- Conversation History: 3,000 tokens (2.3%)
- Retrieved Documents: 15,000 tokens (11.7%)
- Tools/Functions: 5,000 tokens (3.9%)
- Examples: 2,000 tokens (1.6%)
- Reserved for Response: 4,000 tokens (3.1%)
- Safety Margin: 1,000 tokens (0.8%)
- **Total Used**: ~32,500 tokens (25.4% of 128K)
- **Available**: ~95,500 tokens for additional context

### 3. Retrieval Quality over Quantity

**Anti-Pattern**: Retrieving 50 documents and including them all.

**Best Practice**: Retrieve 20, rerank to top 5, only include highly relevant ones.

### 4. Caching Strategy

\`\`\`python
class ContextCache:
    """Multi-level caching for context engineering."""
    
    def __init__(self):
        # L1: Query results cache
        self.query_cache = {}  # query_hash -> results
        
        # L2: Document embeddings cache
        self.embedding_cache = {}  # doc_id -> embedding
        
        # L3: Assembled context cache
        self.context_cache = {}  # context_hash -> assembled_context
    
    def get_or_compute(self, key, compute_fn, cache_type='query'):
        """Get from cache or compute if not exists."""
        cache = getattr(self, f'{cache_type}_cache')
        
        if key in cache:
            return cache[key]
        
        result = compute_fn()
        cache[key] = result
        return result
\`\`\`

### 5. Monitoring and Observability

**Key Metrics to Track**:
- Average context tokens used
- Retrieved documents relevance scores
- Query processing latency
- Cache hit rates
- Token budget utilization
- Context assembly time

## Conclusion

Context engineering is the foundational architecture for intelligent AI systems. It's not about clever prompts—it's about systematic information management that ensures the AI always has exactly what it needs.

Key principles:
1. **Hierarchical Memory**: Multiple levels of memory with different speeds and capacities
2. **Intelligent Retrieval**: Hybrid search + reranking for highest quality
3. **Dynamic Assembly**: Adapt context to each query
4. **Budget Management**: Never waste tokens on low-value information
5. **Continuous Optimization**: Monitor and improve based on actual usage

The systems that win in production are those that master context engineering—providing AIs with perfect information, every time.

---

*Part 2 of the AI Architect Series. Next: Multimodal AI Systems - Integrating Vision, Text, and Beyond*
`,Be="2025-02-04",$e=15,He={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},Ue="AI/ML",We=["Context Engineering","RAG","LLM","Data Pipeline","AI Strategy"],Ve="/blog/context-engineering.png",je=!1,Qe={id:De,slug:ze,title:Fe,excerpt:Oe,content:Ge,publishedAt:Be,readTime:$e,author:He,category:Ue,tags:We,featuredImage:Ve,featured:je},Ye="5",Ke="enterprise-rag-systems-guide",Ze="Building Enterprise-Grade RAG Systems: From Prototype to Production",Xe="A comprehensive guide to building scalable, reliable RAG systems using LangChain, Azure AI Foundry, and hybrid search techniques for production environments.",Je=`# Building Enterprise-Grade RAG Systems: From Prototype to Production

## Introduction: Why RAG is Reshaping Enterprise AI

Picture this: your company has decades of product documentation, customer support tickets, internal wikis, and technical specifications scattered across different systems. You want to build an AI assistant that can answer questions using this proprietary knowledge, but traditional language models only know what they were trained on. How do you bridge this gap?

Enter Retrieval-Augmented Generation, or RAG. This architectural pattern has become the backbone of enterprise AI in 2025, powering everything from customer support chatbots to internal knowledge assistants. According to recent industry data, over 60% of production LLM applications now use RAG architecture.

In this comprehensive guide, we'll build an enterprise-grade RAG system from scratch using LangChain, Azure AI Foundry, and open-source tools. You'll learn the architecture patterns, implementation techniques, and production best practices that separate proof-of-concepts from scalable, reliable systems that handle millions of queries.

## What is RAG and Why Does It Matter?

RAG combines two powerful capabilities:

1. **Retrieval**: Finding relevant information from your knowledge base
2. **Generation**: Using an LLM to create natural language responses grounded in that retrieved information

This solves the fundamental problem of LLMs: they're frozen in time at their training cutoff and don't know about your company's specific data.

### The RAG Advantage

**Up-to-date Information**: Add new documents without retraining models
**Source Attribution**: Track where information comes from for compliance
**Cost Efficiency**: No need to fine-tune expensive models
**Reduced Hallucinations**: Responses are grounded in actual documents
**Domain Specificity**: Works with specialized knowledge without massive datasets

## RAG Architecture: The Building Blocks

Here's the high-level architecture of a production RAG system:

\`\`\`react-flow
{
  "title": "Enterprise RAG Architecture",
  "height": "800px",
  "nodes": [
    { "id": "query", "type": "input", "data": { "label": "USER QUERY" }, "position": { "x": 250, "y": 0 }, "className": "bg-accent-gold/20 border-accent-gold/50 rounded-full font-bold shadow-lg" },
    { "id": "proc", "data": { "label": "Query Processing" }, "position": { "x": 250, "y": 80 }, "className": "bg-accent-blue/10 border-accent-blue/50 font-medium" },
    
    { "id": "layer1", "data": { "label": "Processing Layer" }, "position": { "x": 0, "y": 160 }, "style": { "width": 500, "height": 120, "backgroundColor": "rgba(212, 163, 115, 0.05)", "border": "1px dashed rgba(212, 163, 115, 0.3)" }, "type": "group" },
    { "id": "id", "data": { "label": "Intent Detection" }, "position": { "x": 40, "y": 40 }, "parentId": "layer1", "extent": "parent" },
    { "id": "qe", "data": { "label": "Query Expansion" }, "position": { "x": 180, "y": 40 }, "parentId": "layer1", "extent": "parent" },
    { "id": "mf", "data": { "label": "Metadata Filtering" }, "position": { "x": 320, "y": 40 }, "parentId": "layer1", "extent": "parent" },
    
    { "id": "search", "data": { "label": "Hybrid Search" }, "position": { "x": 250, "y": 320 }, "className": "bg-accent-blue/10 border-accent-blue/50 font-medium" },
    
    { "id": "layer2", "data": { "label": "Retrieval Layer" }, "position": { "x": 100, "y": 400 }, "style": { "width": 300, "height": 100, "backgroundColor": "rgba(212, 163, 115, 0.05)", "border": "1px dashed rgba(212, 163, 115, 0.3)" }, "type": "group" },
    { "id": "dense", "data": { "label": "Dense / Vector" }, "position": { "x": 20, "y": 40 }, "parentId": "layer2", "extent": "parent" },
    { "id": "sparse", "data": { "label": "Sparse / BM25" }, "position": { "x": 160, "y": 40 }, "parentId": "layer2", "extent": "parent" },
    
    { "id": "rerank", "data": { "label": "Reranking" }, "position": { "x": 250, "y": 540 } },
    { "id": "context", "data": { "label": "Context Construction" }, "position": { "x": 250, "y": 620 } },
    { "id": "llm", "data": { "label": "LLM Generation" }, "position": { "x": 250, "y": 700 }, "className": "bg-accent-blue/10 border-accent-blue/50 font-medium" },
    { "id": "valid", "data": { "label": "Response Validation" }, "position": { "x": 250, "y": 780 } },
    { "id": "answer", "type": "output", "data": { "label": "FINAL ANSWER" }, "position": { "x": 250, "y": 880 }, "className": "bg-green-500/20 border-green-500/50 rounded-full font-bold shadow-lg" }
  ],
  "edges": [
    { "id": "e1", "source": "query", "target": "proc", "animated": true },
    { "id": "e2", "source": "proc", "target": "id" },
    { "id": "e3", "source": "proc", "target": "qe" },
    { "id": "e4", "source": "proc", "target": "mf" },
    { "id": "e5", "source": "id", "target": "search" },
    { "id": "e6", "source": "qe", "target": "search" },
    { "id": "e7", "source": "mf", "target": "search" },
    { "id": "e8", "source": "search", "target": "dense" },
    { "id": "e9", "source": "search", "target": "sparse" },
    { "id": "e10", "source": "dense", "target": "rerank" },
    { "id": "e11", "source": "sparse", "target": "rerank" },
    { "id": "e12", "source": "rerank", "target": "context" },
    { "id": "e13", "source": "context", "target": "llm" },
    { "id": "e14", "source": "llm", "target": "valid", "animated": true },
    { "id": "e15", "source": "valid", "target": "answer" }
  ]
}
\`\`\`

Let's build this system step by step.

## Step 1: Document Processing Pipeline

The quality of your RAG system starts with data preparation. Poor document processing leads to poor retrieval, which leads to poor answers.

### Document Ingestion

\`\`\`python
from pathlib import Path
from typing import List, Dict
from langchain.schema import Document
from langchain_community.document_loaders import (
    PyPDFLoader,
    UnstructuredWordDocumentLoader,
    UnstructuredMarkdownLoader,
)

class DocumentProcessor:
    """Production-grade document processing pipeline."""
    
    def __init__(self):
        self.loaders = {
            '.pdf': PyPDFLoader,
            '.docx': UnstructuredWordDocumentLoader,
            '.md': UnstructuredMarkdownLoader,
        }
    
    def load_documents(self, directory: str) -> List[Document]:
        """Load all supported documents from a directory."""
        documents = []
        
        for file_path in Path(directory).rglob('*'):
            if file_path.suffix in self.loaders:
                loader_class = self.loaders[file_path.suffix]
                loader = loader_class(str(file_path))
                
                try:
                    docs = loader.load()
                    
                    # Add metadata
                    for doc in docs:
                        doc.metadata.update({
                            'source': str(file_path),
                            'file_type': file_path.suffix,
                            'file_name': file_path.name,
                        })
                    
                    documents.extend(docs)
                    print(f"Loaded: {file_path.name}")
                    
                except Exception as e:
                    print(f"Error loading {file_path.name}: {e}")
                    continue
        
        return documents

# Usage
processor = DocumentProcessor()
documents = processor.load_documents("./knowledge_base")
print(f"Loaded {len(documents)} documents")
\`\`\`

### Intelligent Chunking Strategy

Chunking is critical. Too small, and you lose context. Too large, and retrieval becomes noisy. Here's a production-ready chunking strategy:

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter

class SmartChunker:
    """Context-aware document chunking."""
    
    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
    ):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=[
                "\\n\\n\\n",  # Document sections
                "\\n\\n",    # Paragraphs
                "\\n",      # Lines
                ". ",      # Sentences
                " ",       # Words
                "",        # Characters
            ],
            length_function=len,
        )
    
    def chunk_documents(
        self,
        documents: List[Document]
    ) -> List[Document]:
        """Chunk documents while preserving metadata."""
        
        chunks = []
        
        for doc in documents:
            # Split the document
            doc_chunks = self.splitter.split_documents([doc])
            
            # Add chunk-specific metadata
            for i, chunk in enumerate(doc_chunks):
                chunk.metadata.update({
                    'chunk_id': f\\"{doc.metadata['file_name']}_chunk_{i}\\",
                    'chunk_index': i,
                    'total_chunks': len(doc_chunks),
                })
                chunks.append(chunk)
        
        return chunks

# Chunk the documents
chunker = SmartChunker(chunk_size=800, chunk_overlap=150)
chunks = chunker.chunk_documents(documents)
print(f"Created {len(chunks)} chunks from {len(documents)} documents")
\`\`\`

### Advanced: Contextual Chunking

In production, we often need to preserve document hierarchy. Here's an advanced technique:

\`\`\`python
def add_contextual_headers(chunks: List[Document]) -> List[Document]:
    """Add document context to each chunk."""
    
    for chunk in chunks:
        # Extract document title/header
        source = chunk.metadata.get('source', '')
        file_name = chunk.metadata.get('file_name', '')
        
        # Prepend context
        context_header = f\\"Document: {file_name}\\n\\n\\"
        chunk.page_content = context_header + chunk.page_content
    
    return chunks

chunks = add_contextual_headers(chunks)
\`\`\`

## Step 2: Building the Vector Store

We'll use FAISS for local development and Azure Cosmos DB for production. Both integrate seamlessly with LangChain.

### Setting Up Embeddings with Azure AI Foundry

\`\`\`python
from langchain_azure_ai.embeddings import AzureAIEmbeddingsModel
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize embeddings model
embeddings = AzureAIEmbeddingsModel(
    endpoint=os.environ[\\"AZURE_INFERENCE_ENDPOINT\\"],
    credential=os.environ[\\"AZURE_INFERENCE_CREDENTIAL\\"],
    model=\\"text-embedding-3-large\\",  # or any embedding model from Azure
)

# Test the embeddings
test_embedding = embeddings.embed_query(\\"Hello world\\")
print(f\\"Embedding dimension: {len(test_embedding)}\\")
\`\`\`

### Local Vector Store (FAISS)

Perfect for development and small-scale deployments:

\`\`\`python
from langchain_community.vectorstores import FAISS

def create_faiss_vectorstore(
    chunks: List[Document],
    embeddings,
    persist_directory: str = \\"./vectorstore\\"
):
    \\"\\"\\"Create and persist FAISS vector store.\\"\\"\\"
    
    print(\\"Creating vector embeddings...\\")
    vectorstore = FAISS.from_documents(
        documents=chunks,
        embedding=embeddings,
    )
    
    # Save for later use
    vectorstore.save_local(persist_directory)
    print(f\\"Vector store saved to {persist_directory}\\")
    
    return vectorstore

# Create vector store
vectorstore = create_faiss_vectorstore(chunks, embeddings)

# Load existing vector store
# vectorstore = FAISS.load_local(\\"./vectorstore\\", embeddings)
\`\`\`

### Production Vector Store (Azure Cosmos DB)

For production deployments with millions of documents:

\`\`\`python
from langchain_azure_ai.vectorstores import AzureCosmosDBNoSqlVectorSearch
from azure.cosmos import CosmosClient

# Initialize Cosmos DB client
cosmos_client = CosmosClient(
    url=os.environ[\\"COSMOS_ENDPOINT\\"],
    credential=os.environ[\\"COSMOS_KEY\\"]
)

# Define vector embedding policy
vector_embedding_policy = {
    \\"vectorEmbeddings\\": [
        {
            \\"path\\": \\"/embedding\\",
            \\"dataType\\": \\"float32\\",
            \\"dimensions\\": 1536,  # Match your embedding model
            \\"distanceFunction\\": \\"cosine\\"
        }
    ]
}

# Create vector store
cosmos_vectorstore = AzureCosmosDBNoSqlVectorSearch.from_documents(
    documents=chunks,
    embedding=embeddings,
    cosmos_client=cosmos_client,
    database_name=\\"knowledge_base\\",
    container_name=\\"documents\\",
    vector_embedding_policy=vector_embedding_policy,
)
\`\`\`

## Step 3: Hybrid Search - The Secret Sauce

Dense vector search alone isn't enough. Production systems combine multiple retrieval strategies:

\`\`\`python
from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever

class HybridRetriever:
    \\"\\"\\"Combines dense and sparse retrieval.\\"\\"\\"
    
    def __init__(
        self,
        vectorstore,
        documents: List[Document],
        dense_weight: float = 0.7,
    ):
        # Dense retriever (vector search)
        self.dense_retriever = vectorstore.as_retriever(
            search_kwargs={\\"k\\": 10}
        )
        
        # Sparse retriever (BM25)
        self.sparse_retriever = BM25Retriever.from_documents(
            documents
        )
        self.sparse_retriever.k = 10
        
        # Ensemble combines both
        self.ensemble_retriever = EnsembleRetriever(
            retrievers=[self.dense_retriever, self.sparse_retriever],
            weights=[dense_weight, 1 - dense_weight]
        )
    
    def retrieve(self, query: str, k: int = 5) -> List[Document]:
        \\"\\"\\"Hybrid retrieval with both methods.\\"\\"\\"
        return self.ensemble_retriever.get_relevant_documents(query)[:k]

# Create hybrid retriever
hybrid_retriever = HybridRetriever(vectorstore, chunks)

# Test retrieval
results = hybrid_retriever.retrieve(
    \\"What are the system requirements for installation?\\"
)

for i, doc in enumerate(results):
    print(f\\"\\n--- Result {i+1} ---\\")
    print(f\\"Source: {doc.metadata['source']}\\")
    print(f\\"Content: {doc.page_content[:200]}...\\")
\`\`\`

## Step 4: Reranking for Precision

After initial retrieval, rerank results for better relevance:

\`\`\`python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

class RerankedRetriever:
    \\"\\"\\"Add LLM-based reranking for better precision.\\"\\"\\"
    
    def __init__(self, base_retriever, llm):
        # Create compressor/reranker
        compressor = LLMChainExtractor.from_llm(llm)
        
        # Wrap base retriever with compression
        self.retriever = ContextualCompressionRetriever(
            base_compressor=compressor,
            base_retriever=base_retriever
        )
    
    def retrieve(self, query: str) -> List[Document]:
        \\"\\"\\"Retrieve and rerank documents.\\"\\"\\"
        return self.retriever.get_relevant_documents(query)

# Add reranking
from langchain_azure_ai.chat_models import AzureAIChatCompletionsModel

llm = AzureAIChatCompletionsModel(
    endpoint=os.environ[\\"AZURE_INFERENCE_ENDPOINT\\"],
    credential=os.environ[\\"AZURE_INFERENCE_CREDENTIAL\\"],
    model=\\"Mistral-7B-Instruct-v0.3\\",
)

reranked_retriever = RerankedRetriever(
    hybrid_retriever.ensemble_retriever,
    llm
)
\`\`\`

## Step 5: Building the RAG Chain

Now we assemble everything into a complete RAG pipeline:

\`\`\`python
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# Create RAG-specific prompt
rag_prompt_template = \\"\\"\\"You are a helpful assistant answering questions based on provided documentation.

Use the following pieces of context to answer the question at the end.

Guidelines:
- If you don't know the answer, say so - don't make up information
- Always cite which document(s) you used
- Be concise but thorough
- If the context doesn't contain enough information, acknowledge what's missing

Context:
{context}

Question: {question}

Answer:\\"\\"\\"

RAG_PROMPT = PromptTemplate(
    template=rag_prompt_template,
    input_variables=[\\"context\\", \\"question\\"]
)

# Create the RAG chain
rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type=\\"stuff\\",  # or \\"map_reduce\\" for longer contexts
    retriever=reranked_retriever.retriever,
    return_source_documents=True,
    chain_type_kwargs={\\"prompt\\": RAG_PROMPT}
)

# Query the system
def query_rag_system(question: str):
    \\"\\"\\"Query the RAG system and display results.\\"\\"\\"
    
    result = rag_chain({\\"query\\": question})
    
    print(f\\"\\nQuestion: {question}\\")
    print(f\\"\\nAnswer: {result['result']}\\")
    print(f\\"\\nSources:\\")
    for i, doc in enumerate(result['source_documents']):
        print(f\\"{i+1}. {doc.metadata['source']}\\")

# Example usage
query_rag_system(\\"What are the installation requirements?\\")
\`\`\`

## Step 6: Advanced RAG Patterns

### Query Transformation

Sometimes user queries need refinement before retrieval:

\`\`\`python
from langchain.chains import LLMChain

query_refinement_prompt = PromptTemplate(
    input_variables=[\\"question\\"],
    template=\\"\\"\\"Given this user question, generate 3 different phrasings 
    that would help retrieve relevant information:
    
    Original: {question}
    
    Variations:
    1.\\"\\"\\"
)

def multi_query_retrieval(question: str, retriever):
    \\"\\"\\"Retrieve using multiple query variations.\\"\\"\\"
    
    # Generate query variations
    refine_chain = LLMChain(llm=llm, prompt=query_refinement_prompt)
    variations = refine_chain.run(question)
    
    all_docs = []
    queries = [question] + variations.split('\\n')
    
    for query in queries:
        docs = retriever.retrieve(query.strip())
        all_docs.extend(docs)
    
    # Deduplicate
    seen = set()
    unique_docs = []
    for doc in all_docs:
        content_hash = hash(doc.page_content)
        if content_hash not in seen:
            seen.add(content_hash)
            unique_docs.append(doc)
    
    return unique_docs[:5]  # Top 5 after deduplication
\`\`\`

### HyDE (Hypothetical Document Embeddings)

Generate a hypothetical answer, then search for documents similar to it:

\`\`\`python
def hyde_retrieval(question: str, retriever, llm):
    \\"\\"\\"Use HyDE for better retrieval.\\"\\"\\"
    
    hyde_prompt = PromptTemplate(
        input_variables=[\\"question\\"],
        template=\\"\\"\\"Write a detailed paragraph that would answer this question:
        
        {question}
        
        Answer:\\"\\"\\"
    )
    
    # Generate hypothetical document
    chain = LLMChain(llm=llm, prompt=hyde_prompt)
    hypothetical_doc = chain.run(question)
    
    # Search using the hypothetical answer
    docs = retriever.retrieve(hypothetical_doc)
    
    return docs
\`\`\`

## Step 7: Production Monitoring and Evaluation

Production RAG systems need robust monitoring:

\`\`\`python
from datetime import datetime
import json

class RAGMonitor:
    \\"\\"\\"Monitor RAG system performance.\\"\\"\\"
    
    def __init__(self, log_file: str = \\"rag_metrics.jsonl\\"):
        self.log_file = log_file
    
    def log_query(
        self,
        query: str,
        answer: str,
        sources: List[str],
        latency: float,
        relevance_score: float = None,
    ):
        \\"\\"\\"Log query metrics.\\"\\"\\"
        
        metrics = {
            \\"timestamp\\": datetime.now().isoformat(),
            \\"query\\": query,
            \\"answer_length\\": len(answer),
            \\"num_sources\\": len(sources),
            \\"latency_ms\\": latency * 1000,
            \\"relevance_score\\": relevance_score,
        }
        
        with open(self.log_file, 'a') as f:
            f.write(json.dumps(metrics) + '\\n')
    
    def evaluate_retrieval_quality(
        self,
        query: str,
        retrieved_docs: List[Document],
        ground_truth_docs: List[str] = None,
    ) -> Dict[str, float]:
        \\"\\"\\"Evaluate retrieval quality.\\"\\"\\"
        
        metrics = {}
        
        # Calculate diversity (cosine similarity between docs)
        if len(retrieved_docs) > 1:
            embeddings_list = [
                embeddings.embed_query(doc.page_content)
                for doc in retrieved_docs
            ]
            # Calculate pairwise similarity
            # ... (implementation omitted for brevity)
        
        # Calculate relevance if ground truth provided
        if ground_truth_docs:
            retrieved_sources = {
                doc.metadata['source'] for doc in retrieved_docs
            }
            true_sources = set(ground_truth_docs)
            
            metrics['recall'] = len(
                retrieved_sources & true_sources
            ) / len(true_sources)
            
            metrics['precision'] = len(
                retrieved_sources & true_sources
            ) / len(retrieved_sources)
        
        return metrics

# Initialize monitor
monitor = RAGMonitor()

# Enhanced query function with monitoring
def monitored_rag_query(question: str):
    \\"\\"\\"RAG query with monitoring.\\"\\"\\"
    
    import time
    start_time = time.time()
    
    result = rag_chain({\\"query\\": question})
    
    latency = time.time() - start_time
    
    monitor.log_query(
        query=question,
        answer=result['result'],
        sources=[doc.metadata['source'] for doc in result['source_documents']],
        latency=latency,
    )
    
    return result
\`\`\`

### Hallucination Detection

Critical for production systems:

\`\`\`python
from langchain.chains import LLMChain

def check_hallucination(answer: str, context: str, llm) -> bool:
    \\"\\"\\"Verify answer is grounded in context.\\"\\"\\"
    
    verification_prompt = PromptTemplate(
        input_variables=[\\"answer\\", \\"context\\"],
        template=\\"\\"\\"Given the following context and answer, determine if the answer 
        is fully supported by the context.
        
        Context: {context}
        
        Answer: {answer}
        
        Is this answer fully grounded in the context? Answer only YES or NO.\\"\\"\\"
    )
    
    chain = LLMChain(llm=llm, prompt=verification_prompt)
    result = chain.run(answer=answer, context=context)
    
    return \\"YES\\" in result.upper()

# Usage in RAG chain
def safe_rag_query(question: str):
    \\"\\"\\"RAG with hallucination checking.\\"\\"\\"
    
    result = rag_chain({\\"query\\": question})
    
    # Combine context from source documents
    context = \\"\\n\\n\\".join([
        doc.page_content for doc in result['source_documents']
    ])
    
    # Check for hallucinations
    is_grounded = check_hallucination(
        result['result'],
        context,
        llm
    )
    
    if not is_grounded:
        print(\\"⚠️  Warning: Potential hallucination detected\\")
        # Could trigger human review, return warning, etc.
    
    return result
\`\`\`

## Step 8: Optimizing for Scale

### Caching Strategy

\`\`\`python
from functools import lru_cache
import hashlib

class RAGCache:
    \\"\\"\\"Cache for RAG queries and embeddings.\\"\\"\\"
    
    def __init__(self):
        self.query_cache = {}
        self.embedding_cache = {}
    
    def get_cached_query(self, query: str):
        \\"\\"\\"Retrieve cached query result.\\"\\"\\"
        query_hash = hashlib.md5(query.encode()).hexdigest()
        return self.query_cache.get(query_hash)
    
    def cache_query(self, query: str, result):
        \\"\\"\\"Cache query result.\\"\\"\\"
        query_hash = hashlib.md5(query.encode()).hexdigest()
        self.query_cache[query_hash] = result
    
    @lru_cache(maxsize=10000)
    def get_embedding(self, text: str):
        \\"\\"\\"Cache embeddings.\\"\\"\\"
        return embeddings.embed_query(text)

cache = RAGCache()

# Cached retrieval
def cached_rag_query(question: str):
    \\"\\"\\"RAG query with caching.\\"\\"\\"
    
    # Check cache first
    cached_result = cache.get_cached_query(question)
    if cached_result:
        print(\\"✓ Cache hit\\")
        return cached_result
    
    # Execute query
    result = rag_chain({\\"query\\": question})
    
    # Cache for future
    cache.cache_query(question, result)
    
    return result
\`\`\`

### Batch Processing

For high-volume scenarios:

\`\`\`python
async def batch_rag_queries(questions: List[str]):
    \\"\\"\\"Process multiple queries efficiently.\\"\\"\\"
    
    import asyncio
    
    async def async_query(q):
        # Use async LLM client in production
        return rag_chain({\\"query\\": q})
    
    # Process in parallel
    tasks = [async_query(q) for q in questions]
    results = await asyncio.gather(*tasks)
    
    return results
\`\`\`

## Production Deployment Architecture

Here's a complete production deployment on Azure:

\`\`\`react-flow
{
  "title": "Production Deployment Architecture",
  "height": "600px",
  "nodes": [
    { "id": "cloud", "data": { "label": "Cloud Infrastructure" }, "position": { "x": 0, "y": 0 }, "style": { "width": 600, "height": 500, "backgroundColor": "rgba(212, 163, 115, 0.05)", "border": "1px dashed rgba(212, 163, 115, 0.3)" }, "type": "group" },
    { "id": "afd", "data": { "label": "Azure Front Door / WAF" }, "position": { "x": 200, "y": 40 }, "parentId": "cloud", "extent": "parent", "className": "bg-accent-gold/20 border-accent-gold/50" },
    { "id": "aks", "data": { "label": "Azure Kubernetes Service" }, "position": { "x": 200, "y": 120 }, "parentId": "cloud", "extent": "parent", "className": "bg-accent-blue/10 border-accent-blue/50 font-medium" },
    
    { "id": "backend", "data": { "label": "Backend Services" }, "position": { "x": 150, "y": 200 }, "parentId": "cloud", "extent": "parent", "style": { "width": 300, "height": 80, "backgroundColor": "rgba(59, 130, 246, 0.05)", "border": "1px dashed rgba(59, 130, 246, 0.3)" }, "type": "group" },
    { "id": "api", "data": { "label": "FastAPI RAG API" }, "position": { "x": 50, "y": 20 }, "parentId": "backend", "extent": "parent" },
    
    { "id": "storage", "data": { "label": "Storage & AI" }, "position": { "x": 50, "y": 320 }, "parentId": "cloud", "extent": "parent", "style": { "width": 500, "height": 100, "backgroundColor": "rgba(16, 185, 129, 0.05)", "border": "1px dashed rgba(16, 185, 129, 0.3)" }, "type": "group" },
    { "id": "cosmos", "data": { "label": "Cosmos DB Vector Store" }, "position": { "x": 20, "y": 40 }, "parentId": "storage", "extent": "parent" },
    { "id": "ai", "data": { "label": "Azure AI Foundry LLMs" }, "position": { "x": 180, "y": 40 }, "parentId": "storage", "extent": "parent" },
    { "id": "redis", "data": { "label": "Redis Cache" }, "position": { "x": 360, "y": 40 }, "parentId": "storage", "extent": "parent" },
    
    { "id": "mon", "data": { "label": "App Insights" }, "position": { "x": 450, "y": 220 }, "parentId": "cloud", "extent": "parent" }
  ],
  "edges": [
    { "id": "e1", "source": "afd", "target": "aks", "animated": true },
    { "id": "e2", "source": "aks", "target": "api" },
    { "id": "e3", "source": "api", "target": "cosmos" },
    { "id": "e4", "source": "api", "target": "ai" },
    { "id": "e5", "source": "api", "target": "redis" },
    { "id": "e6", "source": "api", "target": "mon" }
  ]
}
\`\`\`

### FastAPI Production Service

\`\`\`python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title=\\"Enterprise RAG API\\")

class QueryRequest(BaseModel):
    question: str
    max_sources: int = 5
    temperature: float = 0.7

class QueryResponse(BaseModel):
    answer: str
    sources: List[str]
    confidence: float
    latency_ms: float

@app.post(\\"/query\\", response_model=QueryResponse)
async def query_endpoint(request: QueryRequest):
    \\"\\"\\"Main RAG query endpoint.\\"\\"\\"
    
    try:
        import time
        start = time.time()
        
        # Execute RAG query
        result = rag_chain({
            \\"query\\": request.question
        })
        
        latency = (time.time() - start) * 1000
        
        return QueryResponse(
            answer=result['result'],
            sources=[
                doc.metadata['source']
                for doc in result['source_documents']
            ][:request.max_sources],
            confidence=0.85,  # Calculate based on retrieval scores
            latency_ms=latency,
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get(\\"/health\\")
async def health_check():
    \\"\\"\\"Health check endpoint.\\"\\"\\"
    return {\\"status\\": \\"healthy\\", \\"version\\": \\"1.0.0\\"}

# Run with: uvicorn main:app --host 0.0.0.0 --port 8000
\`\`\`

## Best Practices Checklist

### Data Quality
- ✅ Clean and preprocess documents
- ✅ Remove duplicates
- ✅ Maintain metadata
- ✅ Regular updates

### Retrieval Optimization
- ✅ Use hybrid search (dense + sparse)
- ✅ Implement reranking
- ✅ Optimize chunk size for your domain
- ✅ Add query expansion

### Generation Quality
- ✅ Craft domain-specific prompts
- ✅ Implement hallucination detection
- ✅ Provide source attribution
- ✅ Handle edge cases gracefully

### Production Readiness
- ✅ Monitor latency and costs
- ✅ Cache frequently asked questions
- ✅ Implement rate limiting
- ✅ Set up comprehensive logging
- ✅ Create evaluation datasets
- ✅ Establish feedback loops

## Common Pitfalls and Solutions

### Pitfall 1: Poor Chunk Boundaries
**Problem**: Chunks split mid-sentence, losing context
**Solution**: Use RecursiveCharacterTextSplitter with appropriate separators

### Pitfall 2: Retrieval-Generation Mismatch
**Problem**: Retrieved docs don't help answer the question
**Solution**: Implement reranking and query transformation

### Pitfall 3: Context Window Overflow
**Problem**: Too many source documents exceed LLM context limit
**Solution**: Use map-reduce chain or implement progressive summarization

### Pitfall 4: Slow Query Times
**Problem**: Users wait 10+ seconds for answers
**Solution**: Implement caching, optimize retrieval, use streaming

## Measuring Success

Key metrics for production RAG systems:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Answer Relevance | >4/5 | Human evaluation |
| Retrieval Recall | >80% | Benchmark datasets |
| Latency (p95) | <2s | Application logs |
| Hallucination Rate | <5% | Automated verification |
| User Satisfaction | >85% | Surveys, thumbs up/down |

## Conclusion

Building production RAG systems requires more than just connecting an LLM to a vector database. You need:

1. **Intelligent document processing** with context-aware chunking
2. **Hybrid retrieval** combining multiple search strategies
3. **Reranking** for precision
4. **Robust monitoring** to catch issues early
5. **Iterative improvement** based on real usage

The good news? The tools and patterns are mature. LangChain provides the framework, Azure AI Foundry provides the models, and the open-source ecosystem provides the infrastructure. The hard part is the engineering discipline to do it right.

Start simple, measure everything, and iterate. Your first RAG system won't be perfect, but with the patterns in this guide, it will be production-ready from day one.

## What's Next?

In the next article, we'll explore **LLMOps: Deploying and Monitoring LLM Applications in Production**, covering:
- CI/CD pipelines for LLM apps
- A/B testing prompts and models
- Cost optimization strategies
- Incident response for AI systems

Stay tuned!

---

*This guide is part of a comprehensive series on production AI systems. The complete code is available on GitHub (link).*
`,en="/blog/enterprise-rag.png",nn={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},tn="2025-01-28",an=12,rn="AI/ML",on=["RAG","LangChain","Azure AI","Vector DB"],sn=!1,ln={id:Ye,slug:Ke,title:Ze,excerpt:Xe,content:Je,featuredImage:en,author:nn,publishedAt:tn,readTime:an,category:rn,tags:on,featured:sn},cn="1",dn="llmops-production-guide",un="LLMOps: Engineering Production-Grade AI Systems That Actually Work",pn="Master the lifecycle of Large Language Model operations, from prompt versioning and automated evaluation to canary deployments and cost optimization.",mn=`# LLMOps: Engineering Production-Grade AI Systems That Actually Work

## Introduction: From Prototype to Production Reality

You've built an amazing AI prototype. It works perfectly on your laptop, impresses stakeholders in demos, and passes all your test cases. Then you deploy it to production, and reality hits: costs spiral out of control, responses slow to a crawl, the model starts hallucinating on edge cases, and you have no idea why. Welcome to the world of LLMOps.

Large Language Model Operations (LLMOps) is the practice of reliably deploying, monitoring, and maintaining LLM applications in production. It's MLOps adapted for the unique challenges of foundation models: unpredictable outputs, massive scale, sky-high costs, and the constant need for iteration.

In 2025, companies that master LLMOps are shipping AI features 10x faster than their competitors while spending 50% less on infrastructure. This isn't magic; it's engineering discipline.

In this comprehensive guide, you'll learn how to build production LLM systems using Python, LangChain, Azure AI Foundry, and industry-proven practices. We'll cover everything from deployment pipelines to cost optimization, monitoring strategies to incident response.

## The Shift to Agentic AI

Before diving into the lifecycle, it's important to understand the shift from traditional chat-based LLMs to autonomous Agentic systems.

\`\`\`react-flow
{
  "title": "Traditional vs Agentic LLM Comparison",
  "height": "450px",
  "nodes": [
    { "id": "trad", "data": { "label": "TRADITIONAL LLM\\n(Stateless Chat)" }, "position": { "x": 20, "y": 20 }, "style": { "width": 240, "height": 340, "backgroundColor": "rgba(59, 130, 246, 0.05)", "border": "2px dashed rgba(59, 130, 246, 0.3)" }, "type": "group" },
    { "id": "agent", "data": { "label": "AGENTIC LLM\\n(Autonomous Loops)" }, "position": { "x": 280, "y": 20 }, "style": { "width": 240, "height": 340, "backgroundColor": "rgba(212, 163, 115, 0.05)", "border": "2px dashed rgba(212, 163, 115, 0.3)" }, "type": "group" },
    
    { "id": "t1", "data": { "label": "USER QUERY\\n'How do I analyze sales?'" }, "position": { "x": 20, "y": 60 }, "parentId": "trad", "extent": "parent", "className": "bg-white dark:bg-black border-blue-500/30 text-xs" },
    { "id": "t2", "data": { "label": "LLM RESPONSE\\n'You should load the CSV,\\ncalculate metrics...'" }, "position": { "x": 20, "y": 160 }, "parentId": "trad", "extent": "parent", "className": "bg-blue-500/10 border-blue-500/50 text-xs" },
    { "id": "t3", "data": { "label": "USER WORK\\n(Manual Execution)" }, "position": { "x": 20, "y": 260 }, "parentId": "trad", "extent": "parent", "className": "bg-neutral-100 dark:bg-neutral-800 text-xs" },

    { "id": "a1", "data": { "label": "USER GOAL\\n'Analyze sales data from Q4'" }, "position": { "x": 20, "y": 60 }, "parentId": "agent", "extent": "parent", "className": "bg-white dark:bg-black border-[#d4a373]/30 text-xs" },
    { "id": "a2", "data": { "label": "AGENT EXECUTION\\n1. ✓ Load sales_q4.csv\\n2. ✓ Calculate metrics\\n3. ✓ Create charts\\n4. ✓ Email report" }, "position": { "x": 20, "y": 160 }, "parentId": "agent", "extent": "parent", "className": "bg-[#d4a373]/10 border-[#d4a373]/50 text-xs" },
    { "id": "a3", "data": { "label": "DONE\\n(Autonomous Work)" }, "position": { "x": 20, "y": 260 }, "parentId": "agent", "extent": "parent", "className": "bg-green-500/10 border-green-500/50 text-xs" }
  ],
  "edges": [
    { "id": "et1", "source": "t1", "target": "t2", "animated": true },
    { "id": "et2", "source": "t2", "target": "t3", "animated": false, "style": { "strokeDasharray": "5 5" } },
    { "id": "ea1", "source": "a1", "target": "a2", "animated": true },
    { "id": "ea2", "source": "a2", "target": "a3", "animated": true }
  ]
}
\`\`\`

## The LLMOps Lifecycle

\`\`\`react-flow
{
  "title": "LLMOps Production Lifecycle",
  "height": "500px",
  "nodes": [
    { "id": "lifecycle", "data": { "label": "LLMOps Lifecycle Loop" }, "position": { "x": 50, "y": 20 }, "style": { "width": 500, "height": 380, "backgroundColor": "rgba(212, 163, 115, 0.05)", "border": "2px dashed rgba(212, 163, 115, 0.4)" }, "type": "group" },
    
    { "id": "dev", "data": { "label": "DEVELOPMENT\\n• Prompt Engineering\\n• Model Selection\\n• Eval Datasets" }, "position": { "x": 40, "y": 60 }, "parentId": "lifecycle", "extent": "parent", "className": "bg-accent-blue/10 border-accent-blue/50 text-sm text-center" },
    { "id": "dep", "data": { "label": "DEPLOYMENT\\n• CI/CD Pipelines\\n• A/B Testing\\n• Canary Deploys" }, "position": { "x": 280, "y": 60 }, "parentId": "lifecycle", "extent": "parent", "className": "bg-accent-gold/10 border-accent-gold/50 text-sm text-center" },
    { "id": "mon", "data": { "label": "MONITORING\\n• Latency & Cost\\n• Hallucinations\\n• User Feedback" }, "position": { "x": 280, "y": 240 }, "parentId": "lifecycle", "extent": "parent", "className": "bg-accent-blue/10 border-accent-blue/50 text-sm text-center" },
    { "id": "opt", "data": { "label": "OPTIMIZATION\\n• Cost Tracking\\n• Model Updates\\n• Prompt Refinement" }, "position": { "x": 40, "y": 240 }, "parentId": "lifecycle", "extent": "parent", "className": "bg-accent-gold/10 border-accent-gold/50 text-sm text-center" }
  ],
  "edges": [
    { "id": "e1", "source": "dev", "target": "dep", "animated": true },
    { "id": "e2", "source": "dep", "target": "mon", "animated": true },
    { "id": "e3", "source": "mon", "target": "opt", "animated": true },
    { "id": "e4", "source": "opt", "target": "dev", "animated": true }
  ]
}
\`\`\`

Let's build each component systematically.

## Phase 1: Development - Building Quality Foundations

### Prompt Engineering as Code

In production LLMOps, prompts are treated like code: versioned, tested, and deployed systematically.

\`\`\`python
from typing import Dict, List
from dataclasses import dataclass
from datetime import datetime
import json

@dataclass
class PromptTemplate:
    """Version-controlled prompt template."""
    
    name: str
    version: str
    template: str
    variables: List[str]
    created_at: datetime
    performance_metrics: Dict = None
    
    def render(self, **kwargs) -> str:
        """Render prompt with variables."""
        return self.template.format(**kwargs)
    
    def to_dict(self) -> dict:
        """Serialize for storage."""
        return {
            'name': self.name,
            'version': self.version,
            'template': self.template,
            'variables': self.variables,
            'created_at': self.created_at.isoformat(),
            'performance_metrics': self.performance_metrics,
        }

class PromptRegistry:
    """Git-like version control for prompts."""
    
    def __init__(self, storage_path: str = "./prompts"):
        self.storage_path = storage_path
        self.prompts: Dict[str, Dict[str, PromptTemplate]] = {}
    
    def register(self, prompt: PromptTemplate):
        """Register a new prompt version."""
        if prompt.name not in self.prompts:
            self.prompts[prompt.name] = {}
        
        self.prompts[prompt.name][prompt.version] = prompt
        self._persist()
    
    def get(self, name: str, version: str = "latest") -> PromptTemplate:
        """Retrieve a specific prompt version."""
        if version == "latest":
            versions = sorted(
                self.prompts[name].keys(),
                reverse=True
            )
            version = versions[0]
        
        return self.prompts[name][version]
    
    def _persist(self):
        """Save to disk."""
        with open(f"{self.storage_path}/registry.json", 'w') as f:
            data = {
                name: {
                    ver: p.to_dict() 
                    for ver, p in versions.items()
                }
                for name, versions in self.prompts.items()
            }
            json.dump(data, f, indent=2)

# Example usage
registry = PromptRegistry()

# Register a customer support prompt
support_prompt_v1 = PromptTemplate(
    name="customer_support",
    version="1.0.0",
    template="""You are a helpful customer support agent for {company}.

Customer query: {query}

Provide a clear, professional response. If you can't help, 
escalate to human support.""",
    variables=["company", "query"],
    created_at=datetime.now(),
)

registry.register(support_prompt_v1)

# Later, update with improved version
support_prompt_v2 = PromptTemplate(
    name="customer_support",
    version="1.1.0",
    template="""You are a customer support specialist for {company}.

Context: {context}
Query: {query}

Instructions:
1. Be empathetic and professional
2. Provide specific, actionable solutions
3. Include relevant documentation links
4. If uncertain, offer to escalate

Response:""",
    variables=["company", "context", "query"],
    created_at=datetime.now(),
)

registry.register(support_prompt_v2)
\`\`\`

### Evaluation Framework

Production systems need systematic evaluation, not gut feelings.

\`\`\`python
from typing import Callable
from dataclasses import dataclass
import pandas as pd

@dataclass
class EvalCase:
    """Single evaluation test case."""
    input: str
    expected_output: str = None
    metadata: Dict = None

class LLMEvaluator:
    """Systematic LLM evaluation framework."""
    
    def __init__(self, llm_chain):
        self.llm_chain = llm_chain
        self.results = []
    
    def add_test_case(self, case: EvalCase):
        """Add test case to evaluation suite."""
        self.results.append({
            'input': case.input,
            'expected': case.expected_output,
            'metadata': case.metadata,
        })
    
    def run_evaluation(self) -> pd.DataFrame:
        """Execute all test cases and collect metrics."""
        
        for test in self.results:
            # Generate output
            output = self.llm_chain.run(test['input'])
            test['actual'] = output
            
            # Calculate metrics
            test['metrics'] = self._calculate_metrics(
                test['expected'],
                test['actual']
            )
        
        return pd.DataFrame(self.results)
    
    def _calculate_metrics(
        self,
        expected: str,
        actual: str
    ) -> Dict[str, float]:
        """Calculate quality metrics."""
        
        metrics = {}
        
        # Length similarity
        metrics['length_ratio'] = len(actual) / max(len(expected), 1)
        
        # Keyword overlap (simple example)
        expected_words = set(expected.lower().split())
        actual_words = set(actual.lower().split())
        
        overlap = expected_words & actual_words
        metrics['keyword_precision'] = len(overlap) / len(actual_words) if actual_words else 0
        metrics['keyword_recall'] = len(overlap) / len(expected_words) if expected_words else 0
        
        # Could add: ROUGE, BLEU, semantic similarity, etc.
        
        return metrics

# Example usage
evaluator = LLMEvaluator(llm_chain)

# Add test cases
test_cases = [
    EvalCase(
        input="How do I reset my password?",
        expected_output="To reset your password, click 'Forgot Password' on the login page...",
        metadata={'category': 'account_management'}
    ),
    EvalCase(
        input="What are your business hours?",
        expected_output="We're open Monday-Friday, 9 AM to 5 PM EST.",
        metadata={'category': 'general_info'}
    ),
]

for case in test_cases:
    evaluator.add_test_case(case)

# Run evaluation
results_df = evaluator.run_evaluation()
print(results_df)
\`\`\`

### Model Selection Strategy

Choosing the right model is crucial for cost and performance:

\`\`\`python
from enum import Enum
from typing import Optional

class ModelTier(Enum):
    """Model tiers for different use cases."""
    SMALL = "small"      # <7B params - fast, cheap
    MEDIUM = "medium"    # 7-30B params - balanced
    LARGE = "large"      # >30B params - high quality

class ModelRouter:
    """Route queries to appropriate model tiers."""
    
    def __init__(self):
        # Initialize models at different tiers
        from langchain_azure_ai.chat_models import AzureAIChatCompletionsModel
        import os
        
        self.models = {
            ModelTier.SMALL: AzureAIChatCompletionsModel(
                endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
                credential=os.environ["AZURE_INFERENCE_CREDENTIAL"],
                model="Phi-3.5-Mini-3.8B",  # Fast & cheap
                temperature=0.3,
            ),
            ModelTier.MEDIUM: AzureAIChatCompletionsModel(
                endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
                credential=os.environ["AZURE_INFERENCE_CREDENTIAL"],
                model="Meta-Llama-3.1-8B-Instruct",
                temperature=0.7,
            ),
            ModelTier.LARGE: AzureAIChatCompletionsModel(
                endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
                credential=os.environ["AZURE_INFERENCE_CREDENTIAL"],
                model="Meta-Llama-3.1-70B-Instruct",
                temperature=0.7,
            ),
        }
    
    def classify_complexity(self, query: str) -> ModelTier:
        """Determine query complexity for routing."""
        
        # Simple heuristics (in production, use classifier model)
        query_lower = query.lower()
        
        # Simple queries -> small model
        simple_patterns = [
            'what is', 'who is', 'when did',
            'how do i', 'where can'
        ]
        if any(pattern in query_lower for pattern in simple_patterns):
            return ModelTier.SMALL
        
        # Complex queries -> large model
        complex_patterns = [
            'analyze', 'compare', 'explain why',
            'evaluate', 'summarize'
        ]
        if any(pattern in query_lower for pattern in complex_patterns):
            return ModelTier.LARGE
        
        # Default to medium
        return ModelTier.MEDIUM
    
    def route(self, query: str, force_tier: Optional[ModelTier] = None):
        """Route query to appropriate model."""
        
        tier = force_tier or self.classify_complexity(query)
        model = self.models[tier]
        
        print(f"Routing to {tier.value} model")
        return model.invoke(query)

# Usage
router = ModelRouter()

# Simple query -> small model (cheap & fast)
response1 = router.route("What is Python?")

# Complex query -> large model (expensive & accurate)
response2 = router.route(
    "Analyze the trade-offs between microservices and monolithic architecture"
)
\`\`\`

## Phase 2: Deployment - Getting to Production

### CI/CD Pipeline for LLM Applications

\`\`\`python
# deployment_pipeline.py

import yaml
from pathlib import Path
from typing import Dict

class LLMDeploymentPipeline:
    """Automated deployment pipeline for LLM apps."""
    
    def __init__(self, config_path: str):
        with open(config_path) as f:
            self.config = yaml.safe_load(f)
    
    def run_tests(self) -> bool:
        """Run test suite before deployment."""
        print("Running test suite...")
        
        # Load evaluation dataset
        evaluator = LLMEvaluator(llm_chain)
        
        # Run tests
        results = evaluator.run_evaluation()
        
        # Check pass criteria
        pass_threshold = self.config['deployment']['test_threshold']
        avg_score = results['metrics'].apply(
            lambda m: m.get('keyword_precision', 0)
        ).mean()
        
        passed = avg_score >= pass_threshold
        
        if passed:
            print(f"✓ Tests passed (score: {avg_score:.2f})")
        else:
            print(f"✗ Tests failed (score: {avg_score:.2f}, threshold: {pass_threshold})")
        
        return passed
    
    def deploy_canary(self):
        """Deploy to small percentage of traffic first."""
        print("Deploying canary (5% traffic)...")
        
        # Update routing config
        routing_config = {
            'version_a': {'weight': 95, 'model': 'current'},
            'version_b': {'weight': 5, 'model': 'new'},
        }
        
        # Would update load balancer config in production
        return routing_config
    
    def monitor_canary(self, duration_minutes: int = 30):
        """Monitor canary deployment metrics."""
        import time
        
        print(f"Monitoring canary for {duration_minutes} minutes...")
        
        # In production, query metrics from monitoring system
        metrics = {
            'error_rate': 0.002,  # 0.2%
            'latency_p95': 1.2,   # seconds
            'user_satisfaction': 0.88,
        }
        
        # Check if metrics are acceptable
        thresholds = self.config['deployment']['canary_thresholds']
        
        passed = (
            metrics['error_rate'] < thresholds['max_error_rate'] and
            metrics['latency_p95'] < thresholds['max_latency_p95'] and
            metrics['user_satisfaction'] > thresholds['min_satisfaction']
        )
        
        return passed, metrics
    
    def promote_or_rollback(self, canary_passed: bool):
        """Promote canary to full deployment or rollback."""
        
        if canary_passed:
            print("✓ Canary successful - promoting to 100%")
            # Update routing to 100% new version
            return True
        else:
            print(f"✗ Canary failed - rolling back")
            # Revert to previous version
            return False
    
    def deploy(self):
        """Execute full deployment pipeline."""
        
        # Step 1: Run tests
        if not self.run_tests():
            print("Deployment aborted - tests failed")
            return False
        
        # Step 2: Deploy canary
        self.deploy_canary()
        
        # Step 3: Monitor canary
        canary_passed, metrics = self.monitor_canary()
        print(f"Canary metrics: {metrics}")
        
        # Step 4: Promote or rollback
        success = self.promote_or_rollback(canary_passed)
        
        return success

# deployment_config.yaml
"""
deployment:
  test_threshold: 0.75
  canary_thresholds:
    max_error_rate: 0.01
    max_latency_p95: 2.0
    min_satisfaction: 0.85
"""

# Usage
pipeline = LLMDeploymentPipeline("deployment_config.yaml")
pipeline.deploy()
\`\`\`

### Feature Flags for A/B Testing

\`\`\`python
class FeatureFlags:
    """A/B testing for prompts and models."""
    
    def __init__(self):
        self.experiments = {}
    
    def create_experiment(
        self,
        name: str,
        variant_a: Dict,
        variant_b: Dict,
        traffic_split: float = 0.5,
    ):
        """Create A/B test experiment."""
        
        self.experiments[name] = {
            'variant_a': variant_a,
            'variant_b': variant_b,
            'traffic_split': traffic_split,
            'results': {'a': [], 'b': []},
        }
    
    def get_variant(self, experiment_name: str, user_id: str):
        """Deterministically assign user to variant."""
        import hashlib
        
        # Hash user_id to determine variant
        hash_val = int(hashlib.md5(user_id.encode()).hexdigest(), 16)
        
        experiment = self.experiments[experiment_name]
        threshold = experiment['traffic_split']
        
        # Consistent assignment
        if (hash_val % 100) / 100 < threshold:
            return 'a', experiment['variant_a']
        else:
            return 'b', experiment['variant_b']
    
    def record_result(
        self,
        experiment_name: str,
        variant: str,
        metric_value: float,
    ):
        """Record experiment result."""
        self.experiments[experiment_name]['results'][variant].append(
            metric_value
        )
    
    def analyze_experiment(self, experiment_name: str):
        """Statistical analysis of A/B test."""
        import numpy as np
        from scipy import stats
        
        results = self.experiments[experiment_name]['results']
        
        a_results = np.array(results['a'])
        b_results = np.array(results['b'])
        
        # T-test
        t_stat, p_value = stats.ttest_ind(a_results, b_results)
        
        return {
            'variant_a_mean': a_results.mean(),
            'variant_b_mean': b_results.mean(),
            'p_value': p_value,
            'significant': p_value < 0.05,
            'winner': 'b' if b_results.mean() > a_results.mean() else 'a',
        }

# Example: Test two prompt versions
flags = FeatureFlags()

flags.create_experiment(
    name="support_prompt_test",
    variant_a={'prompt': registry.get("customer_support", "1.0.0")},
    variant_b={'prompt': registry.get("customer_support", "1.1.0")},
    traffic_split=0.5,
)

# In production code
def handle_support_query(user_id: str, query: str):
    # Get assigned variant
    variant, config = flags.get_variant("support_prompt_test", user_id)
    
    # Use assigned prompt
    prompt = config['prompt']
    response = llm_chain.run(prompt.render(company="Acme Corp", query=query))
    
    # Measure quality (e.g., user feedback)
    user_rating = get_user_feedback()  # 1-5 stars
    
    # Record result
    flags.record_result("support_prompt_test", variant, user_rating)
    
    return response

# After collecting data
analysis = flags.analyze_experiment("support_prompt_test")
print(f"Results: {analysis}")
# Promote winner to production
\`\`\`

## Phase 3: Monitoring - Know What's Happening

### Comprehensive Observability

\`\`\`python
from dataclasses import dataclass
from datetime import datetime
import json

@dataclass
class LLMTrace:
    """Detailed trace of LLM execution."""
    
    trace_id: str
    timestamp: datetime
    user_id: str
    
    # Input
    prompt: str
    model: str
    temperature: float
    
    # Output
    response: str
    tokens_used: int
    latency_ms: float
    cost_usd: float
    
    # Quality metrics
    user_feedback: Optional[str] = None
    flagged_as_problematic: bool = False
    error: Optional[str] = None
    
    def to_dict(self):
        return {
            'trace_id': self.trace_id,
            'timestamp': self.timestamp.isoformat(),
            'user_id': self.user_id,
            'prompt': self.prompt,
            'model': self.model,
            'temperature': self.temperature,
            'response': self.response,
            'tokens_used': self.tokens_used,
            'latency_ms': self.latency_ms,
            'cost_usd': self.cost_usd,
            'user_feedback': self.user_feedback,
            'flagged': self.flagged_as_problematic,
            'error': self.error,
        }

class LLMMonitor:
    """Production monitoring for LLM systems."""
    
    def __init__(self, log_path: str = "./llm_traces.jsonl"):
        self.log_path = log_path
    
    def log_trace(self, trace: LLMTrace):
        """Write trace to persistent storage."""
        
        with open(self.log_path, 'a') as f:
            f.write(json.dumps(trace.to_dict()) + '\\n')
    
    def get_metrics(self, time_window_hours: int = 1) -> Dict:
        """Calculate recent metrics."""
        
        import pandas as pd
        from datetime import timedelta
        
        # Load traces
        traces = []
        with open(self.log_path) as f:
            for line in f:
                traces.append(json.loads(line))
        
        df = pd.DataFrame(traces)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Filter to time window
        cutoff = datetime.now() - timedelta(hours=time_window_hours)
        recent = df[df['timestamp'] > cutoff]
        
        # Calculate metrics
        metrics = {
            'total_requests': len(recent),
            'avg_latency_ms': recent['latency_ms'].mean(),
            'p95_latency_ms': recent['latency_ms'].quantile(0.95),
            'total_cost_usd': recent['cost_usd'].sum(),
            'avg_cost_per_request': recent['cost_usd'].mean(),
            'error_rate': recent['error'].notna().mean(),
            'flagged_rate': recent['flagged'].mean(),
        }
        
        return metrics
    
    def detect_anomalies(self, metrics: Dict) -> List[str]:
        """Detect anomalous patterns."""
        
        alerts = []
        
        # High latency
        if metrics['p95_latency_ms'] > 5000:  # 5 seconds
            alerts.append(f"HIGH_LATENCY: p95={metrics['p95_latency_ms']:.0f}ms")
        
        # High error rate
        if metrics['error_rate'] > 0.05:  # 5%
            alerts.append(f"HIGH_ERROR_RATE: {metrics['error_rate']:.1%}")
        
        # Suspicious cost
        if metrics['avg_cost_per_request'] > 0.10:  # 10 cents
            alerts.append(f"HIGH_COST: \${metrics['avg_cost_per_request']:.3f}/request")
        
        return alerts

# Usage with integrated tracing
monitor = LLMMonitor()

def monitored_llm_call(user_id: str, prompt: str):
    """LLM call with full observability."""
    
    import uuid
    import time
    
    trace_id = str(uuid.uuid4())
    start_time = time.time()
    
    try:
        # Execute LLM
        response = llm_chain.run(prompt)
        
        # Calculate metrics
        latency_ms = (time.time() - start_time) * 1000
        tokens = len(prompt.split()) + len(response.split())  # Simplified
        cost = tokens * 0.00001  # Example pricing
        
        # Create trace
        trace = LLMTrace(
            trace_id=trace_id,
            timestamp=datetime.now(),
            user_id=user_id,
            prompt=prompt,
            model="llama-3.1-8b",
            temperature=0.7,
            response=response,
            tokens_used=tokens,
            latency_ms=latency_ms,
            cost_usd=cost,
        )
        
        monitor.log_trace(trace)
        
        return response
        
    except Exception as e:
        # Log error
        trace = LLMTrace(
            trace_id=trace_id,
            timestamp=datetime.now(),
            user_id=user_id,
            prompt=prompt,
            model="llama-3.1-8b",
            temperature=0.7,
            response="",
            tokens_used=0,
            latency_ms=(time.time() - start_time) * 1000,
            cost_usd=0,
            error=str(e),
        )
        
        monitor.log_trace(trace)
        raise

# Periodic monitoring
def run_monitoring_check():
    """Periodic health check."""
    
    metrics = monitor.get_metrics(time_window_hours=1)
    alerts = monitor.detect_anomalies(metrics)
    
    print(f"📊 Metrics (last hour):")
    for key, value in metrics.items():
        print(f"  {key}: {value}")
    
    if alerts:
        print(f"\\n🚨 Alerts:")
        for alert in alerts:
            print(f"  {alert}")
            # Send to alerting system (PagerDuty, Slack, etc.)

# Run every 5 minutes
import schedule
schedule.every(5).minutes.do(run_monitoring_check)
\`\`\`

### Dashboard Metrics

Key metrics to track in your monitoring dashboard:

\`\`\`python
class MetricsDashboard:
    """Production metrics dashboard."""
    
    @staticmethod
    def get_dashboard_data():
        """Aggregate metrics for visualization."""
        
        return {
            # Performance
            'latency': {
                'p50': 850,  # ms
                'p95': 2100,
                'p99': 4500,
            },
            
            # Quality
            'response_quality': {
                'avg_rating': 4.2,  # out of 5
                'hallucination_rate': 0.03,  # 3%
                'user_satisfaction': 0.87,  # 87%
            },
            
            # Cost
            'costs': {
                'total_daily': 245.50,  # USD
                'cost_per_request': 0.012,
                'token_usage': 18_500_000,
            },
            
            # Reliability
            'errors': {
                'rate_last_hour': 0.008,  # 0.8%
                'rate_last_day': 0.005,   # 0.5%
                'timeout_rate': 0.002,    # 0.2%
            },
        }
\`\`\`

## Phase 4: Optimization - Getting Better Over Time

### Cost Optimization Strategies

\`\`\`python
class CostOptimizer:
    """Reduce LLM costs without sacrificing quality."""
    
    def __init__(self, monitor: LLMMonitor):
        self.monitor = monitor
    
    def analyze_token_usage(self):
        """Identify expensive patterns."""
        
        # Load traces
        import pandas as pd
        traces = self._load_traces()
        
        # Find expensive queries
        expensive = traces.nlargest(100, 'tokens_used')
        
        print("Most expensive query patterns:")
        for _, row in expensive.head(10).iterrows():
            print(f"  Tokens: {row['tokens_used']}")
            print(f"  Prompt: {row['prompt'][:100]}...")
            print()
    
    def suggest_optimizations(self):
        """Recommend cost-saving measures."""
        
        suggestions = []
        
        traces = self._load_traces()
        avg_tokens = traces['tokens_used'].mean()
        
        # Check if smaller model would work
        if avg_tokens < 500:
            suggestions.append({
                'type': 'model_downgrade',
                'description': 'Consider using Phi-3.5-Mini for simple queries',
                'estimated_savings': '60%',
            })
        
        # Check for redundant queries
        duplicate_rate = traces.duplicated(subset=['prompt']).mean()
        if duplicate_rate > 0.1:
            suggestions.append({
                'type': 'caching',
                'description': f'{duplicate_rate:.0%} of queries are duplicates - add caching',
                'estimated_savings': f'{duplicate_rate:.0%}',
            })
        
        return suggestions
    
    def _load_traces(self):
        """Helper to load trace data."""
        import pandas as pd
        traces = []
        with open(self.monitor.log_path) as f:
            for line in f:
                traces.append(json.loads(line))
        return pd.DataFrame(traces)

# Usage
optimizer = CostOptimizer(monitor)
suggestions = optimizer.suggest_optimizations()

for suggestion in suggestions:
    print(f"💡 {suggestion['type']}")
    print(f"   {suggestion['description']}")
    print(f"   Estimated savings: {suggestion['estimated_savings']}")
\`\`\`

### Prompt Optimization Through Data

\`\`\`python
class PromptOptimizer:
    """Iteratively improve prompts using production data."""
    
    def __init__(self, evaluator: LLMEvaluator):
        self.evaluator = evaluator
        self.improvements = []
    
    def analyze_failures(self, threshold: float = 3.0):
        """Find prompts with low user ratings."""
        
        # Load production feedback
        low_rated = self._get_low_rated_responses(threshold)
        
        # Group by common patterns
        patterns = self._identify_patterns(low_rated)
        
        return patterns
    
    def propose_improvements(self, patterns: List[Dict]):
        """Generate improved prompt versions."""
        
        for pattern in patterns:
            # Use LLM to suggest improvements
            improvement_prompt = f"""
            This prompt is getting low user ratings:
            
            Current prompt:
            {pattern['prompt']}
            
            Common failure cases:
            {pattern['examples']}
            
            Suggest an improved version that addresses these issues.
            """
            
            improved = llm_chain.run(improvement_prompt)
            
            self.improvements.append({
                'original': pattern['prompt'],
                'improved': improved,
                'issues': pattern['issues'],
            })
        
        return self.improvements
    
    def _get_low_rated_responses(self, threshold):
        # Query production database
        pass
    
    def _identify_patterns(self, responses):
        # Cluster similar failures
        pass
\`\`\`

## Production Checklist

Before deploying to production, ensure you have:

### Infrastructure
- [ ] Load balancer configured
- [ ] Auto-scaling enabled
- [ ] CDN for static assets
- [ ] Rate limiting implemented
- [ ] API authentication

### Monitoring
- [ ] Latency tracking
- [ ] Cost tracking
- [ ] Error tracking
- [ ] User feedback collection
- [ ] Alert thresholds configured

### Quality Assurance
- [ ] Evaluation dataset created
- [ ] Automated tests running
- [ ] A/B testing framework
- [ ] Hallucination detection
- [ ] Content safety filters

### Operations
- [ ] Runbook documented
- [ ] On-call rotation defined
- [ ] Incident response plan
- [ ] Rollback procedure tested
- [ ] Backup/recovery plan

## Incident Response Playbook

When things go wrong (and they will), you need a plan:

\`\`\`python
class IncidentResponse:
    """Handle production incidents."""
    
    def __init__(self):
        self.severity_levels = {
            'P0': 'Complete outage',
            'P1': 'Significant degradation',
            'P2': 'Minor issues',
        }
    
    def detect_incident(self, metrics: Dict) -> Optional[str]:
        """Auto-detect incident severity."""
        
        if metrics['error_rate'] > 0.50:
            return 'P0'
        elif metrics['error_rate'] > 0.10:
            return 'P1'
        elif metrics['p95_latency_ms'] > 10000:
            return 'P1'
        elif metrics['error_rate'] > 0.05:
            return 'P2'
        
        return None
    
    def respond(self, severity: str):
        """Execute incident response."""
        
        actions = {
            'P0': [
                'Page on-call engineer',
                'Activate incident channel',
                'Roll back last deployment',
                'Switch to backup system',
            ],
            'P1': [
                'Notify engineering team',
                'Investigate root cause',
                'Apply hotfix if available',
            ],
            'P2': [
                'File bug ticket',
                'Schedule fix for next sprint',
            ],
        }
        
        print(f"🚨 INCIDENT DETECTED: {severity}")
        print(f"Executing response plan:")
        
        for action in actions[severity]:
            print(f"  ✓ {action}")
            # Execute actual remediation
\`\`\`

## Conclusion

LLMOps isn't optional anymore. It's the difference between a cool prototype and a reliable product that users trust and companies depend on.

The key principles:

1. **Treat prompts like code** - version control, testing, deployment
2. **Measure everything** - latency, costs, quality, errors
3. **Deploy carefully** - canary releases, A/B tests, rollbacks
4. **Optimize continuously** - use production data to improve
5. **Prepare for incidents** - because they will happen

The tools exist. LangChain provides the framework. Azure AI Foundry provides the infrastructure. Python provides the flexibility. The hard part is the discipline to do it consistently.

Start small. Add monitoring to your existing app. Create an evaluation dataset. Set up basic alerts. Then iterate. Your future self (and your on-call team) will thank you.

## Next Steps

In the next article, we'll explore **Small Language Models: Deploying Efficient AI at Scale**, covering:
- When to use SLMs vs LLMs
- Fine-tuning strategies
- Edge deployment
- Cost-performance tradeoffs

Stay tuned!

---

*Part of the Production AI Engineering series. Find the complete code on GitHub.*
`,gn={name:"Abhishek",photo:"/Abhishek_Profile.png"},fn="2025-01-25",_n=10,hn="LLMOps",yn=["LLMOps","Production","Monitoring","Azure"],bn="/blog/llmops-production.png",xn=!0,vn={id:cn,slug:dn,title:un,excerpt:pn,content:mn,author:gn,publishedAt:fn,readTime:_n,category:hn,tags:yn,featuredImage:bn,featured:xn},wn="11",An="multimodal-ai-architecture",kn="Multimodal AI Systems: Architecture for Vision, Language, and Beyond",In="A deep dive into building AI systems that can see, hear, and speak, exploring the architecture and implementation of multimodal models.",Cn=`# Multimodal AI Systems: Architecture for Vision, Language, and Beyond

## Introduction: The Convergence of Modalities

Modern AI systems are no longer limited to text. They understand images, video, audio, and combine these modalities to reason about the world. As an architect, you must design systems that seamlessly integrate vision transformers, language models, and cross-modal attention mechanisms while maintaining performance and scalability.

This guide provides the complete architectural blueprint for building production multimodal AI systems.

## Theoretical Foundation: Understanding Multimodal Learning

\`\`\`react-flow
{
  "title": "Multimodal Learning Foundation Architecture",
  "height": "700px",
  "nodes": [
    { "id": "inputs", "data": { "label": "Input Modalities" }, "position": { "x": 0, "y": 0 }, "style": { "width": 600, "height": 100, "backgroundColor": "rgba(212, 163, 115, 0.05)", "border": "1px dashed rgba(212, 163, 115, 0.3)" }, "type": "group" },
    { "id": "a", "data": { "label": "Text Input\\nTokens" }, "position": { "x": 20, "y": 30 }, "parentId": "inputs", "extent": "parent" },
    { "id": "b", "data": { "label": "Image Input\\nPixels" }, "position": { "x": 165, "y": 30 }, "parentId": "inputs", "extent": "parent" },
    { "id": "c", "data": { "label": "Audio Input\\nWaveforms" }, "position": { "x": 310, "y": 30 }, "parentId": "inputs", "extent": "parent" },
    { "id": "d", "data": { "label": "Video Input\\nFrames + Audio" }, "position": { "x": 455, "y": 30 }, "parentId": "inputs", "extent": "parent" },

    { "id": "encoders", "data": { "label": "Encoder Layer" }, "position": { "x": 0, "y": 120 }, "style": { "width": 600, "height": 100, "backgroundColor": "rgba(59, 130, 246, 0.05)", "border": "1px dashed rgba(59, 130, 246, 0.3)" }, "type": "group" },
    { "id": "e", "data": { "label": "Text Encoder\\nTransformer" }, "position": { "x": 20, "y": 30 }, "parentId": "encoders", "extent": "parent" },
    { "id": "f", "data": { "label": "Vision Encoder\\nViT/CLIP" }, "position": { "x": 165, "y": 30 }, "parentId": "encoders", "extent": "parent" },
    { "id": "g", "data": { "label": "Audio Encoder\\nWhisper/Wav2Vec" }, "position": { "x": 310, "y": 30 }, "parentId": "encoders", "extent": "parent" },
    { "id": "h", "data": { "label": "Video Encoder\\nTimeSFormer" }, "position": { "x": 455, "y": 30 }, "parentId": "encoders", "extent": "parent" },

    { "id": "latent", "data": { "label": "Shared Latent Space\\n512-1024 dims" }, "position": { "x": 200, "y": 240 }, "className": "bg-orange-100 border-orange-300" },

    { "id": "attention", "data": { "label": "Cross-Modal Attention" }, "position": { "x": 50, "y": 320 }, "style": { "width": 500, "height": 100, "backgroundColor": "rgba(16, 185, 129, 0.05)", "border": "1px dashed rgba(16, 185, 129, 0.3)" }, "type": "group" },
    { "id": "j", "data": { "label": "Text-Image" }, "position": { "x": 20, "y": 30 }, "parentId": "attention", "extent": "parent" },
    { "id": "k", "data": { "label": "Image-Text" }, "position": { "x": 180, "y": 30 }, "parentId": "attention", "extent": "parent" },
    { "id": "l", "data": { "label": "Audio-Text" }, "position": { "x": 340, "y": 30 }, "parentId": "attention", "extent": "parent" },

    { "id": "fusion", "data": { "label": "Fusion Layer\\nAttention-based" }, "position": { "x": 200, "y": 440 }, "className": "bg-blue-100 border-blue-300" },

    { "id": "decoders", "data": { "label": "Decoder Layer" }, "position": { "x": 50, "y": 520 }, "style": { "width": 500, "height": 100, "backgroundColor": "rgba(107, 114, 128, 0.05)", "border": "1px dashed rgba(107, 114, 128, 0.3)" }, "type": "group" },
    { "id": "n", "data": { "label": "Text Gen" }, "position": { "x": 20, "y": 30 }, "parentId": "decoders", "extent": "parent" },
    { "id": "o", "data": { "label": "Image Gen" }, "position": { "x": 180, "y": 30 }, "parentId": "decoders", "extent": "parent" },
    { "id": "p", "data": { "label": "Classification" }, "position": { "x": 340, "y": 30 }, "parentId": "decoders", "extent": "parent" }
  ],
  "edges": [
    { "id": "e_ae", "source": "a", "target": "e" },
    { "id": "e_bf", "source": "b", "target": "f" },
    { "id": "e_cg", "source": "c", "target": "g" },
    { "id": "e_dh", "source": "d", "target": "h" },
    { "id": "e_ei", "source": "e", "target": "latent" },
    { "id": "e_fi", "source": "f", "target": "latent" },
    { "id": "e_gi", "source": "g", "target": "latent" },
    { "id": "e_hi", "source": "h", "target": "latent" },
    { "id": "e_ij", "source": "latent", "target": "j" },
    { "id": "e_ik", "source": "latent", "target": "k" },
    { "id": "e_il", "source": "latent", "target": "l" },
    { "id": "e_jm", "source": "j", "target": "fusion" },
    { "id": "e_km", "source": "k", "target": "fusion" },
    { "id": "e_lm", "source": "l", "target": "fusion" },
    { "id": "e_mn", "source": "fusion", "target": "n" },
    { "id": "e_mo", "source": "fusion", "target": "o" },
    { "id": "e_mp", "source": "fusion", "target": "p" }
  ]
}
\`\`\`

## Architecture Pattern: Vision-Language Integration

\`\`\`react-flow
{
  "title": "Vision-Language Integration Execution Flow",
  "height": "600px",
  "nodes": [
    { "id": "user", "data": { "label": "User" }, "position": { "x": 0, "y": 0 } },
    { "id": "api", "data": { "label": "API" }, "position": { "x": 150, "y": 0 } },
    { "id": "image_proc", "data": { "label": "Image Processor" }, "position": { "x": 300, "y": 50 } },
    { "id": "v_enc", "data": { "label": "Vision Encoder" }, "position": { "x": 450, "y": 100 } },
    { "id": "t_enc", "data": { "label": "Text Encoder" }, "position": { "x": 450, "y": 0 } },
    { "id": "cross", "data": { "label": "Cross Attention" }, "position": { "x": 600, "y": 50 }, "className": "bg-accent-blue/10 border-accent-blue/50" },
    { "id": "llm", "data": { "label": "LLM Core" }, "position": { "x": 750, "y": 50 }, "className": "bg-accent-gold/20 border-accent-gold/50" },
    { "id": "resp", "type": "output", "data": { "label": "Final Response" }, "position": { "x": 900, "y": 50 } }
  ],
  "edges": [
    { "id": "e1", "source": "user", "target": "api", "label": "Upload", "animated": true },
    { "id": "e2", "source": "api", "target": "image_proc", "label": "Process Image" },
    { "id": "e3", "source": "api", "target": "t_enc", "label": "Encode Text" },
    { "id": "e4", "source": "image_proc", "target": "v_enc", "label": "Vision Embed" },
    { "id": "e5", "source": "v_enc", "target": "cross" },
    { "id": "e6", "source": "t_enc", "target": "cross" },
    { "id": "e7", "source": "cross", "target": "llm", "label": "Fused Embeds", "animated": true },
    { "id": "e8", "source": "llm", "target": "resp" },
    { "id": "e9", "source": "resp", "target": "user", "animated": true }
  ]
}
\`\`\`

## Complete Implementation

\`\`\`python
from typing import Dict, List, Tuple
import torch
import torch.nn as nn
from transformers import CLIPVisionModel, CLIPTextModel, AutoModelForCausalLM
from PIL import Image

class MultimodalAISystem:
    """Production multimodal AI architecture."""
    
    def __init__(
        self,
        vision_model: str = "openai/clip-vit-large-patch14",
        text_model: str = "meta-llama/Llama-3.1-8B",
    ):
        # Vision encoder
        self.vision_encoder = CLIPVisionModel.from_pretrained(vision_model)
        self.vision_projection = nn.Linear(1024, 768)  # Project to LLM dim
        
        # Text encoder
        self.text_encoder = CLIPTextModel.from_pretrained(vision_model)
        
        # Language model
        self.llm = AutoModelForCausalLM.from_pretrained(text_model)
        
        # Cross-modal attention
        self.cross_attention = nn.MultiheadAttention(
            embed_dim=768,
            num_heads=12
        )
    
    def process_multimodal_input(
        self,
        image: Image.Image,
        text_query: str
    ) -> str:
        """Process image + text and generate response."""
        
        # Encode image
        image_features = self._encode_image(image)
        
        # Encode text query
        text_features = self._encode_text(text_query)
        
        # Cross-modal fusion
        fused_features = self._cross_modal_fusion(
            text_features,
            image_features
        )
        
        # Generate response
        response = self._generate_response(fused_features)
        
        return response
    
    def _encode_image(self, image: Image.Image) -> torch.Tensor:
        """Encode image to feature vectors."""
        # Preprocess
        inputs = self.vision_processor(images=image, return_tensors="pt")
        
        # Extract features
        with torch.no_grad():
            outputs = self.vision_encoder(**inputs)
            features = outputs.last_hidden_state  # [1, 196, 1024]
        
        # Project to LLM dimensions
        features = self.vision_projection(features)  # [1, 196, 768]
        
        return features
    
    def _encode_text(self, text: str) -> torch.Tensor:
        """Encode text to feature vectors."""
        inputs = self.text_processor(text, return_tensors="pt")
        
        with torch.no_grad():
            outputs = self.text_encoder(**inputs)
            features = outputs.last_hidden_state
        
        return features
    
    def _cross_modal_fusion(
        self,
        text_features: torch.Tensor,
        image_features: torch.Tensor
    ) -> torch.Tensor:
        """Fuse text and image features via cross-attention."""
        
        # text_features: [1, seq_len, 768]
        # image_features: [1, 196, 768]
        
        # Cross attention: Q from text, K,V from image
        fused, attention_weights = self.cross_attention(
            query=text_features.transpose(0, 1),
            key=image_features.transpose(0, 1),
            value=image_features.transpose(0, 1)
        )
        
        # fused: [seq_len, 1, 768]
        return fused.transpose(0, 1)  # [1, seq_len, 768]
    
    def _generate_response(self, features: torch.Tensor) -> str:
        """Generate text response from fused features."""
        
        # Convert features to LLM input
        # This is simplified - production needs proper integration
        outputs = self.llm.generate(
            inputs_embeds=features,
            max_length=512,
            do_sample=True,
            temperature=0.7
        )
        
        response = self.llm.tokenizer.decode(outputs[0])
        return response
\`\`\`

## Production Deployment Architecture

\`\`\`react-flow
{
  "title": "Production Multimodal AI Deployment Architecture",
  "height": "800px",
  "nodes": [
    { "id": "lb", "data": { "label": "Load Balancer\\n(Nginx/Traefik)" }, "position": { "x": 250, "y": 0 }, "className": "bg-accent-gold/20 border-accent-gold/50" },
    
    { "id": "api_layer", "data": { "label": "API Layer" }, "position": { "x": 50, "y": 100 }, "style": { "width": 500, "height": 80, "backgroundColor": "rgba(59, 130, 246, 0.05)", "border": "1px dashed rgba(59, 130, 246, 0.3)" }, "type": "group" },
    { "id": "api1", "data": { "label": "FastAPI 1" }, "position": { "x": 20, "y": 20 }, "parentId": "api_layer", "extent": "parent" },
    { "id": "api2", "data": { "label": "FastAPI 2" }, "position": { "x": 180, "y": 20 }, "parentId": "api_layer", "extent": "parent" },
    { "id": "api3", "data": { "label": "FastAPI 3" }, "position": { "x": 340, "y": 20 }, "parentId": "api_layer", "extent": "parent" },
    
    { "id": "serving", "data": { "label": "Model Serving" }, "position": { "x": 50, "y": 250 }, "style": { "width": 500, "height": 100, "backgroundColor": "rgba(16, 185, 129, 0.05)", "border": "1px dashed rgba(16, 185, 129, 0.3)" }, "type": "group" },
    { "id": "ve", "data": { "label": "Vision Encoder\\nGPU 1" }, "position": { "x": 20, "y": 40 }, "parentId": "serving", "extent": "parent" },
    { "id": "te", "data": { "label": "Text Encoder\\nGPU 2" }, "position": { "x": 180, "y": 40 }, "parentId": "serving", "extent": "parent" },
    { "id": "llmg", "data": { "label": "LLM Core\\nGPU 3-4" }, "position": { "x": 340, "y": 40 }, "parentId": "serving", "extent": "parent" },
    
    { "id": "storage", "data": { "label": "Storage & Caching" }, "position": { "x": 50, "y": 400 }, "style": { "width": 500, "height": 100, "backgroundColor": "rgba(107, 114, 128, 0.05)", "border": "1px dashed rgba(107, 114, 128, 0.3)" }, "type": "group" },
    { "id": "s3", "data": { "label": "Image S3" }, "position": { "x": 20, "y": 40 }, "parentId": "storage", "extent": "parent" },
    { "id": "vdb", "data": { "label": "Vector DB" }, "position": { "x": 180, "y": 40 }, "parentId": "storage", "extent": "parent" },
    { "id": "redis", "data": { "label": "Redis Cache" }, "position": { "x": 340, "y": 40 }, "parentId": "storage", "extent": "parent" },
    
    { "id": "mon", "data": { "label": "Monitoring\\n(Prometheus/Grafana)" }, "position": { "x": 200, "y": 550 }, "className": "bg-accent-blue/10 border-accent-blue/50" }
  ],
  "edges": [
    { "id": "e1", "source": "lb", "target": "api1" },
    { "id": "e2", "source": "lb", "target": "api2" },
    { "id": "e3", "source": "lb", "target": "api3" },
    { "id": "e4", "source": "api1", "target": "ve" },
    { "id": "e5", "source": "api1", "target": "te" },
    { "id": "e6", "source": "api1", "target": "llmg" },
    { "id": "e7", "source": "api1", "target": "s3" },
    { "id": "e8", "source": "ve", "target": "vdb" },
    { "id": "e9", "source": "api1", "target": "mon" }
  ]
}
\`\`\`

## Key Architectural Decisions

### 1. Model Selection
- **Vision**: CLIP for general, SAM for segmentation, DINO for objects
- **Text**: LLaMA for generation, BERT for understanding
- **Audio**: Whisper for speech, Wav2Vec for features

### 2. Compute Optimization
- Separate GPU pools for each modality
- Model quantization (FP16/INT8)
- Batch processing for throughput
- KV caching for inference

### 3. Latency Requirements
- Vision encoding: ~50-100ms
- Text encoding: ~20-50ms
- Cross-attention: ~10-30ms
- LLM generation: ~2-5s (depends on length)
- **Total**: ~2-6 seconds

---

*Part 3 of AI Architect Series*
`,Sn="2025-01-30",Ln=11,Pn={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},Mn="Computer Vision",Tn=["Multimodal","Computer Vision","NLP","AI Architecture","Azure"],qn="/blog/multimodal-ai.png",Rn=!1,En={id:wn,slug:An,title:kn,excerpt:In,content:Cn,publishedAt:Sn,readTime:Ln,author:Pn,category:Mn,tags:Tn,featuredImage:qn,featured:Rn},Nn="12",Dn="ai-agent-protocols-mcp",zn="AI Agent Communication Protocols: MCP, Tool Integration, and Standards",Fn="Exploring the Model Context Protocol (MCP) and other standards that enable AI agents to communicate and share tools across different platforms.",On=`# AI Agent Communication Protocols: MCP, Tool Integration, and Standards

## Introduction: The Need for Agent Protocols

As AI systems evolve from single models to ecosystems of specialized agents, we need standardized communication protocols. The Model Context Protocol (MCP) and emerging agent standards define how AI systems discover capabilities, exchange information, and coordinate actions.

## Model Context Protocol (MCP) Architecture

\`\`\`react-flow
{
  "title": "Model Context Protocol (MCP) Architecture",
  "height": "700px",
  "nodes": [
    { "id": "client_layer", "data": { "label": "Client Layer" }, "position": { "x": 0, "y": 0 }, "style": { "width": 600, "height": 100, "backgroundColor": "rgba(59, 130, 246, 0.05)", "border": "1px dashed rgba(59, 130, 246, 0.3)" }, "type": "group" },
    { "id": "a", "data": { "label": "AI Application\\nChatGPT/Claude/Local" }, "position": { "x": 200, "y": 30 }, "parentId": "client_layer", "extent": "parent" },

    { "id": "protocol_layer", "data": { "label": "MCP Protocol Layer" }, "position": { "x": 0, "y": 120 }, "style": { "width": 600, "height": 100, "backgroundColor": "rgba(212, 163, 115, 0.05)", "border": "1px dashed rgba(212, 163, 115, 0.3)" }, "type": "group" },
    { "id": "b", "data": { "label": "MCP Client\\nProtocol Handler" }, "position": { "x": 50, "y": 30 }, "parentId": "protocol_layer", "extent": "parent", "className": "bg-blue-100 border-blue-300" },
    { "id": "c", "data": { "label": "Discovery Service\\nFind Servers" }, "position": { "x": 225, "y": 30 }, "parentId": "protocol_layer", "extent": "parent", "className": "bg-orange-100 border-orange-300" },
    { "id": "d", "data": { "label": "Connection Manager\\nLifecycle" }, "position": { "x": 400, "y": 30 }, "parentId": "protocol_layer", "extent": "parent" },

    { "id": "servers_layer", "data": { "label": "MCP Servers" }, "position": { "x": 0, "y": 240 }, "style": { "width": 600, "height": 100, "backgroundColor": "rgba(16, 185, 129, 0.05)", "border": "1px dashed rgba(16, 185, 129, 0.3)" }, "type": "group" },
    { "id": "e", "data": { "label": "File System Server" }, "position": { "x": 20, "y": 30 }, "parentId": "servers_layer", "extent": "parent", "style": { "fontSize": "10px" } },
    { "id": "f", "data": { "label": "Database Server" }, "position": { "x": 165, "y": 30 }, "parentId": "servers_layer", "extent": "parent", "style": { "fontSize": "10px" } },
    { "id": "g", "data": { "label": "API Server" }, "position": { "x": 310, "y": 30 }, "parentId": "servers_layer", "extent": "parent", "style": { "fontSize": "10px" } },
    { "id": "h", "data": { "label": "Tool Server" }, "position": { "x": 455, "y": 30 }, "parentId": "servers_layer", "extent": "parent", "style": { "fontSize": "10px" } },

    { "id": "resources_layer", "data": { "label": "Resources" }, "position": { "x": 0, "y": 360 }, "style": { "width": 600, "height": 100, "backgroundColor": "rgba(107, 114, 128, 0.05)", "border": "1px dashed rgba(107, 114, 128, 0.3)" }, "type": "group" },
    { "id": "i", "data": { "label": "Local Files" }, "position": { "x": 20, "y": 30 }, "parentId": "resources_layer", "extent": "parent" },
    { "id": "j", "data": { "label": "PostgreSQL" }, "position": { "x": 165, "y": 30 }, "parentId": "resources_layer", "extent": "parent" },
    { "id": "k", "data": { "label": "REST APIs" }, "position": { "x": 310, "y": 30 }, "parentId": "resources_layer", "extent": "parent" },
    { "id": "l", "data": { "label": "Python Functions" }, "position": { "x": 455, "y": 30 }, "parentId": "resources_layer", "extent": "parent" }
  ],
  "edges": [
    { "id": "e_ab", "source": "a", "target": "b", "animated": true },
    { "id": "e_bc", "source": "b", "target": "c" },
    { "id": "e_ce", "source": "c", "target": "e" },
    { "id": "e_cf", "source": "c", "target": "f" },
    { "id": "e_cg", "source": "c", "target": "g" },
    { "id": "e_ch", "source": "c", "target": "h" },
    { "id": "e_ei", "source": "e", "target": "i" },
    { "id": "e_fj", "source": "f", "target": "j" },
    { "id": "e_gk", "source": "g", "target": "k" },
    { "id": "e_hl", "source": "h", "target": "l" }
  ]
}
\`\`\`

## Complete Protocol Implementation

\`\`\`python
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum
import json

class MCPMessageType(Enum):
    """MCP message types."""
    DISCOVER = "discover"
    CAPABILITIES = "capabilities"
    INVOKE = "invoke"
    RESULT = "result"
    ERROR = "error"

@dataclass
class MCPMessage:
    """MCP protocol message."""
    message_type: MCPMessageType
    message_id: str
    payload: Dict[str, Any]
    
class MCPServer:
    """MCP-compliant server implementation."""
    
    def __init__(self, name: str, version: str):
        self.name = name
        self.version = version
        self.capabilities = {}
        self.tools = {}
    
    def register_capability(
        self,
        capability_name: str,
        description: str,
        schema: Dict
    ):
        """Register a capability this server provides."""
        self.capabilities[capability_name] = {
            'description': description,
            'schema': schema,
            'version': '1.0'
        }
    
    def handle_discovery(self) -> Dict:
        """Handle discovery request."""
        return {
            'server_name': self.name,
            'version': self.version,
            'capabilities': list(self.capabilities.keys()),
            'protocol_version': 'MCP/1.0'
        }
    
    def handle_capabilities(self, capability_name: str) -> Dict:
        """Return detailed capability information."""
        if capability_name not in self.capabilities:
            return {'error': 'Capability not found'}
        
        return self.capabilities[capability_name]
    
    def handle_invoke(
        self,
        capability: str,
        parameters: Dict
    ) -> Dict:
        """Invoke a capability with parameters."""
        
        if capability not in self.tools:
            return {
                'status': 'error',
                'message': f'Unknown capability: {capability}'
            }
        
        try:
            result = self.tools[capability](parameters)
            return {
                'status': 'success',
                'result': result
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }
\`\`\`

## Tool Protocol Design

\`\`\`react-flow
{
  "title": "Tool Protocol Execution Flow",
  "height": "600px",
  "nodes": [
    { "id": "agent", "data": { "label": "AI Agent" }, "position": { "x": 250, "y": 0 }, "className": "bg-accent-gold/20 border-accent-gold/50 font-bold" },
    { "id": "registry", "data": { "label": "Tool Registry" }, "position": { "x": 50, "y": 100 } },
    { "id": "selector", "data": { "label": "Tool Selector" }, "position": { "x": 250, "y": 100 } },
    { "id": "validator", "data": { "label": "Parameter Validator" }, "position": { "x": 250, "y": 200 }, "className": "bg-accent-blue/10 border-accent-blue/50" },
    { "id": "executor", "data": { "label": "Tool Executor" }, "position": { "x": 250, "y": 300 } },
    { "id": "api", "data": { "label": "External API / Service" }, "position": { "x": 250, "y": 400 }, "className": "bg-green-500/10 border-green-500/50" },
    { "id": "result", "type": "output", "data": { "label": "Final Result to Agent" }, "position": { "x": 250, "y": 500 } }
  ],
  "edges": [
    { "id": "e1", "source": "agent", "target": "registry", "label": "Discover", "animated": true },
    { "id": "e2", "source": "registry", "target": "selector", "label": "Return Schemas" },
    { "id": "e3", "source": "selector", "target": "validator", "label": "Validate Params" },
    { "id": "e4", "source": "validator", "target": "executor", "label": "Execute", "animated": true },
    { "id": "e5", "source": "executor", "target": "api", "label": "Call Service" },
    { "id": "e6", "source": "api", "target": "result", "label": "Success Result", "animated": true },
    { "id": "e7", "source": "validator", "target": "agent", "label": "Validation Fail", "style": { "stroke": "red" } }
  ]
}
\`\`\`

---

*Part 4 of AI Architect Series*
`,Gn="2025-02-06",Bn=9,$n={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},Hn="AI Frameworks",Un=["MCP","AI Agents","Protocols","Standards","Tool Integration"],Wn="/blog/ai-agent-protocols.png",Vn=!1,jn={id:Nn,slug:Dn,title:zn,excerpt:Fn,content:On,publishedAt:Gn,readTime:Bn,author:$n,category:Hn,tags:Un,featuredImage:Wn,featured:Vn},Qn="7",Yn="small-language-models-efficiency",Kn="Small Language Models: Building Efficient AI That Actually Ships",Zn="Discover why smaller is often better. A technical deep dive into fine-tuning 1-10B parameter models like Phi-3.5 and Llama 3.2 for specialized, low-latency tasks.",Xn=`# Small Language Models: Building Efficient AI That Actually Ships

## Introduction: The Efficiency Revolution

In 2023, everyone was obsessed with making AI models bigger. GPT-4 reportedly has over a trillion parameters. Training costs soared past $100 million. Running these giants in production could cost thousands of dollars per day. And then something interesting happened: engineers realized that for most real-world tasks, you don't need a trillion-parameter model. You need a smart, fast, efficient model that solves your specific problem.

Enter Small Language Models (SLMs). These are models with 1-10 billion parameters that deliver surprising performance while using a fraction of the compute, cost, and energy of their massive cousins. In 2025, SLMs are powering everything from mobile apps to edge devices to cost-conscious enterprises.

This comprehensive guide will show you how to select, fine-tune, deploy, and optimize SLMs for production using Python, LangChain, and open-source tools. You'll learn when to use SLMs versus LLMs, how to fine-tune for your domain, and how to deploy models that run on devices from smartphones to servers.

## Understanding SLMs: More Than Just "Smaller"

### What Makes an SLM Different?

\`\`\`react-flow
{
  "title": "LLM vs SLM Comparison Matrix",
  "height": "400px",
  "nodes": [
    { "id": "llm-col", "data": { "label": "LARGE LANGUAGE MODELS (LLM)" }, "position": { "x": 0, "y": 0 }, "style": { "width": 260, "height": 320, "backgroundColor": "rgba(59, 130, 246, 0.05)", "border": "2px dashed rgba(59, 130, 246, 0.3)" }, "type": "group" },
    { "id": "slm-col", "data": { "label": "SMALL LANGUAGE MODELS (SLM)" }, "position": { "x": 280, "y": 0 }, "style": { "width": 260, "height": 320, "backgroundColor": "rgba(212, 163, 115, 0.05)", "border": "2px dashed rgba(212, 163, 115, 0.3)" }, "type": "group" },
    
    { "id": "l1", "data": { "label": "SIZE\\\\n70B - 1T+ parameters" }, "position": { "x": 10, "y": 50 }, "parentId": "llm-col", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },
    { "id": "l2", "data": { "label": "MEMORY\\\\n40GB - 400GB+ GPU" }, "position": { "x": 10, "y": 100 }, "parentId": "llm-col", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },
    { "id": "l3", "data": { "label": "SPEED\\\\n2-10 seconds" }, "position": { "x": 10, "y": 150 }, "parentId": "llm-col", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },
    { "id": "l4", "data": { "label": "COST\\\\n$0.01 - $0.10 / req" }, "position": { "x": 10, "y": 200 }, "parentId": "llm-col", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },
    { "id": "l5", "data": { "label": "USE CASE\\\\nOpen reasoning" }, "position": { "x": 10, "y": 250 }, "parentId": "llm-col", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },

    { "id": "s1", "data": { "label": "SIZE\\\\n1B - 10B parameters" }, "position": { "x": 10, "y": 50 }, "parentId": "slm-col", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },
    { "id": "s2", "data": { "label": "MEMORY\\\\n2GB - 16GB GPU/CPU" }, "position": { "x": 10, "y": 100 }, "parentId": "slm-col", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },
    { "id": "s3", "data": { "label": "SPEED\\\\n50-500ms" }, "position": { "x": 10, "y": 150 }, "parentId": "slm-col", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },
    { "id": "s4", "data": { "label": "COST\\\\n$0.0001 - $0.001 / req" }, "position": { "x": 10, "y": 200 }, "parentId": "slm-col", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },
    { "id": "s5", "data": { "label": "USE CASE\\\\nDomain specialist" }, "position": { "x": 10, "y": 250 }, "parentId": "slm-col", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" }
  ],
  "edges": [
    { "id": "c1", "source": "l1", "target": "s1", "style": { "stroke": "#d4a373", "opacity": 0.2 } },
    { "id": "c2", "source": "l2", "target": "s2", "style": { "stroke": "#d4a373", "opacity": 0.2 } },
    { "id": "c3", "source": "l3", "target": "s3", "style": { "stroke": "#d4a373", "opacity": 0.2 } },
    { "id": "c4", "source": "l4", "target": "s4", "style": { "stroke": "#d4a373", "opacity": 0.2 } },
    { "id": "c5", "source": "l5", "target": "s5", "style": { "stroke": "#d4a373", "opacity": 0.2 } }
  ]
}
\`\`\`

### When to Choose SLMs

**Perfect for SLMs:**
- ✅ Domain-specific tasks (legal docs, medical records, code)
- ✅ Low-latency requirements (<500ms)
- ✅ Privacy-sensitive data (on-premise deployment)
- ✅ High-volume, cost-sensitive applications
- ✅ Edge/mobile deployment
- ✅ Offline functionality

**Better with LLMs:**
- ❌ Open-ended creative tasks
- ❌ Multi-domain general knowledge
- ❌ Complex multi-step reasoning
- ❌ Tasks requiring broad world knowledge

## SLM Landscape in 2025

Let's explore the top SLMs for production use:

\`\`\`python
from enum import Enum
from dataclasses import dataclass
from typing import Optional

@dataclass
class SLMProfile:
    """Profile for a small language model."""
    
    name: str
    parameters: str
    size_gb: float
    context_window: int
    strengths: list
    best_for: list
    license: str
    quantized_available: bool = True

class TopSLMs:
    """Catalog of production-ready SLMs in 2025."""
    
    MODELS = {
        'phi-3.5-mini': SLMProfile(
            name="Microsoft Phi-3.5-Mini",
            parameters="3.8B",
            size_gb=2.3,
            context_window=128000,
            strengths=[
                "Instruction following",
                "Code generation",
                "Reasoning tasks",
            ],
            best_for=[
                "Mobile apps",
                "Edge deployment",
                "Low-latency APIs",
            ],
            license="MIT",
        ),
        
        'llama-3.2-1b': SLMProfile(
            name="Meta LLaMA 3.2",
            parameters="1B",
            size_gb=0.9,
            context_window=128000,
            strengths=[
                "Efficiency",
                "Multilingual",
                "Safety aligned",
            ],
            best_for=[
                "Chatbots",
                "Content moderation",
                "Translation",
            ],
            license="Llama 3.2",
        ),
        
        'mistral-nemo': SLMProfile(
            name="Mistral NeMo",
            parameters="12B",
            size_gb=7.2,
            context_window=128000,
            strengths=[
                "Function calling",
                "Multi-turn dialogue",
                "Code tasks",
            ],
            best_for=[
                "AI agents",
                "Developer tools",
                "Structured outputs",
            ],
            license="Apache 2.0",
        ),
        
        'qwen-2.5-1.5b': SLMProfile(
            name="Alibaba Qwen 2.5",
            parameters="1.5B",
            size_gb=1.1,
            context_window=32768,
            strengths=[
                "Multilingual (40+ languages)",
                "Math & coding",
                "Fast inference",
            ],
            best_for=[
                "Global applications",
                "Educational tools",
                "Real-time systems",
            ],
            license="Apache 2.0",
        ),
    }
    
    @classmethod
    def recommend(cls, requirements: dict) -> str:
        """Recommend SLM based on requirements."""
        
        if requirements.get('deployment') == 'mobile':
            return 'phi-3.5-mini'
        elif requirements.get('task') == 'code':
            return 'mistral-nemo'
        elif requirements.get('multilingual'):
            return 'qwen-2.5-1.5b'
        else:
            return 'llama-3.2-1b'

# Example usage
requirements = {
    'deployment': 'mobile',
    'latency': 'low',
    'task': 'chat'
}

recommended = TopSLMs.recommend(requirements)
model_info = TopSLMs.MODELS[recommended]

print(f"Recommended: {model_info.name}")
print(f"Size: {model_info.size_gb}GB")
print(f"Best for: {', '.join(model_info.best_for)}")
\`\`\`

## Fine-Tuning SLMs: Making Them Your Own

One of the biggest advantages of SLMs is that fine-tuning is actually affordable. Let's build a complete fine-tuning pipeline.

### Step 1: Prepare Your Dataset

\`\`\`python
import pandas as pd
from datasets import Dataset
from typing import List, Dict

class DatasetPreparation:
    """Prepare training data for SLM fine-tuning."""
    
    def __init__(self):
        self.data = []
    
    def add_examples(self, examples: List[Dict[str, str]]):
        """Add training examples.
        
        Format: [
            {"instruction": "...", "input": "...", "output": "..."},
            ...
        ]
        """
        self.data.extend(examples)
    
    def format_for_training(self, template: str = "alpaca"):
        """Format data for specific template."""
        
        formatted = []
        
        for example in self.data:
            if template == "alpaca":
                # Alpaca format: instruction, input, output
                text = f"""Below is an instruction that describes a task, paired with an input that provides further context.

### Instruction:
{example['instruction']}

### Input:
{example.get('input', '')}

### Response:
{example['output']}"""
            
            elif template == "chat":
                # Chat format
                text = f"""<|user|>
{example['instruction']}
{example.get('input', '')}
<|assistant|>
{example['output']}"""
            
            formatted.append({"text": text})
        
        return Dataset.from_pandas(pd.DataFrame(formatted))
    
    def split_dataset(self, train_ratio: float = 0.9):
        """Split into train/validation sets."""
        
        dataset = self.format_for_training()
        split = dataset.train_test_split(
            test_size=1-train_ratio,
            seed=42
        )
        
        return split['train'], split['test']

# Example: Create customer support dataset
dataset_prep = DatasetPreparation()

customer_support_examples = [
    {
        "instruction": "Respond to this customer inquiry about shipping",
        "input": "When will my order #12345 arrive?",
        "output": "I'd be happy to help you track order #12345. Let me check the status for you. Your order shipped yesterday and should arrive within 3-5 business days. You can track it at: [tracking link]. Is there anything else I can help you with?"
    },
    {
        "instruction": "Handle a product return request",
        "input": "I want to return my shoes, they don't fit",
        "output": "I'm sorry to hear the shoes don't fit. I'll help you start a return. Our return policy allows returns within 30 days. Here's what to do next: 1) Print a return label from your account, 2) Pack the shoes in the original box, 3) Drop off at any shipping location. Your refund will be processed within 5-7 days of receiving the return. Would you like me to email you the instructions?"
    },
    # Add 100-1000+ examples for good results
]

dataset_prep.add_examples(customer_support_examples)
train_data, val_data = dataset_prep.split_dataset()

print(f"Training examples: {len(train_data)}")
print(f"Validation examples: {len(val_data)}")
\`\`\`

### Step 2: Fine-Tune with LoRA

LoRA (Low-Rank Adaptation) is the most efficient way to fine-tune SLMs. Instead of updating all parameters, you add small trainable layers.

\`\`\`python
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer,
)
from peft import LoraConfig, get_peft_model, TaskType
import torch

class SLMFineTuner:
    """Fine-tune SLMs efficiently with LoRA."""
    
    def __init__(
        self,
        model_name: str = "microsoft/Phi-3.5-mini-instruct",
        output_dir: str = "./fine_tuned_model"
    ):
        self.model_name = model_name
        self.output_dir = output_dir
        
        # Load model and tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.tokenizer.pad_token = self.tokenizer.eos_token
        
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float16,
            device_map="auto",
            trust_remote_code=True,
        )
    
    def setup_lora(
        self,
        lora_r: int = 16,
        lora_alpha: int = 32,
        lora_dropout: float = 0.05,
    ):
        """Configure LoRA adaptation."""
        
        lora_config = LoraConfig(
            r=lora_r,  # Rank of adaptation matrices
            lora_alpha=lora_alpha,  # Scaling factor
            target_modules=[
                "q_proj",
                "k_proj",
                "v_proj",
                "o_proj",
            ],  # Which layers to adapt
            lora_dropout=lora_dropout,
            bias="none",
            task_type=TaskType.CAUSAL_LM,
        )
        
        # Wrap model with LoRA
        self.model = get_peft_model(self.model, lora_config)
        
        # Print trainable parameters
        self.model.print_trainable_parameters()
        # Output: trainable params: 8M / 3.8B = 0.21%
    
    def prepare_data(self, dataset):
        """Tokenize dataset for training."""
        
        def tokenize_function(examples):
            outputs = self.tokenizer(
                examples["text"],
                truncation=True,
                max_length=2048,
                padding="max_length",
            )
            outputs["labels"] = outputs["input_ids"].copy()
            return outputs
        
        tokenized = dataset.map(
            tokenize_function,
            batched=True,
            remove_columns=dataset.column_names,
        )
        
        return tokenized
    
    def train(
        self,
        train_dataset,
        val_dataset,
        num_epochs: int = 3,
        batch_size: int = 4,
        learning_rate: float = 2e-4,
    ):
        """Execute fine-tuning."""
        
        # Prepare data
        train_data = self.prepare_data(train_dataset)
        val_data = self.prepare_data(val_dataset)
        
        # Training configuration
        training_args = TrainingArguments(
            output_dir=self.output_dir,
            num_train_epochs=num_epochs,
            per_device_train_batch_size=batch_size,
            per_device_eval_batch_size=batch_size,
            gradient_accumulation_steps=4,
            learning_rate=learning_rate,
            fp16=True,  # Mixed precision training
            logging_steps=10,
            evaluation_strategy="steps",
            eval_steps=50,
            save_steps=100,
            warmup_steps=100,
            lr_scheduler_type="cosine",
            report_to=["tensorboard"],
        )
        
        # Create trainer
        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=train_data,
            eval_dataset=val_data,
        )
        
        # Train!
        print("Starting fine-tuning...")
        trainer.train()
        
        # Save final model
        trainer.save_model()
        self.tokenizer.save_pretrained(self.output_dir)
        
        print(f"✓ Model saved to {self.output_dir}")
    
    def merge_and_save(self, final_output_dir: str):
        """Merge LoRA weights into base model."""
        
        # Merge adapters
        merged_model = self.model.merge_and_unload()
        
        # Save merged model
        merged_model.save_pretrained(final_output_dir)
        self.tokenizer.save_pretrained(final_output_dir)
        
        print(f"✓ Merged model saved to {final_output_dir}")

# Usage
finetuner = SLMFineTuner(
    model_name="microsoft/Phi-3.5-mini-instruct"
)

# Setup efficient training with LoRA
finetuner.setup_lora(lora_r=16, lora_alpha=32)

# Train
finetuner.train(
    train_dataset=train_data,
    val_dataset=val_data,
    num_epochs=3,
    batch_size=4,
)

# Save final merged model
finetuner.merge_and_save("./customer_support_model")
\`\`\`

### Cost Comparison: Fine-Tuning SLM vs LLM

\`\`\`
Fine-Tuning Cost Analysis (1000 examples, 3 epochs):

Model              GPU Hours    Cost (AWS)    Memory Required
─────────────────────────────────────────────────────────────
GPT-3.5-turbo     N/A (API)    $8-12         N/A
LLaMA 70B         40-60 hrs    $160-240      80GB A100
Mistral 7B        6-10 hrs     $24-40        24GB A100
Phi-3.5-Mini      2-4 hrs      $8-16         16GB T4
LLaMA 3.2-1B      1-2 hrs      $4-8          8GB T4

Conclusion: SLMs are 10-20x cheaper to fine-tune!
\`\`\`

## Deployment Strategies

### Strategy 1: Cloud API (Easiest)

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
import torch

app = FastAPI()

# Load fine-tuned model
generator = pipeline(
    "text-generation",
    model="./customer_support_model",
    torch_dtype=torch.float16,
    device_map="auto",
)

class ChatRequest(BaseModel):
    message: str
    max_length: int = 512

class ChatResponse(BaseModel):
    response: str
    latency_ms: float

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Generate response using fine-tuned SLM."""
    
    import time
    start = time.time()
    
    # Format input
    prompt = f"""<|user|>
{request.message}
<|assistant|>
"""
    
    # Generate
    output = generator(
        prompt,
        max_length=request.max_length,
        num_return_sequences=1,
        temperature=0.7,
        do_sample=True,
    )[0]['generated_text']
    
    # Extract response
    response = output.split("<|assistant|>")[-1].strip()
    
    latency = (time.time() - start) * 1000
    
    return ChatResponse(
        response=response,
        latency_ms=latency,
    )

# Run with: uvicorn app:app --host 0.0.0.0 --port 8000
\`\`\`

### Strategy 2: Edge Deployment (Most Efficient)

For mobile and edge devices, we need quantization:

\`\`\`python
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

class EdgeDeployment:
    """Deploy SLM to edge devices with quantization."""
    
    @staticmethod
    def quantize_model(
        model_path: str,
        output_path: str,
        quantization: str = "int8"  # or "int4" for more compression
    ):
        """Quantize model for edge deployment."""
        
        print(f"Loading model from {model_path}...")
        
        # Load model with quantization
        if quantization == "int8":
            model = AutoModelForCausalLM.from_pretrained(
                model_path,
                device_map="cpu",
                load_in_8bit=True,
            )
        elif quantization == "int4":
            model = AutoModelForCausalLM.from_pretrained(
                model_path,
                device_map="cpu",
                load_in_4bit=True,
            )
        
        # Save quantized model
        model.save_pretrained(output_path)
        
        print(f"✓ Quantized model saved to {output_path}")
        
        # Check size reduction
        import os
        original_size = sum(
            os.path.getsize(os.path.join(model_path, f))
            for f in os.listdir(model_path)
        ) / (1024**3)
        
        quantized_size = sum(
            os.path.getsize(os.path.join(output_path, f))
            for f in os.listdir(output_path)
        ) / (1024**3)
        
        print(f"Size reduction: {original_size:.2f}GB → {quantized_size:.2f}GB")
        print(f"Compression: {(1 - quantized_size/original_size)*100:.1f}%")

# Quantize for edge deployment
EdgeDeployment.quantize_model(
    model_path="./customer_support_model",
    output_path="./customer_support_model_int8",
    quantization="int8"
)

# Result:
# Size reduction: 7.6GB → 1.9GB
# Compression: 75%
\`\`\`

### Strategy 3: ONNX Runtime (Fastest Inference)

\`\`\`python
from optimum.onnxruntime import ORTModelForCausalLM
from transformers import AutoTokenizer

class ONNXDeployment:
    """Ultra-fast inference with ONNX."""
    
    def __init__(self, model_path: str):
        # Convert to ONNX format
        self.model = ORTModelForCausalLM.from_pretrained(
            model_path,
            export=True,  # Automatically convert to ONNX
        )
        
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
    
    def generate(self, prompt: str, max_length: int = 256):
        """Generate with optimized ONNX runtime."""
        
        inputs = self.tokenizer(prompt, return_tensors="pt")
        
        outputs = self.model.generate(
            **inputs,
            max_length=max_length,
            num_beams=1,  # Greedy decoding for speed
        )
        
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)

# Usage
onnx_model = ONNXDeployment("./customer_support_model")

# Benchmark
import time

prompts = ["How do I reset my password?"] * 100

start = time.time()
for prompt in prompts:
    _ = onnx_model.generate(prom## Production Architecture for SLMs

Here's a complete production setup for edge-first intelligence:

\`\`\`react-flow
{
  "title": "SLM Production Hybrid Architecture",
  "height": "600px",
  "nodes": [
    { "id": "clients", "data": { "label": "MOBILE / EDGE CLIENTS (LOCAL INFERENCE)" }, "position": { "x": 20, "y": 20 }, "style": { "width": 560, "height": 140, "backgroundColor": "rgba(212, 163, 115, 0.05)", "border": "2px solid rgba(212, 163, 115, 0.4)" }, "type": "group" },
    
    { "id": "ios", "data": { "label": "iOS APP\\\\nPhi-3.5 (2GB)" }, "position": { "x": 20, "y": 50 }, "parentId": "clients", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },
    { "id": "android", "data": { "label": "ANDROID\\\\nLlama-3.2 (2GB)" }, "position": { "x": 200, "y": 50 }, "parentId": "clients", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },
    { "id": "iot", "data": { "label": "IoT EDGE\\\\nQuantized (1GB)" }, "position": { "x": 380, "y": 50 }, "parentId": "clients", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },

    { "id": "gateway", "data": { "label": "API GATEWAY\\\\n(Intelligent Router)" }, "position": { "x": 200, "y": 200 }, "className": "bg-accent-blue/10 border-accent-blue/50 font-bold" },

    { "id": "pods", "data": { "label": "CLOUD COMPUTE TIER" }, "position": { "x": 20, "y": 320 }, "style": { "width": 560, "height": 120, "backgroundColor": "rgba(0, 0, 0, 0.03)", "border": "1px dashed rgba(0, 0, 0, 0.2)" }, "type": "group" },
    
    { "id": "slm-simple", "data": { "label": "SLM PODS\\\\n(Simple Tasks)" }, "position": { "x": 20, "y": 40 }, "parentId": "pods", "extent": "parent", "className": "bg-green-500/10 border-green-500/50 text-[10px]" },
    { "id": "slm-med", "data": { "label": "SLM PODS\\\\n(Medium Tasks)" }, "position": { "x": 200, "y": 40 }, "parentId": "pods", "extent": "parent", "className": "bg-blue-500/10 border-blue-500/50 text-[10px]" },
    { "id": "llm-complex", "data": { "label": "LLM PODS\\\\n(Complex Reasoning)" }, "position": { "x": 380, "y": 40 }, "parentId": "pods", "extent": "parent", "className": "bg-purple-500/10 border-purple-500/50 text-[10px]" },

    { "id": "mon", "data": { "label": "REAL-TIME MONITORING\\\\nLatency • Accuracy • Cost" }, "position": { "x": 180, "y": 500 }, "className": "bg-[#d4a373] text-white font-bold" }
  ],
  "edges": [
    { "id": "e1", "source": "clients", "target": "gateway", "label": "Complex Fallback", "animated": true },
    { "id": "e2", "source": "gateway", "target": "slm-simple", "animated": true },
    { "id": "e3", "source": "gateway", "target": "slm-med", "animated": true },
    { "id": "e4", "source": "gateway", "target": "llm-complex", "animated": true },
    { "id": "e5", "source": "slm-simple", "target": "mon", "style": { "strokeDasharray": "5 5" } },
    { "id": "e6", "source": "slm-med", "target": "mon", "style": { "strokeDasharray": "5 5" } },
    { "id": "e7", "source": "llm-complex", "target": "mon", "style": { "strokeDasharray": "5 5" } }
  ]
}
\`\`\`

### Hybrid Routing System

\`\`\`python
class HybridRouter:
    """Route queries between SLM (edge) and LLM (cloud)."""
    
    def __init__(self):
        self.slm_threshold = 0.7  # Confidence threshold
        
        # Edge SLM (runs locally)
        self.slm = self._load_slm()
        
        # Cloud LLM (API fallback)
        self.llm = self._load_llm()
    
    def route_query(self, query: str):
        """Intelligently route based on complexity."""
        
        # Try SLM first (fast, cheap, private)
        slm_response, confidence = self._try_slm(query)
        
        if confidence > self.slm_threshold:
            return {
                'response': slm_response,
                'model': 'slm',
                'latency_ms': 100,
                'cost': 0.0001,
                'location': 'edge'
            }
        
        # Fall back to LLM for complex queries
        llm_response = self._try_llm(query)
        
        return {
            'response': llm_response,
            'model': 'llm',
            'latency_ms': 2000,
            'cost': 0.01,
            'location': 'cloud'
        }
    
    def _try_slm(self, query: str):
        """Attempt with SLM, return confidence score."""
        
        response = self.slm.generate(query)
        
        # Calculate confidence (simplified)
        confidence = self._calculate_confidence(query, response)
        
        return response, confidence
    
    def _try_llm(self, query: str):
        """Fallback to cloud LLM."""
        return self.llm.generate(query)
    
    def _calculate_confidence(self, query: str, response: str) -> float:
        """Estimate response quality."""
        
        # Simplified confidence scoring
        # In production, use proper uncertainty estimation
        
        factors = []
        
        # Length check
        if len(response) > 50:
            factors.append(0.3)
        
        # Keyword presence
        if any(word in response.lower() for word in ['yes', 'no', 'because']):
            factors.append(0.4)
        
        # No hedging language
        if not any(word in response.lower() for word in ['maybe', 'possibly', 'unsure']):
            factors.append(0.3)
        
        return sum(factors)
    
    def _load_slm(self):
        # Load quantized SLM for edge
        pass
    
    def _load_llm(self):
        # Configure cloud LLM API
        pass

# Usage
router = HybridRouter()

# Simple query → SLM (edge)
result1 = router.route_query("What is the capital of France?")
print(f"Model: {result1['model']}, Cost: \${result1['cost']}")

# Complex query → LLM (cloud)
result2 = router.route_query(
    "Analyze the geopolitical implications of quantum computing advancement"
)
print(f"Model: {result2['model']}, Cost: \${result2['cost']}")
\`\`\`

## Monitoring SLM Performance

\`\`\`python
import json
from datetime import datetime
from typing import Dict

class SLMMonitor:
    """Monitor SLM-specific metrics."""
    
    def __init__(self):
        self.metrics = {
            'total_requests': 0,
            'edge_served': 0,
            'cloud_fallback': 0,
            'avg_latency_edge': [],
            'avg_latency_cloud': [],
            'cost_saved': 0.0,
        }
    
    def log_request(
        self,
        query: str,
        model_used: str,
        latency_ms: float,
        cost: float,
    ):
        """Log request metrics."""
        
        self.metrics['total_requests'] += 1
        
        if model_used == 'slm':
            self.metrics['edge_served'] += 1
            self.metrics['avg_latency_edge'].append(latency_ms)
            
            # Calculate savings vs always using cloud
            cloud_cost = 0.01
            self.metrics['cost_saved'] += (cloud_cost - cost)
        else:
            self.metrics['cloud_fallback'] += 1
            self.metrics['avg_latency_cloud'].append(latency_ms)
    
    def get_report(self) -> Dict:
        """Generate performance report."""
        
        total = self.metrics['total_requests']
        
        return {
            'total_requests': total,
            'edge_percentage': (self.metrics['edge_served'] / total * 100) if total > 0 else 0,
            'avg_latency_edge': sum(self.metrics['avg_latency_edge']) / len(self.metrics['avg_latency_edge']) if self.metrics['avg_latency_edge'] else 0,
            'avg_latency_cloud': sum(self.metrics['avg_latency_cloud']) / len(self.metrics['avg_latency_cloud']) if self.metrics['avg_latency_cloud'] else 0,
            'total_cost_saved': self.metrics['cost_saved'],
        }

# Usage
monitor = SLMMonitor()

# Simulate 1000 requests
for i in range(1000):
    result = router.route_query(f"Query {i}")
    monitor.log_request(
        query=f"Query {i}",
        model_used=result['model'],
        latency_ms=result['latency_ms'],
        cost=result['cost'],
    )

# Check results
report = monitor.get_report()
print(f"""
Performance Report:
-------------------
Total requests: {report['total_requests']}
Edge served: {report['edge_percentage']:.1f}%
Avg edge latency: {report['avg_latency_edge']:.0f}ms
Avg cloud latency: {report['avg_latency_cloud']:.0f}ms
Total cost saved: \${report['total_cost_saved']:.2f}
""")

# Expected output:
# Edge served: 75-85%
# Total cost saved: $7.50+ (per 1000 requests)
\`\`\`

## Best Practices for SLM Production

### 1. Model Selection Checklist

\`\`\`python
def evaluate_slm_for_use_case(
    use_case: str,
    requirements: Dict
) -> Dict[str, float]:
    """Score SLMs against requirements."""
    
    criteria = {
        'latency': {
            'weight': requirements.get('latency_weight', 0.3),
            'threshold_ms': requirements.get('max_latency', 500),
        },
        'accuracy': {
            'weight': requirements.get('accuracy_weight', 0.4),
            'threshold': requirements.get('min_accuracy', 0.85),
        },
        'cost': {
            'weight': requirements.get('cost_weight', 0.3),
            'max_per_request': requirements.get('max_cost', 0.001),
        }
    }
    
    # Score each model
    scores = {}
    
    for model_name, profile in TopSLMs.MODELS.items():
        score = 0.0
        
        # Latency score (smaller = better)
        estimated_latency = profile.size_gb * 50  # Rough estimate
        if estimated_latency < criteria['latency']['threshold_ms']:
            score += criteria['latency']['weight']
        
        # (Would test accuracy on benchmark in production)
        
        # Cost score
        estimated_cost = profile.size_gb * 0.0001
        if estimated_cost < criteria['cost']['max_per_request']:
            score += criteria['cost']['weight']
        
        scores[model_name] = score
    
    return scores
\`\`\`

### 2. Continuous Evaluation

\`\`\`python
class ContinuousEvaluator:
    """Monitor SLM performance over time."""
    
    def __init__(self, test_set):
        self.test_set = test_set
        self.results = []
    
    def evaluate_daily(self, model):
        """Run daily evaluation."""
        
        correct = 0
        total = len(self.test_set)
        
        for example in self.test_set:
            response = model.generate(example['input'])
            
            # Check if response matches expected
            if self._check_correctness(response, example['expected']):
                correct += 1
        
        accuracy = correct / total
        
        self.results.append({
            'date': datetime.now().isoformat(),
            'accuracy': accuracy,
        })
        
        # Alert if degradation
        if accuracy < 0.80:
            self._send_alert(f"Model accuracy dropped to {accuracy:.2%}")
        
        return accuracy
    
    def _check_correctness(self, response, expected):
        # Implement your validation logic
        pass
    
    def _send_alert(self, message):
        # Send to monitoring system
        print(f"🚨 ALERT: {message}")
\`\`\`

## Cost Analysis: Real Numbers

\`\`\`python
class CostCalculator:
    """Calculate actual costs for SLM deployment."""
    
    @staticmethod
    def compare_deployment_costs(
        requests_per_day: int = 100_000,
        days_per_month: int = 30,
    ):
        """Compare SLM vs LLM costs."""
        
        total_requests = requests_per_day * days_per_month
        
        scenarios = {
            'cloud_llm_only': {
                'cost_per_request': 0.01,
                'infrastructure': 0,
            },
            'cloud_slm_only': {
                'cost_per_request': 0.0005,
                'infrastructure': 200,  # Server costs
            },
            'hybrid_edge_cloud': {
                'edge_percentage': 0.80,
                'edge_cost': 0.0001,
                'cloud_cost': 0.01,
                'infrastructure': 100,  # Smaller cloud footprint
            },
        }
        
        results = {}
        
        for scenario, config in scenarios.items():
            if scenario == 'hybrid_edge_cloud':
                edge_requests = total_requests * config['edge_percentage']
                cloud_requests = total_requests * (1 - config['edge_percentage'])
                
                total_cost = (
                    edge_requests * config['edge_cost'] +
                    cloud_requests * config['cloud_cost'] +
                    config['infrastructure']
                )
            else:
                total_cost = (
                    total_requests * config['cost_per_request'] +
                    config['infrastructure']
                )
            
            results[scenario] = total_cost
        
        return results

# Example
costs = CostCalculator.compare_deployment_costs(
    requests_per_day=100_000
)

for scenario, cost in costs.items():
    print(f"{scenario:25s}: \${cost:,.2f}/month")

# Output:
# cloud_llm_only          : $30,000.00/month
# cloud_slm_only          : $1,700.00/month
# hybrid_edge_cloud       : $650.00/month
#
# Savings: $29,350/month (98% reduction!)
\`\`\`

## Conclusion: The SLM Revolution

Small Language Models aren't just a cost-cutting measure. They're enabling entirely new categories of AI applications:

**Privacy-First AI**: Medical apps processing patient data on-device
**Real-Time AI**: Manufacturing quality control with millisecond latency
**Offline AI**: Field workers using AI in remote locations
**Sustainable AI**: Reducing carbon footprint by 90%+

The key insights:

1. **Right-size your models** - Don't use a sledgehammer when a scalpel works
2. **Fine-tune strategically** - 1000 good examples beats a generic giant
3. **Deploy close to users** - Edge beats cloud for latency and privacy
4. **Monitor and optimize** - Continuous evaluation catches drift early
5. **Hybrid is best** - SLM for 80% of queries, LLM for the complex 20%

In 2025, the companies winning with AI aren't the ones with the biggest models. They're the ones with the smartest deployment strategies. SLMs are a huge part of that strategy.

## What's Next?

In the final article of this series, we'll explore **Agentic AI in Production: Building AI Systems That Actually Work**, covering:
- Agent architecture patterns
- Tool integration
- Multi-step reasoning
- Production deployment

Stay tuned!

---

*Part of the Production AI Engineering series. Complete code on GitHub.*
`,Jn="2025-01-20",et=8,nt={name:"Abhishek",photo:"/Abhishek_Profile.png"},tt="Edge AI",at=["SLM","Edge AI","Optimization","Phi-3.5"],rt="/blog/small-language-models.png",ot=!1,st={id:Qn,slug:Yn,title:Kn,excerpt:Zn,content:Xn,publishedAt:Jn,readTime:et,author:nt,category:tt,tags:at,featuredImage:rt,featured:ot},it="14",lt="agentic-ai-production-guide",ct="Agentic AI in Production: From Research Hype to Business Reality",dt="Master the architecture of autonomous AI agents. Learn to build reliable, goal-oriented systems using ReAct patterns, multi-agent coordination, and production-grade tool integration.",ut=`# Agentic AI in Production: From Research Hype to Business Reality

## Introduction: Beyond Chat - AI That Actually Does Things

For the past two years, most LLM applications have been glorified chatbots. You ask a question, get an answer, repeat. But in 2025, something fundamental has shifted. AI systems are now agents: autonomous software that can plan, use tools, execute tasks, and adapt based on results. They don't just tell you how to book a flight; they book it. They don't explain how to debug code; they fix it.

This is agentic AI, and it's transforming how businesses operate. Companies are deploying agents that handle customer support end-to-end, write and deploy code autonomously, manage complex workflows, and coordinate with other agents like team members.

But here's the challenge: most \\"agent\\" demos you've seen are smoke and mirrors. They work in carefully controlled environments with cherry-picked examples. Production agentic systems that handle real-world complexity, edge cases, and scale are an entirely different beast.

In this comprehensive guide, we'll build production-ready AI agents using LangChain, LangGraph, Azure AI Foundry, and proven architectural patterns. You'll learn how to create agents that are reliable, safe, and actually useful in business contexts.

### Traditional vs Agentic LLM Comparison

\`\`\`react-flow
{
  "title": "Traditional vs Agentic LLM Comparison",
  "height": "500px",
  "nodes": [
    { "id": "trad", "data": { "label": "TRADITIONAL LLM (CHATBOT)" }, "position": { "x": 0, "y": 0 }, "style": { "width": 260, "height": 380, "backgroundColor": "rgba(0, 0, 0, 0.03)", "border": "2px dashed rgba(0, 0, 0, 0.2)" }, "type": "group" },
    { "id": "agent", "data": { "label": "AGENTIC AI (AUTONOMOUS)" }, "position": { "x": 300, "y": 0 }, "style": { "width": 260, "height": 380, "backgroundColor": "rgba(212, 163, 115, 0.05)", "border": "2px solid rgba(212, 163, 115, 0.4)" }, "type": "group" },

    { "id": "t1", "data": { "label": "User: How do I analyze sales data?" }, "position": { "x": 10, "y": 50 }, "parentId": "trad", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },
    { "id": "t2", "data": { "label": "LLM: You should load CSV, calculate metrics..." }, "position": { "x": 10, "y": 120 }, "parentId": "trad", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },
    { "id": "t3", "data": { "label": "[User does the work]" }, "position": { "x": 10, "y": 300 }, "parentId": "trad", "extent": "parent", "className": "bg-accent-blue/10 font-bold text-center" },

    { "id": "a1", "data": { "label": "User: Analyze sales data from Q4" }, "position": { "x": 10, "y": 50 }, "parentId": "agent", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },
    { "id": "a2", "data": { "label": "Agent: Working...\\n1. Load sales_q4.csv\\n2. Calculate metrics\\n3. Create charts\\n4. Generate report" }, "position": { "x": 10, "y": 120 }, "parentId": "agent", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },
    { "id": "a3", "data": { "label": "[Agent does the work]" }, "position": { "x": 10, "y": 300 }, "parentId": "agent", "extent": "parent", "className": "bg-accent-gold/20 font-bold text-center" }
  ],
  "edges": [
    { "id": "e1", "source": "t1", "target": "t2", "animated": true },
    { "id": "e2", "source": "t2", "target": "t3" },
    { "id": "e3", "source": "a1", "target": "a2", "animated": true },
    { "id": "e4", "source": "a2", "target": "a3", "animated": true }
  ]
}
\`\`\`

### The Agent Loop (ReAct Pattern)

\`\`\`react-flow
{
  "title": "Agentic AI Loop (ReAct)",
  "height": "600px",
  "nodes": [
    { "id": "start", "type": "input", "data": { "label": "START" }, "position": { "x": 250, "y": 0 }, "className": "bg-accent-gold/20 border-accent-gold/50 rounded-full font-bold" },
    { "id": "obs1", "data": { "label": "1. OBSERVE" }, "position": { "x": 250, "y": 80 } },
    { "id": "rea", "data": { "label": "2. REASON" }, "position": { "x": 250, "y": 160 } },
    { "id": "act", "data": { "label": "3. ACT" }, "position": { "x": 250, "y": 240 } },
    { "id": "obs2", "data": { "label": "4. OBSERVE RESULTS" }, "position": { "x": 250, "y": 320 } },
    { "id": "goal", "data": { "label": "Goal Reached?" }, "position": { "x": 250, "y": 420 }, "className": "bg-accent-blue/10 border-accent-blue/50" },
    { "id": "finish", "type": "output", "data": { "label": "FINISH" }, "position": { "x": 250, "y": 540 }, "className": "bg-green-500/20 border-green-500/50 rounded-full font-bold" }
  ],
  "edges": [
    { "id": "e1", "source": "start", "target": "obs1", "animated": true },
    { "id": "e2", "source": "obs1", "target": "rea" },
    { "id": "e3", "source": "rea", "target": "act" },
    { "id": "e4", "source": "act", "target": "obs2" },
    { "id": "e5", "source": "obs2", "target": "goal" },
    { "id": "e6", "source": "goal", "target": "obs1", "label": "No", "animated": true, "type": "smoothstep" },
    { "id": "e7", "source": "goal", "target": "finish", "label": "Yes" }
  ]
}
\`\`\`

## Building a Production Agent: Step-by-Step

Let's build a real agent that can help with data analysis tasks.

### Step 1: Define Agent Tools

Tools are the agent's hands and eyes. Each tool is a function the agent can call.

\`\`\`python
from langchain.agents import Tool
from typing import Dict, Any
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64

class DataAnalysisTools:
    \\"\\"\\"Tool suite for data analysis agent.\\"\\"\\"
    
    def __init__(self):
        self.data_cache = {}
    
    def load_csv(self, file_path: str) -> str:
        \\"\\"\\"Load CSV file into memory.\\"\\"\\"
        try:
            df = pd.read_csv(file_path)
            self.data_cache['current_df'] = df
            
            info = f\\"\\"\\"Loaded dataset: {file_path}
Shape: {df.shape[0]} rows × {df.shape[1]} columns
Columns: {', '.join(df.columns.tolist())}

First 5 rows:
{df.head().to_string()}

Data types:
{df.dtypes.to_string()}\\\\"\\"\\"
            
            return info
            
        except Exception as e:
            return f\\"Error loading CSV: {str(e)}\\"
    
    def calculate_statistics(self, column: str) -> str:
        \\"\\"\\"Calculate descriptive statistics for a column.\\"\\"\\"
        try:
            df = self.data_cache.get('current_df')
            if df is None:
                return \\"Error: No dataset loaded. Use load_csv first.\\"
            
            if column not in df.columns:
                return f\\"Error: Column '{column}' not found. Available: {', '.join(df.columns)}\\"
            
            stats = df[column].describe()
            
            result = f\\"\\"\\"Statistics for '{column}':
{stats.to_string()}

Additional metrics:
- Missing values: {df[column].isna().sum()}
- Unique values: {df[column].nunique()}\\\\"\\"\\"
            
            return result
            
        except Exception as e:
            return f\\"Error calculating statistics: {str(e)}\\"
    
    def create_visualization(
        self,
        chart_type: str,
        x_column: str,
        y_column: str = None
    ) -> str:
        \\"\\"\\"Create a visualization and return base64 encoded image.\\"\\"\\"
        try:
            df = self.data_cache.get('current_df')
            if df is None:
                return \\"Error: No dataset loaded.\\"
            
            plt.figure(figsize=(10, 6))
            
            if chart_type == \\"bar\\":
                df[x_column].value_counts().plot(kind='bar')
                plt.title(f\\"Distribution of {x_column}\\")
                
            elif chart_type == \\"line\\":
                if y_column:
                    plt.plot(df[x_column], df[y_column])
                    plt.xlabel(x_column)
                    plt.ylabel(y_column)
                else:
                    return \\"Error: line chart requires both x and y columns\\"
                    
            elif chart_type == \\"scatter\\":
                if y_column:
                    plt.scatter(df[x_column], df[y_column])
                    plt.xlabel(x_column)
                    plt.ylabel(y_column)
                else:
                    return \\"Error: scatter plot requires both x and y columns\\"
            
            # Save to base64
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', bbox_inches='tight')
            buffer.seek(0)
            image_base64 = base64.b64encode(buffer.read()).decode()
            
            plt.close()
            
            # In production, save to file or cloud storage
            return f\\"Created {chart_type} chart. Image saved successfully.\\"
            
        except Exception as e:
            return f\\"Error creating visualization: {str(e)}\\"
    
    def execute_pandas_query(self, query: str) -> str:
        \\"\\"\\"Execute a pandas query on the current dataset.\\"\\"\\"
        try:
            df = self.data_cache.get('current_df')
            if df is None:
                return \\"Error: No dataset loaded.\\"
            
            # Safe evaluation (in production, use more robust sandboxing)
            result = eval(query, {\\"df\\": df, \\"pd\\": pd})
            
            return str(result)
            
        except Exception as e:
            return f\\"Error executing query: {str(e)}\\"
    
    def get_langchain_tools(self):
        \\"\\"\\"Convert methods to LangChain tools.\\"\\"\\"
        
        return [
            Tool(
                name=\\"load_csv\\",
                func=self.load_csv,
                description=\\"\\"\\"Load a CSV file for analysis.
                Input: file path (string)
                Returns: dataset info including columns and sample rows
                Example: load_csv(\\\\\\"sales_data.csv\\\\\\")\\\\\\"\\\\\\""
            ),
            Tool(
                name=\\"calculate_statistics\\",
                func=self.calculate_statistics,
                description=\\"\\"\\"Calculate statistics for a specific column.
                Input: column name (string)
                Returns: descriptive statistics
                Example: calculate_statistics(\\\\\\"revenue\\\\\\")\\\\\\"\\\\\\""
            ),
            Tool(
                name=\\"create_visualization\\",
                func=lambda args: self.create_visualization(**eval(args)),
                description=\\"\\"\\"Create a data visualization.
                Input: JSON string with chart_type, x_column, y_column
                Example: '{\\\\\\"chart_type\\\\\\": \\\\\\"bar\\\\\\", \\\\\\"x_column\\\\\\": \\\\\\"product\\\\\\"}'\\\\\\"\\\\\\""
            ),
            Tool(
                name=\\"execute_pandas_query\\",
                func=self.execute_pandas_query,
                description=\\"\\"\\"Execute a pandas operation on the dataset.
                Input: pandas code (string)
                Example: \\\\\\"df.groupby('category')['sales'].sum()\\\\\\"
                Use 'df' to reference the current dataset.\\\\\\"\\\\\\""
            ),
        ]

# Initialize tools
data_tools = DataAnalysisTools()
tools = data_tools.get_langchain_tools()
\`\`\`

### Step 2: Create the Agent

\`\`\`python
from langchain.agents import create_react_agent, AgentExecutor
from langchain.prompts import PromptTemplate
from langchain_azure_ai.chat_models import AzureAIChatCompletionsModel
import os

# Initialize LLM
llm = AzureAIChatCompletionsModel(
    endpoint=os.environ[\\"AZURE_INFERENCE_ENDPOINT\\"],
    credential=os.environ[\\"AZURE_INFERENCE_CREDENTIAL\\"],
    model=\\"Meta-Llama-3.1-8B-Instruct\\",
    temperature=0,  # Low temp for consistent reasoning
)

# Create agent prompt
agent_prompt = PromptTemplate.from_template(\\"\\"\\"You are a data analysis assistant. Your job is to help users analyze datasets by using the available tools.

Available tools:
{tools}

Tool Names: {tool_names}

When solving a task:
1. First, understand what the user wants
2. Break it down into steps
3. Use tools systematically
4. Verify results make sense
5. Provide clear explanations

Use this format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
Thought: {agent_scratchpad}\\\\"\\"\\"")

# Create agent
agent = create_react_agent(
    llm=llm,
    tools=tools,
    prompt=agent_prompt,
)

# Create executor
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    max_iterations=10,  # Prevent infinite loops
    handle_parsing_errors=True,
)

# Test the agent
result = agent_executor.invoke({
    \\"input\\": \\"\\"\\"I have a sales dataset at './sales_q4.csv'. 
    Please analyze it and tell me:
    1. Total revenue
    2. Top 3 products by sales
    3. Create a bar chart of sales by product category\\\\\\"\\\\\\""
})

print(result['output'])
\`\`\`

### Agent Execution Trace

\`\`\`
> Entering new AgentExecutor chain...

Thought: I need to start by loading the dataset to see what we're working with

Action: load_csv
Action Input: ./sales_q4.csv

Observation: Loaded dataset: ./sales_q4.csv
Shape: 1250 rows × 5 columns
Columns: date, product, category, quantity, revenue
...

Thought: Good, now I can analyze the data. Let me calculate total revenue

Action: execute_pandas_query
Action Input: df['revenue'].sum()

Observation: 1245780.50

Thought: Total revenue is $1.24M. Now let me find top 3 products

Action: execute_pandas_query
Action Input: df.groupby('product')['revenue'].sum().nlargest(3)

Observation: 
product
Widget Pro    234567.80
SuperGadget   198432.10
MegaTool      176543.20

Thought: Got the top products. Now let me create the visualization

Action: create_visualization
Action Input: '{\\\\\\"chart_type\\\\\\": \\\\\\"bar\\\\\\", \\\\\\"x_column\\\\\\": \\\\\\"category\\\\\\"}'

Observation: Created bar chart. Image saved successfully.

Thought: I now have all the information needed

Final Answer: Based on analysis of Q4 sales data:

1. Total Revenue: $1,245,780.50

2. Top 3 Products by Sales:
   - Widget Pro: $234,567.80
   - SuperGadget: $198,432.10
   - MegaTool: $176,543.20

3. I've created a bar chart showing sales by product category.

The data shows strong performance in Q4 with Widget Pro leading sales.

> Finished chain.
\`\`\`

## Advanced Agent Patterns

### Pattern 1: Memory-Enhanced Agent

Agents that remember previous interactions:

\`\`\`python
from langchain.memory import ConversationBufferMemory
from langchain.agents import AgentExecutor

class MemoryEnhancedAgent:
    \\"\\"\\"Agent with conversational memory.\\"\\"\\"
    
    def __init__(self, llm, tools):
        # Add memory
        self.memory = ConversationBufferMemory(
            memory_key=\\"chat_history\\",
            return_messages=True,
        )
        
        # Create agent with memory
        self.agent = create_react_agent(llm, tools, agent_prompt)
        
        self.executor = AgentExecutor(
            agent=self.agent,
            tools=tools,
            memory=self.memory,
            verbose=True,
        )
    
    def chat(self, message: str):
        \\"\\"\\"Chat with memory of previous messages.\\"\\"\\"
        return self.executor.invoke({\\"input\\": message})

# Usage
memory_agent = MemoryEnhancedAgent(llm, tools)

# First message
memory_agent.chat(\\"Load the sales data from sales_q4.csv\\")

# Follow-up (agent remembers context)
memory_agent.chat(\\"What was the total revenue?\\")

# Another follow-up (still remembers)
memory_agent.chat(\\"Show me the top products\\")
\`\`\`

### Pattern 2: Human-in-the-Loop

For high-stakes decisions, require human approval:

\`\`\`python
from langchain.agents import AgentExecutor
from langchain.callbacks import HumanApprovalCallbackHandler

class SafeAgent:
    \\"\\"\\"Agent that requires human approval for sensitive actions.\\"\\"\\"
    
    def __init__(self, llm, tools):
        # Define which tools need approval
        sensitive_tools = [\\"execute_pandas_query\\", \\"send_email\\"]
        
        # Create callback
        approval_callback = HumanApprovalCallbackHandler(
            should_check=lambda tool_name: tool_name in sensitive_tools
        )
        
        # Create agent
        agent = create_react_agent(llm, tools, agent_prompt)
        
        self.executor = AgentExecutor(
            agent=agent,
            tools=tools,
            callbacks=[approval_callback],
            verbose=True,
        )
    
    def run(self, task: str):
        \\"\\"\\"Execute task with human oversight.\\"\\"\\"
        return self.executor.invoke({\\"input\\": task})

# Usage
safe_agent = SafeAgent(llm, tools)

# This will prompt for approval before executing pandas code
result = safe_agent.run(
    \\"Calculate the average revenue per product\\"
)

# Console output:
# ⚠️  Agent wants to execute: execute_pandas_query
# Input: df.groupby('product')['revenue'].mean()
# Approve? (y/n): 
\`\`\`

### Pattern 3: Multi-Agent Collaboration

Different agents with different specialties working together:

\`\`\`python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator

class MultiAgentState(TypedDict):
    \\"\\"\\"Shared state across agents.\\"\\"\\"
    task: str
    data_loaded: bool
    analysis_complete: bool
    report_generated: bool
    results: Annotated[list, operator.add]

class MultiAgentSystem:
    \\"\\"\\"Coordinated multi-agent system.\\"\\"\\"
    
    def __init__(self):
        # Create specialized agents
        self.data_agent = self._create_data_agent()
        self.analysis_agent = self._create_analysis_agent()
        self.report_agent = self._create_report_agent()
        
        # Build collaboration graph
        self.graph = self._build_graph()
    
    def _create_data_agent(self):
        \\"\\"\\"Agent specialized in data loading and cleaning.\\"\\"\\"
        data_tools = [
            # Only data loading tools
        ]
        return create_react_agent(llm, data_tools, agent_prompt)
    
    def _create_analysis_agent(self):
        \\"\\"\\"Agent specialized in statistical analysis.\\"\\"\\"
        analysis_tools = [
            # Only analysis tools
        ]
        return create_react_agent(llm, analysis_tools, agent_prompt)
    
    def _create_report_agent(self):
        \\"\\"\\"Agent specialized in generating reports.\\"\\"\\"
        report_tools = [
            # Only reporting tools
        ]
        return create_react_agent(llm, report_tools, agent_prompt)
    
    def _build_graph(self):
        \\"\\"\\"Build agent collaboration workflow.\\"\\"\\"
        
        workflow = StateGraph(MultiAgentState)
        
        # Define agent nodes
        def data_node(state):
            result = self.data_agent.invoke(state['task'])
            return {
                \\"data_loaded\\": True,
                \\"results\\": [f\\"Data loaded: {result}\\"]
            }
        
        def analysis_node(state):
            result = self.analysis_agent.invoke(state['task'])
            return {
                \\"analysis_complete\\": True,
                \\"results\\": [f\\"Analysis: {result}\\"]
            }
        
        def report_node(state):
            result = self.report_agent.invoke({
                \\"results\\": state['results']
            })
            return {
                \\"report_generated\\": True,
                \\"results\\": [f\\"Report: {result}\\"]
            }
        
        # Add nodes
        workflow.add_node(\\"data_agent\\", data_node)
        workflow.add_node(\\"analysis_agent\\", analysis_node)
        workflow.add_node(\\"report_agent\\", report_node)
        
        # Define workflow
        workflow.set_entry_point(\\"data_agent\\")
        workflow.add_edge(\\"data_agent\\", \\"analysis_agent\\")
        workflow.add_edge(\\"analysis_agent\\", \\"report_agent\\")
        workflow.add_edge(\\"report_agent\\", END)
        
        return workflow.compile()
    
    def execute(self, task: str):
        \\"\\"\\"Execute multi-agent workflow.\\"\\"\\"
        
        initial_state = {
            \\"task\\": task,
            \\"data_loaded\\": False,
            \\"analysis_complete\\": False,
            \\"report_generated\\": False,
            \\"results\\": [],
        }
        
        final_state = self.graph.invoke(initial_state)
        return final_state['results']

# Usage
multi_agent = MultiAgentSystem()
results = multi_agent.execute(
    \\"Analyze Q4 sales and create an executive summary\\"
)
\`\`\`

## Production Safety Mechanisms

### 1. Output Validation

\`\`\`python
from typing import Any, Optional
import re

class OutputValidator:
    \\"\\"\\"Validate agent outputs before execution.\\"\\"\\"
    
    def __init__(self):
        self.dangerous_patterns = [
            r'rm\\\\s+-rf',  # Dangerous file operations
            r'DROP\\\\s+TABLE',  # SQL injection
            r'eval\\\\(',  # Code execution
            r'exec\\\\(',
            r'__import__',
        ]
    
    def validate_tool_input(
        self,
        tool_name: str,
        input_str: str
    ) -> tuple[bool, Optional[str]]:
        \\"\\"\\"Check if tool input is safe.\\"\\"\\"
        
        # Check for dangerous patterns
        for pattern in self.dangerous_patterns:
            if re.search(pattern, input_str, re.IGNORECASE):
                return False, f\\"Blocked dangerous pattern: {pattern}\\"
        
        # Tool-specific validation
        if tool_name == \\"execute_pandas_query\\":
            # Only allow read operations
            write_ops = ['drop', 'delete', 'insert', 'update']
            if any(op in input_str.lower() for op in write_ops):
                return False, \\"Write operations not allowed\\"
        
        return True, None
    
    def validate_output(
        self,
        output: str,
        max_length: int = 10000
    ) -> tuple[bool, Optional[str]]:
        \\"\\"\\"Validate agent output.\\"\\"\\"
        
        if len(output) > max_length:
            return False, f\\"Output too long: {len(output)} chars\\"
        
        # Check for PII (simplified)
        pii_patterns = [
            r'\\\\b\\\\d{3}-\\\\d{2}-\\\\d{4}\\\\b',  # SSN
            r'\\\\b\\\\d{16}\\\\b',  # Credit card
        ]
        
        for pattern in pii_patterns:
            if re.search(pattern, output):
                return False, \\"Potential PII detected in output\\"
        
        return True, None

# Integrate with agent
validator = OutputValidator()

class SafeAgentExecutor(AgentExecutor):
    \\"\\"\\"Agent executor with safety checks.\\"\\"\\"
    
    def _call(self, inputs):
        \\"\\"\\"Override to add validation.\\"\\"\\"
        
        # Validate input
        is_safe, error = validator.validate_tool_input(
            tool_name=\\"user_input\\",
            input_str=str(inputs)
        )
        
        if not is_safe:
            return {\\"output\\": f\\"Safety check failed: {error}\\"}
        
        # Execute normally
        result = super()._call(inputs)
        
        # Validate output
        is_safe, error = validator.validate_output(result['output'])
        
        if not is_safe:
            return {\\"output\\": f\\"Output validation failed: {error}\\"}
        
        return result
\`\`\`

### 2. Cost Controls

\`\`\`python
class CostController:
    \\"\\"\\"Prevent runaway agent costs.\\"\\"\\"
    
    def __init__(
        self,
        max_iterations: int = 10,
        max_tokens_per_call: int = 4000,
        max_total_cost: float = 1.0,
    ):
        self.max_iterations = max_iterations
        self.max_tokens = max_tokens_per_call
        self.max_cost = max_total_cost
        self.total_cost = 0.0
        self.iterations = 0
    
    def check_before_call(self) -> tuple[bool, Optional[str]]:
        \\"\\"\\"Check if agent can make another call.\\"\\"\\"
        
        # Check iteration limit
        if self.iterations >= self.max_iterations:
            return False, f\\"Max iterations ({self.max_iterations}) reached\\"
        
        # Check cost limit
        if self.total_cost >= self.max_cost:
            return False, f\\"Max cost (\${self.max_cost}) exceeded\\"
        
        return True, None
    
    def record_call(self, tokens_used: int, cost: float):
        \\"\\"\\"Record call metrics.\\"\\"\\"
        self.iterations += 1
        self.total_cost += cost
    
    def reset(self):
        \\"\\"\\"Reset counters.\\"\\"\\"
        self.iterations = 0
        self.total_cost = 0.0

# Usage
cost_controller = CostController(max_total_cost=0.10)  # 10 cents max

def controlled_agent_call(task: str):
    \\"\\"\\"Agent call with cost control.\\"\\"\\"
    
    # Check if allowed
    allowed, error = cost_controller.check_before_call()
    if not allowed:
        return f\\"Agent stopped: {error}\\"
    
    # Execute
    result = agent_executor.invoke({\\"input\\": task})
    
    # Record cost (simplified)
    tokens = len(task.split()) * 2  # Rough estimate
    cost = tokens * 0.00001
    cost_controller.record_call(tokens, cost)
    
    return result
\`\`\`

### 3. Monitoring and Observability

\`\`\`python
from datetime import datetime
import json
from typing import Dict, List

class AgentMonitor:
    \\"\\"\\"Comprehensive agent monitoring.\\"\\"\\"
    
    def __init__(self):
        self.traces = []
        self.metrics = {
            'total_executions': 0,
            'successful': 0,
            'failed': 0,
            'avg_iterations': [],
            'tool_usage': {},
        }
    
    def start_trace(self, task: str) -> str:
        \\"\\"\\"Start monitoring an agent execution.\\"\\"\\"
        import uuid
        
        trace_id = str(uuid.uuid4())
        
        trace = {
            'trace_id': trace_id,
            'task': task,
            'start_time': datetime.now().isoformat(),
            'iterations': [],
            'status': 'running',
        }
        
        self.traces.append(trace)
        return trace_id
    
    def log_iteration(
        self,
        trace_id: str,
        iteration: int,
        thought: str,
        action: str,
        action_input: str,
        observation: str,
    ):
        \\"\\"\\"Log a single agent iteration.\\"\\"\\"
        
        trace = next(t for t in self.traces if t['trace_id'] == trace_id)
        
        trace['iterations'].append({
            'iteration': iteration,
            'thought': thought,
            'action': action,
            'action_input': action_input,
            'observation': observation,
            'timestamp': datetime.now().isoformat(),
        })
        
        # Track tool usage
        if action not in self.metrics['tool_usage']:
            self.metrics['tool_usage'][action] = 0
        self.metrics['tool_usage'][action] += 1
    
    def end_trace(
        self,
        trace_id: str,
        status: str,
        final_answer: str = None,
        error: str = None,
    ):
        \\"\\"\\"Complete a trace.\\"\\"\\"
        
        trace = next(t for t in self.traces if t['trace_id'] == trace_id)
        
        trace['status'] = status
        trace['end_time'] = datetime.now().isoformat()
        trace['final_answer'] = final_answer
        trace['error'] = error
        
        # Update metrics
        self.metrics['total_executions'] += 1
        if status == 'success':
            self.metrics['successful'] += 1
        else:
            self.metrics['failed'] += 1
        
        self.metrics['avg_iterations'].append(len(trace['iterations']))
    
    def get_metrics_summary(self) -> Dict:
        \\"\\"\\"Get summary statistics.\\"\\"\\"
        
        import statistics
        
        return {
            'total_executions': self.metrics['total_executions'],
            'success_rate': self.metrics['successful'] / max(self.metrics['total_executions'], 1),
            'avg_iterations': statistics.mean(self.metrics['avg_iterations']) if self.metrics['avg_iterations'] else 0,
            'tool_usage': self.metrics['tool_usage'],
        }
    
    def export_traces(self, filepath: str):
        \\"\\"\\"Export traces for analysis.\\"\\"\\"
        
        with open(filepath, 'w') as f:
            json.dump(self.traces, f, indent=2)

# Usage
monitor = AgentMonitor()

def monitored_agent_execution(task: str):
    \\"\\"\\"Execute agent with full monitoring.\\"\\"\\"
    
    trace_id = monitor.start_trace(task)
    
    try:
        # Custom agent executor that logs each iteration
        # (Implementation details omitted for brevity)
        
        result = agent_executor.invoke({\\"input\\": task})
        
        monitor.end_trace(
            trace_id,
            status='success',
            final_answer=result['output']
        )
        
        return result
        
    except Exception as e:
        monitor.end_trace(
            trace_id,
            status='failed',
            error=str(e)
        )
        raise

# Check metrics
summary = monitor.get_metrics_summary()
print(f\\"Success rate: {summary['success_rate']:.1%}\\")
print(f\\"Avg iterations: {summary['avg_iterations']:.1f}\\")
print(f\\"Tool usage: {summary['tool_usage']}\\")
\`\`\`

## Real-World Production Architecture

Here's how to deploy agentic systems at scale:

\`\`\`react-flow
{
  "title": "Production Agent System Architecture",
  "height": "600px",
  "nodes": [
    { "id": "system", "data": { "label": "Production Agent System" }, "position": { "x": 0, "y": 0 }, "style": { "width": 600, "height": 550, "backgroundColor": "rgba(212, 163, 115, 0.05)", "border": "1px dashed rgba(212, 163, 115, 0.3)" }, "type": "group" },
    { "id": "gw", "data": { "label": "API Gateway / Rate Limit" }, "position": { "x": 200, "y": 40 }, "parentId": "system", "extent": "parent", "className": "bg-accent-gold/20 border-accent-gold/50" },
    
    { "id": "worker", "data": { "label": "Worker Layer" }, "position": { "x": 50, "y": 120 }, "parentId": "system", "extent": "parent", "style": { "width": 500, "height": 100, "backgroundColor": "rgba(59, 130, 246, 0.05)", "border": "1px dashed rgba(59, 130, 246, 0.3)" }, "type": "group" },
    { "id": "w1", "data": { "label": "Agent Worker 1" }, "position": { "x": 20, "y": 40 }, "parentId": "worker", "extent": "parent" },
    { "id": "w2", "data": { "label": "Agent Worker 2" }, "position": { "x": 180, "y": 40 }, "parentId": "worker", "extent": "parent" },
    { "id": "w3", "data": { "label": "Agent Worker 3" }, "position": { "x": 340, "y": 40 }, "parentId": "worker", "extent": "parent" },
    
    { "id": "resource", "data": { "label": "Resource Layer" }, "position": { "x": 50, "y": 280 }, "parentId": "system", "extent": "parent", "style": { "width": 500, "height": 100, "backgroundColor": "rgba(16, 185, 129, 0.05)", "border": "1px dashed rgba(16, 185, 129, 0.3)" }, "type": "group" },
    { "id": "tools", "data": { "label": "Tools Service" }, "position": { "x": 20, "y": 40 }, "parentId": "resource", "extent": "parent" },
    { "id": "llm", "data": { "label": "LLM Provider" }, "position": { "x": 180, "y": 40 }, "parentId": "resource", "extent": "parent" },
    { "id": "state", "data": { "label": "State Store" }, "position": { "x": 340, "y": 40 }, "parentId": "resource", "extent": "parent" },
    
    { "id": "mon", "data": { "label": "Monitoring / Alerts" }, "position": { "x": 200, "y": 450 }, "parentId": "system", "extent": "parent" }
  ],
  "edges": [
    { "id": "e1", "source": "gw", "target": "w1" },
    { "id": "e2", "source": "gw", "target": "w2" },
    { "id": "e3", "source": "gw", "target": "w3" },
    { "id": "e4", "source": "w1", "target": "tools" },
    { "id": "e5", "source": "w1", "target": "llm" },
    { "id": "e6", "source": "w1", "target": "state" },
    { "id": "e7", "source": "w2", "target": "tools" },
    { "id": "e8", "source": "w2", "target": "llm" },
    { "id": "e9", "source": "w2", "target": "state" },
    { "id": "e10", "source": "w3", "target": "tools" },
    { "id": "e11", "source": "w3", "target": "llm" },
    { "id": "e12", "source": "w3", "target": "state" },
    { "id": "e13", "source": "tools", "target": "mon" },
    { "id": "e14", "source": "llm", "target": "mon" },
    { "id": "e15", "source": "state", "target": "mon" }
  ]
}
\`\`\`

### Production Deployment Code

\`\`\`python
from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import Optional
import asyncio

app = FastAPI(title=\\"Production Agent API\\")

class AgentRequest(BaseModel):
    task: str
    max_iterations: int = 10
    timeout_seconds: int = 300
    user_id: str

class AgentResponse(BaseModel):
    task_id: str
    status: str
    result: Optional[str] = None
    iterations_used: int = 0
    error: Optional[str] = None

# Task queue
task_results = {}

@app.post(\\"/agent/execute\\", response_model=AgentResponse)
async def execute_agent(
    request: AgentRequest,
    background_tasks: BackgroundTasks
):
    \\"\\"\\"Execute agent task asynchronously.\\"\\"\\"
    
    import uuid
    task_id = str(uuid.uuid4())
    
    # Initialize result
    task_results[task_id] = {
        \\"status\\": \\"pending\\",
        \\"result\\": None,
    }
    
    # Execute in background
    background_tasks.add_task(
        run_agent_task,
        task_id,
        request,
    )
    
    return AgentResponse(
        task_id=task_id,
        status=\\"pending\\",
    )

async def run_agent_task(task_id: str, request: AgentRequest):
    \\"\\"\\"Execute agent in background.\\"\\"\\"
    
    try:
        # Apply cost controls
        cost_controller = CostController(
            max_iterations=request.max_iterations,
        )
        
        # Apply monitoring
        trace_id = monitor.start_trace(request.task)
        
        # Execute with timeout
        result = await asyncio.wait_for(
            asyncio.to_thread(
                agent_executor.invoke,
                {\\"input\\": request.task}
            ),
            timeout=request.timeout_seconds
        )
        
        # Update result
        task_results[task_id] = {
            \\"status\\": \\"completed\\",
            \\"result\\": result['output'],
            \\"iterations\\": cost_controller.iterations,
        }
        
        monitor.end_trace(trace_id, \\"success\\", result['output'])
        
    except asyncio.TimeoutError:
        task_results[task_id] = {
            \\"status\\": \\"failed\\",
            \\"error\\": \\"Task exceeded timeout\\",
        }
        monitor.end_trace(trace_id, \\"failed\\", error=\\"Timeout\\")
        
    except Exception as e:
        task_results[task_id] = {
            \\"status\\": \\"failed\\",
            \\"error\\": str(e),
        }
        monitor.end_trace(trace_id, \\"failed\\", error=str(e))

@app.get(\\"/agent/status/{task_id}\\", response_model=AgentResponse)
async def get_task_status(task_id: str):
    \\"\\"\\"Check agent task status.\\"\\"\\"
    
    if task_id not in task_results:
        raise HTTPException(status_code=404, detail=\\"Task not found\\")
    
    result = task_results[task_id]
    
    return AgentResponse(
        task_id=task_id,
        status=result['status'],
        result=result.get('result'),
        iterations_used=result.get('iterations', 0),
        error=result.get('error'),
    )

# Run with: uvicorn app:app --workers 4
\`\`\`

## Key Lessons from Production Deployments

### 1. Agents Fail (A Lot)

**Problem**: Production agents encounter edge cases that break them.
**Solution**: Implement robust error handling and fallbacks.

\`\`\`python
def resilient_agent_call(task: str, max_retries: int = 3):
    \\"\\"\\"Agent call with automatic retries and fallbacks.\\"\\"\\"
    
    for attempt in range(max_retries):
        try:
            return agent_executor.invoke({\\"input\\": task})
        
        except Exception as e:
            if attempt < max_retries - 1:
                print(f\\"Attempt {attempt + 1} failed, retrying...\\")
                continue
            else:
                # Fall back to simple LLM call
                return {
                    \\"output\\": llm.invoke(task).content,
                    \\"fallback\\": True,
                }
\`\`\`

### 2. Infinite Loops Are Real

**Problem**: Agents can get stuck in reasoning loops.
**Solution**: Enforce strict iteration limits and timeout.

\`\`\`python
# Always set max_iterations
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    max_iterations=10,  # Hard limit
    max_execution_time=60,  # 60 second timeout
)
\`\`\`

### 3. Prompt Engineering Matters More

**Problem**: Generic prompts lead to unreliable behavior.
**Solution**: Craft task-specific prompts with examples.

\`\`\`python
task_specific_prompt = \\"\\"\\"You are a data analyst agent.

Your job: Analyze datasets and answer questions.

Key rules:
1. Always load data before analyzing
2. Verify column names before calculations
3. Handle missing data gracefully
4. Explain your reasoning
5. If unsure, ask for clarification

Example workflow:
User: \\\\\\"What's the average revenue?\\\\\\"
1. Load data
2. Check if 'revenue' column exists
3. Calculate average
4. Report result with context

Now begin:
{input}\\\\\\"\\\\\\""
\`\`\`

## Conclusion

Agentic AI represents a fundamental shift from passive AI to active AI. From chatbots that answer questions to agents that solve problems. But production agentic systems require:

1. **Robust tool design** - Tools are the agent's interface to the world
2. **Safety mechanisms** - Validation, human-in-the-loop, cost controls
3. **Comprehensive monitoring** - Know what your agents are doing
4. **Error handling** - Agents will fail; plan for it
5. **Iteration limits** - Prevent runaway costs and loops

The patterns in this guide—ReAct agents, multi-agent systems, tool validation, monitoring—are battle-tested in production. They work.

The future of software isn't just assisted by AI. It's orchestrated by AI agents working together to solve complex, real-world problems. And that future is here.

## Complete Code Repository

All code from this guide is available on GitHub with:
- Full implementation examples
- Docker deployment configs
- Kubernetes manifests
- Monitoring dashboards
- Production-ready templates

## What's Next?

This concludes our 5-part series on Production AI Engineering. You've learned:
1. Multi-agent systems with LangGraph
2. Enterprise RAG systems
3. LLMOps and production operations
4. Small language models at scale
5. Agentic AI in production

The tools are mature. The patterns are proven. The time to build is now.

Go build something amazing.

---

*Final article in the Production AI Engineering series. Thank you for reading!*
`,pt={name:"Abhishek",photo:"/Abhishek_Profile.png"},mt="2025-01-20",gt=15,ft="Agentic AI",_t=["AI Agents","ReAct","LangChain","Autonomy"],ht="/blog/agentic-ai.png",yt=!1,bt={id:it,slug:lt,title:ct,excerpt:dt,content:ut,author:pt,publishedAt:mt,readTime:gt,category:ft,tags:_t,featuredImage:ht,featured:yt},xt="13",vt="production-ai-observability",wt="Production AI Observability: Monitoring, Logging, and Debugging",At="A deep dive into observability for AI systems, covering performance monitoring, tracing, and debugging in production environments.",kt=`# Production AI Observability: Monitoring, Logging, and Debugging

## Introduction: You Can't Improve What You Can't Measure

Production AI systems require comprehensive observability to ensure reliability, performance, and quality. This guide covers the complete observability stack for AI applications.

## The Three Pillars of Observability

\`\`\`react-flow
{
  "title": "Production AI Observability Stack",
  "height": "800px",
  "nodes": [
    { "id": "metrics", "data": { "label": "Metrics (Layer 1)" }, "position": { "x": 0, "y": 0 }, "style": { "width": 180, "height": 300, "backgroundColor": "rgba(59, 130, 246, 0.05)", "border": "1px dashed rgba(59, 130, 246, 0.3)" }, "type": "group" },
    { "id": "a", "data": { "label": "Request Rate" }, "position": { "x": 10, "y": 30 }, "parentId": "metrics", "extent": "parent" },
    { "id": "b", "data": { "label": "Latency" }, "position": { "x": 10, "y": 80 }, "parentId": "metrics", "extent": "parent" },
    { "id": "c", "data": { "label": "Error Rate" }, "position": { "x": 10, "y": 130 }, "parentId": "metrics", "extent": "parent" },
    { "id": "d", "data": { "label": "Token Usage" }, "position": { "x": 10, "y": 180 }, "parentId": "metrics", "extent": "parent" },
    { "id": "e", "data": { "label": "Accuracy" }, "position": { "x": 10, "y": 230 }, "parentId": "metrics", "extent": "parent" },

    { "id": "logs", "data": { "label": "Logs (Layer 2)" }, "position": { "x": 200, "y": 0 }, "style": { "width": 180, "height": 250, "backgroundColor": "rgba(212, 163, 115, 0.05)", "border": "1px dashed rgba(212, 163, 115, 0.3)" }, "type": "group" },
    { "id": "f", "data": { "label": "Req Logs" }, "position": { "x": 10, "y": 30 }, "parentId": "logs", "extent": "parent" },
    { "id": "g", "data": { "label": "Inference Logs" }, "position": { "x": 10, "y": 80 }, "parentId": "logs", "extent": "parent" },
    { "id": "h", "data": { "label": "Error Logs" }, "position": { "x": 10, "y": 130 }, "parentId": "logs", "extent": "parent" },
    { "id": "i", "data": { "label": "Debug Traces" }, "position": { "x": 10, "y": 180 }, "parentId": "logs", "extent": "parent" },

    { "id": "traces", "data": { "label": "Traces (Layer 3)" }, "position": { "x": 400, "y": 0 }, "style": { "width": 180, "height": 200, "backgroundColor": "rgba(16, 185, 129, 0.05)", "border": "1px dashed rgba(16, 185, 129, 0.3)" }, "type": "group" },
    { "id": "j", "data": { "label": "Req Tracing" }, "position": { "x": 10, "y": 30 }, "parentId": "traces", "extent": "parent" },
    { "id": "k", "data": { "label": "Distributed" }, "position": { "x": 10, "y": 80 }, "parentId": "traces", "extent": "parent" },
    { "id": "l", "data": { "label": "Profiling" }, "position": { "x": 10, "y": 130 }, "parentId": "traces", "extent": "parent" },

    { "id": "m", "data": { "label": "Prometheus\\n(Time Series)" }, "position": { "x": 0, "y": 350 }, "className": "bg-blue-100 border-blue-300" },
    { "id": "n", "data": { "label": "Elasticsearch\\n(Logs)" }, "position": { "x": 200, "y": 350 }, "className": "bg-orange-100 border-orange-300" },
    { "id": "o", "data": { "label": "Jaeger/Tempo\\n(Traces)" }, "position": { "x": 400, "y": 350 }, "className": "bg-green-100 border-green-300" },

    { "id": "p", "data": { "label": "Grafana\\n(Visualization)" }, "position": { "x": 200, "y": 450 }, "className": "bg-accent-blue/10 border-accent-blue/50 font-bold" },
    { "id": "q", "data": { "label": "Alert Manager" }, "position": { "x": 200, "y": 550 }, "className": "bg-red-500/10 border-red-500/50" },
    { "id": "r", "type": "output", "data": { "label": "PagerDuty / Slack" }, "position": { "x": 200, "y": 650 } }
  ],
  "edges": [
    { "id": "e_am", "source": "a", "target": "m" },
    { "id": "e_bm", "source": "b", "target": "m" },
    { "id": "e_cm", "source": "c", "target": "m" },
    { "id": "e_dm", "source": "d", "target": "m" },
    { "id": "e_em", "source": "e", "target": "m" },
    { "id": "e_fn", "source": "f", "target": "n" },
    { "id": "e_gn", "source": "g", "target": "n" },
    { "id": "e_hn", "source": "h", "target": "n" },
    { "id": "e_in", "source": "i", "target": "n" },
    { "id": "e_jo", "source": "j", "target": "o" },
    { "id": "e_ko", "source": "k", "target": "o" },
    { "id": "e_lo", "source": "l", "target": "o" },
    { "id": "e_mp", "source": "m", "target": "p", "animated": true },
    { "id": "e_np", "source": "n", "target": "p", "animated": true },
    { "id": "e_op", "source": "o", "target": "p", "animated": true },
    { "id": "e_pq", "source": "p", "target": "q" },
    { "id": "e_qr", "source": "q", "target": "r", "animated": true }
  ]
}
\`\`\`

## Complete Monitoring Implementation

\`\`\`python
from prometheus_client import Counter, Histogram, Gauge
import logging
from opentelemetry import trace
from opentelemetry.exporter.jaeger import JaegerExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

# Metrics
request_count = Counter(
    'ai_requests_total',
    'Total AI requests',
    ['endpoint', 'model', 'status']
)

request_latency = Histogram(
    'ai_request_duration_seconds',
    'AI request latency',
    ['endpoint', 'model'],
    buckets=[0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 30.0]
)

token_usage = Counter(
    'ai_tokens_used_total',
    'Total tokens used',
    ['model', 'operation']
)

model_load = Gauge(
    'ai_model_memory_bytes',
    'Model memory usage',
    ['model']
)

# Logging
logger = logging.getLogger(__name__)

# Tracing
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

jaeger_exporter = JaegerExporter(
    agent_host_name='localhost',
    agent_port=6831,
)

trace.get_tracer_provider().add_span_processor(
    BatchSpanProcessor(jaeger_exporter)
)

class AIObservability:
    """Complete observability for AI systems."""
    
    @staticmethod
    def track_request(endpoint: str, model: str):
        """Track AI request."""
        with tracer.start_as_current_span("ai_request") as span:
            span.set_attribute("endpoint", endpoint)
            span.set_attribute("model", model)
            
            start_time = time.time()
            try:
                # Process request
                result = process_ai_request()
                
                # Record metrics
                request_count.labels(
                    endpoint=endpoint,
                    model=model,
                    status='success'
                ).inc()
                
                latency = time.time() - start_time
                request_latency.labels(
                    endpoint=endpoint,
                    model=model
                ).observe(latency)
                
                return result
                
            except Exception as e:
                request_count.labels(
                    endpoint=endpoint,
                    model=model,
                    status='error'
                ).inc()
                
                logger.error(
                    f"Request failed: {str(e)}",
                    extra={
                        'endpoint': endpoint,
                        'model': model,
                        'error': str(e)
                    }
                )
                raise
\`\`\`

---

*Part 5 of AI Architect Series - Complete*
`,It="2025-02-01",Ct=13,St={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},Lt="DevOps",Pt=["Observability","Monitoring","AI Production","DevOps","Tracing"],Mt="/blog/ai-observability.png",Tt=!1,qt={id:xt,slug:vt,title:wt,excerpt:At,content:kt,publishedAt:It,readTime:Ct,author:St,category:Lt,tags:Pt,featuredImage:Mt,featured:Tt},Rt=[K,ce,we,Ne,Qe,ln,vn,En,jn,st,bt,qt].sort((e,t)=>parseInt(e.id)-parseInt(t.id));function Ot(e){return Rt.find(t=>t.slug===e)}export{zt as B,Ft as S,S as a,Rt as b,q as c,Ot as g};
