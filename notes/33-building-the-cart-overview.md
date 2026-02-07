# Building the Cart Overview with Selectors

## Overview

This guide demonstrates how to create **selector functions** for calculating cart totals. Selectors are pure functions that extract and compute derived state from Redux, following Redux best practices.

---

## Why Use Selectors?

**Benefits:**

- ✅ **Centralized Logic** - Calculations live with the state, not scattered across components
- ✅ **Reusable** - Same selector used in multiple components
- ✅ **Testable** - Pure functions easy to unit test
- ✅ **Maintainable** - Change logic once, updates everywhere
- ✅ **Official Pattern** - Recommended by Redux team

---

## Implementation

### Step 1: Add Selectors to Cart Slice

Add selector functions at the bottom of your cart slice file.

```javascript
// features/cart/cartSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      state.cart.push(action.payload);
    },
    deleteItem(state, action) {
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    increaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decreaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

// Export action creators
export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;

// ===== SELECTOR FUNCTIONS =====
// These calculate derived state from the cart

/**
 * Get total number of items in cart
 * @param {Object} state - Full Redux state
 * @returns {number} Total quantity of all items
 */
export const getTotalCartQuantity = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

/**
 * Get total price of all items in cart
 * @param {Object} state - Full Redux state
 * @returns {number} Total price in dollars
 */
export const getTotalCartPrice = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);

/**
 * Get the cart array itself
 * @param {Object} state - Full Redux state
 * @returns {Array} Array of cart items
 */
export const getCart = (state) => state.cart.cart;
```

**How Selectors Work:**

1. **Receive Full State** - Selectors get entire Redux state tree
2. **Navigate to Data** - Access `state.cart.cart` array
3. **Compute Value** - Use `.reduce()` to sum quantities or prices
4. **Return Result** - Return calculated value

**Understanding reduce():**

```javascript
// Initial cart: [{ quantity: 2, totalPrice: 32 }, { quantity: 1, totalPrice: 16 }]
cart.reduce((sum, item) => sum + item.quantity, 0);
// Step 1: sum=0, item.quantity=2 → return 2
// Step 2: sum=2, item.quantity=1 → return 3
// Final result: 3
```

---

### Step 2: Use Selectors in Components

Import and use selectors with `useSelector` hook.

```jsx
// features/cart/CartOverview.jsx

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalCartQuantity, getTotalCartPrice } from "./cartSlice";
import { formatCurrency } from "../../utils/helpers";

function CartOverview() {
  // Use selector functions to get computed values
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const totalCartPrice = useSelector(getTotalCartPrice);

  // Don't show cart overview if cart is empty
  if (!totalCartQuantity) return null;

  return (
    <div className="bg-stone-800 px-4 py-4 text-stone-200">
      <p className="space-x-4 font-semibold text-stone-300">
        <span>{totalCartQuantity} pizzas</span>
        <span>{formatCurrency(totalCartPrice)}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
```

**How It Works:**

1. **Import Selectors** - Get selector functions from cartSlice
2. **useSelector Hook** - Pass selector function, not inline function
3. **Auto Re-render** - Component updates when cart changes
4. **Display Values** - Show computed totals in UI

---

## Selector Pattern Comparison

### ❌ Bad: Logic in Component

```jsx
function CartOverview() {
  // DON'T: Calculation in component
  const cart = useSelector((state) => state.cart.cart);
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);

  return <span>{total} pizzas</span>;
}
```

### ✅ Good: Logic in Selector

```jsx
// cartSlice.js
export const getTotalCartQuantity = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

// Component
function CartOverview() {
  const total = useSelector(getTotalCartQuantity);
  return <span>{total} pizzas</span>;
}
```

---

## Complete Data Flow

**When Cart Updates:**

1. **Action Dispatched** - e.g., `addItem()`, `increaseItemQuantity()`
2. **Reducer Updates State** - Cart array modified
3. **Selectors Recalculate** - `getTotalCartQuantity` and `getTotalCartPrice` run
4. **Components Re-render** - Any component using these selectors updates
5. **UI Shows New Totals** - User sees updated quantities and prices

**Example:**

```
Add pizza → Cart: [pizza1] → Quantity: 1, Price: $16
Add another → Cart: [pizza1, pizza2] → Quantity: 2, Price: $32
Increase qty → Cart updated → Quantity: 3, Price: $48
```

---

## Important Notes

> **Best Practice:** Always define selectors in the slice file, not in components. This is the official Redux recommendation.

> **Naming Convention:** Prefix selectors with `get` (e.g., `getTotalCartQuantity`, `getCart`).

> **Performance:** For expensive computations, use `reselect` library to memoize selectors.

> **Testing:** Selectors are pure functions, making them easy to test:

```javascript
const state = { cart: { cart: [{ quantity: 2 }] } };
expect(getTotalCartQuantity(state)).toBe(2);
```

---

## Additional Useful Selectors

```javascript
// Get specific item from cart by ID
export const getCartItemById = (id) => (state) =>
  state.cart.cart.find((item) => item.pizzaId === id);

// Check if cart is empty
export const getIsCartEmpty = (state) => state.cart.cart.length === 0;

// Get number of unique items (not total quantity)
export const getUniqueItemsCount = (state) => state.cart.cart.length;
```

**Usage:**

```jsx
const pizzaInCart = useSelector(getCartItemById(12));
const isEmpty = useSelector(getIsCartEmpty);
```

---

## Next Steps

Continue to: [Building the Cart Page](./34-building-the-cart-page.md)
