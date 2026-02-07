# Managing User State with Redux Toolkit

## Overview

This guide demonstrates how to implement global state management for user data using Redux Toolkit. Redux Toolkit is the official, recommended way to write Redux logic—it simplifies store setup, reduces boilerplate, and includes best practices by default.

---

## What is Redux Toolkit?

**Redux Toolkit** is a state management library that helps you manage application-wide state in a predictable way. It's particularly useful when:

- Multiple components need access to the same data
- State needs to persist across route changes
- You want a single source of truth for application data

**Key Concepts:**

- **Store** - Central location holding all application state
- **Slice** - A portion of state with its own reducers and actions
- **Reducer** - Function that specifies how state changes
- **Action** - Object describing what happened (e.g., "user updated name")
- **Selector** - Function to read specific data from the store

---

## Implementation

### Step 1: Install Dependencies

Install Redux Toolkit and React-Redux (the official React bindings for Redux).

```bash
npm install react-redux @reduxjs/toolkit
```

**Packages Explained:**

- **`@reduxjs/toolkit`** - Core Redux Toolkit library with utilities
- **`react-redux`** - Connects Redux store to React components

---

### Step 2: Create a User Slice

A "slice" contains all the logic for one feature of your application. Here we're creating a slice for user-related state.

```javascript
// features/user/userSlice.js

import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for this slice
const initialState = {
  username: "", // User's name, empty by default
};

// Create the slice with reducers and actions
const userSlice = createSlice({
  name: "user", // Used to generate action types like "user/updateName"
  initialState, // Starting state
  reducers: {
    // Reducer function to update username
    // Redux Toolkit uses Immer library, allowing direct mutation syntax
    updateName(state, action) {
      state.username = action.payload; // Looks like mutation, but creates new state
    },
  },
});

// Export action creators for use in components
// These are automatically generated from reducer names
export const { updateName } = userSlice.actions;

// Export the reducer to add to the store
export default userSlice.reducer;
```

**How It Works:**

1. **`createSlice()`** - Auto-generates action creators and action types
2. **`name: "user"`** - Namespace for this slice's actions
3. **`initialState`** - Default state when app first loads
4. **`reducers`** - Object containing reducer functions
5. **`updateName(state, action)`** - Updates username with new value
   - `state` - Current state of this slice
   - `action.payload` - Data sent with the action (the new username)
6. **Direct Mutation** - Redux Toolkit uses Immer, so you can write code that _looks_ like mutation but actually creates immutable updates

**Understanding Action Creators:**

```javascript
// When you call updateName("John"):
updateName("John")
// It creates this action object:
{ type: "user/updateName", payload: "John" }
```

---

### Step 3: Create the Redux Store

Combine all your slices into a single store—the central hub for all application state.

```javascript
// store.js

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";

// Create the Redux store
const store = configureStore({
  reducer: {
    user: userReducer, // Add user slice to the store
    // cart: cartReducer, // You can add more slices here
    // orders: ordersReducer,
  },
});

export default store;
```

**How It Works:**

- **`configureStore()`** - Sets up Redux store with good defaults
- **`reducer` object** - Combines multiple slice reducers
- **`user: userReducer`** - Makes user state accessible at `state.user`
- **Auto-configuration** - Includes Redux DevTools and helpful middleware

**Store Structure:**

```javascript
{
  user: {
    username: "" // From userSlice
  },
  // Future slices will be added here
}
```

---

### Step 4: Provide Store to Your App

Wrap your app with the Redux Provider to make the store accessible to all components.

```jsx
// main.jsx (or index.jsx)

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Provider makes Redux store available to entire component tree */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
```

**How It Works:**

- **`<Provider>`** - React component from react-redux
- **`store={store}`** - Passes Redux store to all child components
- **Context API** - Provider uses React Context under the hood
- **Access Anywhere** - Any component inside Provider can access the store

---

### Step 5: Read State with useSelector

Access Redux state in any component using the `useSelector` hook.

```jsx
// features/user/Username.jsx

import { useSelector } from "react-redux";

function Username() {
  // Select username from Redux store
  // The selector function receives the entire state
  const username = useSelector((state) => state.user.username);

  // Don't render anything if username is empty
  if (!username) return null;

  return (
    <div className="hidden text-sm font-semibold md:block">{username}</div>
  );
}

export default Username;
```

**How It Works:**

1. **`useSelector(selector)`** - Hook to extract data from Redux store
2. **Selector Function** - `(state) => state.user.username`
   - Receives entire Redux state
   - Returns specific piece of state you need
3. **Auto Re-render** - Component re-renders when selected state changes
4. **Conditional Rendering** - Returns `null` if no username (component doesn't render)

**Understanding the Selector:**

```javascript
// The selector function traverses the state tree:
(state) => state.user.username

// State structure:
state = {
  user: {
    username: "John" ← This is what we select
  }
}
```

---

### Step 6: Update State with useDispatch

Dispatch actions to update Redux state from any component.

```jsx
// features/user/CreateUser.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateName } from "./userSlice";
import { useNavigate } from "react-router-dom";

function CreateUser() {
  // Local state for form input
  const [username, setUsername] = useState("");

  // Get dispatch function to send actions to Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    // Only proceed if username is not empty
    if (!username) return;

    // Dispatch action to update Redux store
    // updateName("John") creates: { type: "user/updateName", payload: "John" }
    dispatch(updateName(username));

    // Navigate to menu after updating username
    navigate("/menu");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your full name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button type="submit">Start ordering</button>
    </form>
  );
}

export default CreateUser;
```

**How It Works:**

1. **`useDispatch()`** - Returns the `dispatch` function
2. **`dispatch(action)`** - Sends action to Redux store
3. **`updateName(username)`** - Action creator that creates the action object
4. **Store Update** - Redux calls the reducer with the action
5. **Component Re-render** - All components using that state automatically update

**Understanding Dispatch Flow:**

```javascript
// 1. User types "John" and submits
dispatch(updateName("John"))

// 2. Action is created
{ type: "user/updateName", payload: "John" }

// 3. Redux calls the reducer
updateName(state, action) {
  state.username = action.payload; // "John"
}

// 4. State is updated
state.user.username = "John"

// 5. Components using useSelector re-render with new value
```

---

## Complete Redux Flow

### Initial Setup Flow:

1. **Install packages** - `npm install react-redux @reduxjs/toolkit`

2. **Create slice** - Define state shape and how it changes

```javascript
userSlice = { username: "" };
```

3. **Create store** - Combine all slices

```javascript
store = { user: userReducer };
```

4. **Wrap app** - Provide store to component tree

```jsx
<Provider store={store}>
  <App />
</Provider>
```

---

### Runtime Data Flow:

#### Reading State:

1. **Component Mounts** - Username component renders

2. **useSelector Runs** - Extracts username from store

```javascript
const username = useSelector((state) => state.user.username);
```

3. **Component Renders** - Displays current username (or nothing if empty)

4. **Subscribe to Changes** - Component automatically re-renders when username changes

---

#### Updating State:

1. **User Action** - User types name and submits form

2. **Dispatch Action** - Component calls dispatch

```javascript
dispatch(updateName("John"));
```

3. **Action Created** - Action creator generates action object

```javascript
   { type: "user/updateName", payload: "John" }
```

4. **Reducer Runs** - Redux calls the reducer with current state and action

```javascript
state.username = "John";
```

5. **Store Updates** - New state saved in store

6. **Components Re-render** - All components using `username` automatically update

7. **UI Updates** - User sees their name displayed

---

## Redux Toolkit vs Traditional Redux

### Traditional Redux (Verbose)

```javascript
// Action types
const UPDATE_NAME = "user/updateName";

// Action creator
function updateName(name) {
  return { type: UPDATE_NAME, payload: name };
}

// Reducer
function userReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_NAME:
      return { ...state, username: action.payload };
    default:
      return state;
  }
}
```

### Redux Toolkit (Concise)

```javascript
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
  },
});
```

**Much simpler!** Redux Toolkit handles the boilerplate automatically.

---

## Key Benefits

✅ **Global State** - Access user data from any component  
✅ **Persistent Across Routes** - State survives navigation  
✅ **Single Source of Truth** - One place to manage user data  
✅ **DevTools Integration** - Time-travel debugging built-in  
✅ **Type Safety** - Great TypeScript support  
✅ **Less Boilerplate** - Redux Toolkit reduces code significantly  
✅ **Immutable Updates** - Immer prevents accidental mutations

---

## Important Notes

> **Note:** Redux Toolkit uses Immer internally, which allows you to write "mutating" code that actually produces immutable updates. This is much simpler than manual spreading.

> **Best Practice:** Only put data in Redux that multiple components need. Local component state with `useState` is fine for data that only one component uses.

> **Naming Convention:** Slice names should match their reducer key in the store:

```javascript
// ✅ Good
const userSlice = createSlice({ name: "user" });
store = configureStore({ reducer: { user: userReducer } });

// ❌ Bad - Confusing
const userSlice = createSlice({ name: "currentUser" });
store = configureStore({ reducer: { user: userReducer } });
```

> **Performance:** `useSelector` compares the old and new values using strict equality (`===`). If you select an object or array, use memoization to prevent unnecessary re-renders.

> **DevTools:** Install Redux DevTools browser extension to inspect state changes and time-travel through actions.

---

## Advanced: Selector Optimization

For expensive computations or derived state, create reusable selectors:

```javascript
// features/user/userSlice.js

// Selector functions
export const selectUsername = (state) => state.user.username;
export const selectIsLoggedIn = (state) => state.user.username !== "";

// In component
import { selectUsername, selectIsLoggedIn } from "./userSlice";

const username = useSelector(selectUsername);
const isLoggedIn = useSelector(selectIsLoggedIn);
```

**Benefits:**

- Reusable across components
- Easier to test
- Can be memoized with `reselect` library
- Centralized logic

---

## Common Patterns

### Multiple Selectors

```jsx
function UserProfile() {
  const username = useSelector((state) => state.user.username);
  const email = useSelector((state) => state.user.email);
  const avatar = useSelector((state) => state.user.avatar);

  return (
    <div>
      {username} - {email}
    </div>
  );
}
```

### Conditional Dispatch

```jsx
function UpdateProfile() {
  const dispatch = useDispatch();

  function handleUpdate(newName) {
    if (newName.length >= 3) {
      dispatch(updateName(newName));
    }
  }
}
```

### Multiple Actions

```javascript
const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    email: "",
    isAuthenticated: false,
  },
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
    updateEmail(state, action) {
      state.email = action.payload;
    },
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.username = "";
      state.email = "";
    },
  },
});
```

---

## Debugging Tips

**1. Install Redux DevTools:**

- Chrome: [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools)
- Firefox: Available in Firefox Add-ons

**2. Log state changes:**

```javascript
const username = useSelector((state) => {
  console.log("Username from Redux:", state.user.username);
  return state.user.username;
});
```

**3. Check action dispatch:**

```javascript
dispatch(updateName("John"));
console.log("Dispatched updateName action");
```

**4. Verify store structure:**

```javascript
// In browser console (with DevTools)
store.getState(); // Shows entire Redux state
```

---

## TypeScript Support (Optional)

For TypeScript projects, add types for better autocomplete:

```typescript
// store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create typed hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**Usage:**

```typescript
// Full autocomplete!
const username = useAppSelector((state) => state.user.username);
```

---

## Next Steps

Continue to: [Reading and Updating Cart State](./30-reading-and-updating.md)
