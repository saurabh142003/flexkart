import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerFoods, setOfferFoods] = useState([]);
  const [restaurants,setRestaurants] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerFoods);
  useEffect(() => {
    const fetchOfferFoods = async () => {
      try {
        const res = await fetch('/api/food/get?offer=true&limit=4');
        const data = await res.json();
        setOfferFoods(data);
        const restaurantRes = await fetch('/api/restaurant/get?limit=10');
        const resData = await restaurantRes.json();
        setRestaurants(resData);

      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferFoods();
  }, []);
  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>favourite</span>
          <br />
          food with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Delish Drive is the best food delivery platform to find your next favourite food to
          have.
          <br />
          We have a wide range of varieties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerFoods &&
          offerFoods.length > 0 &&
          offerFoods.map((food) => (
            <SwiperSlide key={food._id}>
              <div
                style={{
                  background: `url(${food.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
                
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale and rent */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerFoods && offerFoods.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerFoods.map((food) => (
                <ListingItem food={food} key={food._id} type={"food"} />
              ))}
            </div>
          </div>
        )}
        {restaurants && restaurants.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Restaurants</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {restaurants.map((restaurant) => (
                <ListingItem food={restaurant} key={restaurant._id} type={"restaurant"} />
              ))}
            </div>
          </div>
        )}
        {/* {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}