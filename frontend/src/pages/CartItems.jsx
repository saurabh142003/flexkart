import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MdDelete } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { RiSubtractLine } from "react-icons/ri";
import { loadStripe } from '@stripe/stripe-js';


function CartItems() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const fetchCart = async () => {
    try {
      setLoading(true);
      if (currentUser) console.log("currentId" + currentUser._id);

      const res = await fetch(`/api/cart/${currentUser._id}`);
      const data = await res.json();

      if (!data || data.success === false) {
        setError(true);
        setLoading(false);
        return;
      }

      console.log('Fetched cart data:', data);
      setCart(data);  // Correctly setting the full data object
      setLoading(false);
      setError(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser._id) {
      fetchCart();
    }
  }, [currentUser._id]);

  useEffect(() => {
    console.log('Updated cart state:', cart);
  }, [cart]);

  const removeItem = async (item) => {
    try {
      setLoading(true);
      const res = await fetch('/api/cart/remove/item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser._id, foodId: item._id }),
      });
      const data = await res.json();

      if (data.success === false) {
        setError(true);
        setLoading(false);
        return;
      }

      console.log('Removed item:', data);
      await fetchCart();  // Refetch the cart after removing an item
      setLoading(false);
      setError(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };
  const makePayment = async () => {
    const stripe = await loadStripe("pk_test_51PiKxhRx7TPOeLO79CB3DhGCARCJS9uCUCBR4BxQ0R9zeE4c47JcAC751kjtW06aqg3tBG6pxW0xS76WMxnQY1fH00lzOG7R7k");

    const body = {
      products: cart
    };

    const headers = {
      "Content-Type": "application/json"
    };

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const session = await response.json();
      console.log("Session ID:", session.id);

      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  async function addOne(item) {
    try {
      setLoading(true);
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser._id, foodId: item.foodId._id, quantity: 1 }),
      });
      const data = await res.json();

      if (data.success === false) {
        setError(true);
        setLoading(false);
        return;
      }

      setCart(data)
      await fetchCart();  // Refetch the cart after removing an item
      setLoading(false);
      setError(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }
  async function minusOne(item) {
    try {
      setLoading(true);
      const res = await fetch('/api/cart/remove/quantity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser._id, foodId: item.foodId._id }),
      });
      const data = await res.json();

      if (data.success === false) {
        setError(true);
        setLoading(false);
        return;
      }

      setCart(data)
      await fetchCart();
      setLoading(false);
      setError(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }



  if (loading) return <p className="text-center my-7 text-2xl">Loading...</p>;
  if (error) return <p className="text-center my-7 text-2xl">Something went wrong!</p>;
  if (!cart || !cart.items) return <p className="text-center my-7 text-2xl">Your cart is empty.</p>;

  const totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="cart-page container p-2 sm:p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>
      {cart.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cart.items.map((item) => (
              <div key={item._id} className="w-full md:w-1/3 p-4 flex gap-5 border-b border-gray-300 h-auto">
                <div className="w-[100px] h-[140px] flex-shrink-0 overflow-hidden rounded-lg shadow-md">
                  {item.foodId && (
                    <img
                      src={item.foodId.imageUrls[0]}
                      alt={item.foodId.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  {item.foodId && (
                    <>
                      <div>
                        <h6 className="text-lg font-semibold max-h-[3.5em] overflow-hidden line-clamp-2">
                          {item.foodId.name}
                        </h6>
                        <p className="text-xs text-gray-600">
                          {item.foodId.description.substring(0, 40)}{item.foodId.description.length > 40 ? '...' : ''}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <h6 className="text-xl font-bold text-green-600">
                          ${((item.foodId.discountPrice || item.foodId.regularPrice) * item.quantity).toFixed(2)}
                        </h6>
                        <div className="flex items-center gap-1">
                          <button onClick={() => addOne(item)} className="text-green-600 hover:text-green-800">
                            <IoIosAdd size={18} />
                          </button>
                          <span className="text-lg">{item.quantity}</span>
                          <button onClick={() => minusOne(item)} className="text-red-600 hover:text-red-800">
                            <RiSubtractLine size={18} />
                          </button>
                          <button onClick={() => removeItem(item)} className="text-red-600 hover:text-red-800">
                            <MdDelete size={22} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

            ))}
          </div>
          <div className="cart-summary mt-8 flex flex-col sm:flex-row gap-4 justify-between p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-center">Total Price: ${cart.totalPrice.toFixed(2)}</h2>
            <h2 className="text-2xl font-semibold text-center">Total Quantity: {totalQuantity}</h2>
            <button onClick={makePayment} className='p-4 text-2xl text-white bg-green-700 rounded-md  '>Checkout</button>
          </div>

        </>
      ) : (
        <p className="text-center text-xl">Your cart is empty.</p>
      )}
    </div>
  );
}

export default CartItems;


