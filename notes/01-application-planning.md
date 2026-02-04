# Application planning

FROM THE EARLIER “THINKING IN REACT” LECTURE

1. Break the desired UI into components
2. Build a static version (no state yet)
3. Think about state management + data flow
   👉 This works well for small apps with one page and a few features
   👉 In real-world apps, we need to adapt this process

## HOW TO PLAN AND BUILD A REACT APPLICATION

1. Gather application requirements and features
2. Divide the application into pages
   - 👉 Think about the overall and page-level UI
   - 👉 Break the desired UI into components
   - 👉 Design and build a static version (no state yet)
3. Divide the application into feature categories
   - 👉 Think about state management + data flow
4. Decide on what libraries to use (technology decisions)👨💼 PROJECT REQUIREMENTS FROM THE BUSINESS

PROJECT REQUIREMENTS FROM THE BUSINESS
STEP 1

- Very simple application, where users can order one or more pizzas from a menu
- Requires no user accounts and no login: users just input their names before using the app
- The pizza menu can change, so it should be loaded from an API
- Users can add multiple pizzas to a cart before ordering
- Ordering requires just the user’s name, phone number, and address
- If possible, GPS location should also be provided, to make delivery easier
- User’s can mark their order as “priority” for an additional 20% of the cart price
- Orders are made by sending a POST request with the order data (user data + selected pizzas) to the API
- Payments are made on delivery, so no payment processing is necessary in the app
- Each order will get a unique ID that should be displayed, so the user can later look up their order based on the ID
- Users should be able to mark their order as “priority” order even after it has been placedFEATURES

| Features categories | Necessary page                              | path                                 |
| ------------------- | ------------------------------------------- | ------------------------------------ |
| User                | Homepage                                    | `/`                                  |
| Menu                | Pizza menu                                  | `/menu`                              |
| Cart                | Cart                                        | `/cart`                              |
| Order               | Placing new Order <br/> Looking up an order | `/order/new` <br/> `/order/:orderID` |

## Tech Stack

- React router: Routing and Remote state menagement
- Tailwind CSS: Styling
- Redux: UI State Management

Next: [Setting up professional file structure](./02-settingup-professional-file-structure.md)
