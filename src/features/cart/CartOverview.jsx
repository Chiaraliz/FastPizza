import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalPizzaPrice, getTotalPizzaQuantity } from "./cartSlice";
function CartOverview() {
  const totalItemsQuantity = useSelector(getTotalPizzaQuantity);
  const totalItemsPrice = useSelector(getTotalPizzaPrice);

  if (!totalItemsQuantity) return null;
  return (
    <div className="bg-gray-300  uppercase px-4 py-4 sm:px-6 text-sm md:text-base flex items-center justify-between">
      <p className="font-semibold space-x-4 sm:space-x-6 ">
        <span>{totalItemsQuantity} pizzas</span>
        <span>${totalItemsPrice}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
