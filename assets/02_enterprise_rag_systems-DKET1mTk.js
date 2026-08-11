const l="5",e="enterprise-rag-systems-guide",n="Building Enterprise-Grade RAG Systems: From Prototype to Production",t="A comprehensive guide to building scalable, reliable RAG systems using LangChain, Azure AI Foundry, and hybrid search techniques for production environments.",r=`# Building Enterprise-Grade RAG Systems: From Prototype to Production

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
                "\\
\\
\\
",  # Document sections
                "\\
\\
",    # Paragraphs
                "\\
",      # Lines
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
                    'chunk_id': f\\\\"{doc.metadata['file_name']}_chunk_{i}\\\\",
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
        context_header = f\\\\"Document: {file_name}\\
\\
\\\\"
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
    endpoint=os.environ[\\\\"AZURE_INFERENCE_ENDPOINT\\\\"],
    credential=os.environ[\\\\"AZURE_INFERENCE_CREDENTIAL\\\\"],
    model=\\\\"text-embedding-3-large\\\\",  # or any embedding model from Azure
)

# Test the embeddings
test_embedding = embeddings.embed_query(\\\\"Hello world\\\\")
print(f\\\\"Embedding dimension: {len(test_embedding)}\\\\")
\`\`\`

### Local Vector Store (FAISS)

Perfect for development and small-scale deployments:

\`\`\`python
from langchain_community.vectorstores import FAISS

def create_faiss_vectorstore(
    chunks: List[Document],
    embeddings,
    persist_directory: str = \\\\"./vectorstore\\\\"
):
    \\\\"\\\\"\\\\"Create and persist FAISS vector store.\\\\"\\\\"\\\\"
    
    print(\\\\"Creating vector embeddings...\\\\")
    vectorstore = FAISS.from_documents(
        documents=chunks,
        embedding=embeddings,
    )
    
    # Save for later use
    vectorstore.save_local(persist_directory)
    print(f\\\\"Vector store saved to {persist_directory}\\\\")
    
    return vectorstore

# Create vector store
vectorstore = create_faiss_vectorstore(chunks, embeddings)

# Load existing vector store
# vectorstore = FAISS.load_local(\\\\"./vectorstore\\\\", embeddings)
\`\`\`

### Production Vector Store (Azure Cosmos DB)

For production deployments with millions of documents:

\`\`\`python
from langchain_azure_ai.vectorstores import AzureCosmosDBNoSqlVectorSearch
from azure.cosmos import CosmosClient

# Initialize Cosmos DB client
cosmos_client = CosmosClient(
    url=os.environ[\\\\"COSMOS_ENDPOINT\\\\"],
    credential=os.environ[\\\\"COSMOS_KEY\\\\"]
)

# Define vector embedding policy
vector_embedding_policy = {
    \\\\"vectorEmbeddings\\\\": [
        {
            \\\\"path\\\\": \\\\"/embedding\\\\",
            \\\\"dataType\\\\": \\\\"float32\\\\",
            \\\\"dimensions\\\\": 1536,  # Match your embedding model
            \\\\"distanceFunction\\\\": \\\\"cosine\\\\"
        }
    ]
}

# Create vector store
cosmos_vectorstore = AzureCosmosDBNoSqlVectorSearch.from_documents(
    documents=chunks,
    embedding=embeddings,
    cosmos_client=cosmos_client,
    database_name=\\\\"knowledge_base\\\\",
    container_name=\\\\"documents\\\\",
    vector_embedding_policy=vector_embedding_policy,
)
\`\`\`

## Step 3: Hybrid Search - The Secret Sauce

Dense vector search alone isn't enough. Production systems combine multiple retrieval strategies:

\`\`\`python
from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever

class HybridRetriever:
    \\\\"\\\\"\\\\"Combines dense and sparse retrieval.\\\\"\\\\"\\\\"
    
    def __init__(
        self,
        vectorstore,
        documents: List[Document],
        dense_weight: float = 0.7,
    ):
        # Dense retriever (vector search)
        self.dense_retriever = vectorstore.as_retriever(
            search_kwargs={\\\\"k\\\\": 10}
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
        \\\\"\\\\"\\\\"Hybrid retrieval with both methods.\\\\"\\\\"\\\\"
        return self.ensemble_retriever.get_relevant_documents(query)[:k]

# Create hybrid retriever
hybrid_retriever = HybridRetriever(vectorstore, chunks)

# Test retrieval
results = hybrid_retriever.retrieve(
    \\\\"What are the system requirements for installation?\\\\"
)

for i, doc in enumerate(results):
    print(f\\\\"\\
--- Result {i+1} ---\\\\")
    print(f\\\\"Source: {doc.metadata['source']}\\\\")
    print(f\\\\"Content: {doc.page_content[:200]}...\\\\")
\`\`\`

## Step 4: Reranking for Precision

After initial retrieval, rerank results for better relevance:

\`\`\`python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

class RerankedRetriever:
    \\\\"\\\\"\\\\"Add LLM-based reranking for better precision.\\\\"\\\\"\\\\"
    
    def __init__(self, base_retriever, llm):
        # Create compressor/reranker
        compressor = LLMChainExtractor.from_llm(llm)
        
        # Wrap base retriever with compression
        self.retriever = ContextualCompressionRetriever(
            base_compressor=compressor,
            base_retriever=base_retriever
        )
    
    def retrieve(self, query: str) -> List[Document]:
        \\\\"\\\\"\\\\"Retrieve and rerank documents.\\\\"\\\\"\\\\"
        return self.retriever.get_relevant_documents(query)

# Add reranking
from langchain_azure_ai.chat_models import AzureAIChatCompletionsModel

llm = AzureAIChatCompletionsModel(
    endpoint=os.environ[\\\\"AZURE_INFERENCE_ENDPOINT\\\\"],
    credential=os.environ[\\\\"AZURE_INFERENCE_CREDENTIAL\\\\"],
    model=\\\\"Mistral-7B-Instruct-v0.3\\\\",
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
rag_prompt_template = \\\\"\\\\"\\\\"You are a helpful assistant answering questions based on provided documentation.

Use the following pieces of context to answer the question at the end.

Guidelines:
- If you don't know the answer, say so - don't make up information
- Always cite which document(s) you used
- Be concise but thorough
- If the context doesn't contain enough information, acknowledge what's missing

Context:
{context}

Question: {question}

Answer:\\\\"\\\\"\\\\"

RAG_PROMPT = PromptTemplate(
    template=rag_prompt_template,
    input_variables=[\\\\"context\\\\", \\\\"question\\\\"]
)

# Create the RAG chain
rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type=\\\\"stuff\\\\",  # or \\\\"map_reduce\\\\" for longer contexts
    retriever=reranked_retriever.retriever,
    return_source_documents=True,
    chain_type_kwargs={\\\\"prompt\\\\": RAG_PROMPT}
)

# Query the system
def query_rag_system(question: str):
    \\\\"\\\\"\\\\"Query the RAG system and display results.\\\\"\\\\"\\\\"
    
    result = rag_chain({\\\\"query\\\\": question})
    
    print(f\\\\"\\
Question: {question}\\\\")
    print(f\\\\"\\
Answer: {result['result']}\\\\")
    print(f\\\\"\\
Sources:\\\\")
    for i, doc in enumerate(result['source_documents']):
        print(f\\\\"{i+1}. {doc.metadata['source']}\\\\")

# Example usage
query_rag_system(\\\\"What are the installation requirements?\\\\")
\`\`\`

## Step 6: Advanced RAG Patterns

### Query Transformation

Sometimes user queries need refinement before retrieval:

\`\`\`python
from langchain.chains import LLMChain

query_refinement_prompt = PromptTemplate(
    input_variables=[\\\\"question\\\\"],
    template=\\\\"\\\\"\\\\"Given this user question, generate 3 different phrasings 
    that would help retrieve relevant information:
    
    Original: {question}
    
    Variations:
    1.\\\\"\\\\"\\\\"
)

def multi_query_retrieval(question: str, retriever):
    \\\\"\\\\"\\\\"Retrieve using multiple query variations.\\\\"\\\\"\\\\"
    
    # Generate query variations
    refine_chain = LLMChain(llm=llm, prompt=query_refinement_prompt)
    variations = refine_chain.run(question)
    
    all_docs = []
    queries = [question] + variations.split('\\
')
    
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
    \\\\"\\\\"\\\\"Use HyDE for better retrieval.\\\\"\\\\"\\\\"
    
    hyde_prompt = PromptTemplate(
        input_variables=[\\\\"question\\\\"],
        template=\\\\"\\\\"\\\\"Write a detailed paragraph that would answer this question:
        
        {question}
        
        Answer:\\\\"\\\\"\\\\"
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
    \\\\"\\\\"\\\\"Monitor RAG system performance.\\\\"\\\\"\\\\"
    
    def __init__(self, log_file: str = \\\\"rag_metrics.jsonl\\\\"):
        self.log_file = log_file
    
    def log_query(
        self,
        query: str,
        answer: str,
        sources: List[str],
        latency: float,
        relevance_score: float = None,
    ):
        \\\\"\\\\"\\\\"Log query metrics.\\\\"\\\\"\\\\"
        
        metrics = {
            \\\\"timestamp\\\\": datetime.now().isoformat(),
            \\\\"query\\\\": query,
            \\\\"answer_length\\\\": len(answer),
            \\\\"num_sources\\\\": len(sources),
            \\\\"latency_ms\\\\": latency * 1000,
            \\\\"relevance_score\\\\": relevance_score,
        }
        
        with open(self.log_file, 'a') as f:
            f.write(json.dumps(metrics) + '\\
')
    
    def evaluate_retrieval_quality(
        self,
        query: str,
        retrieved_docs: List[Document],
        ground_truth_docs: List[str] = None,
    ) -> Dict[str, float]:
        \\\\"\\\\"\\\\"Evaluate retrieval quality.\\\\"\\\\"\\\\"
        
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
    \\\\"\\\\"\\\\"RAG query with monitoring.\\\\"\\\\"\\\\"
    
    import time
    start_time = time.time()
    
    result = rag_chain({\\\\"query\\\\": question})
    
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
    \\\\"\\\\"\\\\"Verify answer is grounded in context.\\\\"\\\\"\\\\"
    
    verification_prompt = PromptTemplate(
        input_variables=[\\\\"answer\\\\", \\\\"context\\\\"],
        template=\\\\"\\\\"\\\\"Given the following context and answer, determine if the answer 
        is fully supported by the context.
        
        Context: {context}
        
        Answer: {answer}
        
        Is this answer fully grounded in the context? Answer only YES or NO.\\\\"\\\\"\\\\"
    )
    
    chain = LLMChain(llm=llm, prompt=verification_prompt)
    result = chain.run(answer=answer, context=context)
    
    return \\\\"YES\\\\" in result.upper()

# Usage in RAG chain
def safe_rag_query(question: str):
    \\\\"\\\\"\\\\"RAG with hallucination checking.\\\\"\\\\"\\\\"
    
    result = rag_chain({\\\\"query\\\\": question})
    
    # Combine context from source documents
    context = \\\\"\\
\\
\\\\".join([
        doc.page_content for doc in result['source_documents']
    ])
    
    # Check for hallucinations
    is_grounded = check_hallucination(
        result['result'],
        context,
        llm
    )
    
    if not is_grounded:
        print(\\\\"⚠️  Warning: Potential hallucination detected\\\\")
        # Could trigger human review, return warning, etc.
    
    return result
\`\`\`

## Step 8: Optimizing for Scale

### Caching Strategy

\`\`\`python
from functools import lru_cache
import hashlib

class RAGCache:
    \\\\"\\\\"\\\\"Cache for RAG queries and embeddings.\\\\"\\\\"\\\\"
    
    def __init__(self):
        self.query_cache = {}
        self.embedding_cache = {}
    
    def get_cached_query(self, query: str):
        \\\\"\\\\"\\\\"Retrieve cached query result.\\\\"\\\\"\\\\"
        query_hash = hashlib.md5(query.encode()).hexdigest()
        return self.query_cache.get(query_hash)
    
    def cache_query(self, query: str, result):
        \\\\"\\\\"\\\\"Cache query result.\\\\"\\\\"\\\\"
        query_hash = hashlib.md5(query.encode()).hexdigest()
        self.query_cache[query_hash] = result
    
    @lru_cache(maxsize=10000)
    def get_embedding(self, text: str):
        \\\\"\\\\"\\\\"Cache embeddings.\\\\"\\\\"\\\\"
        return embeddings.embed_query(text)

cache = RAGCache()

# Cached retrieval
def cached_rag_query(question: str):
    \\\\"\\\\"\\\\"RAG query with caching.\\\\"\\\\"\\\\"
    
    # Check cache first
    cached_result = cache.get_cached_query(question)
    if cached_result:
        print(\\\\"✓ Cache hit\\\\")
        return cached_result
    
    # Execute query
    result = rag_chain({\\\\"query\\\\": question})
    
    # Cache for future
    cache.cache_query(question, result)
    
    return result
\`\`\`

### Batch Processing

For high-volume scenarios:

\`\`\`python
async def batch_rag_queries(questions: List[str]):
    \\\\"\\\\"\\\\"Process multiple queries efficiently.\\\\"\\\\"\\\\"
    
    import asyncio
    
    async def async_query(q):
        # Use async LLM client in production
        return rag_chain({\\\\"query\\\\": q})
    
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

app = FastAPI(title=\\\\"Enterprise RAG API\\\\")

class QueryRequest(BaseModel):
    question: str
    max_sources: int = 5
    temperature: float = 0.7

class QueryResponse(BaseModel):
    answer: str
    sources: List[str]
    confidence: float
    latency_ms: float

@app.post(\\\\"/query\\\\", response_model=QueryResponse)
async def query_endpoint(request: QueryRequest):
    \\\\"\\\\"\\\\"Main RAG query endpoint.\\\\"\\\\"\\\\"
    
    try:
        import time
        start = time.time()
        
        # Execute RAG query
        result = rag_chain({
            \\\\"query\\\\": request.question
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

@app.get(\\\\"/health\\\\")
async def health_check():
    \\\\"\\\\"\\\\"Health check endpoint.\\\\"\\\\"\\\\"
    return {\\\\"status\\\\": \\\\"healthy\\\\", \\\\"version\\\\": \\\\"1.0.0\\\\"}

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

\`\`\`react-flow
{
  "title": "RAG Success Metrics & Targets",
  "height": "450px",
  "nodes": [
    { "id": "quality", "data": { "label": "QUALITY METRICS" }, "position": { "x": 0, "y": 0 }, "style": { "width": 260, "height": 180, "backgroundColor": "rgba(59, 130, 246, 0.05)", "border": "2px dashed rgba(59, 130, 246, 0.3)" }, "type": "group" },
    { "id": "perf", "data": { "label": "PERFORMANCE METRICS" }, "position": { "x": 300, "y": 0 }, "style": { "width": 260, "height": 180, "backgroundColor": "rgba(16, 185, 129, 0.05)", "border": "2px dashed rgba(16, 185, 129, 0.3)" }, "type": "group" },
    { "id": "user", "data": { "label": "USER METRICS" }, "position": { "x": 150, "y": 220 }, "style": { "width": 260, "height": 100, "backgroundColor": "rgba(212, 163, 115, 0.05)", "border": "2px dashed rgba(212, 163, 115, 0.3)" }, "type": "group" },
    
    { "id": "q1", "data": { "label": "Relevance: >4/5" }, "position": { "x": 10, "y": 50 }, "parentId": "quality", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },
    { "id": "q2", "data": { "label": "Recall: >80%" }, "position": { "x": 10, "y": 110 }, "parentId": "quality", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },

    { "id": "p1", "data": { "label": "Latency (p95): <2s" }, "position": { "x": 10, "y": 50 }, "parentId": "perf", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },
    { "id": "p2", "data": { "label": "Hallucination: <5%" }, "position": { "x": 10, "y": 110 }, "parentId": "perf", "extent": "parent", "className": "bg-white dark:bg-black text-[10px]" },

    { "id": "u1", "data": { "label": "Satisfaction: >85%" }, "position": { "x": 10, "y": 40 }, "parentId": "user", "extent": "parent", "className": "bg-white dark:bg-black text-[10px] font-bold" }
  ],
  "edges": [
    { "id": "e1", "source": "q1", "target": "u1", "animated": true },
    { "id": "e2", "source": "p2", "target": "u1", "animated": true }
  ]
}
\`\`\`

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
`,o="2026-02-20",u=12,i={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},a="AI/ML",s=["RAG","LangChain","Azure AI","Vector DB"],c="/blog/enterprise-rag.png",d=!1,p={id:"5",slug:e,title:n,excerpt:t,content:r,publishedAt:o,readTime:12,author:i,category:a,tags:s,featuredImage:c,featured:d};export{i as author,a as category,r as content,p as default,t as excerpt,d as featured,c as featuredImage,l as id,o as publishedAt,u as readTime,e as slug,s as tags,n as title};
