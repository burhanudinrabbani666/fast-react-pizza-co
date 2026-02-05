# Displaying Loading Indicators in React Router

## Overview

This guide explains how to implement a global loading indicator that appears during navigation transitions in a React Router application. The loading indicator provides visual feedback to users when navigating between routes.

---

## Core Concept: The `useNavigation` Hook

React Router's `useNavigation` hook allows you to track the current navigation state of your application. It returns an object with a `state` property that can be one of three values:

- **`"idle"`** - No navigation is happening
- **`"loading"`** - Navigation is in progress (data is being fetched)
- **`"submitting"`** - A form is being submitted

---

## Implementation

### Step 1: Create the Loader Component

This is a simple visual component that displays while content is loading.

```jsx
function Loader() {
  return <div className="loader"></div>;
}

export default Loader;
```

**How It Works:**

- Returns a `div` with the class `loader`
- Typically styled with CSS to show a spinner or animation
- Acts as a reusable loading indicator throughout your app

---

### Step 2: Add Loading State to Your Layout

Integrate the loading indicator into your application's main layout component.

```jsx
function AppLayout() {
  // Access the current navigation state
  const navigation = useNavigation();

  // Check if a navigation is currently in progress
  const isLoading = navigation.state === "loading";

  console.log(navigation); // Useful for debugging navigation states

  return (
    <div className="layout">
      {/* Show loader only when navigating between routes */}
      {isLoading && <Loader />}

      <Header />

      <main>
        {/* Child routes render here */}
        <Outlet />
      </main>

      <CartOverview />
    </div>
  );
}
```

**How It Works:**

1. **`useNavigation()`** - Retrieves the current navigation state from React Router
2. **`navigation.state === "loading"`** - Checks if data is being loaded for the next route
3. **Conditional Rendering** - The `<Loader />` component only appears when `isLoading` is `true`
4. **`<Outlet />`** - This is where child routes render their content

---

## Complete Application Flow

### When a User Navigates to a New Route:

1. **User clicks a link** or triggers navigation (e.g., `<Link to="/menu">`)
2. **Navigation state changes** from `"idle"` to `"loading"`
3. **`useNavigation` detects the change** in the `AppLayout` component
4. **`isLoading` becomes `true`**, triggering the loader to display
5. **React Router fetches data** for the new route (if using loaders)
6. **Data loading completes** and the new route component renders
7. **Navigation state returns to `"idle"`**
8. **Loader disappears** and users see the new page content

---

## Key Benefits

✅ **Global Loading State** - One loading indicator for your entire application  
✅ **Automatic Management** - No need to manually track loading states for each route  
✅ **Better UX** - Users get immediate feedback that their action is being processed  
✅ **Centralized Logic** - Loading UI logic lives in one place (the layout component)

---

## Important Notes

> **Note:** This approach works best with React Router v6.4+ and data routers (e.g., `createBrowserRouter`)

> **Tip:** Add CSS transitions to your loader for smooth appearance/disappearance animations

> **Debugging:** The `console.log(navigation)` statement is helpful for understanding when navigation state changes occur

---

## CSS Example (Optional)

To make the loader visible, you'll need CSS. Here's a basic example:

```css
.loader {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

---

## Next Steps

Continue to: [Handling Errors](./07-handling-error.md)
