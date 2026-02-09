# Updating cart quantities

## Overview

This guide explains how to implement quantity controls for cart items using Redux. Users can increase or decrease item quantities with automatic removal when quantity reaches zero.

---

## 1. Creating the Quantity Update Component

### Code Implementation

```jsx
import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { decreaseItemQuantity, increaseItemQuantity } from "./cartSlice"; // Note: Fixed typo

function UpdateItemQuantity({ pizzaId, currentQuantity }) {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center gap-1.5 md:gap-3">
      {/* Decrease button: reduces quantity by 1 */}
      <Button
        type="round"
        onClick={() => dispatch(decreaseItemQuantity(pizzaId))}
      >
        -
      </Button>

      {/* Display current quantity */}
      <span className="text-sm font-medium">{currentQuantity}</span>

      {/* Increase button: adds 1 to quantity */}
      <Button
        type="round"
        onClick={() => dispatch(increaseItemQuantity(pizzaId))}
      >
        +
      </Button>
    </div>
  );
}

export default UpdateItemQuantity;
```

### How It Works

1. **Props Received**:
   - `pizzaId`: Identifies which item to update
   - `currentQuantity`: Shows the current quantity (for display only)

2. **User Interactions**:
   - **Minus Button (-)**: Dispatches `decreaseItemQuantity` action
   - **Plus Button (+)**: Dispatches `increaseItemQuantity` action

3. **UI Layout**: Horizontal flexbox with minus, quantity display, and plus buttons

---

## 2. Redux Reducer Logic

### Code Implementation

```jsx
decreaseItemQuantity(state, action) {
  // action.payload contains the pizzaId
  const item = state.cart.find((item) => item.pizzaId === action.payload);

  // Decrease quantity by 1
  item.quantity--;

  // Recalculate total price based on new quantity
  item.totalPrice = item.quantity * item.unitPrice;

  // Auto-delete item if quantity reaches 0
  if (item.quantity === 0) {
    cartSlice.caseReducers.deleteItem(state, action);
  }
}
```

### How It Works

1. **Find Item**: Locates the cart item using `pizzaId` from action payload
2. **Decrease Quantity**: Reduces quantity by 1
3. **Update Price**: Recalculates `totalPrice = quantity × unitPrice`
4. **Auto-Cleanup**: Calls `deleteItem` reducer if quantity becomes 0

### Key Benefits

- ✅ **Automatic Cleanup**: No orphaned zero-quantity items in cart
- ✅ **Price Sync**: Total price always matches current quantity
- ✅ **Reusable Reducer**: Uses existing `deleteItem` logic via `caseReducers`

### Important Note

💡 **caseReducers**: Redux Toolkit allows reducers to call other reducers in the same slice using `sliceName.caseReducers.reducerName(state, action)`. This avoids code duplication.

---

## 3. Implementing in Cart Items

### Code Implementation

```jsx
<div className="flex items-center justify-between sm:gap-6">
  {/* Display total price */}
  <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>

  {/* Quantity controls with current quantity display */}
  <UpdateItemQuantity pizzaId={pizzaId} currentQuantity={quantity} />

  {/* Delete button for immediate removal */}
  <DeleteItem pizzaId={pizzaId} />
</div>
```

### How It Works

- **totalPrice**: Shows formatted price for this line item
- **UpdateItemQuantity**: Passes both `pizzaId` and current `quantity`
- **DeleteItem**: Allows instant removal without reducing to zero

---

## Complete Data Flow

```
User clicks "+" or "-" button
    ↓
UpdateItemQuantity dispatches action (increase/decrease)
    ↓
Redux reducer finds item by pizzaId
    ↓
Updates quantity (±1) and recalculates totalPrice
    ↓
If quantity = 0 → calls deleteItem reducer
    ↓
Cart state updates
    ↓
Component re-renders with new quantity/price
    ↓
UI reflects updated cart
```

---

## Component Usage Examples

### In CartItem Component

```jsx
function CartItem({ item }) {
  const { pizzaId, name, quantity, totalPrice } = item;

  return (
    <li className="py-3 sm:flex sm:items-center sm:justify-between">
      <p className="mb-1 sm:mb-0">
        {quantity}&times; {name}
      </p>
      <div className="flex items-center justify-between sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
        <UpdateItemQuantity pizzaId={pizzaId} currentQuantity={quantity} />
        <DeleteItem pizzaId={pizzaId} />
      </div>
    </li>
  );
}
```

### In MenuItem Component (Add to Cart)

```jsx
// Can also be used when adding items from menu
<UpdateItemQuantity
  pizzaId={pizza.id}
  currentQuantity={currentQuantityInCart}
/>
```

---

## Important Notes

⚠️ **Fixed Typo**: Changed `cartSLice` to `cartSlice` in import

🔄 **Two Ways to Remove Items**:

1. Click "-" until quantity reaches 0 (automatic)
2. Click "Delete" button (immediate)

📝 **Redux Setup Required**:

- `increaseItemQuantity` action in cartSlice
- `decreaseItemQuantity` action in cartSlice
- `deleteItem` action in cartSlice (for auto-removal)

---

## Next Steps

Continue to: [Using cart for new orders](./37-using-cart-for-new-orders.md)
