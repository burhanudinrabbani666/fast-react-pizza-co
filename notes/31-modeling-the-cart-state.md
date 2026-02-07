# Modeling the Shopping Cart State

## Overview

This guide shows how to build a complete shopping cart using Redux Toolkit. The cart manages pizza items with full CRUD operations: add, delete, update quantities, and clear all items.

---

## Cart State Structure

Each cart item contains:

- **pizzaId** - Unique identifier for the pizza
- **name** - Pizza name (e.g., "Mediterranean")
- **quantity** - Number of pizzas ordered
- **unitPrice** - Price per single pizza
- **totalPrice** - quantity × unitPrice

---

## Implementation

### Creating the Cart Slice

```javascript
// features/cart/cartSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Start with empty cart in production
  cart: [],

  // Sample data for development/testing
  // cart: [
  //   {
  //     pizzaId: 12,
  //     name: "Mediterranean",
  //     quantity: 2,
  //     unitPrice: 16,
  //     totalPrice: 32,
  //   },
  // ],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add new item to cart
    addItem(state, action) {
      // payload = entire item object { pizzaId, name, quantity, unitPrice, totalPrice }
      state.cart.push(action.payload);
    },

    // Remove item from cart
    deleteItem(state, action) {
      // payload = pizzaId (number)
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },

    // Increase quantity by 1
    increaseItemQuantity(state, action) {
      // payload = pizzaId (number)
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
    },

    // Decrease quantity by 1
    decreaseItemQuantity(state, action) {
      // payload = pizzaId (number)
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;

      // Optional: Remove item if quantity reaches 0
      // if (item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
    },

    // Empty the entire cart
    clearCart(state) {
      state.cart = [];
    },
  },
});

// Export action creators for components to use
export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;

// Export reducer to add to store
export default cartSlice.reducer;
```

**How Each Reducer Works:**

| Action                 | Payload          | What It Does                                        |
| ---------------------- | ---------------- | --------------------------------------------------- |
| `addItem`              | Full item object | Adds new pizza to cart array                        |
| `deleteItem`           | pizzaId          | Removes pizza from cart                             |
| `increaseItemQuantity` | pizzaId          | Finds item, increments quantity, recalculates total |
| `decreaseItemQuantity` | pizzaId          | Finds item, decrements quantity, recalculates total |
| `clearCart`            | None             | Resets cart to empty array                          |

---

## Adding Cart to Store

```javascript
// store.js

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import cartReducer from "./features/cart/cartSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer, // Add cart slice
  },
});

export default store;
```

---

## Usage Examples

### Adding Items

```jsx
import { useDispatch } from "react-redux";
import { addItem } from "./cartSlice";

function MenuItem({ pizza }) {
  const dispatch = useDispatch();

  function handleAddToCart() {
    const newItem = {
      pizzaId: pizza.id,
      name: pizza.name,
      quantity: 1,
      unitPrice: pizza.unitPrice,
      totalPrice: pizza.unitPrice,
    };
    dispatch(addItem(newItem));
  }

  return <button onClick={handleAddToCart}>Add to cart</button>;
}
```

### Updating Quantities

```jsx
function CartItem({ item }) {
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(decreaseItemQuantity(item.pizzaId))}>
        -
      </button>
      <span>{item.quantity}</span>
      <button onClick={() => dispatch(increaseItemQuantity(item.pizzaId))}>
        +
      </button>
    </div>
  );
}
```

### Reading Cart State

```jsx
import { useSelector } from "react-redux";

function Cart() {
  const cart = useSelector((state) => state.cart.cart);
  const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div>
      {cart.map((item) => (
        <CartItem key={item.pizzaId} item={item} />
      ))}
      <p>Total: ${totalPrice}</p>
    </div>
  );
}
```

---

## Complete User Flow

**Adding to Cart:**

1. User clicks "Add to cart" on pizza
2. Component creates item object with quantity=1
3. Dispatches `addItem(newItem)`
4. Redux adds item to cart array
5. Cart components re-render showing new item

**Updating Quantity:**

1. User clicks "+" button
2. Dispatches `increaseItemQuantity(pizzaId)`
3. Redux finds item by ID, increments quantity
4. Redux recalculates totalPrice
5. Cart updates with new quantity and price

**Removing Items:**

1. User clicks delete button
2. Dispatches `deleteItem(pizzaId)`
3. Redux filters out item with matching ID
4. Cart re-renders without that item

---

## Key Benefits

✅ **Centralized Cart Logic** - All cart operations in one place  
✅ **Automatic Price Updates** - Total recalculated on quantity changes  
✅ **Immutable Updates** - Redux Toolkit handles immutability  
✅ **Reusable Actions** - Same actions used across components

---

## Important Notes

> **Note:** The typo "decraseItemQuantity" should be "decreaseItemQuantity" in production code (fixed in examples above).

> **Best Practice:** Always recalculate `totalPrice` when quantity changes to keep prices in sync.

> **Edge Case:** Consider removing items when quantity reaches 0 in `decreaseItemQuantity`.

> **Development Tip:** Use sample cart data during development, empty array in production.

---

## Next Steps

Continue to: [Adding Menu Items to Cart](./32-adding-menu-items.md)
