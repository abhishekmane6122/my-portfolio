# Agentic AI in Production: From Research Hype to Business Reality

## Introduction: Beyond Chat - AI That Actually Does Things

For the past two years, most LLM applications have been glorified chatbots. You ask a question, get an answer, repeat. But in 2025, something fundamental has shifted. AI systems are now agents: autonomous software that can plan, use tools, execute tasks, and adapt based on results. They don't just tell you how to book a flight; they book it. They don't explain how to debug code; they fix it.

This is agentic AI, and it's transforming how businesses operate. Companies are deploying agents that handle customer support end-to-end, write and deploy code autonomously, manage complex workflows, and coordinate with other agents like team members.

But here's the challenge: most "agent" demos you've seen are smoke and mirrors. They work in carefully controlled environments with cherry-picked examples. Production agentic systems that handle real-world complexity, edge cases, and scale are an entirely different beast.

In this comprehensive guide, we'll build production-ready AI agents using LangChain, LangGraph, Azure AI Foundry, and proven architectural patterns. You'll learn how to create agents that are reliable, safe, and actually useful in business contexts.

## What Makes an Agent Different?

```
Traditional LLM:              Agentic LLM:
───────────────              ─────────────

User: How do I analyze       User: Analyze sales data
      sales data?                   from Q4

LLM:  You should load        Agent:
      the CSV, calculate       1. ✓ Load sales_q4.csv
      metrics, visualize       2. ✓ Calculate metrics
      trends...                   - Revenue: $1.2M (+15%)
                                  - Top product: Widget X
                              3. ✓ Create visualizations
      [User does the work]    4. ✓ Generate report
                              5. ✓ Email to stakeholders

                              [Agent does the work]
```

### The Agent Loop (ReAct Pattern)

The foundation of modern agents is the ReAct (Reasoning + Acting) pattern:

```
┌─────────────────────────────────────────────────────────┐
│                   Agent Execution Loop                  │
└─────────────────────────────────────────────────────────┘

     ┌──────────────────────────────────────────┐
     │         1. OBSERVE                       │
     │    Analyze current situation             │
     │    Review available information          │
     └──────────────┬───────────────────────────┘
                    │
                    ▼
     ┌──────────────────────────────────────────┐
     │         2. REASON                        │
     │    Plan next action                      │
     │    Consider alternatives                 │
     │    Decide what to do                     │
     └──────────────┬───────────────────────────┘
                    │
                    ▼
     ┌──────────────────────────────────────────┐
     │         3. ACT                           │
     │    Execute chosen action                 │
     │    Use tools/APIs                        │
     │    Perform operations                    │
     └──────────────┬───────────────────────────┘
                    │
                    ▼
     ┌──────────────────────────────────────────┐
     │         4. OBSERVE RESULTS               │
     │    Get tool output                       │
     │    Update state                          │
     └──────────────┬───────────────────────────┘
                    │
                    ▼
            ┌───────────────┐
            │  Goal Reached?│
            └───┬───────┬───┘
                │       │
            No  │       │ Yes
                │       │
                │       ▼
                │   ┌────────┐
                │   │ FINISH │
                │   └────────┘
                │
                └─────────► (Loop back to OBSERVE)
```

## Building a Production Agent: Step-by-Step

Let's build a real agent that can help with data analysis tasks.

### Step 1: Define Agent Tools

Tools are the agent's hands and eyes. Each tool is a function the agent can call.

```python
from langchain.agents import Tool
from typing import Dict, Any
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64

class DataAnalysisTools:
    """Tool suite for data analysis agent."""
    
    def __init__(self):
        self.data_cache = {}
    
    def load_csv(self, file_path: str) -> str:
        """Load CSV file into memory."""
        try:
            df = pd.read_csv(file_path)
            self.data_cache['current_df'] = df
            
            info = f"""Loaded dataset: {file_path}
Shape: {df.shape[0]} rows × {df.shape[1]} columns
Columns: {', '.join(df.columns.tolist())}

First 5 rows:
{df.head().to_string()}

Data types:
{df.dtypes.to_string()}"""
            
            return info
            
        except Exception as e:
            return f"Error loading CSV: {str(e)}"
    
    def calculate_statistics(self, column: str) -> str:
        """Calculate descriptive statistics for a column."""
        try:
            df = self.data_cache.get('current_df')
            if df is None:
                return "Error: No dataset loaded. Use load_csv first."
            
            if column not in df.columns:
                return f"Error: Column '{column}' not found. Available: {', '.join(df.columns)}"
            
            stats = df[column].describe()
            
            result = f"""Statistics for '{column}':
{stats.to_string()}

Additional metrics:
- Missing values: {df[column].isna().sum()}
- Unique values: {df[column].nunique()}"""
            
            return result
            
        except Exception as e:
            return f"Error calculating statistics: {str(e)}"
    
    def create_visualization(
        self,
        chart_type: str,
        x_column: str,
        y_column: str = None
    ) -> str:
        """Create a visualization and return base64 encoded image."""
        try:
            df = self.data_cache.get('current_df')
            if df is None:
                return "Error: No dataset loaded."
            
            plt.figure(figsize=(10, 6))
            
            if chart_type == "bar":
                df[x_column].value_counts().plot(kind='bar')
                plt.title(f"Distribution of {x_column}")
                
            elif chart_type == "line":
                if y_column:
                    plt.plot(df[x_column], df[y_column])
                    plt.xlabel(x_column)
                    plt.ylabel(y_column)
                else:
                    return "Error: line chart requires both x and y columns"
                    
            elif chart_type == "scatter":
                if y_column:
                    plt.scatter(df[x_column], df[y_column])
                    plt.xlabel(x_column)
                    plt.ylabel(y_column)
                else:
                    return "Error: scatter plot requires both x and y columns"
            
            # Save to base64
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', bbox_inches='tight')
            buffer.seek(0)
            image_base64 = base64.b64encode(buffer.read()).decode()
            
            plt.close()
            
            # In production, save to file or cloud storage
            return f"Created {chart_type} chart. Image saved successfully."
            
        except Exception as e:
            return f"Error creating visualization: {str(e)}"
    
    def execute_pandas_query(self, query: str) -> str:
        """Execute a pandas query on the current dataset."""
        try:
            df = self.data_cache.get('current_df')
            if df is None:
                return "Error: No dataset loaded."
            
            # Safe evaluation (in production, use more robust sandboxing)
            result = eval(query, {"df": df, "pd": pd})
            
            return str(result)
            
        except Exception as e:
            return f"Error executing query: {str(e)}"
    
    def get_langchain_tools(self):
        """Convert methods to LangChain tools."""
        
        return [
            Tool(
                name="load_csv",
                func=self.load_csv,
                description="""Load a CSV file for analysis.
                Input: file path (string)
                Returns: dataset info including columns and sample rows
                Example: load_csv("sales_data.csv")"""
            ),
            Tool(
                name="calculate_statistics",
                func=self.calculate_statistics,
                description="""Calculate statistics for a specific column.
                Input: column name (string)
                Returns: descriptive statistics
                Example: calculate_statistics("revenue")"""
            ),
            Tool(
                name="create_visualization",
                func=lambda args: self.create_visualization(**eval(args)),
                description="""Create a data visualization.
                Input: JSON string with chart_type, x_column, y_column
                Example: '{"chart_type": "bar", "x_column": "product"}'"""
            ),
            Tool(
                name="execute_pandas_query",
                func=self.execute_pandas_query,
                description="""Execute a pandas operation on the dataset.
                Input: pandas code (string)
                Example: "df.groupby('category')['sales'].sum()"
                Use 'df' to reference the current dataset."""
            ),
        ]

# Initialize tools
data_tools = DataAnalysisTools()
tools = data_tools.get_langchain_tools()
```

### Step 2: Create the Agent

```python
from langchain.agents import create_react_agent, AgentExecutor
from langchain.prompts import PromptTemplate
from langchain_azure_ai.chat_models import AzureAIChatCompletionsModel
import os

# Initialize LLM
llm = AzureAIChatCompletionsModel(
    endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
    credential=os.environ["AZURE_INFERENCE_CREDENTIAL"],
    model="Meta-Llama-3.1-8B-Instruct",
    temperature=0,  # Low temp for consistent reasoning
)

# Create agent prompt
agent_prompt = PromptTemplate.from_template("""You are a data analysis assistant. Your job is to help users analyze datasets by using the available tools.

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
Thought: {agent_scratchpad}""")

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
    "input": """I have a sales dataset at './sales_q4.csv'. 
    Please analyze it and tell me:
    1. Total revenue
    2. Top 3 products by sales
    3. Create a bar chart of sales by product category"""
})

print(result['output'])
```

### Agent Execution Trace

```
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
Action Input: '{"chart_type": "bar", "x_column": "category"}'

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
```

## Advanced Agent Patterns

### Pattern 1: Memory-Enhanced Agent

Agents that remember previous interactions:

```python
from langchain.memory import ConversationBufferMemory
from langchain.agents import AgentExecutor

class MemoryEnhancedAgent:
    """Agent with conversational memory."""
    
    def __init__(self, llm, tools):
        # Add memory
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
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
        """Chat with memory of previous messages."""
        return self.executor.invoke({"input": message})

# Usage
memory_agent = MemoryEnhancedAgent(llm, tools)

# First message
memory_agent.chat("Load the sales data from sales_q4.csv")

# Follow-up (agent remembers context)
memory_agent.chat("What was the total revenue?")

# Another follow-up (still remembers)
memory_agent.chat("Show me the top products")
```

### Pattern 2: Human-in-the-Loop

For high-stakes decisions, require human approval:

```python
from langchain.agents import AgentExecutor
from langchain.callbacks import HumanApprovalCallbackHandler

class SafeAgent:
    """Agent that requires human approval for sensitive actions."""
    
    def __init__(self, llm, tools):
        # Define which tools need approval
        sensitive_tools = ["execute_pandas_query", "send_email"]
        
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
        """Execute task with human oversight."""
        return self.executor.invoke({"input": task})

# Usage
safe_agent = SafeAgent(llm, tools)

# This will prompt for approval before executing pandas code
result = safe_agent.run(
    "Calculate the average revenue per product"
)

# Console output:
# ⚠️  Agent wants to execute: execute_pandas_query
# Input: df.groupby('product')['revenue'].mean()
# Approve? (y/n): 
```

### Pattern 3: Multi-Agent Collaboration

Different agents with different specialties working together:

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator

class MultiAgentState(TypedDict):
    """Shared state across agents."""
    task: str
    data_loaded: bool
    analysis_complete: bool
    report_generated: bool
    results: Annotated[list, operator.add]

class MultiAgentSystem:
    """Coordinated multi-agent system."""
    
    def __init__(self):
        # Create specialized agents
        self.data_agent = self._create_data_agent()
        self.analysis_agent = self._create_analysis_agent()
        self.report_agent = self._create_report_agent()
        
        # Build collaboration graph
        self.graph = self._build_graph()
    
    def _create_data_agent(self):
        """Agent specialized in data loading and cleaning."""
        data_tools = [
            # Only data loading tools
        ]
        return create_react_agent(llm, data_tools, agent_prompt)
    
    def _create_analysis_agent(self):
        """Agent specialized in statistical analysis."""
        analysis_tools = [
            # Only analysis tools
        ]
        return create_react_agent(llm, analysis_tools, agent_prompt)
    
    def _create_report_agent(self):
        """Agent specialized in generating reports."""
        report_tools = [
            # Only reporting tools
        ]
        return create_react_agent(llm, report_tools, agent_prompt)
    
    def _build_graph(self):
        """Build agent collaboration workflow."""
        
        workflow = StateGraph(MultiAgentState)
        
        # Define agent nodes
        def data_node(state):
            result = self.data_agent.invoke(state['task'])
            return {
                "data_loaded": True,
                "results": [f"Data loaded: {result}"]
            }
        
        def analysis_node(state):
            result = self.analysis_agent.invoke(state['task'])
            return {
                "analysis_complete": True,
                "results": [f"Analysis: {result}"]
            }
        
        def report_node(state):
            result = self.report_agent.invoke({
                "results": state['results']
            })
            return {
                "report_generated": True,
                "results": [f"Report: {result}"]
            }
        
        # Add nodes
        workflow.add_node("data_agent", data_node)
        workflow.add_node("analysis_agent", analysis_node)
        workflow.add_node("report_agent", report_node)
        
        # Define workflow
        workflow.set_entry_point("data_agent")
        workflow.add_edge("data_agent", "analysis_agent")
        workflow.add_edge("analysis_agent", "report_agent")
        workflow.add_edge("report_agent", END)
        
        return workflow.compile()
    
    def execute(self, task: str):
        """Execute multi-agent workflow."""
        
        initial_state = {
            "task": task,
            "data_loaded": False,
            "analysis_complete": False,
            "report_generated": False,
            "results": [],
        }
        
        final_state = self.graph.invoke(initial_state)
        return final_state['results']

# Usage
multi_agent = MultiAgentSystem()
results = multi_agent.execute(
    "Analyze Q4 sales and create an executive summary"
)
```

## Production Safety Mechanisms

### 1. Output Validation

```python
from typing import Any, Optional
import re

class OutputValidator:
    """Validate agent outputs before execution."""
    
    def __init__(self):
        self.dangerous_patterns = [
            r'rm\s+-rf',  # Dangerous file operations
            r'DROP\s+TABLE',  # SQL injection
            r'eval\(',  # Code execution
            r'exec\(',
            r'__import__',
        ]
    
    def validate_tool_input(
        self,
        tool_name: str,
        input_str: str
    ) -> tuple[bool, Optional[str]]:
        """Check if tool input is safe."""
        
        # Check for dangerous patterns
        for pattern in self.dangerous_patterns:
            if re.search(pattern, input_str, re.IGNORECASE):
                return False, f"Blocked dangerous pattern: {pattern}"
        
        # Tool-specific validation
        if tool_name == "execute_pandas_query":
            # Only allow read operations
            write_ops = ['drop', 'delete', 'insert', 'update']
            if any(op in input_str.lower() for op in write_ops):
                return False, "Write operations not allowed"
        
        return True, None
    
    def validate_output(
        self,
        output: str,
        max_length: int = 10000
    ) -> tuple[bool, Optional[str]]:
        """Validate agent output."""
        
        if len(output) > max_length:
            return False, f"Output too long: {len(output)} chars"
        
        # Check for PII (simplified)
        pii_patterns = [
            r'\b\d{3}-\d{2}-\d{4}\b',  # SSN
            r'\b\d{16}\b',  # Credit card
        ]
        
        for pattern in pii_patterns:
            if re.search(pattern, output):
                return False, "Potential PII detected in output"
        
        return True, None

# Integrate with agent
validator = OutputValidator()

class SafeAgentExecutor(AgentExecutor):
    """Agent executor with safety checks."""
    
    def _call(self, inputs):
        """Override to add validation."""
        
        # Validate input
        is_safe, error = validator.validate_tool_input(
            tool_name="user_input",
            input_str=str(inputs)
        )
        
        if not is_safe:
            return {"output": f"Safety check failed: {error}"}
        
        # Execute normally
        result = super()._call(inputs)
        
        # Validate output
        is_safe, error = validator.validate_output(result['output'])
        
        if not is_safe:
            return {"output": f"Output validation failed: {error}"}
        
        return result
```

### 2. Cost Controls

```python
class CostController:
    """Prevent runaway agent costs."""
    
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
        """Check if agent can make another call."""
        
        # Check iteration limit
        if self.iterations >= self.max_iterations:
            return False, f"Max iterations ({self.max_iterations}) reached"
        
        # Check cost limit
        if self.total_cost >= self.max_cost:
            return False, f"Max cost (${self.max_cost}) exceeded"
        
        return True, None
    
    def record_call(self, tokens_used: int, cost: float):
        """Record call metrics."""
        self.iterations += 1
        self.total_cost += cost
    
    def reset(self):
        """Reset counters."""
        self.iterations = 0
        self.total_cost = 0.0

# Usage
cost_controller = CostController(max_total_cost=0.10)  # 10 cents max

def controlled_agent_call(task: str):
    """Agent call with cost control."""
    
    # Check if allowed
    allowed, error = cost_controller.check_before_call()
    if not allowed:
        return f"Agent stopped: {error}"
    
    # Execute
    result = agent_executor.invoke({"input": task})
    
    # Record cost (simplified)
    tokens = len(task.split()) * 2  # Rough estimate
    cost = tokens * 0.00001
    cost_controller.record_call(tokens, cost)
    
    return result
```

### 3. Monitoring and Observability

```python
from datetime import datetime
import json
from typing import Dict, List

class AgentMonitor:
    """Comprehensive agent monitoring."""
    
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
        """Start monitoring an agent execution."""
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
        """Log a single agent iteration."""
        
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
        """Complete a trace."""
        
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
        """Get summary statistics."""
        
        import statistics
        
        return {
            'total_executions': self.metrics['total_executions'],
            'success_rate': self.metrics['successful'] / max(self.metrics['total_executions'], 1),
            'avg_iterations': statistics.mean(self.metrics['avg_iterations']) if self.metrics['avg_iterations'] else 0,
            'tool_usage': self.metrics['tool_usage'],
        }
    
    def export_traces(self, filepath: str):
        """Export traces for analysis."""
        
        with open(filepath, 'w') as f:
            json.dump(self.traces, f, indent=2)

# Usage
monitor = AgentMonitor()

def monitored_agent_execution(task: str):
    """Execute agent with full monitoring."""
    
    trace_id = monitor.start_trace(task)
    
    try:
        # Custom agent executor that logs each iteration
        # (Implementation details omitted for brevity)
        
        result = agent_executor.invoke({"input": task})
        
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
print(f"Success rate: {summary['success_rate']:.1%}")
print(f"Avg iterations: {summary['avg_iterations']:.1f}")
print(f"Tool usage: {summary['tool_usage']}")
```

## Real-World Production Architecture

Here's how to deploy agentic systems at scale:

```
┌─────────────────────────────────────────────────────────┐
│                Production Agent System                  │
└─────────────────────────────────────────────────────────┘

                    ┌─────────────┐
                    │   API GW    │
                    │ Rate Limit  │
                    └──────┬──────┘
                           │
                ┌──────────┼──────────┐
                │          │          │
                ▼          ▼          ▼
         ┌──────────┐ ┌──────────┐ ┌──────────┐
         │ Agent    │ │ Agent    │ │ Agent    │
         │ Workers  │ │ Workers  │ │ Workers  │
         │ (K8s)    │ │ (K8s)    │ │ (K8s)    │
         └────┬─────┘ └────┬─────┘ └────┬─────┘
              │            │            │
              └────────────┼────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │ Tools    │ │ LLM      │ │ State    │
       │ Service  │ │ Provider │ │ Store    │
       │          │ │ (Azure)  │ │ (Redis)  │
       └──────────┘ └──────────┘ └──────────┘
              │            │            │
              └────────────┼────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   Monitoring    │
                  │ - Traces        │
                  │ - Metrics       │
                  │ - Alerts        │
                  └─────────────────┘
```

### Production Deployment Code

```python
from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import Optional
import asyncio

app = FastAPI(title="Production Agent API")

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

@app.post("/agent/execute", response_model=AgentResponse)
async def execute_agent(
    request: AgentRequest,
    background_tasks: BackgroundTasks
):
    """Execute agent task asynchronously."""
    
    import uuid
    task_id = str(uuid.uuid4())
    
    # Initialize result
    task_results[task_id] = {
        "status": "pending",
        "result": None,
    }
    
    # Execute in background
    background_tasks.add_task(
        run_agent_task,
        task_id,
        request,
    )
    
    return AgentResponse(
        task_id=task_id,
        status="pending",
    )

async def run_agent_task(task_id: str, request: AgentRequest):
    """Execute agent in background."""
    
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
                {"input": request.task}
            ),
            timeout=request.timeout_seconds
        )
        
        # Update result
        task_results[task_id] = {
            "status": "completed",
            "result": result['output'],
            "iterations": cost_controller.iterations,
        }
        
        monitor.end_trace(trace_id, "success", result['output'])
        
    except asyncio.TimeoutError:
        task_results[task_id] = {
            "status": "failed",
            "error": "Task exceeded timeout",
        }
        monitor.end_trace(trace_id, "failed", error="Timeout")
        
    except Exception as e:
        task_results[task_id] = {
            "status": "failed",
            "error": str(e),
        }
        monitor.end_trace(trace_id, "failed", error=str(e))

@app.get("/agent/status/{task_id}", response_model=AgentResponse)
async def get_task_status(task_id: str):
    """Check agent task status."""
    
    if task_id not in task_results:
        raise HTTPException(status_code=404, detail="Task not found")
    
    result = task_results[task_id]
    
    return AgentResponse(
        task_id=task_id,
        status=result['status'],
        result=result.get('result'),
        iterations_used=result.get('iterations', 0),
        error=result.get('error'),
    )

# Run with: uvicorn app:app --workers 4
```

## Key Lessons from Production Deployments

### 1. Agents Fail (A Lot)

**Problem**: Production agents encounter edge cases that break them.
**Solution**: Implement robust error handling and fallbacks.

```python
def resilient_agent_call(task: str, max_retries: int = 3):
    """Agent call with automatic retries and fallbacks."""
    
    for attempt in range(max_retries):
        try:
            return agent_executor.invoke({"input": task})
        
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"Attempt {attempt + 1} failed, retrying...")
                continue
            else:
                # Fall back to simple LLM call
                return {
                    "output": llm.invoke(task).content,
                    "fallback": True,
                }
```

### 2. Infinite Loops Are Real

**Problem**: Agents can get stuck in reasoning loops.
**Solution**: Enforce strict iteration limits and timeout.

```python
# Always set max_iterations
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    max_iterations=10,  # Hard limit
    max_execution_time=60,  # 60 second timeout
)
```

### 3. Prompt Engineering Matters More

**Problem**: Generic prompts lead to unreliable behavior.
**Solution**: Craft task-specific prompts with examples.

```python
task_specific_prompt = """You are a data analyst agent.

Your job: Analyze datasets and answer questions.

Key rules:
1. Always load data before analyzing
2. Verify column names before calculations
3. Handle missing data gracefully
4. Explain your reasoning
5. If unsure, ask for clarification

Example workflow:
User: "What's the average revenue?"
1. Load data
2. Check if 'revenue' column exists
3. Calculate average
4. Report result with context

Now begin:
{input}"""
```

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
