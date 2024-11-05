import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import { PiHamburger } from "react-icons/pi";


const bannerData = [
  { id: 1, url: 'https://rukminim1.flixcart.com/flap/3376/560/image/57267a180af306fe.jpg?q=50' },
  { id: 2, url: 'https://rukminim1.flixcart.com/flap/3376/560/image/d117a62eb5fbb8e1.jpg?q=50' },
  { id: 3, url: 'https://rukminim1.flixcart.com/flap/3376/560/image/ae9966569097a8b7.jpg?q=50' },
  { id: 4, url: 'https://rukminim1.flixcart.com/flap/3376/560/image/f6202f13b6f89b03.jpg?q=50' }
]

export default function Home() {
  const [offerFoods, setOfferFoods] = useState([]);
  const [foods, setFoods] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerFoods);
  useEffect(() => {
    const fetchOfferFoods = async () => {
      try {
        const res = await fetch('/api/product/get?offer=true&limit=4');
        const data = await res.json();
        setOfferFoods(data);
        const restaurantRes = await fetch('/api/product/get?limit=10');
        const resData = await restaurantRes.json();
        setFoods(resData);

      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferFoods();
  }, []);
  return (
    <div>
      {/* top */}
      {/* <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>favourite</span>
          <br />
          food with ease
        </h1>
        <div className='text-gray-400 relative text-xs sm:text-sm'>
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
      </div> */}

      {/* swiper */}
      <Swiper navigation>
        {bannerData &&
          bannerData.length > 0 &&
          bannerData.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div
                style={{
                  backgroundImage: `url(${banner.url})`,
                  backgroundPosition: 'center', // Center the image for both desktop and mobile
                  backgroundSize: 'cover',      // Cover the full width and height of the div
                  backgroundRepeat: 'no-repeat',
                }}
                className="w-full h-[300px] sm:h-[500px]" // Full width, different heights for mobile and desktop
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
            <div className='flex sm:justify-start justify-center flex-wrap gap-4'>
              {offerFoods.map((food) => (
                <ListingItem food={food} key={food._id} type={"food"} />
              ))}
            </div>
          </div>
        )}
        {foods && foods.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>All products</h2>
              {/* <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link> */}
            </div>
            <div className='flex sm:justify-start justify-center flex-wrap gap-4'>
              {foods.map((food) => (
                <ListingItem food={food} key={food._id} type={"food"} />
              ))}
            </div>
          </div>
        )}
        {/* {restaurants && restaurants.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Restaurants</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search'}>Show more restaurants</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {restaurants.map((restaurant) => (
                <ListingItem food={restaurant} key={restaurant._id} type={"restaurant"} />
              ))}
            </div>
          </div>
        )} */}
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