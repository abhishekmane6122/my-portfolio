# AEGIS Platform - Complete System Architecture & Process Flow

## 📋 Executive Summary

**AEGIS** (Advanced Enterprise Governance & Intelligence System) is a comprehensive regulatory compliance and financial analysis platform built for **Adani Green Energy Limited**. The platform monitors regulatory notifications from BSE, SEBI, and RBI, manages insider trading surveillance, handles directors' disclosure documentation, automates meeting minutes generation, and provides AI-powered insights through a conversational chatbot.

---

## 🏗️ System Architecture Overview

### High-Level System Architecture

```mermaid
flowchart TB
    subgraph CLIENT["🖥️ CLIENT TIER"]
        Browser["Web Browser"]
        subgraph ReactApp["React 18 + TypeScript + Vite"]
            Router["React Router DOM"]
            QueryClient["TanStack Query"]
            UI["shadcn/ui + TailwindCSS"]
        end
    end
    
    subgraph SERVER["⚙️ SERVER TIER"]
        subgraph FastAPIServer["FastAPI Backend - Python"]
            MainServer["fastapi_server.py<br/>Port 8000"]
            Routes["Route Handlers"]
            LLMUtils["LLM Utilities"]
        end
        
        subgraph ChatbotBackend["Chatbot Backend - 4-Layer RAG"]
            Orchestrator["Chat Orchestrator"]
            LLMLayer["LLM Layer"]
            IndexingLayer["Indexing Layer"]
            DataLayer["Data Layer"]
        end
    end
    
    subgraph DATA["💾 DATA TIER"]
        subgraph PostgreSQLDatabases["PostgreSQL Databases"]
            NotificationsDB[("notifications")]
            SEBIDB[("sebi_excel_master")]
            RBIDB[("rbi")]
            DirectorsDB[("directors")]
            DirectorsDataDB[("directors_data")]
            FamilyDB[("director_family_information")]
            ProfileDB[("directors_profile")]
            PlacesDB[("places")]
            VisitsDB[("visits")]
        end
        
        subgraph FileStorage["File Storage"]
            DisclosureDocs["Directors Discloser Output/"]
            Templates["templates/"]
            AIMomOutput["ai_assistant_mom/"]
            InsiderData["AdaniInsiderTraders/"]
        end
    end
    
    subgraph EXTERNAL["🌐 EXTERNAL SERVICES"]
        AzureOpenAI["Azure OpenAI<br/>GPT-4 / GPT-4o"]
    end
    
    Browser -->|"HTTP Request"| ReactApp
    ReactApp -->|"API Calls"| MainServer
    MainServer -->|"Route"| Routes
    Routes -->|"Query"| ChatbotBackend
    Routes -->|"SQL Query"| PostgreSQLDatabases
    Routes -->|"File I/O"| FileStorage
    LLMUtils -->|"API Request"| AzureOpenAI
    AzureOpenAI -->|"AI Response"| LLMUtils
    LLMLayer -->|"API Request"| AzureOpenAI
    AzureOpenAI -->|"AI Response"| LLMLayer
    DataLayer -->|"SQL Query"| PostgreSQLDatabases
    PostgreSQLDatabases -->|"Result Set"| DataLayer
```

---

## 📁 Complete Repository Structure

### Root Directory Structure

```mermaid
flowchart LR
    subgraph ROOT["📂 Share_Updated_Aegis"]
        SRC["src/<br/>Frontend React App"]
        AEGIS["Backend/aegis_backend/<br/>FastAPI Server"]
        CHATBOT["chatbot_backend/<br/>4-Layer RAG Chatbot"]
        ARCH["Architecture/<br/>Documentation"]
        KT["Knowledge_Transfer_Documents/"]
        DIST["dist/<br/>Production Build"]
        PKG["package.json<br/>Node Dependencies"]
        ENV[".env<br/>Environment Config"]
    end
    
    SRC -->|"imports"| PKG
    AEGIS -->|"uses"| ENV
    CHATBOT -->|"uses"| ENV
    
    style SRC fill:#61DAFB,color:#000
    style AEGIS fill:#009688,color:#fff
    style CHATBOT fill:#FF6B6B,color:#fff
    style ARCH fill:#FFD93D,color:#000
```

### Detailed File Tree

```
📂 Share_Updated_Aegis/
├── 📄 .env                              # Environment variables (API keys)
├── 📄 package.json                       # NPM dependencies & scripts
├── 📄 vite.config.ts                     # Vite build configuration
├── 📄 tailwind.config.ts                 # TailwindCSS configuration
├── 📄 tsconfig.json                      # TypeScript configuration
├── 📄 index.html                         # HTML entry point
│
├── 📂 src/                               # FRONTEND (React 18)
│   ├── 📄 main.tsx                       # Application entry point
│   ├── 📄 App.tsx                        # Router configuration
│   ├── 📄 index.css                      # Global styles
│   │
│   ├── 📂 pages/                         # PAGE COMPONENTS
│   │   ├── 📄 LandingPage.tsx            # Home page (6 products)
│   │   ├── 📄 Dashboard.tsx              # BSE main dashboard
│   │   ├── 📄 SEBIDashboard.tsx          # SEBI dashboard
│   │   ├── 📄 RBIDashboard.tsx           # RBI dashboard
│   │   ├── 📄 InsiderTrading.tsx         # Insider trading module
│   │   ├── 📄 DirectorsDisclosure.tsx    # Directors disclosure hub
│   │   ├── 📄 MinutesPreparation.tsx     # Minutes generator hub
│   │   ├── 📄 TotalNotifications.tsx     # BSE notifications list
│   │   ├── 📄 EmailData.tsx              # Email data view
│   │   ├── 📄 WeeklyAnalysis.tsx         # Weekly trends
│   │   │
│   │   ├── 📂 DirectorsDisclosure/       # Sub-module pages
│   │   │   ├── 📄 DirectorsDisclosureMasterData.tsx
│   │   │   ├── 📄 DirectorsDisclosureAnalytics.tsx
│   │   │   ├── 📄 DirectorsDisclosureDataSource.tsx
│   │   │   ├── 📄 DirectorsDisclosureCompaniesMasterData.tsx
│   │   │   └── 📄 FamilyInfoModal.tsx
│   │   │
│   │   ├── 📂 minutes-preparation/       # Minutes sub-pages
│   │   │   ├── 📄 FormBasedGenerator.tsx
│   │   │   ├── 📄 AIAssistant.tsx
│   │   │   ├── 📄 Templates.tsx
│   │   │   └── 📄 TemplateRenderer.tsx
│   │   │
│   │   └── 📂 InsiderTrading/            # Insider trading sub-pages
│   │
│   ├── 📂 components/                    # REUSABLE COMPONENTS
│   │   ├── 📄 ChatbotFab.tsx             # Floating AI chatbot
│   │   ├── 📄 DirectorSelector.tsx       # Director picker
│   │   ├── 📄 PlaceSelector.tsx          # Venue picker
│   │   ├── 📄 Stepper.tsx                # Step wizard
│   │   │
│   │   ├── 📂 ui/                        # shadcn/ui components (51 files)
│   │   ├── 📂 layout/                    # Layout components
│   │   └── 📂 charts/                    # Chart components (Recharts)
│   │
│   ├── 📂 services/                      # API SERVICE LAYER
│   │   ├── 📄 bseService.ts              # BSE API calls
│   │   ├── 📄 rbiService.ts              # RBI API calls
│   │   └── 📄 sharePointService.ts       # SharePoint integration
│   │
│   ├── 📂 hooks/                         # CUSTOM HOOKS
│   ├── 📂 utils/                         # UTILITIES
│   └── 📂 types/                         # TypeScript types
│
├── Backend/
│   ├── Backend/aegis_backend/                     # BACKEND (FastAPI)
│   ├── 📄 fastapi_server.py              # Main FastAPI app
│   ├── 📄 llm_utils.py                   # LLM utilities
│   │
│   ├── 📂 routes/                        # API ROUTE HANDLERS
│   │   ├── 📄 health.py                  # Health check
│   │   ├── 📄 bse.py                     # BSE notifications
│   │   ├── 📄 sebi.py                    # SEBI data
│   │   ├── 📄 rbi.py                     # RBI data
│   │   ├── 📄 directors_disclosure.py    # Disclosure management (1320 lines)
│   │   ├── 📄 insider_trading.py         # Insider trading (558 lines)
│   │   ├── 📄 minutes.py                 # Template-based minutes
│   │   ├── 📄 ai_assistant.py            # AI transcript processing (867 lines)
│   │   ├── 📄 chat.py                    # Chatbot API bridge
│   │   └── 📄 EnhancedIndianNameMatcher.py
│   │
│   ├── 📂 public/                        # STATIC FILES & DATABASES
│   │   ├── 📂 Directors Discloser Output/  # 195 DOCX files
│   │   ├── 📂 templates/                   # 16 meeting templates
│   │   ├── 📂 ai_assistant_mom/            # 141 AI-generated outputs
│   │   └── 📂 AdaniInsiderTraders/         # Insider trading data
│   │
│   └── 📂 utils/
│
├── 📂 chatbot_backend/                   # CHATBOT (4-Layer RAG)
│   ├── 📂 chat_orchestrator/             # LAYER 4: Orchestration
│   │   ├── 📄 orchestrator.py            # Query routing & response
│   │   └── 📄 router_logic.py            # Query classification
│   │
│   ├── 📂 llm_layer/                     # LAYER 3: LLM Integration
│   │   └── 📄 llm_client.py              # Azure OpenAI client
│   │
│   ├── 📂 indexing_layer/                # LAYER 2: Search/Indexing
│   │   └── 📄 embedding_index.py         # Semantic search
│   │
│   ├── 📂 data_layer/                    # LAYER 1: Data Access
│   │   ├── 📄 models.py
│   │   └── 📄 db_models.py               # SQLAlchemy models
│   │
│   ├── 📂 config/                        # LLM Configuration
│   │   └── 📄 llm_config.py
│   │
│   └── 📂 configs/                       # Domain-specific configs
│       ├── 📂 bse/
│       ├── 📂 sebi/
│       └── 📂 rbi/
│
└── 📂 Architecture/                      # DOCUMENTATION
    ├── 📄 Problem_Statement.md
    ├── 📄 Directors_Disclosure_Architecture.md
    ├── 📄 Minutes_Generation_Architecture.md
    └── 📄 AEGIS_Complete_Architecture.md  (this file)
```

---

## 🔄 Application Process Flows

### 1. Application Startup Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Vite
    participant React
    participant FastAPI
    participant PostgreSQL
    
    User->>Browser: Open http://localhost:5173
    Browser->>Vite: Request index.html
    Vite->>Browser: Serve React bundle
    Browser->>React: Initialize App
    React->>React: Setup QueryClient
    React->>React: Initialize Router
    React->>Browser: Render LandingPage
    
    Note over FastAPI,PostgreSQL: Backend runs on port 8000
    FastAPI->>PostgreSQL: Initialize database connections
    PostgreSQL-->>FastAPI: Connection established
    FastAPI->>FastAPI: Register all routers
    FastAPI->>FastAPI: Configure CORS
    FastAPI->>FastAPI: Mount static files
    FastAPI-->>User: Server ready
```

### 2. Complete Request-Response Flow

```mermaid
flowchart TB
    subgraph Frontend["Frontend - React"]
        Page["Page Component"]
        Service["Service Layer"]
        QueryClient["TanStack Query"]
    end
    
    subgraph Backend["Backend - FastAPI"]
        Router["Route Handler"]
        Business["Business Logic"]
        LLM["LLM Utils"]
    end
    
    subgraph Database["PostgreSQL"]
        DB[("Database")]
    end
    
    subgraph External["Azure Cloud"]
        AzureAI["Azure OpenAI"]
    end
    
    Page -->|"1. useQuery()"| QueryClient
    QueryClient -->|"2. fetch()"| Service
    Service -->|"3. HTTP Request"| Router
    Router -->|"4. Process"| Business
    Business -->|"5. SQL Query"| DB
    DB -->|"6. Result Set"| Business
    Business -->|"7. LLM Call"| LLM
    LLM -->|"8. API Request"| AzureAI
    AzureAI -->|"9. AI Response"| LLM
    LLM -->|"10. Processed"| Business
    Business -->|"11. Format Response"| Router
    Router -->|"12. JSON"| Service
    Service -->|"13. Data"| QueryClient
    QueryClient -->|"14. Re-render"| Page
```

---

## 🧩 Six Product Modules - Detailed Architecture

### Module Overview Flow

```mermaid
flowchart TB
    Landing["🏠 Landing Page<br/>/"]
    
    Landing -->|"Navigate"| BSE["📊 BSE Analysis<br/>/bse-alerts"]
    Landing -->|"Navigate"| RBI["🏦 RBI Analysis<br/>/rbi-dashboard"]
    Landing -->|"Navigate"| SEBI["📈 SEBI Analysis<br/>/sebi-dashboard"]
    Landing -->|"Navigate"| Insider["🔍 Insider Trading<br/>/insider-trading"]
    Landing -->|"Navigate"| Directors["👔 Directors Disclosure<br/>/directors-disclosure"]
    Landing -->|"Navigate"| Minutes["📝 Minutes Generator<br/>/minutes-preparation"]
    
    BSE -->|"Sub-route"| BSE1["/notifications"]
    BSE -->|"Sub-route"| BSE2["/emaildata"]
    BSE -->|"Sub-route"| BSE3["/websitedata"]
    BSE -->|"Sub-route"| BSE4["/weekly-analysis"]
    
    Directors -->|"Sub-route"| D1["/master-data"]
    Directors -->|"Sub-route"| D2["/analytics"]
    Directors -->|"Sub-route"| D3["/data-source"]
    Directors -->|"Sub-route"| D4["/companies-master-data"]
    
    Minutes -->|"Sub-route"| M1["/form-generator"]
    Minutes -->|"Sub-route"| M2["/ai-assistant"]
    Minutes -->|"Sub-route"| M3["/directors"]
    
    style Landing fill:#4CAF50,color:white
    style BSE fill:#2196F3,color:white
    style RBI fill:#9C27B0,color:white
    style SEBI fill:#FF9800,color:white
    style Insider fill:#E91E63,color:white
    style Directors fill:#00BCD4,color:white
    style Minutes fill:#795548,color:white
```

---

### Product 1: BSE Analysis Flow

```mermaid
flowchart TB
    subgraph Frontend["Frontend Layer"]
        Dashboard["Dashboard.tsx"]
        Notifications["TotalNotifications.tsx"]
        Email["EmailData.tsx"]
        Charts["Recharts Components"]
    end
    
    subgraph API["API Layer"]
        BSERoute["routes/bse.py"]
    end
    
    subgraph Database["Database Layer"]
        NotifDB[("PostgreSQL<br/>notifications<br/>Table: DailyLogs")]
    end
    
    Dashboard -->|"GET /bse-alerts"| BSERoute
    Notifications -->|"GET /bse-alerts?page=X&per_page=Y"| BSERoute
    BSERoute -->|"SELECT * FROM DailyLogs<br/>WHERE Link IS NOT NULL<br/>ORDER BY Date DESC"| NotifDB
    NotifDB -->|"Result Set"| BSERoute
    BSERoute -->|"JSON Response"| Dashboard
    BSERoute -->|"JSON Response"| Notifications
    Dashboard -->|"Render"| Charts
```

**BSE Database Schema:**
```sql
CREATE TABLE DailyLogs (
    SrNo SERIAL PRIMARY KEY,
    EntityName VARCHAR(255),
    Link TEXT,
    Nature VARCHAR(100),
    Summary TEXT,
    Date DATE
);
```

---

### Product 2: RBI Analysis Flow

```mermaid
flowchart TB
    subgraph Frontend["Frontend Layer"]
        RBIDash["RBIDashboard.tsx"]
        RBINotif["RBITotalNotifications.tsx"]
    end
    
    subgraph API["API Layer"]
        RBIRoute["routes/rbi.py"]
    end
    
    subgraph Database["Database Layer"]
        RBIDB[("PostgreSQL<br/>rbi<br/>Table: master_summaries")]
    end
    
    RBIDash -->|"GET /rbi-analysis-data"| RBIRoute
    RBINotif -->|"GET /rbi-analysis-data"| RBIRoute
    RBIRoute -->|"SELECT * FROM master_summaries<br/>WHERE NOT (pdf_link='NIL' AND summary='NIL')"| RBIDB
    RBIDB -->|"Result Set"| RBIRoute
    RBIRoute -->|"JSON Response"| RBIDash
    RBIRoute -->|"JSON Response"| RBINotif
```

---

### Product 3: SEBI Analysis Flow

```mermaid
flowchart TB
    subgraph Frontend["Frontend Layer"]
        SEBIDash["SEBIDashboard.tsx"]
        SEBINotif["SEBITotalNotifications.tsx"]
    end
    
    subgraph API["API Layer"]
        SEBIRoute["routes/sebi.py"]
    end
    
    subgraph Database["Database Layer"]
        SEBIDB[("PostgreSQL<br/>sebi_excel_master<br/>Table: excel_summaries")]
    end
    
    SEBIDash -->|"GET /sebi-analysis-data"| SEBIRoute
    SEBINotif -->|"GET /sebi-analysis-data"| SEBIRoute
    SEBIRoute -->|"SELECT * FROM excel_summaries"| SEBIDB
    SEBIDB -->|"Result Set"| SEBIRoute
    SEBIRoute -->|"JSON Response"| SEBIDash
    SEBIRoute -->|"JSON Response"| SEBINotif
```

---

### Product 4: Insider Trading Flow

```mermaid
flowchart TB
    subgraph Frontend["Frontend Layer"]
        InsiderPage["InsiderTrading.tsx"]
    end
    
    subgraph API["API Layer"]
        InsiderRoute["routes/insider_trading.py"]
    end
    
    subgraph Database["Database Layer"]
        InsiderDBs[("PostgreSQL<br/>insider_trading<br/>Multiple tables per company")]
    end
    
    subgraph AggregationLogic["Aggregation Logic"]
        Added["Added - New Investors"]
        Removed["Removed - Exits"]
        Changed["Changed Holdings"]
        Unchanged["Unchanged"]
    end
    
    InsiderPage -->|"GET /api/insider-trading/summary"| InsiderRoute
    InsiderPage -->|"GET /api/insider-trading/enhanced-details"| InsiderRoute
    InsiderPage -->|"GET /api/insider-trading/filter-options"| InsiderRoute
    
    InsiderRoute -->|"Aggregate Query"| InsiderDBs
    InsiderDBs -->|"Raw Data"| AggregationLogic
    AggregationLogic -->|"Processed Data"| InsiderRoute
    InsiderRoute -->|"JSON Response"| InsiderPage
```

**Insider Trading Database Structure:**
```
PostgreSQL Tables per Company:
├── {company}_summary
├── {company}_all_data
├── {company}_added        (New Investors)
├── {company}_removed      (Exits)
├── {company}_changed      (Changed Holdings)
└── {company}_unchanged    (No Change)
```

---

### Product 5: Directors Disclosure Flow

```mermaid
flowchart TB
    subgraph Frontend["Frontend Layer"]
        DD["DirectorsDisclosure.tsx"]
        Master["DirectorsDisclosureMasterData.tsx"]
        Analytics["DirectorsDisclosureAnalytics.tsx"]
        DataSrc["DirectorsDisclosureDataSource.tsx"]
        FamilyModal["FamilyInfoModal.tsx"]
    end
    
    subgraph API["API Layer"]
        DDRoute["routes/directors_disclosure.py<br/>(1320 lines)"]
        LLMUtil["llm_utils.py"]
        NameMatcher["EnhancedIndianNameMatcher.py"]
    end
    
    subgraph Database["Database Layer"]
        DirDB[("PostgreSQL<br/>directors")]
        DirDataDB[("PostgreSQL<br/>directors_data")]
        FamilyDB[("PostgreSQL<br/>director_family_information")]
        ProfileDB[("PostgreSQL<br/>directors_profile")]
    end
    
    subgraph Files["File Storage"]
        DOCXFiles["Directors Discloser Output/<br/>195 DOCX files"]
        Images["director_images/"]
    end
    
    subgraph External["Azure Cloud"]
        LLM["Azure OpenAI"]
    end
    
    Master -->|"CRUD Operations"| DDRoute
    DDRoute -->|"Query"| DirDB
    DirDB -->|"Result"| DDRoute
    DDRoute -->|"Query"| ProfileDB
    ProfileDB -->|"Result"| DDRoute
    
    DataSrc -->|"GET /api/directors-disclosures"| DDRoute
    DDRoute -->|"Read Files"| DOCXFiles
    DOCXFiles -->|"File List"| DDRoute
    
    DataSrc -->|"POST /generate-summary"| DDRoute
    DDRoute -->|"Extract Text"| DOCXFiles
    DOCXFiles -->|"Document Text"| DDRoute
    DDRoute -->|"Generate Summary"| LLMUtil
    LLMUtil -->|"API Request"| LLM
    LLM -->|"Summary Text"| LLMUtil
    LLMUtil -->|"Insert"| DirDataDB
    DirDataDB -->|"Saved"| LLMUtil
    
    FamilyModal -->|"GET /api/directors/{name}/family-info"| DDRoute
    DDRoute -->|"Fuzzy Match"| NameMatcher
    NameMatcher -->|"Query"| FamilyDB
    FamilyDB -->|"Family Data"| NameMatcher
    NameMatcher -->|"Matched Result"| DDRoute
```

---

### Product 6: Minutes Generator Flow

```mermaid
flowchart TB
    subgraph Frontend["Frontend Layer"]
        MinPrep["MinutesPreparation.tsx"]
        FormGen["FormBasedGenerator.tsx"]
        AIAssist["AIAssistant.tsx"]
    end
    
    subgraph API_Form["Form-Based API"]
        MinRoute["routes/minutes.py"]
    end
    
    subgraph API_AI["AI-Powered API"]
        AIRoute["routes/ai_assistant.py<br/>(867 lines)"]
    end
    
    subgraph Database["Database Layer"]
        PlacesDB[("PostgreSQL<br/>places")]
        DirectorsDB[("PostgreSQL<br/>directors")]
    end
    
    subgraph Files["File Storage"]
        Templates["templates/<br/>16 DOCX templates"]
        MomOutput["ai_assistant_mom/<br/>141 outputs"]
    end
    
    subgraph External["Azure Cloud"]
        LLM["Azure OpenAI"]
    end
    
    %% Form-Based Path
    FormGen -->|"GET /places"| MinRoute
    MinRoute -->|"Query"| PlacesDB
    PlacesDB -->|"Places List"| MinRoute
    MinRoute -->|"JSON Response"| FormGen
    
    FormGen -->|"POST /generate-minutes"| MinRoute
    MinRoute -->|"Load Template"| Templates
    Templates -->|"Template DOCX"| MinRoute
    MinRoute -->|"Generated DOCX"| FormGen
    
    %% AI Path
    AIAssist -->|"POST /ai-assistant/upload"| AIRoute
    AIRoute -->|"Save File"| MomOutput
    MomOutput -->|"Saved"| AIRoute
    AIRoute -->|"Task ID"| AIAssist
    
    AIAssist -->|"POST /ai-assistant/generate-mom"| AIRoute
    AIRoute -->|"Read Transcript"| MomOutput
    MomOutput -->|"Transcript Text"| AIRoute
    AIRoute -->|"LLM Extraction"| LLM
    LLM -->|"Structured Data"| AIRoute
    AIRoute -->|"Generate DOCX"| MomOutput
    MomOutput -->|"Saved"| AIRoute
    
    AIAssist -->|"GET /ai-assistant/download/{id}"| AIRoute
    AIRoute -->|"Read File"| MomOutput
    MomOutput -->|"DOCX File"| AIRoute
    AIRoute -->|"File Response"| AIAssist
```

---

## 🤖 AI Chatbot Architecture

### 4-Layer RAG Architecture

```mermaid
flowchart TB
    subgraph User["User Interface"]
        Query["User Query"]
        Response["AI Response"]
    end
    
    subgraph Layer4["Layer 4: Chat Orchestrator"]
        Orch["orchestrator.py"]
        RouterLogic["router_logic.py"]
    end
    
    subgraph Layer3["Layer 3: LLM Layer"]
        LLMClient["llm_client.py"]
        AzureClient["Azure OpenAI Client"]
    end
    
    subgraph Layer2["Layer 2: Indexing Layer"]
        EmbeddingIdx["embedding_index.py"]
        SemanticSearch["Semantic Search"]
    end
    
    subgraph Layer1["Layer 1: Data Layer"]
        DBModels["db_models.py"]
        BSEModel["BSENotification Model"]
        SEBIModel["SEBINotification Model"]
        RBIModel["RBINotification Model"]
    end
    
    subgraph Databases["PostgreSQL Databases"]
        BSE_DB[("notifications")]
        SEBI_DB[("sebi_excel_master")]
        RBI_DB[("rbi")]
    end
    
    Query -->|"1. Send Query"| Orch
    Orch -->|"2. Classify"| RouterLogic
    RouterLogic -->|"3a. Structured Query"| Layer1
    RouterLogic -->|"3b. Semantic Query"| Layer2
    
    Layer2 -->|"4. Search"| EmbeddingIdx
    EmbeddingIdx -->|"5. Query"| Layer1
    Layer1 -->|"6. SQL"| Databases
    Databases -->|"7. Results"| Layer1
    Layer1 -->|"8. Data"| Orch
    
    Orch -->|"9. Context + Query"| LLMClient
    LLMClient -->|"10. API Call"| AzureClient
    AzureClient -->|"11. AI Response"| LLMClient
    LLMClient -->|"12. Formatted"| Orch
    Orch -->|"13. Final Answer"| Response
```

### Chatbot Query Processing Flow

```mermaid
sequenceDiagram
    participant User
    participant ChatFab as ChatbotFab.tsx
    participant ChatAPI as /api/chat/message
    participant Orch as orchestrator.py
    participant Router as router_logic.py
    participant Data as data_layer
    participant LLM as llm_client.py
    participant Azure as Azure OpenAI
    
    User->>ChatFab: "What BSE notifications came yesterday?"
    ChatFab->>ChatAPI: POST { query: "..." }
    ChatAPI->>Orch: process_query()
    
    Orch->>Router: classify_query()
    Router->>Router: Extract dates/entities
    Router-->>Orch: { type: "structured", date: "2025-12-10" }
    
    Orch->>Data: fetch_notifications(date="2025-12-10")
    Data->>Data: Execute SQL Query
    Data-->>Orch: [Notification1, Notification2, ...]
    
    Orch->>Orch: Format context for LLM
    Orch->>LLM: generate_response(context, query)
    LLM->>Azure: chat.completions.create()
    Azure-->>LLM: AI-generated summary
    LLM-->>Orch: Formatted response
    
    Orch-->>ChatAPI: { response: "Here are the notifications..." }
    ChatAPI-->>ChatFab: JSON Response
    ChatFab-->>User: Display in chat bubble
```

---

## 🗄️ Complete Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    DailyLogs ||--o{ ChatbotQueries : "referenced by"
    excel_summaries ||--o{ ChatbotQueries : "referenced by"
    master_summaries ||--o{ ChatbotQueries : "referenced by"
    
    directors ||--o{ document_summaries : "has disclosures"
    directors ||--o{ director_family : "has family"
    directors ||--o{ directors_profile : "has profile"
    
    DailyLogs {
        serial SrNo PK
        varchar EntityName
        text Link
        varchar Nature
        text Summary
        date Date
    }
    
    excel_summaries {
        serial id PK
        varchar date_key
        integer row_index
        text pdf_link
        text summary
        timestamp inserted_at
    }
    
    master_summaries {
        serial id PK
        varchar run_date
        text pdf_link
        text summary
        timestamp created_at
    }
    
    directors {
        serial id PK
        varchar name
        varchar din UK
        timestamp created_at
    }
    
    document_summaries {
        serial id PK
        varchar director_name FK
        varchar din
        varchar file_path UK
        text full_text
        text summary
        timestamp created_at
        timestamp updated_at
    }
    
    directors_profile {
        serial id PK
        varchar DIN UK
        varchar PAN
        text Address
        date DateOfBirth
        text Qualification
        text Experience
    }
    
    director_family {
        varchar Name PK
        text Section_2_77_i
        text Section_2_77_ii
        text Section_2_77_iii
        varchar Father
        varchar Mother
        varchar Son
        varchar Daughter
        varchar Brother
        varchar Sister
    }
    
    places {
        serial id PK
        varchar name UK
        text address
        varchar city
        timestamp created_at
    }
    
    visits {
        serial id PK
        integer count
        timestamp last_visit
    }
```

---

## 🔌 Complete API Endpoint Map

### API Routes Diagram

```mermaid
flowchart TB
    subgraph HealthCheck["Health Check"]
        H1["GET /health"]
    end
    
    subgraph BSEModule["BSE Module"]
        B1["GET /bse-alerts"]
        B2["GET /bse-alerts?page&per_page"]
    end
    
    subgraph SEBIModule["SEBI Module"]
        S1["GET /sebi-analysis-data"]
    end
    
    subgraph RBIModule["RBI Module"]
        R1["GET /rbi-analysis-data"]
    end
    
    subgraph DirectorsModule["Directors Module"]
        D1["GET /api/directors-master"]
        D2["POST /api/directors-master"]
        D3["PUT /api/directors-master/{id}"]
        D4["DELETE /api/directors-master/{id}"]
        D5["GET /api/directors-disclosures"]
        D6["GET /api/directors-disclosures/{id}/content"]
        D7["POST /api/directors-disclosures/{id}/generate-summary"]
        D8["GET /api/directors/{name}/family-info"]
        D9["PUT /api/directors/{name}/family-info"]
    end
    
    subgraph InsiderModule["Insider Trading Module"]
        I1["GET /api/insider-trading/summary"]
        I2["GET /api/insider-trading/enhanced-details"]
        I3["GET /api/insider-trading/filter-options"]
    end
    
    subgraph MinutesModule["Minutes Module"]
        M1["GET /places"]
        M2["POST /places"]
        M3["POST /generate-minutes"]
        M4["GET /directors"]
    end
    
    subgraph AIModule["AI Assistant Module"]
        A1["POST /ai-assistant/upload"]
        A2["POST /ai-assistant/generate-mom"]
        A3["GET /ai-assistant/status/{task_id}"]
        A4["GET /ai-assistant/mom/{task_id}"]
        A5["GET /ai-assistant/download/{task_id}"]
    end
    
    subgraph ChatModule["Chatbot Module"]
        C1["POST /api/chat/message"]
        C2["POST /api/chat/stream"]
    end
    
    H1 --> B1
    B1 --> S1
    S1 --> R1
    R1 --> D1
    D1 --> I1
    I1 --> M1
    M1 --> A1
    A1 --> C1
```

### Complete Endpoint Table

| Method | Endpoint | Module | Description |
|--------|----------|--------|-------------|
| GET | `/health` | System | Health check |
| GET | `/bse-alerts` | BSE | Get BSE notifications |
| GET | `/sebi-analysis-data` | SEBI | Get SEBI data |
| GET | `/rbi-analysis-data` | RBI | Get RBI data |
| GET | `/api/directors-master` | Directors | List directors |
| POST | `/api/directors-master` | Directors | Create director |
| PUT | `/api/directors-master/{id}` | Directors | Update director |
| DELETE | `/api/directors-master/{id}` | Directors | Delete director |
| GET | `/api/directors-disclosures` | Directors | List disclosures |
| GET | `/api/directors-disclosures/{id}/content` | Directors | Get document content |
| POST | `/api/directors-disclosures/{id}/generate-summary` | Directors | Generate AI summary |
| GET | `/api/directors/{name}/family-info` | Directors | Get family info |
| PUT | `/api/directors/{name}/family-info` | Directors | Update family info |
| GET | `/api/insider-trading/summary` | Insider | KPI summary |
| GET | `/api/insider-trading/enhanced-details` | Insider | Full details |
| GET | `/api/insider-trading/filter-options` | Insider | Filter options |
| GET | `/places` | Minutes | List venues |
| POST | `/places` | Minutes | Create venue |
| POST | `/generate-minutes` | Minutes | Generate from template |
| POST | `/ai-assistant/upload` | AI | Upload transcript |
| POST | `/ai-assistant/generate-mom` | AI | Start generation |
| GET | `/ai-assistant/status/{task_id}` | AI | Check status |
| GET | `/ai-assistant/download/{task_id}` | AI | Download DOCX |
| POST | `/api/chat/message` | Chatbot | Send message |
| POST | `/api/chat/stream` | Chatbot | Stream response |

---

## 🛠️ Technology Stack Summary

### Complete Stack Diagram

```mermaid
flowchart TB
    subgraph FrontendStack["Frontend Stack"]
        React["React 18.3.1"]
        TS["TypeScript 5.8.3"]
        Vite["Vite 5.4.19"]
        Tailwind["TailwindCSS 3.4.17"]
        Shadcn["shadcn/ui"]
        ReactRouter["React Router DOM 6.30.1"]
        TanStack["TanStack Query 5.83.0"]
        Recharts["Recharts 2.15.4"]
        Framer["Framer Motion 12.23.12"]
        Axios["Axios 1.12.2"]
    end
    
    subgraph BackendStack["Backend Stack"]
        Python["Python 3.8+"]
        FastAPI["FastAPI"]
        SQLAlchemy["SQLAlchemy"]
        PostgreSQL["PostgreSQL"]
        Docx["python-docx"]
        AzureSDK["Azure OpenAI SDK"]
        Uvicorn["Uvicorn ASGI"]
    end
    
    subgraph ExternalServices["External Services"]
        AzureAPI["Azure OpenAI API"]
    end
    
    React -->|"compiles with"| TS
    TS -->|"bundled by"| Vite
    React -->|"styled with"| Tailwind
    React -->|"components from"| Shadcn
    React -->|"routing via"| ReactRouter
    React -->|"data fetching"| TanStack
    React -->|"charts"| Recharts
    React -->|"animations"| Framer
    TanStack -->|"HTTP calls"| Axios
    
    FastAPI -->|"runs on"| Python
    FastAPI -->|"ORM"| SQLAlchemy
    SQLAlchemy -->|"connects to"| PostgreSQL
    FastAPI -->|"document processing"| Docx
    FastAPI -->|"AI integration"| AzureSDK
    FastAPI -->|"served by"| Uvicorn
    
    AzureSDK -->|"API calls"| AzureAPI
```

---

## 🚀 Development & Deployment

### Development Flow

```mermaid
flowchart LR
    subgraph Development["Development Mode"]
        FE["npm run dev<br/>Port: 5173"]
        BE["npm run backend:fastapi<br/>Port: 8000"]
    end
    
    subgraph Build["Build Process"]
        ViteBuild["npm run build"]
        Dist["dist/ folder"]
    end
    
    subgraph Production["Production Serve"]
        SSL["npm run serve:ssl<br/>Port: 8000"]
    end
    
    FE -->|"Ready for build"| ViteBuild
    BE -->|"Ready for deploy"| ViteBuild
    ViteBuild -->|"Generates"| Dist
    Dist -->|"Served by"| SSL
```

### NPM Scripts

```json
{
  "dev": "vite",
  "dev:all:fastapi": "concurrently \"npm run dev\" \"npm run backend:fastapi\"",
  "backend:fastapi": "cd ../Backend/aegis_backend && python fastapi_server.py",
  "backend:install-deps": "cd ../Backend/aegis_backend && pip install -r requirements.txt",
  "build": "vite build",
  "serve:ssl": "cd ../Backend/aegis_backend && python fastapi_server.py --ssl"
}
```

---

## 🔐 Security Architecture

```mermaid
flowchart TB
    subgraph SecurityMeasures["Security Measures"]
        CORS["CORS Configuration"]
        SSL["SSL/TLS Support"]
        ENV["Environment Variables"]
        Admin["Admin Authentication"]
        Validation["Pydantic Validation"]
    end
    
    subgraph Implementation["Implementation Details"]
        Origins["Allowed Origins:<br/>localhost:5173<br/>localhost:8000"]
        Certs["SSL Certificates"]
        Keys["API Keys Protected"]
        Token["JWT Token Storage"]
        Models["Request/Response Models"]
    end
    
    CORS -->|"configures"| Origins
    SSL -->|"uses"| Certs
    ENV -->|"protects"| Keys
    Admin -->|"manages"| Token
    Validation -->|"enforces"| Models
```

---

## 📋 Environment Configuration

### Required Environment Variables

```env
# LLM Configuration (Required for AI features)
LLM_PROVIDER=azure
LLM_ENDPOINT=https://your-azure-endpoint.openai.azure.com
LLM_DEPLOYMENT=gpt-4
LLM_API_KEY=<your-azure-api-key>
AZURE_API_VERSION=2023-05-15

# PostgreSQL Database
DATABASE_URL=postgresql://user:password@localhost:5432/aegis

# Optional
DEBUG=false
```

---

## 📝 Onboarding Checklist for New Developers

### Quick Start

1. **Clone & Install**
   ```bash
   git clone <repository>
   cd Share_Updated_Aegis
   npm install
   npm run backend:install-deps
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Add your Azure OpenAI API keys
   - Configure PostgreSQL connection

3. **Start Development**
   ```bash
   npm run dev:all:fastapi
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000

4. **Key Files to Understand**
   - `src/App.tsx` - All frontend routes
   - `Backend/aegis_backend/fastapi_server.py` - Backend entry
   - `Backend/aegis_backend/routes/` - All API handlers
   - `chatbot_backend/chat_orchestrator/orchestrator.py` - Chatbot logic

5. **Making Changes**
   - Frontend: Edit files in `src/`, Vite hot-reloads
   - Backend: Edit files in `Backend/aegis_backend/routes/`, restart server
   - Add new routes: Create in `routes/`, register in `fastapi_server.py`

---

## 📊 System Metrics

| Component | Files | Lines of Code | Size |
|-----------|-------|---------------|------|
| Frontend (src/) | 133 | ~15,000 | ~600KB |
| Backend Routes | 19 | ~4,000 | ~250KB |
| Chatbot Backend | 28 | ~2,000 | ~100KB |
| PostgreSQL Tables | 9 | - | Variable |
| DOCX Templates | 16 | - | ~500KB |
| Director Disclosures | 195 | - | ~10MB |

---

*Document Version: 2.0*  
*Last Updated: December 11, 2025*  
*Platform: AEGIS v1.0.0*  
*Organization: Adani Green Energy Limited*
