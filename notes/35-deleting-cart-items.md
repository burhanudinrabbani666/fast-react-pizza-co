# Cart Item Deletion Guide

## Overview

This guide explains how to implement a reusable delete functionality for cart items using Redux state management. The pattern separates concerns by creating a dedicated delete component that can be reused anywhere in your application.

---

## 1. Creating the Delete Component

### Code Implementation

```jsx
import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { deleteItem } from "./cartSlice"; // Note: Fixed typo (cartSLice → cartSlice)

function DeleteItem({ pizzaId }) {
  const dispatch = useDispatch();

  return (
    <Button
      type="small"
      onClick={() => dispatch(deleteItem(pizzaId))} // Dispatches Redux action to remove item
    >
      Delete
    </Button>
  );
}

export default DeleteItem;
```

### How It Works

1. **useDispatch Hook**: Gets the Redux dispatch function to send actions to the store
2. **pizzaId Prop**: Receives the unique identifier of the item to delete
3. **Click Handler**: When clicked, dispatches the `deleteItem` action with the pizza ID
4. **Reusable Button**: Uses a shared UI component styled as "small"

### Key Benefits

- ✅ **Reusable**: Use this component anywhere you need delete functionality
- ✅ **Separation of Concerns**: UI logic separated from state management
- ✅ **Type Safety**: Accepts only the necessary `pizzaId` prop

---

## 2. Using the Delete Component

### Code Implementation

```jsx
import { formatCurrency } from "../../utils/helpers";
import DeleteItem from "./DeleteItem";
import UpdateItemQuantity from "./UpdateItemQuantity";

function CartItem({ item }) {
  // Destructure item properties for easier access
  const { pizzaId, name, quantity, totalPrice } = item;

  return (
    <li className="py-3 sm:flex sm:items-center sm:justify-between">
      {/* Display item name and quantity */}
      <p className="mb-1 sm:mb-0">
        {quantity}&times; {name}
      </p>

      {/* Actions section: price, quantity controls, and delete */}
      <div className="flex items-center justify-between sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
        <UpdateItemQuantity pizzaId={pizzaId} />
        <DeleteItem pizzaId={pizzaId} />{" "}
        {/* Delete component integrated here */}
      </div>
    </li>
  );
}

export default CartItem;
```

### How It Works

1. **Item Prop**: Receives a cart item object with all necessary data
2. **Destructuring**: Extracts `pizzaId`, `name`, `quantity`, and `totalPrice` for clean code
3. **Display Section**: Shows quantity and name (e.g., "2× Margherita Pizza")
4. **Actions Section**: Groups price display, quantity controls, and delete button together
5. **DeleteItem Integration**: Passes the `pizzaId` to enable item removal

---

## Complete Data Flow

```
User clicks "Delete"
    ↓
DeleteItem component captures click event
    ↓
Dispatches deleteItem(pizzaId) action to Redux
    ↓
Redux reducer removes item from cart state
    ↓
CartItem component re-renders (item no longer in list)
    ↓
UI updates to show updated cart
```

---

## Important Notes

⚠️ **Fixed Typo**: Changed `cartSLice` to `cartSlice` in the import statement

💡 **Redux Setup Required**: This assumes you have:

- A `deleteItem` action defined in your `cartSlice.js`
- Redux store properly configured in your app

🎯 **Component Hierarchy**:

```
Cart (parent)
  └── CartItem (displays each item)
       └── DeleteItem (handles deletion)
```

---

## Next Steps

Continue to: [Updating cart quantities](./36-updating-cart-quantities.md)
