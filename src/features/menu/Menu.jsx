import { useLoaderData } from "react-router-dom";
import MenuItem from "./MenuItem";

function Menu() {
  const data = useLoaderData();

  return (
    <ul className="divide-y divide-stone-200 px-2">
      {data.map((pizza) => (
        <MenuItem key={pizza.id} pizza={pizza} />
      ))}
    </ul>
  );
}

export default Menu;

// check is data was loading
