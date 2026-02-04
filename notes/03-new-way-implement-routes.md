# Implementing Routes with React Router

This guide shows you how to set up routing in your React application using React Router v6.

## Overview

We'll use `createBrowserRouter` and `RouterProvider` from React Router to define and manage our application routes. This is the modern approach recommended for React Router v6.4+.

## Installation

First, make sure you have React Router installed:

```bash
npm install react-router-dom
```

## Route Configuration

Here's how to set up your application routes:

```jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import page components
import Home from "./ui/Home";
import Menu from "./features/menu/Menu";
import Order from "./features/order/Order";
import Cart from "./features/cart/Cart";
import CreateOrder from "./features/order/CreateOrder";

// Define your routes
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/menu", element: <Menu /> },
  { path: "/cart", element: <Cart /> },
  { path: "/order/:orderId", element: <Order /> },
  { path: "/order/new", element: <CreateOrder /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

## Routes Breakdown

| Route             | Component     | Description                                      |
| ----------------- | ------------- | ------------------------------------------------ |
| `/`               | `Home`        | Homepage/landing page                            |
| `/menu`           | `Menu`        | Menu listing page                                |
| `/cart`           | `Cart`        | Shopping cart page                               |
| `/order/:orderId` | `Order`       | Order details page (dynamic route with order ID) |
| `/order/new`      | `CreateOrder` | New order creation page                          |

## Key Concepts

- **`createBrowserRouter`**: Creates a router instance with your route definitions
- **`RouterProvider`**: Wraps your app and provides routing functionality
- **Dynamic routes**: The `:orderId` parameter in `/order/:orderId` allows you to access different orders (e.g., `/order/123`, `/order/456`)

## Next Steps

Continue to: [Building App Layout](./04-building-app-layout.md)
