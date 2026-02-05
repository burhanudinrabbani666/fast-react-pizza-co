import { getMenu } from "../services/apiRestaurant";

export default async function menuLoader() {
  const menu = await getMenu();

  return menu;
}
