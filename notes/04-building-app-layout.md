# Building the App Layout

This guide explains how to create a shared layout component that wraps all pages in your React application using React Router.

## Creating the Layout Component

The `AppLayout` component serves as the main wrapper for your application, providing consistent UI elements across all pages.

```jsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import CartOverview from "../features/cart/CartOverview";

function AppLayout() {
  return (
    <div>
      <Header />

      <main>
        <Outlet />
      </main>

      <CartOverview />
    </div>
  );
}

export default AppLayout;
```

### Key Components

- **`<Header />`** - Navigation and branding displayed at the top of every page
- **`<Outlet />`** - React Router component that renders the current route's child component
- **`<CartOverview />`** - Persistent cart summary shown across all pages

## Integrating the Layout with React Router

Configure your router in `App.jsx` to use `AppLayout` as a parent route. This ensures all child routes render inside the layout.

```jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Home from "./pages/Home";
import Menu from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import Order from "./features/order/Order";
import CreateOrder from "./features/order/CreateOrder";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/menu", element: <Menu /> },
      { path: "/cart", element: <Cart /> },
      { path: "/order/:orderId", element: <Order /> },
      { path: "/order/new", element: <CreateOrder /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

### How It Works

1. `AppLayout` is set as the parent route element
2. All routes are defined as `children` of the layout
3. When navigating between routes, only the content inside `<Outlet />` changes
4. The `Header` and `CartOverview` components remain visible across all pages

---

**Next:** [Fetching Data with React Router](./05-fetching-data-with-react-router.md)
