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



  if (loading) return <p className="text-center my-7 text-2xl">Loading...</p>;
  if (error) return <p className="text-center my-7 text-2xl">Something went wrong!</p>;
  if (!cart || !cart.items) return <p className="text-center my-7 text-2xl">Your cart is empty.</p>;

  const totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="cart-page container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>
      {cart.items.length > 0 ? (
        <>
          <div className="cart-items grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cart.items.map((item) => (
              <div key={item._id} className="cart-item relative bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
                {item.foodId && (
                  <>
                    <img src={item.foodId.imageUrls[0]} alt={item.foodId.name} className="h-32 w-32 object-cover rounded mb-4" />
                    <div className="text-center">
                      <h2 className="text-xl font-semibold">{item.foodId.name}</h2>
                      <p className="text-gray-700 mt-2 max-h-20">{item.foodId.description.substring(0, 50)}{item.foodId.description.length > 50 ? '...' : ''}</p>
                      <p className="text-gray-600 mt-2">Price: ${item.foodId.regularPrice - item.foodId.discountPrice === item.foodId.regularPrice ? item.foodId.regularPrice : item.foodId.discountPrice}</p>
                      <p className="text-gray-600 mt-2">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right mt-4">
                      <p className="text-xl font-semibold">
                        ${(item.foodId.regularPrice - item.foodId.discountPrice === item.foodId.regularPrice ? item.foodId.regularPrice : item.foodId.discountPrice * item.quantity).toFixed(2)}
                      </p>
                      <button onClick={() => removeItem(item)} className="text-red-600 absolute bottom-2 right-2 hover:text-red-800">
                        <MdDelete size={24} />
                      </button>
                      <button className="text-red-600 absolute top-16 right-20 hover:text-red-800">
                        <IoIosAdd size={34} />
                      </button>
                      <button className="text-red-600 absolute top-16 left-20 hover:text-red-800">
                        <RiSubtractLine size={34} />
                      </button>
                    </div>
                  </>
                )}
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


