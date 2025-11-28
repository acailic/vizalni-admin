graph TB
    A[data.gov.rs API] --> B[API Client]
    B --> C[GraphQL Layer]
    C --> D[React UI Components]
    D --> E[Chart Rendering Engine]
    F[User] --> D
    D --> G[Export Services]
    H[Database] --> C
    I[File Storage] --> G
```

The architecture follows a layered approach with clear separation of concerns:
- **Data Layer**: Handles external API integration and data transformation
- **Application Layer**: Manages business logic and state
- **Presentation Layer**: Provides user interface and visualization rendering
- **Infrastructure Layer**: Manages persistence, caching, and deployment

## Component Structure

```mermaid
graph TD
    A[vizualni-admin/] --> B[app/]
    A --> C[docs/]
    A --> D[e2e/]
    A --> E[scripts/]
    A --> F[embed/]
    
    B --> G[pages/]
    B --> H[components/]
    B --> I[charts/]
    B --> J[domain/]
    B --> K[configurator/]
    B --> L[browse/]
    B --> M[locales/]
    B --> N[graphql/]
    B --> O[bin/]
    
    J --> P[data-gov-rs/]
    O --> Q[commands/]
```

### Key Components

- **pages/**: Next.js page components and routing
- **components/**: Reusable React UI components
- **charts/**: Chart implementations using D3.js and Vega
- **domain/**: Business logic and domain models
- **configurator/**: Chart configuration interface
- **browse/**: Dataset browsing and search functionality
- **locales/**: Internationalization and localization
- **graphql/**: GraphQL schema and resolvers
- **bin/**: CLI tools and commands

## Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as React UI
    participant GQL as GraphQL Layer
    participant API as API Client
    participant EXT as data.gov.rs API
    participant DB as Database

    U->>UI: Browse datasets
    UI->>GQL: Query datasets
    GQL->>API: Fetch from data.gov.rs
    API->>EXT: REST API call
    EXT-->>API: Dataset metadata
    API-->>GQL: Transformed data
    GQL-->>UI: GraphQL response
    UI-->>U: Display datasets

    U->>UI: Create visualization
    UI->>GQL: Save configuration
    GQL->>DB: Persist to PostgreSQL
    DB-->>GQL: Confirmation
    GQL-->>UI: Success response
    UI->>UI: Render chart
    UI-->>U: Display visualization
```

### Data Processing Pipeline

1. **Ingestion**: Data is fetched from data.gov.rs REST API
2. **Transformation**: Raw data is normalized and transformed via GraphQL resolvers
3. **Caching**: Frequently accessed data is cached in Redis/memory
4. **Presentation**: Data is formatted for chart rendering engines
5. **Export**: Visualizations can be exported in multiple formats

## State Management

The application uses a combination of local and global state management:

```mermaid
graph LR
    A[Local State] --> B[React useState/useReducer]
    C[Global State] --> D[Zustand Store]
    E[Server State] --> F[React Query]
    G[Form State] --> H[React Hook Form]
    
    B --> I[Component State]
    D --> J[App-wide State]
    F --> K[API Data]
    H --> L[User Input]
```

### State Management Strategy

- **Local State**: Component-specific state using React hooks
- **Global State**: Application-wide state using Zustand for simplicity and performance
- **Server State**: API data management with React Query for caching and synchronization
- **Form State**: Complex form handling with React Hook Form and validation

**Design Decision**: Chose Zustand over Redux for its lightweight footprint and simpler API, reducing bundle size by ~30KB compared to Redux Toolkit.

## API Integration

```mermaid
graph TD
    A[API Client] --> B[data.gov.rs REST API]
    A --> C[GraphQL Server]
    C --> D[Database]
    C --> E[External Services]
    
    B --> F[Endpoints]
    F --> G[/api/1/datasets/]
    F --> H[/api/1/organizations/]
    F --> I[/api/1/resources/]
    
    C --> J[Schema]
    J --> K[Queries]
    J --> L[Mutations]
    J --> M[Subscriptions]
```

### API Client Architecture

The API client (`app/domain/data-gov-rs/client.ts`) provides:
- Type-safe HTTP requests with TypeScript interfaces
- Automatic retry logic with exponential backoff
- Request/response interceptors for logging and error handling
- Caching layer to reduce API calls
- Rate limiting to respect API quotas

**Trade-off**: REST API integration instead of GraphQL for external APIs due to data.gov.rs limitations, with internal GraphQL layer for flexibility.

## Build Pipeline

```mermaid
graph TD
    A[Source Code] --> B[TypeScript Compiler]
    B --> C[ESLint]
    C --> D[Prettier]
    D --> E[Vitest]
    E --> F[Playwright E2E]
    F --> G[Bundle Analysis]
    G --> H[Build Artifacts]
    
    I[CI/CD] --> J[GitHub Actions]
    J --> K[Test Matrix]
    K --> L[Node 18, 20, 22]
    L --> M[Coverage Report]
    M --> N[Codecov]
```

### Build Process

1. **Linting & Formatting**: ESLint and Prettier ensure code quality
2. **Type Checking**: TypeScript compilation with strict mode
3. **Unit Testing**: Vitest for fast, isolated component testing
4. **Integration Testing**: Playwright for end-to-end user flows
5. **Bundle Analysis**: Size monitoring and optimization
6. **Artifact Generation**: Optimized bundles for different targets

**Design Decision**: Multi-stage Docker builds for efficient layer caching and smaller production images.

## Deployment Architecture

```mermaid
graph TD
    A[Git Push] --> B[GitHub Actions]
    B --> C[Build & Test]
    C --> D{Environment}
    D --> E[Development]
    D --> F[Staging]
    D --> G[Production]
    
    E --> H[Vercel Dev]
    F --> I[Vercel Preview]
    G --> J[Vercel Prod]
    
    G --> K[Docker Build]
    K --> L[Container Registry]
    L --> M[Kubernetes]
    M --> N[Load Balancer]
    N --> O[CDN]