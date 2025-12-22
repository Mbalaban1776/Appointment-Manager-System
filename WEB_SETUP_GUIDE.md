# Web Application Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- pnpm (or npm) package manager
- Git

### Step 1: Initialize Project

```bash
# Create new React + TypeScript project with Vite
pnpm create vite appointment-web --template react-ts

# Navigate to project
cd appointment-web

# Install dependencies
pnpm install
```

### Step 2: Install Core Dependencies

```bash
# UI Framework
pnpm add @mui/material @emotion/react @emotion/styled
pnpm add @mui/icons-material

# Calendar
pnpm add react-big-calendar moment
pnpm add -D @types/react-big-calendar

# State Management
pnpm add zustand @tanstack/react-query

# HTTP Client
pnpm add axios

# Routing
pnpm add react-router-dom

# Forms
pnpm add react-hook-form zod @hookform/resolvers

# Real-time
pnpm add socket.io-client

# Date handling
pnpm add date-fns

# Charts (for reports)
pnpm add recharts
```

### Step 3: Install Dev Dependencies

```bash
# Testing
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D jsdom

# Code Quality
pnpm add -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
pnpm add -D husky lint-staged

# E2E Testing
pnpm add -D @playwright/test
```

### Step 4: Project Structure

Create the following folder structure:

```
src/
├── components/
│   ├── common/          # Reusable components (Button, Input, etc.)
│   ├── calendar/        # Calendar-specific components
│   ├── forms/           # Form components
│   └── layout/          # Layout components (Header, Sidebar, etc.)
├── pages/               # Page components
│   ├── Dashboard/
│   ├── Appointments/
│   ├── Resources/
│   ├── Services/
│   ├── Clients/
│   └── Reports/
├── hooks/               # Custom React hooks
│   ├── useAppointments.ts
│   ├── useAuth.ts
│   └── useWebSocket.ts
├── services/            # API and external services
│   ├── api/
│   │   ├── appointments.ts
│   │   ├── resources.ts
│   │   ├── services.ts
│   │   └── clients.ts
│   ├── websocket/
│   │   └── socket.ts
│   └── auth/
│       └── authService.ts
├── store/               # Zustand stores
│   ├── authStore.ts
│   └── uiStore.ts
├── types/               # TypeScript type definitions
│   ├── appointment.ts
│   ├── resource.ts
│   ├── service.ts
│   └── user.ts
├── utils/               # Utility functions
│   ├── dateUtils.ts
│   ├── validation.ts
│   └── constants.ts
├── constants/           # Constants
│   └── config.ts
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

### Step 5: Configuration Files

#### `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### `.env.local`
```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_APP_NAME=Appointment Management System
```

### Step 6: Basic Setup Files

#### `src/services/api/client.ts`
```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

#### `src/services/websocket/socket.ts`
```typescript
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (token: string): Socket => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(import.meta.env.VITE_WS_URL, {
    transports: ['websocket'],
    auth: {
      token,
    },
  });

  socket.on('connect', () => {
    console.log('WebSocket connected');
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
```

#### `src/store/authStore.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'staff' | 'manager' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token, user) => {
        set({ token, user, isAuthenticated: true });
        localStorage.setItem('authToken', token);
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('authToken');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

#### `src/App.tsx` (Basic Setup)
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Appointments from './pages/Appointments';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
```

### Step 7: Run Development Server

```bash
# Start dev server
pnpm dev

# The app will be available at http://localhost:3001
```

## Next Steps

1. **Set up authentication flow**
2. **Create basic layout components** (Header, Sidebar, Footer)
3. **Implement calendar view** for appointments
4. **Connect to backend API**
5. **Set up WebSocket for real-time updates**
6. **Add form components** for booking
7. **Implement routing and protected routes**

## Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Testing
pnpm test             # Run unit tests
pnpm test:ui          # Run tests in UI mode
pnpm test:e2e         # Run E2E tests

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
pnpm type-check       # Check TypeScript types
```

## Integration Checklist

- [ ] Backend API endpoint configured
- [ ] CORS enabled on backend for web app domain
- [ ] WebSocket endpoint configured
- [ ] Authentication endpoint working
- [ ] API response format agreed upon
- [ ] Error handling strategy defined
- [ ] Environment variables set

## Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [React Query Documentation](https://tanstack.com/query)
- [React Router Documentation](https://reactrouter.com)

