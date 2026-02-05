import { getOrder } from "../services/apiRestaurant";

export default async function orderLoader({ params }) {
  const order = await getOrder(params.orderId);

  return order;
}
