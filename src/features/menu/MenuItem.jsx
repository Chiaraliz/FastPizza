import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";

function MenuItem({ pizza }) {
  const { name, unitPrice, ingredients, soldOut, imageUrl } = pizza;

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
          <Button type="small">Add to Cart</Button>
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
