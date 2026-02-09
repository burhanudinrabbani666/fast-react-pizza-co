# Integrating Geolocation

## Overview

This guide shows how to integrate the geolocation feature into your form, allowing users to auto-fill their address with one click. It includes loading states, error handling, and conditional button rendering.

---

## 1. Setting Up Component State

### Code Implementation

```jsx
const {
  username,
  status: addressStatus, // Renamed to avoid conflicts
  position,
  address,
  error: errorAddress, // Renamed to be more specific
} = useSelector((state) => state.user);

// Helper variable for cleaner conditional rendering
const isLoadingAddress = addressStatus === "loading";
```

### How It Works

1. **useSelector Hook**: Extracts user data from Redux store
2. **Renamed Variables**:
   - `status` → `addressStatus` (more descriptive)
   - `error` → `errorAddress` (avoids naming conflicts)
3. **isLoadingAddress**: Boolean flag derived from status for easier use in UI

---

## 2. Address Input Field with Auto-Fill

### Code Implementation

```jsx
<div className="grow">
  {/* Address input - auto-fills when geolocation succeeds */}
  <input
    type="text"
    name="address"
    required
    className="input w-full"
    disabled={isLoadingAddress} // Disable during fetch
    defaultValue={address} // Pre-fill with fetched address
  />

  {/* Error message - only shown when geolocation fails */}
  {addressStatus === "error" && (
    <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
      {errorAddress}
    </p>
  )}
</div>
```

### How It Works

**Input Field**:

- **defaultValue**: Auto-fills with fetched address (user can still edit)
- **disabled**: Prevents editing while fetching location
- **required**: Ensures address is provided before form submission

**Error Display**:

- **Conditional Rendering**: Only shows when `addressStatus === "error"`
- **Styling**: Red background with error message for clear visibility
- **Message**: Shows the actual error (e.g., "User denied geolocation")

---

## 3. Get Position Button (Conditional)

### Code Implementation

```jsx
{
  /* Only show button if position hasn't been fetched yet */
}
{
  !position.latitude && !position.longitude && (
    <span className="absolute top-0 right-1 z-50">
      <Button
        disabled={isLoadingAddress} // Disable during fetch
        type="small"
        onClick={(event) => {
          event.preventDefault(); // Prevent form submission
          dispatch(fetchAddress()); // Trigger geolocation fetch
        }}
      >
        {isLoadingAddress ? "Getting..." : "Get position"}
      </Button>
    </span>
  );
}
```

### How It Works

**Conditional Rendering**:

- **Condition**: `!position.latitude && !position.longitude`
- **Purpose**: Button only appears if coordinates haven't been fetched
- **Result**: Once address is fetched, button disappears

**Button Behavior**:

- **event.preventDefault()**: Prevents form submission when clicked
- **dispatch(fetchAddress())**: Triggers the async thunk
- **disabled**: Button grayed out during loading
- **Dynamic Text**: Shows "Getting..." during loading (optional enhancement)

**Positioning**:

- **absolute positioning**: Places button inside input field (top-right corner)
- **z-50**: Ensures button stays above other elements

---

## Complete User Flow

```
User opens order form
    ↓
Address input is empty
    ↓
"Get position" button visible (top-right of input)
    ↓
User clicks "Get position"
    ↓
Button disabled, shows "Getting..."
    ↓
Browser requests location permission
    ↓

SUCCESS PATH:
  User grants permission
    ↓
  Coordinates fetched → Address retrieved
    ↓
  Input auto-fills with address
    ↓
  Button disappears (position exists)
    ↓
  User can edit address if needed

ERROR PATH:
  User denies permission (or error occurs)
    ↓
  Red error message appears below input
    ↓
  Button re-enabled
    ↓
  User must manually enter address
```

---

## Complete Component Example

```jsx
import { useDispatch, useSelector } from "react-redux";
import { fetchAddress } from "./userSlice";
import Button from "../../ui/Button";

function CreateOrder() {
  const dispatch = useDispatch();

  // Extract user state from Redux
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state) => state.user);

  const isLoadingAddress = addressStatus === "loading";

  return (
    <form>
      {/* Address field container */}
      <div className="relative mb-5">
        <label>Address</label>
        <div className="grow">
          <input
            type="text"
            name="address"
            required
            className="input w-full"
            disabled={isLoadingAddress}
            defaultValue={address}
          />

          {/* Error message */}
          {addressStatus === "error" && (
            <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
              {errorAddress}
            </p>
          )}
        </div>

        {/* Get position button (conditional) */}
        {!position.latitude && !position.longitude && (
          <span className="absolute top-0 right-1 z-50">
            <Button
              disabled={isLoadingAddress}
              type="small"
              onClick={(event) => {
                event.preventDefault();
                dispatch(fetchAddress());
              }}
            >
              {isLoadingAddress ? "Getting..." : "Get position"}
            </Button>
          </span>
        )}
      </div>
    </form>
  );
}

export default CreateOrder;
```

---

## Key Benefits

✅ **One-Click Auto-Fill**: Users don't need to type their address

✅ **Smart Button**: Disappears after address is fetched

✅ **Loading State**: Clear feedback during geolocation fetch

✅ **Error Handling**: Shows helpful error if permission denied

✅ **Editable**: Users can modify auto-filled address if needed

✅ **Fallback**: Manual entry always available if geolocation fails

---

## Important Notes

⚠️ **Fixed Typo**: Changed `langitude` → `longitude` in the condition check

💡 **defaultValue vs value**:

- `defaultValue`: Sets initial value, allows user editing
- `value`: Controlled input, would need onChange handler

🔒 **Browser Permissions**:

- Users must grant location access
- Different browsers handle permissions differently
- Always provide manual input as fallback

💡 **Position Check**:

- Checks both `latitude` and `longitude` to ensure complete position
- Button only hides when both coordinates exist

⚠️ **Form Submission**:

- `event.preventDefault()` is critical
- Without it, clicking button would submit the form

---

## UI States Summary

| State   | Button Visible | Button Enabled | Input Disabled | Error Shown |
| ------- | -------------- | -------------- | -------------- | ----------- |
| Initial | ✅ Yes         | ✅ Yes         | ❌ No          | ❌ No       |
| Loading | ✅ Yes         | ❌ No          | ✅ Yes         | ❌ No       |
| Success | ❌ No          | N/A            | ❌ No          | ❌ No       |
| Error   | ✅ Yes         | ✅ Yes         | ❌ No          | ✅ Yes      |

---

## Next Steps

Continue to: [Fetching data](./40-fetching-data.md)
