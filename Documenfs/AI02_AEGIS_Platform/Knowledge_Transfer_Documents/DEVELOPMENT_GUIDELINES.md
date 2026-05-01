# AEGIS Platform - Development Guidelines

## Development Environment Setup

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Git for version control
- Code editor (VS Code recommended)
- OpenSSL for SSL certificate generation (for production builds)

### Initial Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd aegis-platform
   ```

2. **Frontend Setup**
   ```bash
   npm install
   ```

3. **Backend Setup**
   ```bash
   npm run backend:install-deps
   ```

4. **Chatbot Backend Setup** (if using separate chatbot system)
   ```bash
   cd chatbot_backend
   pip install -r requirements.txt
   ```

5. **Environment Configuration**
   Create `.env` files in the appropriate directories:
   - `Backend/aegis_backend/.env` for backend configuration
   - Follow the examples in existing `.env.example` files

6. **SSL Certificate Setup** (for production)
   ```bash
   mkdir -p ssl
   openssl genrsa -out ssl/key.pem 2048
   openssl req -new -key ssl/key.pem -out ssl/csr.pem
   openssl x509 -req -days 365 -in ssl/csr.pem -signkey ssl/key.pem -out ssl/cert.pem
   ```

## Project Structure Overview

Understanding the project structure is crucial for effective development. The platform follows a modular architecture with clear separation of concerns:

```
aegis-platform/
├── Backend/aegis_backend/                  # Python FastAPI backend
│   ├── routes/                     # API endpoint handlers
│   │   ├── health.py               # Health check endpoints
│   │   ├── excel.py                # Excel processing endpoints
│   │   ├── bse.py                  # BSE data endpoints
│   │   ├── sebi.py                 # SEBI data endpoints
│   │   ├── rbi.py                  # RBI data endpoints
│   │   ├── analytics.py            # Analytics endpoints
│   │   ├── admin.py                # Admin endpoints
│   │   ├── directors.py            # Directors data endpoints
│   │   ├── directors_disclosure.py # Directors disclosure endpoints
│   │   ├── director_analysis.py    # Director analysis endpoints
│   │   ├── minutes.py              # Meeting minutes endpoints
│   │   ├── ai_assistant.py         # AI assistant endpoints
│   │   ├── visit_tracking.py       # Visit tracking endpoints
│   │   ├── insider_trading.py      # Insider trading endpoints
│   │   └── chat.py                 # Chatbot endpoints
│   ├── scripts/                    # Data processing scripts
│   │   ├── director_data_analysis.py      # Director data analysis
│   │   ├── EnhancedIndianNameMatcher.py   # Name matching utilities
│   │   └── fastapi_server_modular.py     # Modular server setup
│   ├── utils/                      # Utility functions
│   │   └── db_init.py              # Database initialization
│   ├── public/                     # Static assets and data files
│   │   ├── Directors Discloser Output/   # Director disclosure documents
│   │   ├── AdaniInsiderTraders/          # Insider trading databases
│   │   ├── ai_assistant_mom/             # AI assistant Meeting Minutes
│   │   ├── templates/                    # Meeting minutes templates
│   │   ├── directors.db                  # Directors master database
│   │   ├── directors_data.db             # Directors disclosure data
│   │   ├── directors_profile.db          # Directors profile information
│   │   ├── Director_Family_Information.db # Director family data
│   │   ├── notifications.db              # BSE alerts
│   │   ├── sebi_excel_master.db          # SEBI filings
│   │   ├── rbi.db                        # RBI notifications
│   │   ├── places.db                     # Meeting places
│   │   └── visits.db                     # Visit tracking
│   ├── docs/                       # Backend documentation
│   ├── fastapi_server.py           # Main FastAPI application
│   └── llm_utils.py                # LLM utility functions
├── chatbot_backend/                # Chatbot system
│   ├── chat_orchestrator/          # Chat flow management
│   ├── config/                     # Configuration management
│   ├── data_layer/                 # Data models and access
│   ├── indexing_layer/             # Data indexing and search
│   ├── llm_layer/                  # LLM integration
│   └── utils/                      # Utility functions
├── src/                            # React frontend source
│   ├── components/                 # Reusable UI components
│   │   ├── ui/                     # Base UI elements
│   │   ├── layout/                 # Page layout components
│   │   ├── charts/                 # Data visualization components
│   │   └── ChatbotFab.tsx         # Chatbot floating action button
│   ├── pages/                      # Page components
│   │   ├── LandingPage.tsx         # Main landing page
│   │   ├── DirectorsDisclosurePage.tsx   # Directors disclosure analysis
│   │   ├── SebiAnalysisPage.tsx          # SEBI analysis
│   │   ├── BseAlertsPage.tsx             # BSE alerts
│   │   ├── RbiNotificationsPage.tsx      # RBI notifications
│   │   ├── MinutesPreparationPage.tsx    # Meeting minutes
│   │   ├── InsiderTradingPage.tsx        # Insider trading analysis
│   │   └── AnalyticsDashboard.tsx        # Analytics dashboard
│   ├── services/                   # API client services
│   │   ├── apiClient.ts            # Base API client
│   │   ├── directorsService.ts     # Directors data service
│   │   ├── sebiService.ts          # SEBI data service
│   │   ├── bseService.ts           # BSE data service
│   │   ├── rbiService.ts           # RBI data service
│   │   ├── analyticsService.ts     # Analytics service
│   │   ├── minutesService.ts       # Meeting minutes service
│   │   ├── insiderTradingService.ts # Insider trading service
│   │   └── chatService.ts          # Chatbot service
│   ├── hooks/                      # Custom React hooks
│   └── utils/                      # Frontend utility functions
├── public/                         # Public static assets
├── ssl/                            # SSL certificates (for production)
├── README.md                       # Project overview
└── package.json                    # Frontend dependencies
```

## Backend Development

### Adding New API Endpoints

1. **Create a New Route Module**
   - Add a new file in `Backend/aegis_backend/routes/`
   - Follow the pattern of existing route modules
   - Use proper type hints and documentation
   - Implement proper logging with module-specific loggers
   - Include comprehensive error handling with specific HTTP status codes

2. **Register the Route**
   - Import the router in `Backend/aegis_backend/fastapi_server.py`
   - Add it to the app with `app.include_router()`
   - Ensure proper ordering of route registrations

3. **Implement Business Logic**
   - Keep route handlers thin (controllers should delegate to services)
   - Move complex logic to separate utility modules or service classes
   - Use async/await for I/O-bound operations
   - Implement proper input validation using Pydantic models
   - Follow RESTful API design principles

### Database Operations

All database operations should:
- Use proper connection management with context managers or try/finally blocks
- Implement transaction handling for multi-step operations
- Follow the existing data model conventions
- Include appropriate error handling with specific exception types
- Use parameterized queries to prevent SQL injection
- Implement proper indexing for performance optimization
- Use the custom thread pool for non-blocking database operations

### Example Route Implementation

```python
# routes/example.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import logging
import asyncio
import concurrent.futures

# Use the shared thread pool for database operations
from aegis_backend.fastapi_server import thread_pool

logger = logging.getLogger(__name__)
router = APIRouter()

class ExampleRequest(BaseModel):
    name: str
    value: int

class ExampleResponse(BaseModel):
    id: int
    name: str
    value: int

@router.post("/api/example", response_model=ExampleResponse)
async def create_example(request: ExampleRequest):
    """Create a new example record"""
    try:
        def insert_record():
            # Database operations should be run in a separate thread
            conn = sqlite3.connect("database.db")
            try:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO examples (name, value) VALUES (?, ?)",
                    (request.name, request.value)
                )
                record_id = cursor.lastrowid
                conn.commit()
                return record_id
            finally:
                conn.close()
        
        # Run database operation in thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        record_id = await loop.run_in_executor(thread_pool, insert_record)
        
        return ExampleResponse(
            id=record_id,
            name=request.name,
            value=request.value
        )
    except sqlite3.Error as e:
        logger.error(f"Database error creating example: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception as e:
        logger.error(f"Unexpected error creating example: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create example")

@router.get("/api/example/{example_id}", response_model=ExampleResponse)
async def get_example(example_id: int):
    """Get an example record by ID"""
    try:
        def fetch_record():
            conn = sqlite3.connect("database.db")
            try:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT id, name, value FROM examples WHERE id = ?",
                    (example_id,)
                )
                row = cursor.fetchone()
                if not row:
                    return None
                return {
                    'id': row[0],
                    'name': row[1],
                    'value': row[2]
                }
            finally:
                conn.close()
        
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(thread_pool, fetch_record)
        
        if not result:
            raise HTTPException(status_code=404, detail="Example not found")
            
        return ExampleResponse(**result)
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except sqlite3.Error as e:
        logger.error(f"Database error fetching example: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception as e:
        logger.error(f"Unexpected error fetching example: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch example")
```

### Best Practices for Backend Development

1. **Error Handling**
   - Use specific HTTP status codes (400 for bad requests, 404 for not found, 500 for server errors)
   - Log errors with appropriate context and traceability
   - Don't expose internal implementation details in error messages
   - Implement proper exception chaining when wrapping exceptions

2. **Performance Optimization**
   - Use database indexing for frequently queried columns
   - Implement pagination for large dataset responses
   - Use connection pooling for database operations
   - Cache expensive operations when appropriate
   - Profile code to identify bottlenecks

3. **Security**
   - Validate and sanitize all input data
   - Use parameterized queries to prevent SQL injection
   - Implement proper authentication and authorization
   - Use environment variables for sensitive configuration
   - Keep dependencies up to date

4. **Logging**
   - Use appropriate log levels (DEBUG, INFO, WARNING, ERROR)
   - Include contextual information in log messages
   - Don't log sensitive data like passwords or API keys
   - Use structured logging for better searchability

## Frontend Development

### Component Development Guidelines

1. **Component Structure**
   - Use functional components with hooks
   - Implement TypeScript interfaces for props
   - Follow the existing component naming conventions
   - Place components in appropriate directories
   - Use descriptive component names that reflect their purpose
   - Implement proper error boundaries for graceful failure handling

2. **State Management**
   - Use local state for component-specific data with useState/useReducer
   - Leverage React Query (TanStack Query) for server state with caching
   - Implement context for global application state (theme, user preferences)
   - Use custom hooks to encapsulate complex state logic
   - Follow the principle of lifting state up when needed

3. **Styling**
   - Use Tailwind CSS classes primarily for consistent styling
   - Follow the existing design system and component library (shadcn/ui)
   - Implement responsive design principles using Tailwind's breakpoints
   - Use CSS modules for component-specific styles when needed
   - Follow accessibility guidelines for inclusive design

### API Integration

1. **Creating Service Clients**
   ```typescript
   // services/exampleService.ts
   import { apiClient } from './apiClient';
   
   export interface ExampleData {
     id: number;
     name: string;
     value: number;
   }
   
   // Define API error types
   export interface ApiError {
     message: string;
     statusCode: number;
   }
   
   export const exampleService = {
     getExamples: async (): Promise<ExampleData[]> => {
       try {
         const response = await apiClient.get<ExampleData[]>('/api/examples');
         return response.data;
       } catch (error) {
         console.error('Error fetching examples:', error);
         throw new Error('Failed to fetch examples');
       }
     },
     
     createExample: async (data: Omit<ExampleData, 'id'>): Promise<ExampleData> => {
       try {
         const response = await apiClient.post<ExampleData>('/api/examples', data);
         return response.data;
       } catch (error) {
         console.error('Error creating example:', error);
         throw new Error('Failed to create example');
       }
     },
     
     getExampleById: async (id: number): Promise<ExampleData> => {
       try {
         const response = await apiClient.get<ExampleData>(`/api/examples/${id}`);
         return response.data;
       } catch (error: any) {
         if (error.response?.status === 404) {
           throw new Error('Example not found');
         }
         console.error('Error fetching example:', error);
         throw new Error('Failed to fetch example');
       }
     }
   };
   ```

2. **Using Services in Components with React Query**
   ```typescript
   // components/ExampleComponent.tsx
   import React, { useState } from 'react';
   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
   import { exampleService, ExampleData } from '../services/exampleService';
   
   const ExampleComponent: React.FC = () => {
     const queryClient = useQueryClient();
     const [newExampleName, setNewExampleName] = useState('');
     const [newExampleValue, setNewExampleValue] = useState(0);
     
     // Fetch examples with React Query
     const { data: examples, isLoading, isError, error } = useQuery<ExampleData[], Error>({
       queryKey: ['examples'],
       queryFn: exampleService.getExamples
     });
     
     // Mutation for creating new examples
     const createExampleMutation = useMutation({
       mutationFn: exampleService.createExample,
       onSuccess: () => {
         // Invalidate and refetch
         queryClient.invalidateQueries({ queryKey: ['examples'] });
         // Reset form
         setNewExampleName('');
         setNewExampleValue(0);
       },
       onError: (error) => {
         console.error('Failed to create example:', error);
         alert('Failed to create example');
       }
     });
     
     const handleCreateExample = () => {
       if (newExampleName.trim()) {
         createExampleMutation.mutate({
           name: newExampleName,
           value: newExampleValue
         });
       }
     };
     
     if (isLoading) return <div className="p-4">Loading...</div>;
     if (isError) return <div className="p-4 text-red-500">Error: {error.message}</div>;
     
     return (
       <div className="p-4">
         <div className="mb-4">
           <h2 className="text-xl font-bold mb-2">Create New Example</h2>
           <input
             type="text"
             value={newExampleName}
             onChange={(e) => setNewExampleName(e.target.value)}
             placeholder="Example name"
             className="border p-2 mr-2"
           />
           <input
             type="number"
             value={newExampleValue}
             onChange={(e) => setNewExampleValue(Number(e.target.value))}
             placeholder="Value"
             className="border p-2 mr-2"
           />
           <button
             onClick={handleCreateExample}
             disabled={createExampleMutation.isPending}
             className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
           >
             {createExampleMutation.isPending ? 'Creating...' : 'Create'}
           </button>
         </div>
         
         <div>
           <h2 className="text-xl font-bold mb-2">Examples</h2>
           {examples && examples.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {examples.map(example => (
                 <div key={example.id} className="border p-4 rounded shadow">
                   <h3 className="font-semibold">{example.name}</h3>
                   <p>Value: {example.value}</p>
                 </div>
               ))}
             </div>
           ) : (
             <p>No examples found</p>
           )}
         </div>
       </div>
     );
   };
   
   export default ExampleComponent;
   ```

### Best Practices for Frontend Development

1. **Performance Optimization**
   - Use React.memo for components that render frequently
   - Implement useMemo and useCallback for expensive computations
   - Lazy load components when appropriate
   - Optimize bundle size with code splitting
   - Use React Query's built-in caching mechanisms
   - Implement proper loading and error states

2. **Accessibility**
   - Use semantic HTML elements
   - Implement proper ARIA attributes
   - Ensure keyboard navigation support
   - Provide sufficient color contrast
   - Use descriptive alt text for images

3. **Testing**
   - Write unit tests for complex components
   - Implement integration tests for critical user flows
   - Use React Testing Library for component testing
   - Test both successful and error scenarios
   - Mock API calls in tests

4. **Code Organization**
   - Organize components by feature rather than type
   - Use barrel exports for cleaner imports
   - Implement consistent naming conventions
   - Follow the single responsibility principle
   - Use TypeScript for type safety

## Testing Guidelines

### Backend Testing
- Write unit tests for utility functions and business logic
- Implement integration tests for API endpoints
- Use pytest for test execution with pytest-asyncio for async tests
- Mock external dependencies appropriately using unittest.mock or pytest-mock
- Test both successful and error scenarios
- Use fixtures for test data setup
- Implement test coverage reporting
- Test database operations with temporary test databases

#### Example Backend Test
```python
# tests/test_example_route.py
import pytest
from fastapi.testclient import TestClient
from aegis_backend.fastapi_server import app
from unittest.mock import patch, MagicMock

client = TestClient(app)

@pytest.fixture
def mock_database():
    with patch('aegis_backend.routes.example.sqlite3.connect') as mock_connect:
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        yield mock_cursor

@pytest.mark.asyncio
class TestExampleRoutes:
    def test_create_example_success(self, mock_database):
        # Arrange
        mock_database.execute.return_value.lastrowid = 1
        
        # Act
        response = client.post('/api/example', json={'name': 'test', 'value': 42})
        
        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data['id'] == 1
        assert data['name'] == 'test'
        assert data['value'] == 42
    
    def test_get_example_not_found(self, mock_database):
        # Arrange
        mock_database.fetchone.return_value = None
        
        # Act
        response = client.get('/api/example/999')
        
        # Assert
        assert response.status_code == 404

    def test_get_example_success(self, mock_database):
        # Arrange
        mock_database.fetchone.return_value = (1, 'test', 42)
        
        # Act
        response = client.get('/api/example/1')
        
        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data['id'] == 1
        assert data['name'] == 'test'
        assert data['value'] == 42
```

### Frontend Testing
- Write unit tests for complex components and custom hooks
- Implement integration tests for critical user flows
- Use Jest and React Testing Library with TypeScript support
- Test both successful and error scenarios
- Mock API calls using msw (Mock Service Worker)
- Test user interactions and state changes
- Implement snapshot testing for UI components
- Use React Testing Library's best practices (query by role, avoid implementation details)

#### Example Frontend Test
```typescript
// components/__tests__/ExampleComponent.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ExampleComponent from '../ExampleComponent';

// Mock the service
jest.mock('../../services/exampleService', () => ({
  exampleService: {
    getExamples: jest.fn(),
    createExample: jest.fn()
  }
}));

import { exampleService } from '../../services/exampleService';

const mockExamples = [
  { id: 1, name: 'Test 1', value: 42 },
  { id: 2, name: 'Test 2', value: 84 }
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('ExampleComponent', () => {
  beforeEach(() => {
    (exampleService.getExamples as jest.Mock).mockResolvedValue(mockExamples);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders examples correctly', async () => {
    renderWithProviders(<ExampleComponent />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Test 1')).toBeInTheDocument();
      expect(screen.getByText('Test 2')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    (exampleService.getExamples as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    
    renderWithProviders(<ExampleComponent />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('creates new example', async () => {
    const user = userEvent.setup();
    (exampleService.createExample as jest.Mock).mockResolvedValue({
      id: 3,
      name: 'New Test',
      value: 126
    });
    
    renderWithProviders(<ExampleComponent />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test 1')).toBeInTheDocument();
    });
    
    // Fill form and submit
    const nameInput = screen.getByPlaceholderText('Example name');
    const valueInput = screen.getByPlaceholderText('Value');
    const createButton = screen.getByText('Create');
    
    await user.type(nameInput, 'New Test');
    await user.type(valueInput, '126');
    await user.click(createButton);
    
    expect(exampleService.createExample).toHaveBeenCalledWith({
      name: 'New Test',
      value: 126
    });
  });
});
```

### Test Execution

#### Backend Tests
```bash
# Run all backend tests
pytest tests/

# Run tests with coverage
pytest --cov=aegis_backend tests/

# Run specific test file
pytest tests/test_example_route.py

# Run tests in parallel
pytest -n auto tests/
```

#### Frontend Tests
```bash
# Run all frontend tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- components/__tests__/ExampleComponent.test.tsx

# Run tests with coverage
npm test -- --coverage
```

### Continuous Integration
- All tests must pass before merging
- Maintain test coverage above 80%
- Run tests on all supported platforms
- Use GitHub Actions or similar CI/CD platforms
- Implement automated testing for pull requests

## Code Quality Standards

### Python Backend
- Follow PEP 8 style guidelines with Black formatter
- Use type hints for all function signatures and return types
- Write docstrings for all public functions using Google-style or NumPy-style
- Keep functions focused and small (single responsibility principle)
- Use logging instead of print statements with appropriate log levels
- Implement proper exception handling with context managers
- Use constants for magic values and configuration
- Follow naming conventions (snake_case for variables/functions, PascalCase for classes)
- Use list/dict comprehensions appropriately for readable code
- Implement proper error messages with context

#### Example of High-Quality Python Code
```python
import logging
from typing import List, Optional, Dict, Any
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class ExampleConfig:
    """Configuration for example processing."""
    max_retries: int = 3
    timeout_seconds: int = 30
    enable_logging: bool = True

class ExampleProcessor:
    """Processes example data with proper error handling and logging."""
    
    def __init__(self, config: ExampleConfig):
        """Initialize the processor with configuration.
        
        Args:
            config: Configuration object for processing parameters
        """
        self.config = config
        self.retry_count = 0
    
    def process_examples(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process a list of example data items.
        
        Args:
            data: List of dictionaries containing example data
            
        Returns:
            List of processed example data
            
        Raises:
            ValueError: If data is invalid
            RuntimeError: If processing fails after retries
        """
        if not isinstance(data, list):
            raise ValueError(f"Expected list, got {type(data)}")
            
        processed_items = []
        
        for item in data:
            try:
                processed_item = self._process_single_item(item)
                processed_items.append(processed_item)
            except Exception as e:
                logger.error(f"Failed to process item {item.get('id', 'unknown')}: {e}")
                if self.retry_count < self.config.max_retries:
                    self.retry_count += 1
                    logger.info(f"Retrying... Attempt {self.retry_count}/{self.config.max_retries}")
                    # Retry logic here
                else:
                    raise RuntimeError(f"Failed to process item after {self.config.max_retries} attempts") from e
                    
        return processed_items
        
    def _process_single_item(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Process a single data item.
        
        Args:
            item: Dictionary containing item data
            
        Returns:
            Processed item dictionary
        """
        # Implementation details...
        return item
```

### TypeScript Frontend
- Enable strict TypeScript checking with `strict: true` in tsconfig
- Use interfaces for object shapes and types for primitives
- Avoid `any` type when possible; use `unknown` for truly unknown types
- Follow functional programming principles with pure functions
- Use React hooks appropriately and follow the Rules of Hooks
- Implement proper error boundaries for graceful failure handling
- Use generics for reusable components and functions
- Follow naming conventions (camelCase for variables/functions, PascalCase for components/types)
- Use destructuring for cleaner code
- Implement proper prop validation with PropTypes or TypeScript interfaces

#### Example of High-Quality TypeScript Code
```typescript
import { useState, useEffect, useCallback } from 'react';

// Define interfaces for type safety
interface ExampleItem {
  id: number;
  name: string;
  value: number;
  createdAt: string;
}

interface ExampleState {
  items: ExampleItem[];
  loading: boolean;
  error: string | null;
}

// Custom hook for example data management
const useExampleData = () => {
  const [state, setState] = useState<ExampleState>({
    items: [],
    loading: false,
    error: null
  });

  const fetchItems = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate API call
      const response = await fetch('/api/examples');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const items: ExampleItem[] = await response.json();
      setState({ items, loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: `Failed to fetch items: ${errorMessage}` 
      }));
    }
  }, []);

  const addItem = useCallback(async (item: Omit<ExampleItem, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/examples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newItem: ExampleItem = await response.json();
      setState(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to add item: ${errorMessage}`);
    }
  }, []);

  return { ...state, fetchItems, addItem };
};

// Component using the custom hook
const ExampleComponent = () => {
  const { items, loading, error, fetchItems, addItem } = useExampleData();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Example Items</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name}: {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExampleComponent;
```

### General Code Quality Principles

1. **Readability**
   - Write code for humans first, computers second
   - Use descriptive variable and function names
   - Keep functions short and focused
   - Add comments for complex logic, not obvious code
   - Follow consistent formatting and style

2. **Maintainability**
   - Follow SOLID principles for object-oriented design
   - Use design patterns appropriately
   - Implement proper separation of concerns
   - Write modular, reusable code
   - Document public APIs and complex algorithms

3. **Performance**
   - Profile code to identify bottlenecks
   - Use efficient algorithms and data structures
   - Implement lazy loading when appropriate
   - Cache expensive operations
   - Minimize memory allocations

4. **Security**
   - Validate and sanitize all input
   - Use parameterized queries to prevent injection
   - Protect sensitive data
   - Implement proper authentication and authorization
   - Keep dependencies updated

## Git Workflow

### Branch Strategy
- `main`: Production-ready code with stable releases
- `develop`: Integration branch for features and ongoing development
- `feature/*`: Individual feature branches for new functionality
- `hotfix/*`: Urgent production fixes that need immediate deployment
- `release/*`: Release preparation branches for version tagging
- `bugfix/*`: Non-urgent bug fixes for the next release

Branch naming conventions:
- Feature branches: `feature/descriptive-name`
- Bug fix branches: `bugfix/issue-description`
- Hotfix branches: `hotfix/critical-issue`
- Release branches: `release/v1.2.3`

### Commit Guidelines
- Use conventional commit messages following the Conventional Commits specification
- Keep commits focused and atomic (one logical change per commit)
- Reference issue numbers when applicable (e.g., "Fixes #123")
- Write clear, descriptive commit messages in present tense
- Separate subject from body with a blank line
- Limit subject line to 50 characters
- Wrap body at 72 characters
- Use imperative mood in subject line ("Add feature" not "Added feature")

#### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

Example:
```
feat(directors): add director family information API

Implement new endpoint to retrieve family information for directors
using enhanced Indian name matching algorithm.

Closes #456
```

### Pull Request Process
1. Ensure all tests pass locally and in CI
2. Update documentation if needed (API changes, new features)
3. Get code review from at least one team member
4. Address all review comments before merging
5. Squash commits when merging to maintain clean history
6. Use merge commits for preserving branch history when beneficial
7. Delete feature branches after merging

#### Pull Request Template
When creating a pull request, include:

1. **Description**: Clear explanation of changes
2. **Related Issues**: Links to any related issues
3. **Type of Change**: Feature, Bug Fix, Refactor, etc.
4. **Checklist**:
   - [ ] Tests pass
   - [ ] Documentation updated
   - [ ] Code reviewed
   - [ ] Commits squashed
5. **Screenshots**: If UI changes are included
6. **Testing Instructions**: Steps to verify the changes

### Code Review Guidelines

Reviewers should check for:
1. **Correctness**: Does the code work as intended?
2. **Clarity**: Is the code easy to understand?
3. **Efficiency**: Are there performance concerns?
4. **Security**: Are there potential vulnerabilities?
5. **Style**: Does it follow coding standards?
6. **Test Coverage**: Are there adequate tests?
7. **Documentation**: Is the code properly documented?

### Git Hooks
The project uses pre-commit hooks to enforce code quality:
- Run linters before commits
- Run tests before pushes
- Check for secrets in code
- Validate commit message format

To set up git hooks:
```bash
git config core.hooksPath .githooks
```

### Release Process
1. Create release branch from develop
2. Update version numbers in relevant files
3. Run complete test suite
4. Merge release branch to main
5. Tag the release in main
6. Merge main back to develop
7. Deploy to production
8. Announce release to team

## Deployment Process

### Development Deployment

For local development, use the integrated development server:

```bash
# Start both frontend and backend in development mode
npm run dev:all:fastapi

# Alternative: Start only frontend
npm run dev:frontend

# Alternative: Start only backend
npm run dev:backend:fastapi
```

This will start:
- Frontend development server at `http://localhost:5173`
- Backend API server at `http://localhost:8000`
- Hot reloading for both frontend and backend changes

### Production Build

For production deployment, build and serve the application:

```bash
# Build the frontend application
npm run build

# Serve the built application with SSL
npm run serve:ssl

# Alternative: Serve without SSL
npm run serve

# Alternative: Run only the backend
npm run backend:fastapi
```

Production deployment considerations:
- Ensure SSL certificates are properly configured
- Set appropriate environment variables
- Configure proper database paths
- Set DEBUG=false for production
- Use production logging levels

### Docker Deployment

While Docker support is planned, you can create a basic Docker setup:

```dockerfile
# Dockerfile
FROM node:16 AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM python:3.8
WORKDIR /app
COPY Backend/aegis_backend/requirements.txt .
RUN pip install -r requirements.txt
COPY Backend/aegis_backend/ .
COPY --from=frontend-build /app/dist ./dist
EXPOSE 8000
CMD ["python", "fastapi_server.py"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  aegis-platform:
    build: .
    ports:
      - "8000:8000"
    environment:
      - PORT=8000
      - DEBUG=false
    volumes:
      - ./Backend/aegis_backend/public:/app/public
```

To deploy with Docker:
```bash
# Build the Docker image
docker build -t aegis-platform .

# Run the container
docker run -p 8000:8000 -v $(pwd)/Backend/aegis_backend/public:/app/public aegis-platform

# Or use Docker Compose
docker-compose up
```

### Environment Configuration

Ensure proper environment configuration for deployment:

```env
# .env file for production
NODE_ENV=production
DEBUG=false
HOST=0.0.0.0
PORT=8000

# Database paths
DIRECTORS_DB_PATH=./public/directors_data.db
NOTIFICATIONS_DB_PATH=./public/notifications.db
SEBI_DB_PATH=./public/sebi_excel_master.db
RBI_DB_PATH=./public/rbi.db

# Logging
LOG_LEVEL=INFO
LOG_FILE=./logs/app.log

# Feature flags
ENABLE_CHATBOT=true
ENABLE_INSIDER_TRADING=true
ENABLE_MEETING_MINUTES=true

# LLM Configuration
LLM_PROVIDER=groq
GROQ_API_KEY=your-groq-api-key
# or for Azure
# LLM_PROVIDER=azure
# AZURE_OPENAI_KEY=your-azure-key
# AZURE_OPENAI_ENDPOINT=your-azure-endpoint
```

### SSL Configuration

For production SSL deployment:

1. Generate SSL certificates:
   ```bash
   mkdir -p ssl
   openssl genrsa -out ssl/key.pem 2048
   openssl req -new -key ssl/key.pem -out ssl/csr.pem
   openssl x509 -req -days 365 -in ssl/csr.pem -signkey ssl/key.pem -out ssl/cert.pem
   ```

2. Ensure certificates are in the `ssl/` directory
3. The FastAPI server will automatically use these certificates when running with SSL support

### Database Migration

When deploying updates that require database schema changes:

1. Backup existing databases
2. Apply schema migrations (when implemented)
3. Validate data integrity
4. Test with sample data

### Monitoring and Logging

Production deployments should include:
- Application performance monitoring
- Error tracking and alerting
- Log aggregation and analysis
- Health check endpoints
- Resource usage monitoring

Health check endpoint: `GET /health`
Returns: `{"status": "healthy", "service": "Financial Data API", "timestamp": "2025-01-01T00:00:00"}`

## Troubleshooting Common Issues

### Backend Issues

1. **Database Connection Errors**
   - Verify database file permissions
   - Check database path configuration
   - Ensure database initialization scripts have run
   - Confirm SQLite database files exist in the correct locations
   - Check for file locks or permission issues
   - Validate database schema integrity

2. **API Route Not Found**
   - Verify route registration in fastapi_server.py
   - Check route path spelling and HTTP method
   - Confirm route module is imported
   - Ensure the route handler function is properly decorated
   - Check for typos in route prefixes

3. **LLM Integration Failures**
   - Verify API keys are correctly configured in environment variables
   - Check network connectivity to LLM provider
   - Confirm LLM provider is correctly selected (Groq vs Azure)
   - Validate prompt formatting and token limits
   - Check for rate limiting or quota exceeded errors

4. **Thread Pool Exhaustion**
   - Monitor for长时间 running operations
   - Check for deadlocks or blocking operations
   - Increase thread pool size if necessary (currently 4 workers)
   - Implement proper timeouts for long-running operations

5. **File Processing Errors**
   - Verify file upload permissions
   - Check file size limits
   - Confirm supported file formats (DOCX, TXT)
   - Validate file corruption or format issues
   - Check available disk space

### Frontend Issues

1. **Component Not Rendering**
   - Check for TypeScript compilation errors
   - Verify component imports and exports
   - Confirm props are passed correctly
   - Check for missing dependencies or incorrect versions
   - Validate React component lifecycle methods
   - Ensure proper error boundary implementation

2. **API Calls Failing**
   - Check browser console for network errors
   - Verify API endpoint URLs
   - Confirm backend server is running
   - Check CORS configuration
   - Validate request headers and authentication
   - Inspect network tab for detailed error information

3. **Performance Issues**
   - Use React DevTools to identify re-rendering issues
   - Check for memory leaks
   - Optimize expensive calculations with useMemo/useCallback
   - Implement virtual scrolling for large datasets
   - Use React Query's caching appropriately
   - Profile with browser dev tools

4. **Styling Problems**
   - Verify Tailwind CSS classes are correctly applied
   - Check for conflicting CSS rules
   - Confirm responsive design breakpoints
   - Validate dark/light theme compatibility
   - Check for missing CSS imports

### Environment Issues

1. **Dependency Installation Failures**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and package-lock.json
   - Reinstall dependencies: `npm install`
   - Check Node.js and Python versions
   - Verify package compatibility

2. **Environment Variable Issues**
   - Confirm .env file is in the correct location
   - Verify variable names match expected configuration
   - Check for proper quoting of values with spaces
   - Restart development server after environment changes
   - Use process.env to access variables in frontend

3. **SSL Certificate Issues**
   - Regenerate certificates if expired
   - Verify certificate file permissions
   - Check certificate paths in configuration
   - Confirm certificate validity dates
   - Test with self-signed certificates for development

### Debugging Techniques

1. **Backend Debugging**
   - Use logging with different levels (DEBUG, INFO, WARNING, ERROR)
   - Add breakpoint debugging with pdb or IDE debugger
   - Monitor log files for error patterns
   - Use Postman or curl for API testing
   - Check FastAPI documentation at `/api/docs`

2. **Frontend Debugging**
   - Use browser developer tools
   - Add console.log statements strategically
   - Use React DevTools for component inspection
   - Monitor network requests in browser dev tools
   - Check for JavaScript errors in console

3. **Database Debugging**
   - Use SQLite command-line tools to inspect databases
   - Check database schema with `.schema` command
   - Validate data integrity with SELECT queries
   - Monitor database locks and performance
   - Use database browser tools for visualization

### Common Error Messages and Solutions

1. **"Module not found"**
   - Check import paths for typos
   - Verify file exists at specified location
   - Confirm case sensitivity of filenames
   - Check for circular dependencies

2. **"Database is locked"**
   - Close other applications using the database
   - Check for unclosed database connections
   - Implement proper connection management
   - Use database connection pooling

3. **"CORS error"**
   - Check CORS configuration in fastapi_server.py
   - Verify allowed origins list
   - Confirm request origin matches allowed patterns
   - Check for credentials and header restrictions

4. **"Network error"**
   - Confirm backend server is running
   - Check firewall and network settings
   - Verify API endpoint URLs
   - Test with curl or Postman

5. **"Permission denied"**
   - Check file and directory permissions
   - Run with appropriate user privileges
   - Verify environment variable access
   - Check for read/write restrictions

## Performance Optimization

### Backend Optimization

1. **Database Optimization**
   - Use database indexes for frequently queried fields
   - Implement proper indexing on foreign keys and commonly filtered columns
   - Use EXPLAIN QUERY PLAN to analyze query performance
   - Optimize complex queries with proper JOINs and WHERE clauses
   - Implement connection pooling for database operations
   - Use prepared statements for repeated queries
   - Monitor database performance with profiling tools

2. **Caching Strategies**
   - Implement caching for expensive operations with appropriate TTL
   - Use in-memory caching for frequently accessed data
   - Implement Redis or similar caching solutions for distributed caching
   - Cache API responses for non-critical real-time data
   - Use CDN for static assets
   - Implement cache warming for predictable traffic patterns

3. **Asynchronous Processing**
   - Use async/await for I/O-bound operations
   - Implement thread pools for CPU-intensive tasks
   - Use background tasks for non-critical operations
   - Implement proper queueing systems for batch processing
   - Use streaming for large data transfers
   - Implement pagination for large dataset responses

4. **Code Profiling**
   - Profile code to identify bottlenecks using cProfile or similar tools
   - Monitor memory usage and identify leaks
   - Use performance monitoring tools in production
   - Implement tracing for complex workflows
   - Optimize algorithms and data structures
   - Minimize external API calls

### Frontend Optimization

1. **Component Optimization**
   - Implement React.memo for expensive components to prevent unnecessary re-renders
   - Use useMemo and useCallback for expensive calculations and stable function references
   - Lazy load components when appropriate using React.lazy and Suspense
   - Optimize bundle size with code splitting and dynamic imports
   - Use virtual scrolling for large lists
   - Implement proper error boundaries
   - Optimize images with appropriate formats and sizes

2. **Data Fetching Optimization**
   - Use React Query's built-in caching mechanisms
   - Implement proper pagination for large datasets
   - Use optimistic updates for better perceived performance
   - Implement request deduplication
   - Use background data fetching
   - Implement proper loading states

3. **Bundle Optimization**
   - Analyze bundle size with webpack-bundle-analyzer
   - Remove unused dependencies
   - Use tree shaking to eliminate dead code
   - Implement code splitting for routes and features
   - Minify CSS and JavaScript
   - Compress assets
   - Use modern JavaScript features with proper transpilation

4. **Rendering Performance**
   - Use windowing/virtualization for long lists
   - Optimize CSS selectors and avoid forced synchronous layouts
   - Use CSS containment for complex components
   - Implement proper key props in lists
   - Avoid inline object and function creation in render
   - Use CSS transforms and opacity for animations

### Monitoring and Metrics

1. **Backend Monitoring**
   - Monitor API response times
   - Track database query performance
   - Monitor memory and CPU usage
   - Implement error rate tracking
   - Monitor throughput and latency
   - Set up alerts for performance degradation

2. **Frontend Monitoring**
   - Monitor Core Web Vitals (LCP, FID, CLS)
   - Track JavaScript bundle sizes
   - Monitor API call performance
   - Implement user experience tracking
   - Use performance budgets
   - Monitor error rates and crash reporting

3. **Profiling Tools**
   - Backend: cProfile, py-spy, or similar Python profilers
   - Frontend: React DevTools Profiler, Chrome DevTools Performance tab
   - Database: SQLite EXPLAIN QUERY PLAN, database-specific profiling tools
   - Network: Browser Network tab, server-side request logging

## Security Considerations

### Backend Security

1. **Input Validation and Sanitization**
   - Validate and sanitize all input data at API boundaries
   - Use Pydantic models for automatic validation
   - Implement proper data type checking
   - Sanitize file uploads and document content
   - Validate file types and sizes
   - Implement rate limiting to prevent abuse

2. **Database Security**
   - Use parameterized queries to prevent SQL injection
   - Implement proper database user permissions
   - Encrypt sensitive data at rest
   - Use secure database connection strings
   - Regularly update database software
   - Implement proper backup and recovery procedures

3. **Authentication and Authorization**
   - Implement proper authentication and authorization
   - Use JWT or session-based authentication
   - Implement role-based access control (RBAC)
   - Secure password storage with proper hashing
   - Implement multi-factor authentication where appropriate
   - Use secure session management

4. **Dependency Management**
   - Keep dependencies up to date with security patches
   - Use dependency scanning tools (safety, bandit)
   - Pin dependency versions to prevent unexpected updates
   - Regularly audit dependencies for vulnerabilities
   - Use trusted sources for dependencies

5. **API Security**
   - Implement proper CORS policies
   - Use HTTPS in production environments
   - Implement API rate limiting
   - Use secure API keys and tokens
   - Implement request validation
   - Log security-relevant events

### Frontend Security

1. **Content Security**
   - Sanitize user-generated content before rendering
   - Use DOMPurify or similar libraries for HTML sanitization
   - Implement Content Security Policy (CSP)
   - Prevent XSS attacks with proper escaping
   - Validate and sanitize API responses before use
   - Implement proper error handling without exposing internals

2. **Secure Communication**
   - Use secure HTTP headers
   - Implement HTTPS for all production traffic
   - Use secure cookies with HttpOnly and SameSite flags
   - Implement proper TLS configuration
   - Validate SSL certificates

3. **Client-Side Security**
   - Avoid exposing sensitive information in client code
   - Implement proper client-side validation as a convenience, not security measure
   - Use environment variables for sensitive configuration
   - Implement proper error handling without exposing stack traces
   - Validate user input on the client as a UX enhancement

4. **Third-Party Libraries**
   - Audit third-party libraries for security vulnerabilities
   - Keep frontend dependencies updated
   - Use Subresource Integrity (SRI) for CDN resources
   - Implement proper CSP directives for external resources

### Environment Security

1. **Secrets Management**
   - Use environment variables for sensitive configuration
   - Never commit secrets to version control
   - Use secret scanning tools
   - Rotate API keys and secrets regularly
   - Implement proper secret rotation procedures

2. **Configuration Security**
   - Use different configurations for development and production
   - Disable debug modes in production
   - Implement proper logging without sensitive data
   - Use secure defaults for all configuration options

3. **Infrastructure Security**
   - Implement proper firewall rules
   - Use secure network configurations
   - Regularly update system software
   - Implement proper backup and disaster recovery
   - Monitor for unauthorized access attempts

### Security Testing

1. **Automated Security Scanning**
   - Use static analysis tools for code scanning
   - Implement dependency vulnerability scanning
   - Use penetration testing tools
   - Regularly scan for known vulnerabilities

2. **Manual Security Reviews**
   - Conduct regular security code reviews
   - Perform threat modeling
   - Review authentication and authorization flows
   - Audit data handling practices

3. **Compliance Considerations**
   - Implement data protection measures (GDPR, CCPA)
   - Ensure proper data retention policies
   - Implement audit logging for security events
   - Follow industry security standards and best practices

By following these guidelines, developers can contribute effectively to the AEGIS Platform while maintaining code quality and consistency across the codebase.
