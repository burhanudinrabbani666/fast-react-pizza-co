# Reading and Updating Redux State

## Overview

This guide demonstrates how to dispatch Redux actions and combine them with React Router navigation. You'll learn to update global state and navigate users in a single user interaction.

---

## Core Concepts

**Key Hooks:**

- **`useDispatch()`** - Sends actions to Redux store to update state
- **`useNavigate()`** - Programmatically navigates to different routes

**Common Pattern:** Update Redux state → Navigate to new page → New page reads updated state

---

## Implementation

### Complete Form Submission Example

Here's how to update Redux state and navigate the user in one action.

```jsx
// features/user/CreateUser.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateName } from "./userSlice";

function CreateUser() {
  // Local state for form input
  const [username, setUsername] = useState("");

  // Redux dispatch function - sends actions to store
  const dispatch = useDispatch();

  // Navigation function - redirects to different routes
  const navigate = useNavigate();

  function handleSubmit(e) {
    // Prevent default form submission behavior (page reload)
    e.preventDefault();

    // Guard: Don't proceed if username is empty
    if (!username) return;

    // Step 1: Dispatch action to update Redux store
    // This creates action: { type: "user/updateName", payload: username }
    // Redux reducer updates state.user.username with the new value
    dispatch(updateName(username));

    // Step 2: Navigate to menu page
    // The menu page can now access the username from Redux
    navigate("/menu");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your full name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input"
      />
      <button type="submit">Start ordering</button>
    </form>
  );
}

export default CreateUser;
```

**How It Works:**

1. **User types name** - Local state updates via `setUsername`
2. **User submits form** - `handleSubmit` is called
3. **Validation** - Returns early if username is empty
4. **Dispatch action** - `updateName(username)` updates Redux store
5. **Navigation** - User redirected to `/menu`
6. **Menu loads** - Can access username from Redux via `useSelector`

---

## Data Flow Visualization

```
User Input → Local State → Redux Store → Navigation → New Page
   ↓             ↓              ↓            ↓           ↓
"John"    →  username    →  dispatch    →  /menu   →  Shows "John"
              state          updateName     route      from Redux
```

---

## Accessing Updated State on New Page

After navigation, any component can read the updated username:

```jsx
// features/menu/Menu.jsx

import { useSelector } from "react-redux";

function Menu() {
  // Read username from Redux store
  const username = useSelector((state) => state.user.username);

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      {/* Menu items */}
    </div>
  );
}
```

**How It Works:**

- Username was saved to Redux before navigation
- `useSelector` reads current value from store
- Component automatically re-renders if username changes

---

## Key Benefits

✅ **Sequential Operations** - Update state, then navigate in one flow  
✅ **Data Persistence** - State survives route changes  
✅ **No Props Drilling** - New page accesses data from Redux directly  
✅ **Clean Separation** - Form component doesn't need to know what Menu does

---

## Important Notes

> **Order Matters:** Always dispatch before navigate. If you navigate first, the new page might render before Redux updates.

> **Validation First:** Always validate before dispatching to avoid storing invalid data.

> **Guard Clauses:** Use early returns (`if (!username) return`) to prevent unnecessary operations.

---

## Common Pattern: Multiple Dispatches

Sometimes you need to update multiple Redux slices:

```jsx
function handleCheckout(e) {
  e.preventDefault();

  // Dispatch multiple actions
  dispatch(updateName(username));
  dispatch(clearCart());
  dispatch(createOrder(orderData));

  // Then navigate
  navigate("/order/confirmation");
}
```

---

## Next Steps

Continue to: [Modeling the Cart State](./31-modeling-the-cart-state.md)
