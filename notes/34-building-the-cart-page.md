# Building the cart page

create function to get all cart

```js
export const getCart = (state) => state.cart.cart;
```

import to components

```jsx
const cart = useSelector(getCart);
```

Next: [Deleting cart items](./35-deleting-cart-items.md)
