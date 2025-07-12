# BVR STR SHOP

A modern e-commerce platform built with Next.js 15, integrating Shopify's headless commerce API with custom user management and authentication.

## Tech Stack

- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: TanStack Query v5 + React Context
- **UI Components**: Radix UI + Custom components
- **E-commerce**: Shopify Storefront API (GraphQL)
- **Authentication**: JWT tokens with cookie storage

## Getting Started

### Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Shopify Configuration
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
SHOPIFY_REVALIDATION_SECRET=your_revalidation_secret

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── account/           # User dashboard (protected)
│   ├── auctions/          # Auction pages (protected)
│   ├── collections/       # Product collections
│   ├── products/          # Product detail pages
│   ├── search/            # Search functionality
│   ├── signin/            # Authentication
│   └── signup/
├── components/
│   ├── cards/             # User, order, auth cards
│   ├── cart/              # Shopping cart components
│   ├── layout/            # Navbar, footer, search
│   ├── modals/            # User detail/password modals
│   ├── providers/         # TanStack Query provider
│   └── ui/                # Reusable UI components
├── lib/
│   ├── shopify/           # Shopify API integration
│   ├── constants.ts       # App constants
│   ├── types.ts           # TypeScript definitions
│   └── utils.ts           # Utility functions
├── server/
│   ├── cart/              # Cart server actions
│   └── user/              # User management actions
└── middleware.ts          # Route protection
```

## Navigation & Features

### Public Routes
- `/` - Homepage with featured products
- `/collections/[handle]` - Product collections
- `/products/[handle]` - Product detail pages
- `/search` - Product search
- `/signin` & `/signup` - Authentication

### Protected Routes (requires authentication)
- `/account` - User dashboard with order history
- `/auctions/*` - Auction functionality

### Key Features
- **Product Catalog**: Browse collections and individual products
- **Shopping Cart**: Add/remove items, manage quantities
- **User Authentication**: Sign up, sign in, profile management
- **Account Dashboard**: View orders, update profile
- **Search**: Find products across the catalog
- **Responsive Design**: Mobile-first approach

## Using TanStack Query

This project uses TanStack Query for efficient server state management. Here are the key patterns:

### Queries for Data Fetching

```typescript
// User data
const { data: user, isLoading } = useQuery({
  queryKey: ["user", userId],
  queryFn: () => getUserDetails(authToken, userId!),
  enabled: !!userId,
});

// Paginated orders
const { data: orders } = useQuery({
  queryKey: ["userOrders", userId, currentPage, pageSize],
  queryFn: () => getUserOrders(authToken, userId!, currentPage, pageSize),
  enabled: !!userId,
});
```

### Mutations for Data Updates

```typescript
// Update user profile
const updateUserMutation = useMutation({
  mutationFn: (data: UpdateUser) => updateUserDetails(authToken, userId, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
    toast.success("Profile updated successfully");
  },
  onError: (error) => {
    toast.error("Failed to update profile");
  },
});

// Usage in component
const handleSubmit = (formData: UpdateUser) => {
  updateUserMutation.mutate(formData);
};
```

### Query Client Setup

The query client is configured in `components/providers/query-provider.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});
```

## Authentication Flow

1. **Sign Up/In**: Users authenticate via `/signin` or `/signup`
2. **Token Storage**: JWT tokens stored in HTTP-only cookies
3. **Middleware Protection**: Routes protected via `middleware.ts`
4. **Auto-redirect**: Unauthenticated users redirected to signin

## Development Guidelines

### State Management
- Use TanStack Query for server state (API data)
- Use React Context for client state (cart, auth status)
- Invalidate queries after mutations to keep data fresh

### Component Structure
- UI components in `/components/ui/` (Radix-based)
- Feature components in respective directories
- Server actions in `/server/` directory

### Styling
- Tailwind CSS for all styling
- Custom CSS properties for theming
- Responsive design patterns throughout

## API Integration

### Shopify Integration
- GraphQL fragments in `lib/shopify/fragments/`
- Queries in `lib/shopify/queries/`
- Mutations in `lib/shopify/mutations/`

### Custom Backend
- User management via server actions
- Authentication token handling
- Order processing and history
