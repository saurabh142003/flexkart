import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { CiDiscount1 } from "react-icons/ci";
import { MdShoppingCart } from "react-icons/md";
import { BsLightningChargeFill } from "react-icons/bs";
import { FiTag } from "react-icons/fi";
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
      const foodRes = await fetch(`/api/product/get/${params.foodId}`);
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
      if (cartData.message == "notFound") {
        setLoading(false)
        return;
      }

      if (!cartData || cartData.success === false) {
        // setError(true);
        setLoading(false);
        return;
      }
      console.log("hello",cartData)
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
  }, [params.foodId, currentUser._id,cartUpdated]);

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
      console.log(response && "true")
      const data = await response.json();

      if (data.success === false) {
        console.log(error+"error")
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
        <div className='flex sm:flex-row w-full items-center overflow-x-hidden justify-center flex-col'>
          {/* <Swiper navigation>
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
          </Swiper> */}
          <div className='sm:pl-10 flex mt-4 flex-col gap-3'>
            <div className='sm:w-[400px] w-[100vw] h-[300px] sm:h-[400px]'>
              <img className='w-full h-full object-cover' src={food.imageUrls[0]} alt="" />
            </div>
            <div className='flex justify-center gap-3 sm:gap-0 sm:justify-between text-xl text-white font-medium'>
              <div className='flex gap-1 justify-center bg-yellow-500 p-2 sm:p-4 min-w-28 sm:min-w-48' >
                <MdShoppingCart size={26} />
                {!item? (<button onClick={addItem}>Add to cart</button>):<button onClick={removeItem}>Remove from cart</button>}
          
              </div>
              <div className='flex justify-center gap-1 bg-orange-500 p-2 sm:p-4 min-w-28 sm:min-w-48'>
                <BsLightningChargeFill size={26} />
                <button >Buy now</button>
              </div>

            </div>

          </div>
          <div className='flex flex-col max-w-4xl mx-auto sm:p-3 p-6 my-2 gap-4'>
            <p className='text-2xl font-semibold'>
              {food.name}

            </p>
            <div className='flex justify-start items-end gap-3'>
              <p className='text-3xl'>${' '}{food.offer
              ? food.discountPrice.toLocaleString('en-US')
              : food.regularPrice.toLocaleString('en-US')}</p>
              <p className='line-through'>{food.offer? food.regularPrice.toLocaleString('en-US'): ""}</p>
              {food.discountPrice>0 && <p className='text-[#388e3c]'> {((food.regularPrice-food.discountPrice)/food.regularPrice)*100} % discount</p>}

            </div>
            <p>Available offers</p>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-3'>
                <FiTag size={24} color='white' fill='green'/>
                <p>Bank Offer 5% Unlimited Cashback on Flipkart Axis Bank Credit Card</p>
              </div>
              <div className='flex items-center gap-3'>
                <FiTag size={24} color='white' fill='green'/>
                <p>Bank Offer 10% Off on Bank of Baroda Mastercard debit card first time transaction, Terms and Condition apply</p>
              </div>
              <div className='flex items-center gap-3'>
                <FiTag size={24} color='white' fill='green'/>
                <p>Purchase this Furniture or Appliance and Get Extra ₹500 Off on Select ACs</p>
              </div>
              <div className='flex items-center gap-3'>
                <FiTag size={24} color='white' fill='green'/>
                <p>Partner OfferExtra 10% off upto ₹500 on next furniture purchase</p>
              </div>
            </div>
            

            {/* <div className='flex gap-4'>
              {food.offer && (
                <p className='bg-green-900 w-full max-w-[130px] text-white text-center p-1 justify-center items-center flex gap-1 rounded-md'>
                  ${+food.regularPrice - +food.discountPrice} OFF
                </p>
              )}
            </div> */}
             <div className='flex gap-8 pb-6 border-b-black border-b' >
              <p className='font-extralight'>Delivery</p>
              <p>Delivery by Sun Nov 10 2024 | ₹40</p>
            </div>
          
            <div className='flex gap-8 pb-6 border-b-black border-b' >
              <p className='font-extralight'>Waranty</p>
              <p>No warranty</p>
            </div>
           
            <div className='flex gap-12' >
              <p className='font-extralight'>Seller</p>
              <div className='flex flex-col justify-center'>
                <p className='text-blue-700'>SuperComNet</p>
                <p>GST invoice available</p>
                <p>View more sellers starting from ₹329</p>
              </div>
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {food.description}
            </p>
           
          
            
          </div>
        </div>
      )}
    </main>
  );
}




