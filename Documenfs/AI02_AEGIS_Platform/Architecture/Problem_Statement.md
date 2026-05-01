# AEGIS Platform - Comprehensive Technical Documentation

## 📋 Problem Statement

**Project AEGIS** (Advanced Enterprise Governance & Intelligence System) is a regulatory compliance and financial analysis platform designed for **Adani Green Energy Limited**. The platform provides real-time monitoring, analysis, and automation of regulatory notifications from major Indian financial regulators (BSE, SEBI, RBI), along with supporting modules for insider trading analysis, directors' disclosure management, and meeting minutes generation.

### Core Business Challenge

Organizations in the Indian financial sector face significant challenges in:
1. **Regulatory Compliance Monitoring**: Tracking thousands of notifications from multiple regulatory bodies (BSE, SEBI, RBI)
2. **Insider Trading Surveillance**: Monitoring and analyzing insider trading activities across multiple companies
3. **Directors' Disclosure Management**: Managing and tracking disclosure documents from company directors
4. **Corporate Governance**: Automating meeting minutes preparation and compliance tracking
5. **Data-Driven Decision Making**: Providing AI-powered insights through natural language chatbot interactions

---

## 🏗️ System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AEGIS PLATFORM                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────┐     ┌─────────────────────────────────────────┐   │
│  │   FRONTEND (React)  │     │            BACKEND SERVICES              │   │
│  │                     │     │                                          │   │
│  │  ┌───────────────┐  │     │  ┌────────────────┐ ┌─────────────────┐ │   │
│  │  │ Landing Page  │  │     │  │ aegis_backend  │ │ chatbot_backend │ │   │
│  │  │ (6 Products)  │  │────▶│  │ (FastAPI)      │ │ (4-Layer RAG)   │ │   │
│  │  └───────────────┘  │     │  │                │ │                 │ │   │
│  │                     │     │  │ Routes:        │ │ Layers:         │ │   │
│  │  ┌───────────────┐  │     │  │ - BSE          │ │ - Data Layer    │ │   │
│  │  │ BSE Dashboard │  │     │  │ - SEBI         │ │ - Indexing      │ │   │
│  │  └───────────────┘  │     │  │ - RBI          │ │ - LLM Layer     │ │   │
│  │                     │     │  │ - Directors    │ │ - Orchestrator  │ │   │
│  │  ┌───────────────┐  │     │  │ - Insider      │ │                 │ │   │
│  │  │ SEBI Dashboard│  │     │  │ - Minutes      │ │                 │ │   │
│  │  └───────────────┘  │     │  │ - AI Assistant │ └─────────────────┘ │   │
│  │                     │     │  │ - Chat         │                      │   │
│  │  ┌───────────────┐  │     │  └────────────────┘                      │   │
│  │  │ RBI Dashboard │  │     │                                          │   │
│  │  └───────────────┘  │     └─────────────────────────────────────────┘   │
│  │                     │                                                    │
│  │  ┌───────────────┐  │     ┌─────────────────────────────────────────┐   │
│  │  │Insider Trading│  │     │              DATABASES                   │   │
│  │  └───────────────┘  │     │                                          │   │
│  │                     │     │  ┌─────────────┐ ┌─────────────────────┐ │   │
│  │  ┌───────────────┐  │     │  │ PostgreSQL  │ │ Chatbot DBs         │ │   │
│  │  │Directors'     │  │     │  │             │ │                     │ │   │
│  │  │Disclosure     │  │     │  │notifications│ │ notifications       │ │   │
│  │  └───────────────┘  │     │  │directors    │ │ sebi_excel_master   │ │   │
│  │                     │     │  │rbi          │ │ rbi                 │ │   │
│  │  ┌───────────────┐  │     │  │sebi         │ │                     │ │   │
│  │  │Minutes        │  │     │  │places       │ │                     │ │   │
│  │  │Preparation    │  │     │  │visits       │ │                     │ │   │
│  │  └───────────────┘  │     │  └─────────────┘ └─────────────────────┘ │   │
│  │                     │     │                                          │   │
│  │  ┌───────────────┐  │     └─────────────────────────────────────────┘   │
│  │  │  AI Chatbot   │  │                                                    │
│  │  │    (FAB)      │  │                                                    │
│  │  └───────────────┘  │                                                    │
│  └─────────────────────┘                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 💾 Database Architecture

### Primary Database: PostgreSQL

The platform uses **PostgreSQL** as the primary database engine for all data storage. This choice provides:
- **Scalability**: Handles high concurrency and large datasets
- **Reliability**: ACID compliance and data integrity
- **Performance**: Optimized for enterprise workloads

### Database Files Inventory

| Database | Purpose | Key Tables |
|----------|---------|------------|
| `notifications` | BSE regulatory notifications | `DailyLogs` |
| `sebi_excel_master` | SEBI regulatory data | `excel_summaries` |
| `rbi` | RBI notifications | `master_summaries` |
| `directors` | Directors master list | `directors` |
| `directors_data` | Director document summaries | `document_summaries` |
| `directors_profile` | Director profile information | `directors_profile` |
| `director_family_information` | Director family data | Family information tables |
| `places` | Meeting places | `places` |
| `visits` | Visit tracking | Visit count |
| `email_data` | Email notifications | Email data |

### Database Schema Details

#### 1. BSE Notifications (`notifications` table)
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

#### 2. SEBI Excel Summaries (`sebi_excel_master` table)
```sql
CREATE TABLE excel_summaries (
    id SERIAL PRIMARY KEY,
    date_key VARCHAR(20),        -- Format: "DD-MM-YYYY"
    row_index INTEGER,
    pdf_link TEXT,
    summary TEXT,
    inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. RBI Master Summaries (`rbi` table)
```sql
CREATE TABLE master_summaries (
    id SERIAL PRIMARY KEY,
    run_date VARCHAR(20),        -- Format: "DD-MM-YYYY"
    pdf_link TEXT,
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. Directors Master (`directors` table)
```sql
CREATE TABLE directors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    din VARCHAR(8) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. Document Summaries (`directors_data` table)
```sql
CREATE TABLE document_summaries (
    id SERIAL PRIMARY KEY,
    director_name VARCHAR(255) NOT NULL,
    din VARCHAR(8),
    file_path VARCHAR(500) NOT NULL UNIQUE,
    full_text TEXT,
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 Six Product Modules

### Product 1: BSE Analysis (Bombay Stock Exchange)

**Route**: `/bse-alerts`
**Status**: Live
**Purpose**: Monitor and analyze BSE market notifications and alerts

**Key Features**:
- Real-time BSE notification tracking
- Market trend analysis
- Entity-based filtering
- Date-range queries
- Summary generation

**Frontend Pages**:
- `Dashboard.tsx`: Main BSE dashboard
- `TotalNotifications.tsx`: Notifications listing
- `EmailData.tsx`: Email notification view
- `WebsiteData.tsx`: Website data view
- `WeeklyAnalysis.tsx`: Weekly trends

**Backend Route**: `routes/bse.py`
- Endpoint: `GET /bse-alerts`
- Fetches from `notifications.db`
- Filters records where `Link IS NOT NULL AND Link != 'NIL'`
- Orders by `Date DESC`

---

### Product 2: RBI Analysis (Reserve Bank of India)

**Route**: `/rbi-dashboard`
**Status**: Live
**Purpose**: Track and analyze RBI regulatory notifications

**Key Features**:
- Monetary policy tracking
- Banking sector compliance
- Regulatory update notifications
- PDF link access

**Frontend Pages**:
- `RBIDashboard.tsx`: Main RBI dashboard
- `RBITotalNotifications.tsx`: RBI notifications
- `RBIEmailData.tsx`: RBI email data

**Backend Route**: `routes/rbi.py`
- Endpoint: `GET /rbi-analysis-data`
- Fetches from `rbi.db`
- Queries `master_summaries` table
- Excludes records where both `pdf_link` and `summary` are 'NIL'

---

### Product 3: SEBI Analysis (Securities and Exchange Board of India)

**Route**: `/sebi-dashboard`
**Status**: Live
**Purpose**: Monitor SEBI circulars, regulations, and compliance updates

**Key Features**:
- Market surveillance insights
- Investor protection tracking
- Corporate governance analysis
- PDF circular access

**Frontend Pages**:
- `SEBIDashboard.tsx`: Main SEBI dashboard
- `SEBITotalNotifications.tsx`: SEBI notifications
- `SEBIEmailData.tsx`: SEBI email data

**Backend Route**: `routes/sebi.py`
- Endpoint: `GET /sebi-analysis-data`
- Fetches from `sebi_excel_master.db`
- Queries `excel_summaries` table

---

### Product 4: Insider Trading

**Route**: `/insider-trading`
**Status**: Live
**Purpose**: Monitor insider trading activities across companies

**Key Features**:
- Track new investor additions (Added)
- Track investor exits (Removed)
- Monitor shareholding changes (Changed/Unchanged)
- Filter by company and depository (CDSL, NSDL, PHY)

**Backend Route**: `routes/insider_trading.py`
**Data Location**: `Backend/aegis_backend/public/AdaniInsiderTraders/`

**Database Structure**:
Each company has folders with format `user_{CompanyName}_{Date}/` containing:
- Multiple `.db` files per depository
- Tables: `Summary`, `All_Data`, `Added`, `Removed`, `Changed`, `Unchanged`

**Key Endpoints**:
- `GET /api/insider-trading/enhanced-details`: Full detail view
- `GET /api/insider-trading/summary`: KPI summary
- `GET /api/insider-trading/filter-options`: Companies and depositories

---

### Product 5: Directors' Disclosure

**Route**: `/directors-disclosure`
**Status**: Live
**Purpose**: Manage and track directors' disclosure documents (MBP-1 forms)

**Key Features**:
- Director master data management (CRUD)
- Disclosure document tracking
- LLM-powered document summarization
- Family information tracking
- Profile image management

**Backend Route**: `routes/directors_disclosure.py` (1320 lines)

**Key Endpoints**:
- `GET /api/directors-master`: List all directors
- `POST /api/directors-master`: Create director
- `PUT /api/directors-master/{id}`: Update director
- `DELETE /api/directors-master/{id}`: Delete director
- `GET /api/directors-disclosures`: List disclosure documents
- `GET /api/directors-disclosures/{id}/content`: Get document content
- `POST /api/directors-disclosures/{id}/generate-summary`: Generate AI summary
- `GET /api/directors/{name}/family-info`: Get family information

**Document Storage**: `Backend/aegis_backend/public/Directors Discloser Output/`

**Uses**:
- `EnhancedIndianNameMatcher.py` for fuzzy name matching
- `llm_utils.py` for LLM-powered summarization

---

### Product 6: Minutes Generator (Meeting Minutes Preparation)

**Route**: `/minutes-preparation`
**Status**: Live
**Purpose**: Automate meeting minutes preparation with AI assistance

**Key Features**:
- Template-based meeting minutes generation
- AI-powered transcript processing (Microsoft Teams transcripts)
- Place/venue management
- Director attendance tracking

**Sub-Routes**:
- `/minutes-preparation` or `/minutes-preparation/directors`: Director selector
- `/minutes-preparation/form-generator`: Form-based generator
- `/minutes-preparation/ai-assistant`: AI transcript processor

**Backend Routes**:
1. `routes/minutes.py` - Template processing
   - `GET /places`: List meeting places
   - `POST /places`: Create new place
   - `POST /generate-minutes`: Generate minutes from form data

2. `routes/ai_assistant.py` - AI transcript processing
   - `POST /ai-assistant/upload`: Upload transcript (DOCX/TXT)
   - `POST /ai-assistant/generate-mom`: Generate Meeting Minutes using LLM
   - `GET /ai-assistant/status/{task_id}`: Check generation status
   - `GET /ai-assistant/download/{task_id}`: Download generated document

**LLM Integration**:
- Uses Groq API (llama-3.3-70b-versatile model) or Azure OpenAI
- Supports large transcript chunking for long meetings
- Handles Microsoft Teams transcript format

**Templates Location**: `Backend/aegis_backend/public/templates/`

---

## 🤖 AI Chatbot Architecture

### 4-Layer Architecture Pattern

The chatbot implements a **Router + RAG (Retrieval-Augmented Generation)** pattern:

```
┌────────────────────────────────────────────────────────────────┐
│                      CHATBOT BACKEND                            │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Layer 1: DATA LAYER (data_layer/)                             │
│  ├── models.py: DailyLog model (BSE data)                      │
│  ├── db_models.py: BSE, SEBI, RBI SQLAlchemy models            │
│  └── data_migration.py: Data migration utilities               │
│                                                                 │
│  Layer 2: INDEXING LAYER (indexing_layer/)                     │
│  └── embedding_index.py: Semantic search functions             │
│      - search_similar_notifications() for BSE                  │
│      - search_sebi_similar() for SEBI                          │
│      - search_rbi_similar() for RBI                            │
│                                                                 │
│  Layer 3: LLM LAYER (llm_layer/)                               │
│  ├── llm_config.py: LLM provider configuration                 │
│  └── llm_client.py: Chat completion wrapper                    │
│      - Azure OpenAI integration                                │
│      - System prompt generation                                │
│      - GPT-4 model support                                     │
│                                                                 │
│  Layer 4: CHAT ORCHESTRATOR (chat_orchestrator/)               │
│  ├── orchestrator.py: Main query processing                    │
│  └── router_logic.py: Query routing logic                      │
│      - Structured query detection                              │
│      - Date extraction                                         │
│      - Entity extraction                                       │
│                                                                 │
│  CONFIGURATIONS (configs/)                                      │
│  ├── bse/: BSE-specific prompts and settings                   │
│  ├── sebi/: SEBI-specific prompts and settings                 │
│  └── rbi/: RBI-specific prompts and settings                   │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Query Processing Flow

1. **User Query** → Chat API (`/api/chat/message`)
2. **Router Logic** determines retrieval method:
   - `structured`: SQL-based retrieval for date/entity queries
   - `date_only`: Date-filtered queries
   - `semantic`: Vector similarity search
3. **Data Retrieval** from appropriate database(s)
4. **LLM Generation** using Azure OpenAI
5. **Response Formatting** with bullet points

### LLM Configuration

**Provider**: Azure OpenAI
- Model: `GPT-4`
- Endpoint: Environment variable `LLM_ENDPOINT`
- API Key: Environment variable `LLM_API_KEY`
- Deployment: Environment variable `LLM_DEPLOYMENT`

---

## 🖥️ Frontend Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.8.3 | Type Safety |
| Vite | 5.4.19 | Build Tool |
| TailwindCSS | 3.4.17 | Styling |
| shadcn/ui | - | Component Library |
| React Router DOM | 6.30.1 | Routing |
| Tanstack Query | 5.83.0 | Data Fetching |
| Recharts | 2.15.4 | Charts |
| Framer Motion | 12.23.12 | Animations |
| Axios | 1.12.2 | HTTP Client |
| date-fns | 3.6.0 | Date Utilities |

### Frontend Structure

```
src/
├── App.tsx                 # Main router configuration
├── main.tsx               # Application entry point
├── index.css              # Global styles
├── components/
│   ├── ui/                # shadcn/ui components (51 files)
│   ├── layout/            # Layout components
│   ├── charts/            # Chart components
│   ├── ChatbotFab.tsx     # Floating AI chatbot
│   ├── DirectorSelector.tsx
│   ├── PlaceSelector.tsx
│   └── ...
├── pages/
│   ├── LandingPage.tsx    # Home page with 6 products
│   ├── Dashboard.tsx      # BSE main dashboard
│   ├── SEBIDashboard.tsx
│   ├── RBIDashboard.tsx
│   ├── InsiderTrading.tsx
│   ├── DirectorsDisclosure.tsx
│   ├── MinutesPreparation.tsx
│   └── DirectorsDisclosure/
│       ├── DirectorsDisclosureMasterData.tsx
│       ├── DirectorsDisclosureAnalytics.tsx
│       └── DirectorsDisclosureDataSource.tsx
├── services/              # API service layer
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
└── types/                 # TypeScript type definitions
```

---

## 🔌 Backend Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.8+ | Primary Backend |
| FastAPI | - | Web Framework |
| SQLAlchemy | - | ORM |
| PostgreSQL | - | Database |
| python-docx | - | DOCX Processing |
| Azure OpenAI SDK | - | LLM API Client |
| Uvicorn | - | ASGI Server |

### Backend Structure

```
Backend/aegis_backend/
├── fastapi_server.py      # Main FastAPI application
├── llm_utils.py           # LLM utilities for summarization
├── directors_data.db      # Director data database
├── routes/
│   ├── __init__.py
│   ├── health.py          # Health check endpoint
│   ├── bse.py             # BSE routes
│   ├── sebi.py            # SEBI routes
│   ├── rbi.py             # RBI routes
│   ├── directors_disclosure.py  # Directors routes (1320 lines)
│   ├── insider_trading.py       # Insider trading routes
│   ├── minutes.py              # Minutes generation routes
│   ├── ai_assistant.py         # AI assistant routes
│   ├── chat.py                 # Chatbot API routes
│   ├── analytics.py
│   ├── admin.py
│   └── visit_tracking.py
├── public/                # Static files and databases
│   ├── notifications.db
│   ├── directors.db
│   ├── sebi_excel_master.db
│   ├── rbi.db
│   ├── Directors Discloser Output/  # Disclosure documents
│   ├── AdaniInsiderTraders/         # Insider trading data
│   └── templates/                   # Meeting templates
└── utils/
    └── db_init.py         # Database initialization

chatbot_backend/
├── __init__.py            # Package initialization
├── chat_orchestrator/
│   ├── orchestrator.py    # Main orchestration logic
│   └── router_logic.py    # Query routing
├── data_layer/
│   ├── models.py          # Data models
│   └── db_models.py       # SQLAlchemy models
├── indexing_layer/
│   └── embedding_index.py # Semantic search
├── llm_layer/
│   └── llm_client.py      # LLM client wrapper
├── config/
│   └── llm_config.py      # LLM configuration
├── configs/
│   ├── bse/               # BSE-specific configs
│   ├── sebi/              # SEBI-specific configs
│   └── rbi/               # RBI-specific configs
├── database/
│   ├── notifications.db
│   ├── sebi_excel_master.db
│   └── rbi.db
└── utils/
    └── db_formatter.py    # Data formatting utilities
```

---

## 🚀 Running the Application

### Prerequisites

```bash
# Node.js & npm (for frontend)
node >= 18.x
npm >= 9.x

# Python (for backend)
python >= 3.8
```

### Quick Start

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
npm run backend:install-deps

# Start both frontend and backend
npm run dev:all:fastapi
```

### Individual Commands

```bash
# Frontend only (development)
npm run dev

# Backend only
npm run backend:fastapi

# Build for production
npm run build

# Serve with SSL
npm run serve:ssl
```

### Environment Variables

Required environment variables (in `.env`):

```
# LLM Configuration (Azure OpenAI)
LLM_PROVIDER=azure
LLM_ENDPOINT=https://your-azure-endpoint.openai.azure.com
LLM_DEPLOYMENT=gpt-4
LLM_API_KEY=your_key
AZURE_API_VERSION=2023-05-15

# PostgreSQL Database
DATABASE_URL=postgresql://user:password@localhost:5432/aegis
```

---

## 📊 API Endpoints Summary

### Core API Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/bse-alerts` | BSE notifications |
| GET | `/sebi-analysis-data` | SEBI data |
| GET | `/rbi-analysis-data` | RBI data |
| GET | `/api/directors-master` | Directors list |
| POST | `/api/directors-master` | Create director |
| GET | `/api/directors-disclosures` | Disclosures list |
| GET | `/api/insider-trading/enhanced-details` | Trading details |
| GET | `/places` | Meeting places |
| POST | `/generate-minutes` | Generate minutes |
| POST | `/ai-assistant/upload` | Upload transcript |
| POST | `/api/chat/message` | Chatbot query |

---

## 🔐 Security Considerations

1. **CORS Configuration**: Configured for localhost and development environments
2. **SSL Support**: FastAPI serves React app with SSL certificates
3. **Database Access**: PostgreSQL with proper access controls
4. **API Keys**: Stored in environment variables (not committed)

---

## 📝 Key Technical Decisions

1. **PostgreSQL**: Enterprise-grade database for scalability and reliability
2. **FastAPI over Flask**: Modern async support and automatic OpenAPI docs
3. **Azure OpenAI**: Enterprise-grade LLM with compliance and security
4. **React + Vite**: Fast development experience and HMR
5. **TailwindCSS + shadcn/ui**: Rapid UI development with consistent design
6. **Modular Route Structure**: Each module has dedicated route file

---

## 🐞 Known Limitations

1. **Document Processing**: DOCX-only support for disclosures
2. **Chatbot Memory**: No conversation history persistence
3. **Embedding Storage**: No persistent vector index (computed on-the-fly)
4. **File Storage**: DOCX files stored locally, not in cloud storage

---

## 📚 Related Documentation

- `README.md`: Project overview and quick start
- `Knowledge_Transfer_Documents/`: Additional documentation
- `SEBI_ANALYSIS_README.md`: SEBI-specific documentation

---

## 🛠️ Development Workflow

1. **Frontend Changes**: Edit files in `src/`, Vite hot-reloads
2. **Backend Changes**: Edit files in `Backend/aegis_backend/routes/`, restart server
3. **Database Schema**: Modify SQLAlchemy models in `data_layer/`
4. **Add New Route**: Create file in `routes/`, register in `fastapi_server.py`

---

*Document generated: December 11, 2025*
*Platform: Aegis v1.0.0*
*Powered by: Adani Green Energy Limited*
