# LLMOps: Engineering Production-Grade AI Systems That Actually Work

## Introduction: From Prototype to Production Reality

You've built an amazing AI prototype. It works perfectly on your laptop, impresses stakeholders in demos, and passes all your test cases. Then you deploy it to production, and reality hits: costs spiral out of control, responses slow to a crawl, the model starts hallucinating on edge cases, and you have no idea why. Welcome to the world of LLMOps.

Large Language Model Operations (LLMOps) is the practice of reliably deploying, monitoring, and maintaining LLM applications in production. It's MLOps adapted for the unique challenges of foundation models: unpredictable outputs, massive scale, sky-high costs, and the constant need for iteration.

In 2025, companies that master LLMOps are shipping AI features 10x faster than their competitors while spending 50% less on infrastructure. This isn't magic; it's engineering discipline.

In this comprehensive guide, you'll learn how to build production LLM systems using Python, LangChain, Azure AI Foundry, and industry-proven practices. We'll cover everything from deployment pipelines to cost optimization, monitoring strategies to incident response.

## The LLMOps Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│                    LLMOps Lifecycle                     │
└─────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│              │      │              │      │              │
│ DEVELOPMENT  │─────▶│  DEPLOYMENT  │─────▶│  MONITORING  │
│              │      │              │      │              │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                     │                     │
       │  • Prompt Engineering                    │
       │  • Model Selection    • CI/CD Pipelines  │
       │  • Eval Datasets      • A/B Testing      │
       │  • Version Control    • Canary Deploys   │
       │                       • Rollbacks         │
       │                                           │
       │                                           │
       │              ┌──────────────┐            │
       │              │              │            │
       └──────────────│ OPTIMIZATION │◀───────────┘
                      │              │
                      └──────────────┘
                      
                      • Cost Tracking
                      • Performance Tuning
                      • Prompt Refinement
                      • Model Updates
```

Let's build each component systematically.

## Phase 1: Development - Building Quality Foundations

### Prompt Engineering as Code

In production LLMOps, prompts are treated like code: versioned, tested, and deployed systematically.

```python
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
```

### Evaluation Framework

Production systems need systematic evaluation, not gut feelings.

```python
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
```

### Model Selection Strategy

Choosing the right model is crucial for cost and performance:

```python
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
```

## Phase 2: Deployment - Getting to Production

### CI/CD Pipeline for LLM Applications

```python
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
            print("✗ Canary failed - rolling back")
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
```

### Feature Flags for A/B Testing

```python
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
```

## Phase 3: Monitoring - Know What's Happening

### Comprehensive Observability

```python
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
            f.write(json.dumps(trace.to_dict()) + '\n')
    
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
            alerts.append(f"HIGH_COST: ${metrics['avg_cost_per_request']:.3f}/request")
        
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
        print(f"\n🚨 Alerts:")
        for alert in alerts:
            print(f"  {alert}")
            # Send to alerting system (PagerDuty, Slack, etc.)

# Run every 5 minutes
import schedule
schedule.every(5).minutes.do(run_monitoring_check)
```

### Dashboard Metrics

Key metrics to track in your monitoring dashboard:

```python
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
```

## Phase 4: Optimization - Getting Better Over Time

### Cost Optimization Strategies

```python
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
```

### Prompt Optimization Through Data

```python
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
```

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

```python
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
```

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
