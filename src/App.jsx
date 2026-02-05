import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./ui/Home";
import Menu from "./features/menu/Menu";
import Order from "./features/order/Order";
import Cart from "./features/cart/Cart";
import CreateOrder from "./features/order/CreateOrder";
import AppLayout from "./ui/AppLayout";
import NotFound from "./ui/Error";

import menuLoader from "./loader/menuLoader";
import createOrderAction from "./features/order/createOrderAction";
import orderLoader from "./loader/orderLoader";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <NotFound />,

    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/menu",
        loader: menuLoader,
        element: <Menu />,
        errorElement: <NotFound />,
      },

      {
        path: "/cart",
        element: <Cart />,
      },

      {
        path: "/order/:orderId",
        loader: orderLoader,
        element: <Order />,
        errorElement: <NotFound />,
      },

      {
        path: "/order/new",
        element: <CreateOrder />,
        action: createOrderAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
