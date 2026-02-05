# Fetching Order Data with React Router Loaders

## Overview

This guide demonstrates how to fetch individual order data using React Router's loader functionality. Loaders allow you to fetch data before a route renders, ensuring your component has all the data it needs when it first displays.

---

## Core Concept: Route Loaders

**Route loaders** are async functions that run before a route component renders. They:

- Fetch data needed by the route
- Run in parallel with route transitions
- Automatically trigger loading states
- Handle errors through error boundaries
- Make data available via the `useLoaderData()` hook

**Benefits over traditional useEffect fetching:**

- Data loads before rendering (no loading spinner needed)
- Automatic error handling
- Better UX with React Router's navigation states
- Prevents race conditions

---

## Implementation

### Step 1: Create the API Service Function

First, create a reusable function to fetch order data from your API.

```jsx
// services/apiRestaurant.js

export async function getOrder(id) {
  // Fetch order data from the API endpoint
  const res = await fetch(`${API_URL}/order/${id}`);

  // Throw an error if the request fails (404, 500, etc.)
  // This error will be caught by React Router's errorElement
  if (!res.ok) throw Error(`Couldn't find order #${id}`);

  // Parse the JSON response
  const { data } = await res.json();

  // Return the order data
  return data;
}
```

**How It Works:**

- **`fetch()`** - Makes an HTTP GET request to the order endpoint
- **Error Handling** - Throws an error if response is not ok (status 200-299)
- **JSON Parsing** - Extracts the data object from the response
- **Return Value** - Returns the order data to be used by the loader

---

### Step 2: Create the Loader Function

Create a loader function that connects your API service to React Router.

```jsx
// features/order/OrderLoader.js (or wherever your Order component lives)

import { getOrder } from "../../services/apiRestaurant";

export async function OrderLoader({ params }) {
  // Extract the orderId from the route parameters
  // params.orderId comes from the :orderId in the route path
  const order = await getOrder(params.orderId);

  // Return the order data - React Router will pass this to the component
  return order;
}
```

**How It Works:**

- **`params`** - Object containing URL parameters from the route
- **`params.orderId`** - Matches the `:orderId` parameter in your route definition
- **`await getOrder()`** - Waits for the API call to complete
- **Return Value** - The returned data becomes available to the component via `useLoaderData()`

**Understanding Params:**

- URL: `/order/ABC123`
- Route: `/order/:orderId`
- Result: `params.orderId === "ABC123"`

---

### Step 3: Configure the Route with Loader

Add the route configuration to your router, connecting the path, component, loader, and error handling.

```jsx
// App.jsx

import { OrderLoader } from "./features/order/Order";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      // ... other routes
      {
        path: "/order/:orderId", // :orderId is a dynamic parameter
        element: <Order />, // Component to render
        loader: OrderLoader, // Function to fetch data before rendering
        errorElement: <NotFound />, // Error handler for this route
      },
    ],
  },
]);
```

**How It Works:**

- **`:orderId`** - Dynamic parameter that matches any value (e.g., `/order/123`, `/order/ABC`)
- **`loader: OrderLoader`** - Tells React Router to run this function before rendering
- **`errorElement`** - Catches any errors thrown by the loader or component
- **Route Matching** - When user navigates to `/order/123`, React Router:
  1. Extracts `123` as `params.orderId`
  2. Runs `OrderLoader({ params })`
  3. Waits for data to load
  4. Renders `<Order />` with the loaded data

---

### Step 4: Use the Data in Your Component

Access the loaded data in your component using the `useLoaderData()` hook.

```jsx
// features/order/Order.jsx

import { useLoaderData } from "react-router-dom";
import { calcMinutesLeft } from "../../utils/helpers";

function Order() {
  // Get the data that was loaded by the OrderLoader function
  const order = useLoaderData();

  // Destructure the order data for easy access
  // Note: Names and addresses are excluded for privacy
  // (only restaurant staff should see full customer details)
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;

  // Calculate delivery time remaining
  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div>
      <h1>Order #{id}</h1>
      <p>Status: {status}</p>
      {/* Render your order details */}
    </div>
  );
}

export default Order;
```

**How It Works:**

- **`useLoaderData()`** - React Router hook that returns the data from the loader
- **No Loading State Needed** - Data is guaranteed to be available when component renders
- **Type Safety** - The data structure matches what your API returns
- **Destructuring** - Extract only the fields you need from the order object

---

## Complete Data Flow

### When a User Visits `/order/ABC123`:

1. **Route Matches** - React Router matches the URL to `/order/:orderId`

2. **Loader Executes** - React Router calls `OrderLoader({ params: { orderId: "ABC123" } })`

3. **API Request** - `getOrder("ABC123")` fetches data from the server

4. **Response Handling** - One of two outcomes:
   - **Success** ✅ - Data is returned and stored by React Router
   - **Error** ❌ - Error is thrown and caught by `errorElement`

5. **Navigation State Updates** - `useNavigation().state` changes:
   - Starts as `"loading"`
   - Ends as `"idle"` when data arrives

6. **Component Renders** - `<Order />` renders with data available via `useLoaderData()`

7. **Data Usage** - Component destructures and displays the order information

8. **User Sees Content** - Complete order details appear instantly (no loading spinner in the component)

---

## Error Handling Flow

### If the API Request Fails:

```jsx
// In getOrder()
if (!res.ok) throw Error(`Couldn't find order #${id}`);
```

1. **Error is Thrown** - `getOrder()` throws an error
2. **Loader Fails** - `OrderLoader` stops execution
3. **Error Bubbles** - React Router catches the error
4. **Error Element Renders** - `<NotFound />` displays instead of `<Order />`
5. **User Sees Error** - Helpful error message with recovery options

---

## Key Benefits

✅ **No Loading Spinners in Component** - Data loads before rendering  
✅ **Automatic Error Handling** - Errors caught by error boundaries  
✅ **Better Performance** - Data fetching starts during navigation  
✅ **Cleaner Components** - No useEffect or loading state management  
✅ **Type-Safe Params** - URL parameters automatically extracted  
✅ **Privacy Built-In** - Easy to exclude sensitive data from responses

---

## Important Notes

> **Note:** Loaders run on every navigation to that route. For caching, consider using a library like React Query or TanStack Router.

> **Privacy Tip:** The comment about excluding names/addresses is important for public-facing order tracking. Users should only see their order details after authentication.

> **Best Practice:** Keep loader functions in the same file as your component, or in a dedicated `loaders.js` file for better organization.

> **TypeScript Tip:** Type your loader return value for better autocomplete:

```typescript
export async function OrderLoader({
  params,
}: LoaderFunctionArgs): Promise<Order> {
  const order = await getOrder(params.orderId!);
  return order;
}
```

---

## Advanced: Parallel Data Loading

If your Order component needs multiple data sources, you can load them in parallel:

```jsx
export async function OrderLoader({ params }) {
  // Load both order and restaurant data simultaneously
  const [order, restaurant] = await Promise.all([
    getOrder(params.orderId),
    getRestaurant(),
  ]);

  return { order, restaurant };
}

// In component
const { order, restaurant } = useLoaderData();
```

---

## Common Patterns

### URL Example

```
URL: https://yourapp.com/order/ORD-2024-001
Path: /order/:orderId
Result: params.orderId = "ORD-2024-001"
```

### Multiple Parameters

```jsx
{
  path: "/restaurant/:restaurantId/order/:orderId",
  loader: async ({ params }) => {
    // params.restaurantId and params.orderId both available
  }
}
```

---

## Next Steps

Continue to: [Writing Data with React Router](./09-writing-data-with-react-router.md)
