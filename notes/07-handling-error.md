# Handling Errors in React Router

## Overview

This guide explains how to implement error handling in React Router applications using the `errorElement` prop. This creates a centralized error boundary that catches routing errors, data loading failures, and component errors within your route tree.

---

## Core Concept: Error Boundaries in React Router

React Router v6.4+ provides built-in error handling through the `errorElement` prop. When an error occurs anywhere in a route (during rendering, data loading, or component lifecycle), React Router automatically renders the error component instead of the normal route content.

**Common scenarios that trigger error elements:**

- Failed data fetches in route loaders
- Network errors
- Component rendering errors
- 404 Not Found errors
- Thrown exceptions in route components

---

## Implementation

### Step 1: Configure Error Handling in Your Router

Add the `errorElement` prop to your route configuration to catch errors globally.

```jsx
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <NotFound />, // Catches all errors in this route tree
    children: [
      // Your child routes here
    ],
  },
]);
```

**How It Works:**

- **`errorElement`** - Specifies which component to render when an error occurs
- **Error Bubbling** - Errors bubble up to the nearest `errorElement`, similar to React error boundaries
- **Replaces Normal Content** - The error component replaces the entire route content when triggered

---

### Step 2: Create Your Error Component

Build a user-friendly error page that displays error information and provides navigation options.

```jsx
function NotFound() {
  // Hook to programmatically navigate
  const navigate = useNavigate();

  // Hook to access the error object thrown by React Router
  const error = useRouteError();

  return (
    <div>
      <h1>Something went wrong 😢</h1>

      {/* Display error message - handles both structured and simple errors */}
      <p>{error.data || error.message}</p>

      {/* Allow users to go back to the previous page */}
      <button onClick={() => navigate(-1)}>&larr; Go back</button>
    </div>
  );
}

export default NotFound;
```

**How It Works:**

1. **`useNavigate()`** - Provides a function to navigate programmatically
2. **`useRouteError()`** - Retrieves the error object that was thrown
3. **`error.data || error.message`** - Displays the error message:
   - `error.data` - Used for custom error responses (e.g., from API loaders)
   - `error.message` - Standard JavaScript error message
4. **`navigate(-1)`** - Takes the user back one step in browser history

---

## Understanding the Error Object

The `useRouteError()` hook returns different error structures depending on the error source:

### Response Errors (from loaders/actions)

```javascript
{
  status: 404,
  statusText: "Not Found",
  data: "Custom error message",
  internal: false
}
```

### JavaScript Errors

```javascript
{
  message: "Something went wrong",
  stack: "Error stack trace..."
}
```

---

## Complete Error Handling Flow

### When an Error Occurs:

1. **Error is thrown** - Can happen during:
   - Route loader execution (data fetching)
   - Component rendering
   - User actions that trigger errors

2. **React Router catches the error** - Stops normal rendering process

3. **Router searches for errorElement** - Bubbles up the route tree to find the nearest `errorElement`

4. **Error component renders** - Replaces the normal route content

5. **`useRouteError()` provides error details** - Makes error information available to your component

6. **User sees error UI** - With helpful message and navigation options

7. **User can recover** - By navigating back or to another route

---

## Enhanced Error Component Example

Here's a more robust error component with better error handling:

```jsx
function NotFound() {
  const navigate = useNavigate();
  const error = useRouteError();

  // Determine error title based on status code
  const title =
    error.status === 404 ? "Page Not Found 🔍" : "Something Went Wrong 😢";

  // Get error message with fallback
  const message = error.data || error.message || "An unexpected error occurred";

  return (
    <div className="error-container">
      <h1>{title}</h1>
      <p>{message}</p>

      {/* Show status code if available */}
      {error.status && <p className="error-code">Error {error.status}</p>}

      <div className="error-actions">
        <button onClick={() => navigate(-1)}>&larr; Go Back</button>
        <button onClick={() => navigate("/")}>🏠 Go Home</button>
      </div>
    </div>
  );
}

export default NotFound;
```

---

## Route-Specific Error Handling

You can add different error elements for different routes:

```jsx
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <NotFound />, // Global error handler
    children: [
      {
        path: "/menu",
        element: <Menu />,
        errorElement: <MenuError />, // Specific to menu route
        loader: menuLoader,
      },
    ],
  },
]);
```

**How It Works:**

- Child route errors are caught by the closest `errorElement`
- If a child doesn't have an `errorElement`, the error bubbles to the parent
- This allows for granular error handling per route

---

## Key Benefits

✅ **Centralized Error Handling** - One place to manage all routing errors  
✅ **Better UX** - Users see helpful messages instead of blank screens  
✅ **Easy Recovery** - Built-in navigation to help users get back on track  
✅ **Catches All Errors** - Handles loader errors, component errors, and 404s  
✅ **Type-Safe** - TypeScript support for error objects

---

## Important Notes

> **Note:** The `errorElement` only catches errors within the React Router context. For global application errors, consider using React Error Boundaries.

> **Tip:** Always provide a way for users to navigate away from error pages (back button, home link, etc.)

> **Best Practice:** Log errors to an error tracking service (like Sentry) for monitoring:

```jsx
const error = useRouteError();
console.error("Route error:", error); // Or send to error tracking service
```

> **Common Mistake:** Don't forget to export your error component! The router needs to import it.

---

## Throwing Custom Errors in Loaders

You can throw custom errors from route loaders for better error messages:

```jsx
// In your loader function
export async function menuLoader() {
  const response = await fetch("/api/menu");

  if (!response.ok) {
    throw new Response("Failed to load menu", {
      status: response.status,
      statusText: "Menu Not Available",
    });
  }

  return response.json();
}
```

This error will be caught by your `errorElement` and accessible via `useRouteError()`.

---

## Next Steps

Continue to: [Fetching Order](./08-fetching-order.md)
