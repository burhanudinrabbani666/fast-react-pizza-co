import { getOrder } from "../services/apiRestaurant";

export async function OrderLoader({ params }) {
  const order = await getOrder(params.orderId);

  return order;
}
