# Error handling in action

using regex

[https://uibakery.io/regex-library/phone-number](https://uibakery.io/regex-library/phone-number)

```jsx
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );
```

adding guard

```jsx
export default async function createOrderAction({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "on",
  };

  // Guard
  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you";

  if (Object.keys(errors).length > 0) return errors;

  // If form submit is okey redirect
  const newOrder = await createOrder(order);
  return redirect(`/order/${newOrder.id}`);
}
```

get information

```jsx
const navigation = useNavigation();
const isSubmiting = navigation.state === "submitting";

const formErrors = useActionData();
```

and rendering in HTML

```jsx
<div>
  <label>Phone number</label>
  <div>
    <input type="tel" name="phone" required />
  </div>
  {formErrors?.phone && <p>{formErrors.phone}</p>}
</div>
```

Next: [Tailwind CSS Crash course: Styling the APP]()
