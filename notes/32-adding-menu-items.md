# Adding Menu Items to Cart

## Overview

This guide shows how to add pizzas from the menu to the Redux cart. Users click "Add to cart" which dispatches an action to update global cart state.

---

## Implementation

### Step 1: Update Button Component for Click Handlers

Modify the reusable Button component to accept click handlers.

```jsx
// ui/Button.jsx

function Button({ children, disabled, to, type, onClick }) {
  const styles = {
    primary: "bg-yellow-400 px-4 py-3 text-sm uppercase font-semibold...",
    small: "bg-yellow-400 px-4 py-2 text-xs uppercase font-semibold...",
    // ... other button styles
  };

  // If onClick prop exists, render a button element (not a Link)
  if (onClick) {
    return (
      <button onClick={onClick} disabled={disabled} className={styles[type]}>
        {children}
      </button>
    );
  }

  // Otherwise, render as a Link for navigation
  // ... rest of Button component
}
```

**How It Works:**

- **`onClick` prop** - If provided, renders `<button>` instead of `<Link>`
- **Event Handler** - Triggers when button is clicked
- **Conditional Rendering** - Same component handles both navigation and actions

---

### Step 2: Create Add to Cart Handler

Implement the menu item component with cart functionality.

```jsx
// features/menu/MenuItem.jsx

import { useDispatch } from "react-redux";
import { addItem } from "../cart/cartSlice";
import { formatCurrency } from "../../utils/helpers";
import Button from "../../ui/Button";

function MenuItem({ pizza }) {
  const dispatch = useDispatch();

  // Destructure pizza properties
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;

  function handleAddToCart() {
    // Create item object matching cart state structure
    const newItem = {
      pizzaId: id, // Use pizza's ID
      name, // Pizza name
      quantity: 1, // Start with 1 item
      unitPrice, // Price per pizza
      totalPrice: unitPrice * 1, // Initial total (same as unitPrice)
    };

    // Dispatch action to add item to Redux cart
    dispatch(addItem(newItem));
  }

  return (
    <li className="flex gap-4 py-2">
      {/* Pizza image with sold out styling */}
      <img
        src={imageUrl}
        alt={name}
        className={`h-24 ${soldOut ? "opacity-50 grayscale" : ""}`}
      />

      <div className="flex grow flex-col">
        {/* Pizza name */}
        <p className="font-medium">{name}</p>

        {/* Ingredients list */}
        <p className="text-sm text-stone-500 capitalize italic">
          {ingredients.join(", ")}
        </p>

        {/* Price and add to cart button */}
        <div className="mt-auto flex items-center justify-between">
          {!soldOut ? (
            <p className="text-sm">{formatCurrency(unitPrice)}</p>
          ) : (
            <p className="text-sm font-medium text-stone-500 uppercase">
              Sold out
            </p>
          )}

          {/* Only show button if not sold out */}
          {!soldOut && (
            <Button type="small" onClick={handleAddToCart}>
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
```

**How It Works:**

1. **User Clicks Button** - `handleAddToCart` is called
2. **Create Item Object** - Matches cart slice structure exactly
3. **Dispatch Action** - `addItem(newItem)` sends to Redux
4. **Redux Updates** - Item added to `state.cart.cart` array
5. **UI Updates** - Cart components automatically re-render

---

## Data Flow

```
User Click → handleAddToCart → Create newItem → dispatch(addItem) → Redux Store
    ↓              ↓                  ↓                ↓                 ↓
"Add to cart" → Function runs → {pizzaId, name...} → Action sent → Cart updated
```

---

## Key Points

**Item Structure:**

```javascript
{
  pizzaId: 12,           // From pizza.id
  name: "Mediterranean", // From pizza.name
  quantity: 1,           // Always starts at 1
  unitPrice: 16,         // From pizza.unitPrice
  totalPrice: 16         // quantity × unitPrice
}
```

**Conditional Rendering:**

- Sold out pizzas show grayed out image
- Sold out pizzas display "Sold out" text instead of price
- "Add to cart" button only appears for available pizzas

---

## Important Notes

> **Note:** The `newItem` structure must exactly match your cart slice's expected format.

> **Best Practice:** Always start quantity at 1. Users can increase it from the cart.

> **Sold Out Logic:** Don't show "Add to cart" for unavailable items to prevent errors.

> **Type Consistency:** `pizzaId` uses `id` from pizza object, not `pizza.pizzaId`.

---

## Complete User Journey

1. **User browses menu** - Sees list of pizzas with prices
2. **Finds desired pizza** - Reads name, ingredients, price
3. **Clicks "Add to cart"** - Button triggers `handleAddToCart`
4. **Item created** - New object with quantity=1
5. **Dispatched to Redux** - `addItem` action sent to store
6. **Cart updates** - Item appears in cart (visible in cart overview)
7. **User continues** - Can add more items or proceed to checkout

---

## Next Steps

Continue to: [Building the Cart Overview](./33-building-the-cart-overview.md)
