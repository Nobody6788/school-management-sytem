# CampusFlow - Technical Documentation

This document provides technical details about the CampusFlow school management system architecture, components, and development guidelines.

## Architecture Overview

CampusFlow is built on a modern web stack with Next.js as the core framework. It follows a component-based architecture with clear separation of concerns:

- **Pages**: Route-based components that serve as entry points
- **Components**: Reusable UI elements
- **Hooks**: Custom React hooks for shared functionality
- **Lib**: Utility functions and data models
- **AI**: Integration with AI services for enhanced features

## Key Technologies

### Frontend Framework
- **Next.js 15.x**: Server-side rendering, API routes, and file-based routing
- **React 18.x**: Component-based UI development with hooks
- **TypeScript**: Type-safe JavaScript for improved developer experience

### UI Components
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: For creating variant components
- **clsx/tailwind-merge**: For conditional class composition

### Data Management
- **React Context**: For state management across components
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for forms and data

### Data Visualization
- **Recharts**: Responsive chart components for data visualization
- **date-fns**: Date manipulation library

### Authentication
- **Firebase**: Authentication and user management

## Component Structure

### UI Components
The UI components follow a consistent pattern:

```typescript
// Button component example
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### Page Structure

Pages follow the Next.js App Router pattern:

```typescript
// Example page structure
'use client';

import { useState } from 'react';
import { ComponentA } from '@/components/component-a';
import { ComponentB } from '@/components/component-b';

export default function PageName() {
  const [state, setState] = useState(initialState);
  
  // Page logic
  
  return (
    <div className="layout-container">
      <ComponentA />
      <ComponentB />
      {/* Page content */}
    </div>
  );
}
```

## Data Models

### User Models

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  profilePicture?: string;
}

interface Student extends User {
  role: 'student';
  grade: string;
  section: string;
  dob: string;
  parentId: string;
}

interface Teacher extends User {
  role: 'teacher';
  specialization: string[];
  salary: number;
}

interface Parent extends User {
  role: 'parent';
  studentIds: string[];
}
```

### Academic Models

```typescript
interface Class {
  id: string;
  name: string;
  capacity: number;
}

interface Section {
  id: string;
  name: string;
  className: string;
  capacity: number;
}

interface Subject {
  id: string;
  name: string;
  className: string;
}

interface Exam {
  id: string;
  name: string;
}

interface Result {
  id: string;
  studentId: string;
  examId: string;
  classId: string;
  subjectId: string;
  marks: number;
  status: 'Pending' | 'Approved' | 'Published';
  submittedBy: string;
}
```

## API Structure

The application uses Next.js API routes for server-side operations:

```typescript
// Example API route
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Fetch data or perform operations
    const data = await fetchData();
    
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Process data
    const result = await processData(body);
    
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
  }
}
```

## Authentication Flow

1. User navigates to the login page
2. User enters credentials
3. Firebase authentication validates credentials
4. Upon successful authentication:
   - JWT token is generated
   - User session is created
   - User is redirected to their role-specific dashboard

## Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful comments for complex logic
- Use consistent naming conventions

### Component Development

1. Create components in the appropriate directory:
   - UI components in `src/components/ui`
   - Layout components in `src/components/layout`
   - Page-specific components in their respective page directories

2. Export components from barrel files for clean imports

3. Follow the pattern:
   ```
   import
   type definitions
   component logic
   return JSX
   ```

### State Management

- Use React Context for global state
- Use useState for component-local state
- Use useReducer for complex state logic

### Form Handling

- Use React Hook Form for form state management
- Use Zod for schema validation
- Implement proper error messages and validation feedback

### Testing

- Write unit tests for utility functions
- Write component tests for UI components
- Write integration tests for page functionality

## Performance Optimization

- Implement code splitting with dynamic imports
- Use Next.js Image component for optimized images
- Implement proper memoization with useMemo and useCallback
- Use virtualization for long lists

## Deployment

The application can be deployed using Vercel or any platform supporting Next.js:

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Troubleshooting Common Issues

### Authentication Issues
- Check Firebase configuration
- Verify user permissions
- Check token expiration

### Data Fetching Issues
- Check network requests in browser console
- Verify API endpoint URLs
- Check for CORS issues

### UI Rendering Issues
- Check for React key prop warnings
- Verify component props
- Check for CSS conflicts

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 0.1.0   | 2024 | Initial development version | 