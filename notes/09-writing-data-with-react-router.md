# Writing Data with React Router Actions

## Overview

This guide explains how to handle form submissions and data mutations using React Router's **Actions**. Actions are the write equivalent of loaders—while loaders fetch data, actions handle form submissions, data creation, updates, and deletions.

---

## Core Concept: React Router Actions

**Actions** are async functions that handle data mutations triggered by form submissions. They run when a form with `method="POST"`, `PUT`, `PATCH`, or `DELETE` is submitted.

**Key Differences from Traditional Forms:**

- No need for `onSubmit` handlers or `preventDefault()`
- Automatic form serialization
- Built-in navigation after submission
- Automatic revalidation of loader data
- Error handling through error boundaries

**When to Use Actions:**

- Creating new records (POST)
- Updating existing records (PUT/PATCH)
- Deleting records (DELETE)
- Any data mutation that should trigger a form submission

---

## Implementation

### Step 1: Use React Router's Form Component

Replace standard HTML `<form>` with React Router's `<Form>` component to enable action handling.

```jsx
// features/order/CreateOrder.jsx

import { Form } from "react-router-dom";

function CreateOrder() {
  return (
    // The method="POST" tells React Router to call the action on submit
    <Form method="POST">
      {/* Your form fields here */}
      <input type="text" name="customer" placeholder="Your name" required />
      <input type="tel" name="phone" placeholder="Phone number" required />
      <input type="text" name="address" placeholder="Address" required />

      {/* Hidden field for cart data */}
      <input type="hidden" name="cart" value={JSON.stringify(cart)} />

      {/* Priority checkbox */}
      <input type="checkbox" name="priority" id="priority" />
      <label htmlFor="priority">Priority delivery?</label>

      <button type="submit">Order Now</button>
    </Form>
  );
}

export default CreateOrder;
```

**How It Works:**

- **`<Form>`** - React Router component that intercepts form submission
- **`method="POST"`** - Specifies this is a data creation operation
- **`name` attributes** - These become keys in the form data object
- **No `onSubmit`** - React Router handles submission automatically
- **No `action` prop** - Defaults to the current route's action

---

### Step 2: Create the Action Function

Build an action function to process the form data and create the order.

```jsx
// features/order/CreateOrder.jsx

import { redirect } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";

export async function createOrderAction({ request }) {
  // Extract form data from the request
  const formData = await request.formData();

  // Convert FormData to a plain JavaScript object
  // FormData entries: [['customer', 'John'], ['phone', '123'], ...]
  // Result: { customer: 'John', phone: '123', ... }
  const data = Object.fromEntries(formData);

  console.log(data); // Debug: see raw form data

  // Transform the data into the format your API expects
  const order = {
    ...data, // Spread all form fields
    cart: JSON.parse(data.cart), // Parse cart from JSON string to array
    priority: data.priority === "on", // Convert checkbox to boolean
  };

  console.log(order); // Debug: see transformed order object

  // Send the order to your API
  const newOrder = await createOrder(order);

  console.log(newOrder); // Debug: see API response

  // Redirect to the new order's page
  // This navigation happens automatically after the action completes
  return redirect(`/order/${newOrder.id}`);
}
```

**How It Works:**

1. **`request.formData()`** - Extracts form data from the HTTP request
2. **`Object.fromEntries()`** - Converts FormData to a plain object:

```javascript
// Before: FormData { customer: "John", phone: "123" }
// After: { customer: "John", phone: "123" }
```

3. **Data Transformation** - Adjusts data types for API:
   - `cart`: Parse JSON string back to array
   - `priority`: Convert checkbox value ("on" or undefined) to boolean
4. **`createOrder(order)`** - API call to create the order
5. **`redirect()`** - Navigate to the new order's detail page

**Understanding Form Data Transformation:**

```javascript
// Raw form data (all strings)
{ customer: "John", phone: "123", cart: "[{...}]", priority: "on" }

// Transformed for API (correct types)
{ customer: "John", phone: "123", cart: [{...}], priority: true }
```

---

### Step 3: Configure the Route with Action

Connect your action to the route in your router configuration.

```jsx
// App.jsx

import CreateOrder, { createOrderAction } from "./features/order/CreateOrder";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      // ... other routes
      {
        path: "/order/new", // Route path for the order form
        element: <CreateOrder />, // Component to render
        action: createOrderAction, // Function to handle form submission
      },
    ],
  },
]);
```

**How It Works:**

- **`path`** - URL where the form is displayed
- **`element`** - Component containing the form
- **`action`** - Function called when form is submitted
- **No `errorElement`** needed here (will bubble to parent's error handler)

---

### Step 4: Create the API Service Function

Implement the function that sends the order data to your backend API.

```jsx
// services/apiRestaurant.js

export async function createOrder(newOrder) {
  try {
    // Make POST request to create order
    const res = await fetch(`${API_URL}/order`, {
      method: "POST", // HTTP method for creating resources
      body: JSON.stringify(newOrder), // Convert order object to JSON string
      headers: {
        "Content-Type": "application/json", // Tell server we're sending JSON
      },
    });

    // Check if request was successful
    if (!res.ok) throw Error();

    // Parse and extract order data from response
    const { data } = await res.json();

    // Return the created order (includes server-generated ID, timestamp, etc.)
    return data;
  } catch {
    // Throw user-friendly error message
    // This will be caught by React Router's error boundary
    throw Error("Failed creating your order");
  }
}
```

**How It Works:**

- **`method: "POST"`** - Indicates we're creating a new resource
- **`JSON.stringify()`** - Converts JavaScript object to JSON string
- **`Content-Type` header** - Tells server the request body is JSON
- **Error Handling** - Throws error if request fails (caught by error boundary)
- **Response Data** - Returns the created order with server-added fields (ID, timestamp, etc.)

---

## Complete Form Submission Flow

### When a User Submits the Order Form:

1. **User Clicks Submit** - Form submission is triggered

2. **React Router Intercepts** - `<Form method="POST">` prevents default browser behavior

3. **Form Data Collected** - All form fields with `name` attributes are gathered

4. **Action Function Called** - React Router calls `createOrderAction({ request })`

5. **Data Extraction** - Form data is extracted and converted to an object

6. **Data Transformation** - Data types are adjusted for API requirements:

```javascript
   cart: "[{...}]" → [{...}]      // JSON string to array
   priority: "on" → true          // String to boolean
```

7. **API Request** - `createOrder()` sends POST request to backend

8. **Server Processing** - Backend creates order and returns data:

```javascript
   { id: "ORD-123", customer: "John", status: "preparing", ... }
```

9. **Navigation** - `redirect()` sends user to `/order/ORD-123`

10. **Page Loads** - Order detail page loads with the new order data

11. **Data Revalidation** - All active loaders are revalidated to ensure fresh data

---

## Understanding FormData vs Object

### FormData (Raw)

```javascript
FormData {
  [entries]: [
    ['customer', 'John Doe'],
    ['phone', '555-0123'],
    ['address', '123 Main St'],
    ['cart', '[{"id":1,"name":"Pizza"}]'],
    ['priority', 'on']
  ]
}
```

### After Object.fromEntries()

```javascript
{
  customer: 'John Doe',
  phone: '555-0123',
  address: '123 Main St',
  cart: '[{"id":1,"name":"Pizza"}]',  // Still a string!
  priority: 'on'                        // String, not boolean!
}
```

### After Transformation

```javascript
{
  customer: 'John Doe',
  phone: '555-0123',
  address: '123 Main St',
  cart: [{ id: 1, name: 'Pizza' }],    // Now an array
  priority: true                        // Now a boolean
}
```

---

## Key Benefits

✅ **No Manual Event Handlers** - No need for `onSubmit` or `preventDefault()`  
✅ **Automatic Serialization** - Form data automatically collected  
✅ **Built-in Navigation** - `redirect()` handles post-submit navigation  
✅ **Error Handling** - Errors caught by error boundaries  
✅ **Optimistic UI** - Can show pending states with `useNavigation()`  
✅ **Data Revalidation** - All loaders automatically rerun after action completes

---

## Important Notes

> **Note:** The `name` attribute on form inputs is crucial—it becomes the key in your data object. Without it, that field won't be included in the form data.

> **Checkbox Values:** Unchecked checkboxes don't send any data. Checked checkboxes send the value `"on"` by default (or a custom value if specified).

> **Hidden Inputs:** Use `<input type="hidden">` to include data that isn't visible to users (like cart contents or IDs).

> **Form Methods:**
>
> - `POST` - Create new resources
> - `PUT/PATCH` - Update existing resources
> - `DELETE` - Delete resources

> **Best Practice:** Always validate form data in your action before sending to the API. Don't trust client-side data alone.

---

## Advanced: Form Validation

Add validation before submitting to the API:

```jsx
export async function createOrderAction({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // Validation
  const errors = {};

  if (!data.customer) errors.customer = "Name is required";
  if (!data.phone) errors.phone = "Phone is required";
  if (data.phone.length < 10) errors.phone = "Phone must be at least 10 digits";

  // Return errors if validation fails
  if (Object.keys(errors).length > 0) {
    return errors; // These will be available via useActionData()
  }

  // Proceed with order creation if validation passes
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "on",
  };

  const newOrder = await createOrder(order);
  return redirect(`/order/${newOrder.id}`);
}

// In component
import { useActionData } from "react-router-dom";

function CreateOrder() {
  const errors = useActionData(); // Get validation errors

  return (
    <Form method="POST">
      <input name="customer" />
      {errors?.customer && <span>{errors.customer}</span>}
      {/* ... */}
    </Form>
  );
}
```

---

## Debugging Tips

**1. Log form data at each transformation step:**

```jsx
console.log("Raw:", Object.fromEntries(formData));
console.log("Transformed:", order);
console.log("API Response:", newOrder);
```

**2. Check network tab** to see the actual API request

**3. Use React Router DevTools** to inspect form submissions

---

## Next Steps

Continue to: [Error Handling in Actions](./10-error-handling-in-action.md)
