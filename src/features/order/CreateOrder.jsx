import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { clearCart, getTotalPizzaPrice } from "../cart/cartSlice";
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const cart = useSelector((state) => state.cart.cart);
  const formErrors = useActionData();
  const username = useSelector((state) => state.user.username);
  const totalItemsPrice = useSelector(getTotalPizzaPrice);
  const priorityPrice = withPriority ? totalItemsPrice * 0.2 : 0;
  const totalPrice = totalItemsPrice + priorityPrice;
  const dispatch = useDispatch();
  const position = useSelector((state) => state.user.position);
  const address = useSelector((state) => state.user.address);
  const addressError = useSelector((state) => state.user.error);

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="mt-4 mx-4">
      <h2 className="text-xl font-semibold mb-7">
        Ready to order? Let&apos;s go!
      </h2>

      <Form method="POST">
        <div className="flex flex-col sm:flex-row mb-3 sm:items-center">
          <label className="sm:basis-40 mb-2">First Name</label>
          <input
            type="text"
            name="customer"
            className="input grow"
            defaultValue={username}
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row mb-3 sm:items-center">
          <label className="sm:basis-40 mb-2">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone" className="input w-full" required />
            {formErrors?.phone && (
              <p className="text-red-500 bg-red-200 mt-3 px-3 py-1 rounded-md">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row mb-3 sm:items-center">
          <label className="sm:basis-40 mb-2">Address</label>
          <div className="grow mr-3">
            <input
              type="text"
              name="address"
              className="input w-full"
              defaultValue={address}
              required
            />
            {addressError && (
              <p className="text-red-500 bg-red-200 mt-3 px-3 py-1 rounded-md">
                {addressError}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <Button
              type="small"
              onClick={(e) => {
                e.preventDefault();
                dispatch(fetchAddress());
              }}
            >
              Get Position
            </Button>
          )}
        </div>

        <div className="mt-5 flex gap-3 mb-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400
            focus:ring-offset-2 border-0 border-stone-200"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)}></input>
          <input
            type="hidden"
            name="position"
            value={
              position.latitude && position.longitude
                ? `${position.latitude}, ${position.longitude} `
                : ""
            }
          ></input>
          <Button disabled={isSubmitting} type="primary">
            {isSubmitting
              ? "Placing order..."
              : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority,
  };

  const errors = {};

  if (!isValidPhone(order.phone)) {
    errors.phone = "Please give correct phone number.";
  }

  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);

  store.dispatch(clearCart());
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
