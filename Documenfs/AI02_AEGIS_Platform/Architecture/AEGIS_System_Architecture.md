# AEGIS Platform - Complete System Architecture

## 🏛️ Enterprise Architecture Overview

---

## Complete System Architecture Diagram

```mermaid
flowchart TB
    subgraph Users["👥 USERS"]
        direction LR
        Compliance["Compliance<br/>Officer"]
        Secretary["Company<br/>Secretary"]
        Legal["Legal<br/>Team"]
        Management["Senior<br/>Management"]
    end

    subgraph Frontend["🖥️ FRONTEND - React Application"]
        direction TB
        Landing["Landing Page"]
        
        subgraph Dashboards["Dashboards"]
            BSEDash["BSE Dashboard"]
            SEBIDash["SEBI Dashboard"]
            RBIDash["RBI Dashboard"]
        end
        
        subgraph Modules["Feature Modules"]
            InsiderUI["Insider Trading"]
            DirectorsUI["Directors Disclosure"]
            MinutesUI["Minutes Generator"]
        end
        
        ChatUI["AI Chatbot"]
    end

    subgraph Backend["⚙️ BACKEND - FastAPI"]
        direction TB
        
        subgraph APIRoutes["API Routes"]
            BSERoute["/bse-alerts"]
            SEBIRoute["/sebi-analysis"]
            RBIRoute["/rbi-analysis"]
            InsiderRoute["/insider-trading"]
            DirectorsRoute["/directors"]
            MinutesRoute["/minutes"]
            AIRoute["/ai-assistant"]
            ChatRoute["/chat"]
        end
        
        subgraph Services["Services"]
            LLMService["LLM Service"]
            DocProcessor["Document Processor"]
            NameMatcher["Name Matcher"]
        end
    end

    subgraph Chatbot["🤖 CHATBOT ENGINE - 4-Layer RAG"]
        direction TB
        Orchestrator["Orchestrator"]
        Router["Query Router"]
        LLMLayer["LLM Layer"]
        DataLayer["Data Layer"]
    end

    subgraph Database["🗄️ DATABASE - PostgreSQL"]
        direction LR
        NotifDB[("Notifications")]
        SEBIDB[("SEBI Data")]
        RBIDB[("RBI Data")]
        DirectorsDB[("Directors")]
        PlacesDB[("Places")]
    end

    subgraph Storage["📁 FILE STORAGE"]
        direction LR
        Disclosures["Disclosure<br/>Documents"]
        Templates["Meeting<br/>Templates"]
        Generated["Generated<br/>Minutes"]
    end

    subgraph External["☁️ EXTERNAL SERVICES"]
        AzureAI["Azure OpenAI<br/>GPT-4"]
    end

    %% User to Frontend connections
    Compliance --> Landing
    Secretary --> Landing
    Legal --> Landing
    Management --> Landing

    %% Frontend navigation
    Landing --> Dashboards
    Landing --> Modules
    Landing --> ChatUI

    %% Dashboard to API
    BSEDash --> BSERoute
    SEBIDash --> SEBIRoute
    RBIDash --> RBIRoute

    %% Modules to API
    InsiderUI --> InsiderRoute
    DirectorsUI --> DirectorsRoute
    MinutesUI --> MinutesRoute
    MinutesUI --> AIRoute

    %% Chat flow
    ChatUI --> ChatRoute
    ChatRoute --> Orchestrator
    Orchestrator --> Router
    Router --> DataLayer
    Router --> LLMLayer
    LLMLayer --> AzureAI
    DataLayer --> Database

    %% API to Database
    BSERoute --> NotifDB
    SEBIRoute --> SEBIDB
    RBIRoute --> RBIDB
    DirectorsRoute --> DirectorsDB
    MinutesRoute --> PlacesDB

    %% API to Services
    DirectorsRoute --> LLMService
    DirectorsRoute --> DocProcessor
    DirectorsRoute --> NameMatcher
    AIRoute --> LLMService

    %% Services to External
    LLMService --> AzureAI

    %% File Storage connections
    DirectorsRoute --> Disclosures
    MinutesRoute --> Templates
    AIRoute --> Generated
    DocProcessor --> Disclosures

    %% Styling
    style Users fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
    style Frontend fill:#eff6ff,stroke:#2563eb,stroke-width:2px
    style Backend fill:#fef3c7,stroke:#d97706,stroke-width:2px
    style Chatbot fill:#f3e8ff,stroke:#9333ea,stroke-width:2px
    style Database fill:#fee2e2,stroke:#dc2626,stroke-width:2px
    style Storage fill:#e0f2fe,stroke:#0284c7,stroke-width:2px
    style External fill:#ecfdf5,stroke:#059669,stroke-width:2px
```

---

## Data Flow Architecture

```mermaid
flowchart LR
    subgraph Sources["📡 DATA SOURCES"]
        BSEFeed["BSE Feed"]
        SEBIFeed["SEBI Portal"]
        RBIFeed["RBI Website"]
        UserDocs["User Documents"]
        Transcripts["Meeting Transcripts"]
    end

    subgraph Ingestion["📥 INGESTION"]
        Collector["Data Collector"]
        Parser["Document Parser"]
        Validator["Data Validator"]
    end

    subgraph Processing["⚙️ PROCESSING"]
        Analytics["Analytics Engine"]
        AIProcessor["AI Processor"]
        Summarizer["Summarizer"]
    end

    subgraph Storage2["💾 STORAGE"]
        PostgreSQL[("PostgreSQL<br/>Database")]
        FileStore[("File<br/>Storage")]
    end

    subgraph Delivery["📤 DELIVERY"]
        Dashboard["Dashboards"]
        Reports["Reports"]
        Alerts["Alerts"]
        Chat["Chatbot"]
    end

    subgraph Consumers["👥 CONSUMERS"]
        Users2["Business Users"]
    end

    BSEFeed --> Collector
    SEBIFeed --> Collector
    RBIFeed --> Collector
    UserDocs --> Parser
    Transcripts --> Parser

    Collector --> Validator
    Parser --> Validator
    Validator --> Analytics
    Validator --> PostgreSQL

    Analytics --> Summarizer
    Summarizer --> AIProcessor
    AIProcessor --> PostgreSQL
    AIProcessor --> FileStore

    PostgreSQL --> Dashboard
    PostgreSQL --> Reports
    PostgreSQL --> Chat
    FileStore --> Reports
    Analytics --> Alerts

    Dashboard --> Users2
    Reports --> Users2
    Alerts --> Users2
    Chat --> Users2

    style Sources fill:#dbeafe,stroke:#2563eb
    style Ingestion fill:#fef9c3,stroke:#ca8a04
    style Processing fill:#f3e8ff,stroke:#9333ea
    style Storage2 fill:#fee2e2,stroke:#dc2626
    style Delivery fill:#dcfce7,stroke:#16a34a
    style Consumers fill:#f0fdf4,stroke:#16a34a
```

---

## Module Integration Architecture

```mermaid
flowchart TB
    subgraph Platform["🏛️ AEGIS PLATFORM"]
        direction TB
        
        subgraph Layer1["Presentation Layer"]
            Web["React Web App"]
            Chat["AI Chatbot"]
        end
        
        subgraph Layer2["API Layer"]
            Gateway["API Gateway<br/>FastAPI"]
        end
        
        subgraph Layer3["Business Logic Layer"]
            direction LR
            
            subgraph Regulatory["Regulatory Modules"]
                BSE["BSE<br/>Analysis"]
                SEBI["SEBI<br/>Analysis"]
                RBI["RBI<br/>Analysis"]
            end
            
            subgraph Governance["Governance Modules"]
                Insider["Insider<br/>Trading"]
                Directors["Directors<br/>Disclosure"]
                Minutes["Minutes<br/>Generator"]
            end
            
            subgraph AI["AI Services"]
                LLM["LLM<br/>Service"]
                RAG["RAG<br/>Engine"]
            end
        end
        
        subgraph Layer4["Data Layer"]
            DB[("PostgreSQL")]
            Files[("File Storage")]
        end
    end
    
    subgraph Cloud["☁️ AZURE CLOUD"]
        OpenAI["Azure OpenAI"]
    end

    Web --> Gateway
    Chat --> Gateway
    
    Gateway --> BSE
    Gateway --> SEBI
    Gateway --> RBI
    Gateway --> Insider
    Gateway --> Directors
    Gateway --> Minutes
    Gateway --> RAG
    
    BSE --> DB
    SEBI --> DB
    RBI --> DB
    Insider --> DB
    Directors --> DB
    Directors --> Files
    Minutes --> DB
    Minutes --> Files
    
    Directors --> LLM
    Minutes --> LLM
    RAG --> LLM
    LLM --> OpenAI
    RAG --> DB

    style Platform fill:#f8fafc,stroke:#1e293b,stroke-width:3px
    style Layer1 fill:#dbeafe,stroke:#2563eb
    style Layer2 fill:#fef3c7,stroke:#d97706
    style Layer3 fill:#f0fdf4,stroke:#16a34a
    style Layer4 fill:#fee2e2,stroke:#dc2626
    style Cloud fill:#ecfdf5,stroke:#059669
```

---

## Request Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Gateway
    participant S as Service
    participant D as Database
    participant AI as Azure OpenAI
    
    rect rgb(240, 253, 244)
        Note over U,F: User Interface
        U->>F: Open Dashboard
        F->>F: Render UI
    end
    
    rect rgb(254, 243, 199)
        Note over F,A: API Request
        F->>A: GET /api/data
        A->>A: Validate Request
    end
    
    rect rgb(243, 232, 255)
        Note over A,S: Business Logic
        A->>S: Process Request
        S->>D: Query Data
        D-->>S: Return Data
    end
    
    rect rgb(236, 253, 245)
        Note over S,AI: AI Processing (if needed)
        S->>AI: Generate Summary
        AI-->>S: AI Response
    end
    
    rect rgb(219, 234, 254)
        Note over S,U: Response
        S-->>A: Processed Data
        A-->>F: JSON Response
        F-->>U: Display Results
    end
```

---

## Technology Stack Architecture

```mermaid
flowchart TB
    subgraph Stack["AEGIS Technology Stack"]
        direction TB
        
        subgraph UI["🎨 User Interface"]
            React["React 18"]
            TS["TypeScript"]
            Tailwind["TailwindCSS"]
            Shadcn["shadcn/ui"]
            Recharts["Recharts"]
        end
        
        subgraph Build["🔧 Build Tools"]
            Vite["Vite"]
            NPM["NPM"]
        end
        
        subgraph API["⚙️ Backend API"]
            FastAPI["FastAPI"]
            Python["Python 3.8+"]
            SQLAlchemy["SQLAlchemy"]
            Pydantic["Pydantic"]
        end
        
        subgraph Data["🗄️ Data Storage"]
            PostgreSQL2["PostgreSQL"]
            FileSystem["File System"]
        end
        
        subgraph AIStack["🤖 AI/ML"]
            AzureOpenAI2["Azure OpenAI"]
            Embeddings["Text Embeddings"]
            RAG2["RAG Pipeline"]
        end
        
        subgraph Infra["🏗️ Infrastructure"]
            Uvicorn["Uvicorn"]
            SSL["SSL/TLS"]
            CORS["CORS"]
        end
    end

    React --> Vite
    TS --> React
    Tailwind --> React
    Shadcn --> React
    Recharts --> React
    
    Vite --> FastAPI
    FastAPI --> Python
    FastAPI --> SQLAlchemy
    FastAPI --> Pydantic
    
    SQLAlchemy --> PostgreSQL2
    FastAPI --> FileSystem
    
    FastAPI --> AzureOpenAI2
    AzureOpenAI2 --> Embeddings
    Embeddings --> RAG2
    RAG2 --> PostgreSQL2
    
    FastAPI --> Uvicorn
    Uvicorn --> SSL
    FastAPI --> CORS

    style Stack fill:#f8fafc,stroke:#1e293b,stroke-width:2px
    style UI fill:#dbeafe,stroke:#2563eb
    style Build fill:#fef9c3,stroke:#ca8a04
    style API fill:#fef3c7,stroke:#d97706
    style Data fill:#fee2e2,stroke:#dc2626
    style AIStack fill:#f3e8ff,stroke:#9333ea
    style Infra fill:#e0f2fe,stroke:#0284c7
```

---

## Security Architecture

```mermaid
flowchart TB
    subgraph Security["🔐 Security Architecture"]
        direction TB
        
        subgraph Perimeter["Perimeter Security"]
            HTTPS["HTTPS/SSL"]
            CORS2["CORS Policy"]
            RateLimit["Rate Limiting"]
        end
        
        subgraph Auth["Authentication"]
            AdminAuth["Admin Authentication"]
            Token["Token Validation"]
        end
        
        subgraph DataSec["Data Security"]
            EnvVars["Environment Variables"]
            APIKeys["API Keys Protected"]
            DBAccess["Database Access Control"]
        end
        
        subgraph Validation["Input Validation"]
            PydanticVal["Pydantic Models"]
            Sanitize["Input Sanitization"]
            FileVal["File Validation"]
        end
    end

    HTTPS --> AdminAuth
    CORS2 --> AdminAuth
    RateLimit --> AdminAuth
    
    AdminAuth --> Token
    Token --> PydanticVal
    PydanticVal --> Sanitize
    Sanitize --> FileVal
    
    Token --> EnvVars
    EnvVars --> APIKeys
    APIKeys --> DBAccess

    style Security fill:#fef2f2,stroke:#dc2626,stroke-width:2px
    style Perimeter fill:#fee2e2,stroke:#dc2626
    style Auth fill:#fef3c7,stroke:#d97706
    style DataSec fill:#dcfce7,stroke:#16a34a
    style Validation fill:#dbeafe,stroke:#2563eb
```

---

## Deployment Architecture

```mermaid
flowchart LR
    subgraph Development["💻 Development"]
        LocalDev["Local Development<br/>npm run dev"]
    end
    
    subgraph Build2["🔨 Build"]
        ViteBuild["Vite Build<br/>npm run build"]
    end
    
    subgraph Production["🚀 Production"]
        subgraph Server["Server"]
            FastAPIServer["FastAPI Server<br/>Port 8000"]
            StaticFiles["Static Files<br/>/dist"]
        end
    end
    
    subgraph Access["🌐 Access"]
        Browser["Web Browser"]
    end

    LocalDev --> ViteBuild
    ViteBuild --> StaticFiles
    StaticFiles --> FastAPIServer
    FastAPIServer --> Browser

    style Development fill:#dbeafe,stroke:#2563eb
    style Build2 fill:#fef9c3,stroke:#ca8a04
    style Production fill:#dcfce7,stroke:#16a34a
    style Access fill:#f3e8ff,stroke:#9333ea
```

---

## Summary: Complete System View

```mermaid
flowchart TB
    subgraph Complete["🏛️ AEGIS - Complete Architecture"]
        
        U["👥 Users"] --> FE["🖥️ Frontend<br/>React + TypeScript"]
        
        FE --> API["⚙️ API Layer<br/>FastAPI"]
        
        API --> M1["📊 BSE"]
        API --> M2["📈 SEBI"]
        API --> M3["🏦 RBI"]
        API --> M4["🔍 Insider"]
        API --> M5["👔 Directors"]
        API --> M6["📝 Minutes"]
        API --> M7["🤖 Chatbot"]
        
        M1 --> DB["🗄️ PostgreSQL"]
        M2 --> DB
        M3 --> DB
        M4 --> DB
        M5 --> DB
        M5 --> FS["📁 Files"]
        M6 --> DB
        M6 --> FS
        M7 --> DB
        
        M5 --> AI["☁️ Azure OpenAI"]
        M6 --> AI
        M7 --> AI
        
    end

    style Complete fill:#f8fafc,stroke:#1e293b,stroke-width:3px
    style U fill:#f0fdf4,stroke:#16a34a
    style FE fill:#dbeafe,stroke:#2563eb
    style API fill:#fef3c7,stroke:#d97706
    style DB fill:#fee2e2,stroke:#dc2626
    style FS fill:#e0f2fe,stroke:#0284c7
    style AI fill:#ecfdf5,stroke:#059669
```

---

*Complete System Architecture Document*  
*AEGIS Platform v1.0*  
*December 2025*
