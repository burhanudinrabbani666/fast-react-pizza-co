# Fetching Data with React Router

This guide shows how to fetch data using React Router's loader pattern, which loads data before rendering components.

## Step 1: Create the API Service

First, create an async function to fetch data from your API. This goes in your services file (e.g., `apiRestaurant.js`).

```jsx
const API_URL = "https://react-fast-pizza-api.jonas.io/api";

export async function getMenu() {
  // Send a GET request to the API
  const res = await fetch(`${API_URL}/menu`);

  // fetch() doesn't automatically throw errors for failed requests (404, 500, etc.)
  // We manually check if the response is OK (status 200-299)
  if (!res.ok) throw Error("Failed getting menu");

  // Parse the JSON response and extract the 'data' property
  const { data } = await res.json();

  // Return the menu data
  return data;
}
```

### Understanding the API Function

- **`fetch()`** - Makes an HTTP request to the server
- **`await`** - Waits for the request to complete before continuing
- **`res.ok`** - Checks if the HTTP status is successful (200-299)
- **`throw Error()`** - Stops execution and triggers error handling
- **`await res.json()`** - Converts the response body from JSON string to JavaScript object
- **`const { data }`** - Destructures the `data` property from the response object

## Step 2: Create a Loader Function

Create a loader function that calls your API service. This function will be executed by React Router before the route renders.

```jsx
import { getMenu } from "../services/apiRestaurant";

export async function menuLoader() {
  // Call the API function to get menu data
  const menu = await getMenu();

  // Return the data so React Router can pass it to the component
  return menu;
}

export default menuLoader;
```

### Understanding the Loader Function

- **Purpose:** Acts as a bridge between React Router and your API service
- **When it runs:** Automatically called by React Router when navigating to the route
- **What it returns:** The fetched data, which becomes available in your component
- **Error handling:** If `getMenu()` throws an error, React Router will catch it and display an error page

**Important:** Loaders must return data or throw errors—they cannot return undefined.

## Step 3: Register the Loader in Your Router

Add the loader to your route configuration in `App.jsx`.

```jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { menuLoader } from "./loaders/menuLoader";
import Menu from "./features/menu/Menu";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      // The loader property tells React Router to fetch data before rendering
      { path: "/menu", element: <Menu />, loader: menuLoader },
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

### Understanding the Router Configuration

- **`loader: menuLoader`** - Connects the loader function to the `/menu` route
- React Router will call `menuLoader()` every time someone navigates to `/menu`
- The component won't render until the data is loaded

## Step 4: Access the Data in Your Component

Use the `useLoaderData` hook to access the fetched data in your component.

```jsx
import { useLoaderData } from "react-router-dom";
import MenuItem from "./MenuItem";

function Menu() {
  // useLoaderData() returns the data from menuLoader()
  const menu = useLoaderData();

  return (
    <ul>
      {/* Loop through each pizza and render a MenuItem component */}
      {menu.map((pizza) => (
        <MenuItem key={pizza.id} pizza={pizza} />
      ))}
    </ul>
  );
}

export default Menu;
```

### Understanding useLoaderData

- **`useLoaderData()`** - A React Router hook that retrieves data from the loader
- Returns whatever your loader function returned (in this case, the menu array)
- No need for `useState` or `useEffect` - React Router handles the data fetching
- The component will only render after the data is available

## How the Complete Flow Works

1. **User navigates to `/menu`** - Either by clicking a link or typing the URL
2. **React Router calls `menuLoader()`** - Before rendering anything
3. **`menuLoader()` calls `getMenu()`** - Which fetches data from the API
4. **Data is received** - And returned from the loader
5. **`<Menu />` component renders** - Now that data is available
6. **Component calls `useLoaderData()`** - To access the fetched menu data
7. **Menu items are displayed** - By mapping over the data array

## Benefits of This Approach

- **No loading states in components** - React Router handles loading
- **Cleaner components** - No `useEffect` or data fetching logic needed
- **Better UX** - Data loads before the page renders (no loading spinners needed in component)
- **Automatic error handling** - Failed fetches trigger React Router's error boundary

---

**Next:** [Displaying Loading Indicator](./06-displaying-loading-indicator.md)
