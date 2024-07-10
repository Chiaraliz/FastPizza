import { useDispatch, useSelector } from "react-redux";
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";
import { addItem, deleteItem, getCurrentQuantityById } from "../cart/cartSlice";
import UpdateItemQuantity from "../cart/UpdateItemQuantity";

function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const dispatch = useDispatch();
  const CurrentQuantity = useSelector(getCurrentQuantityById(id));
  const isInCart = CurrentQuantity > 0;

  function handleAddItem() {
    const newItem = {
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: 1 * unitPrice,
    };
    dispatch(addItem(newItem));
  }

  return (
    <li className="flex py-2">
      <img
        src={imageUrl}
        alt={name}
        className={`h-28 pr-4 ${soldOut ? "opacity-50 grayscale" : ""}`}
      />
      <div className="flex flex-col grow">
        <p className="font-medium">{name}</p>
        <p className="text-sm capitalize text-stone-500 italic">
          {ingredients.join(", ")}
        </p>
        <div className="mt-auto text-sm flex justify-between flex-col sm:flex-row">
          {!soldOut ? <p>{formatCurrency(unitPrice)}</p> : <p>Sold out</p>}
          {isInCart && (
            <div className="flex items-center gap-4 sm:gap-8">
              <UpdateItemQuantity pizzaId={id} />
              <Button type="small" onClick={() => dispatch(deleteItem(id))}>
                Delete
              </Button>
            </div>
          )}
          {!soldOut && !isInCart && (
            <Button type="small" onClick={handleAddItem}>
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
