import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { CiDiscount1 } from "react-icons/ci";

export default function Food() {
  SwiperCore.use([Navigation]);

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [addToCart, setAddToCart] = useState(true);
  const [item, setItem] = useState(null);
  const [cartUpdated, setCartUpdated] = useState(false);

  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const fetchFoodAndCart = async () => {
    try {
      setLoading(true);

      // Fetch food details
      const foodRes = await fetch(`/api/food/get/${params.foodId}`);
      const foodData = await foodRes.json();
      
      if (!foodData || foodData.success === false) {
        setError(true);
        setLoading(false);
        return;
      }
      console.log("Fetched food data:", foodData);
      setFood(foodData);

      // Fetch cart details
      const cartRes = await fetch(`/api/cart/${currentUser._id}`);
      const cartData = await cartRes.json();
      if(cartData.message=="notFound"){
        setLoading(false)
         return;
      }
   
      if (!cartData || cartData.success === false) {
        // setError(true);
        setLoading(false);
        return;
      }
      console.log("Fetched cart data:", cartData);

      // Check if the food item is in the cart
      if (cartData.items) {
        const foundItem = cartData.items.find(item => item.foodId && item.foodId._id === foodData._id);
        setItem(foundItem);
        setAddToCart(!foundItem);
      }

      setLoading(false);
      setError(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser._id) {
      fetchFoodAndCart();
    }
  }, [params.foodId, currentUser._id, cartUpdated]);

  async function addItem() {
    try {
      setLoading(true);

      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: currentUser._id, foodId: food._id, quantity: 1 })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success === false) {
        setError(data.message);
      } else {
        setAddToCart(false);
        setItem(data.items.find(item => item.foodId._id === food._id));
        console.log('Cart updated:', data);
        setCartUpdated(!cartUpdated); // Trigger re-fetch of cart data
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function removeItem() {
    try {
      setLoading(true);
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: currentUser._id, foodId: food._id })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Remove item response:', data); // Added logging

      if (data.success === false) {
        setError(data.message);
      } else {
        setAddToCart(true);
        setItem(null);
        console.log('Cart updated after removal:', data);
        setCartUpdated(!cartUpdated); // Trigger re-fetch of cart data
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {food && !loading && !error && (
        <div>
          <Swiper navigation>
            {food.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {food.name} - ${' '}
              {food.offer
                ? food.discountPrice.toLocaleString('en-US')
                : food.regularPrice.toLocaleString('en-US')}
            </p>

            <div className='flex gap-4'>
              {food.offer && (
                <p className='bg-green-900 w-full max-w-[130px] text-white text-center p-1 justify-center items-center flex gap-1 rounded-md'>
                  ${+food.regularPrice - +food.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {food.description}
            </p>

            {!item ? (
              <button
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
                onClick={addItem}
              >
                ADD TO CART
              </button>
            ) : (
              <button
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
                onClick={removeItem}
              >
                REMOVE FROM CART
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}




