import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ food,type }) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={type==="food"? `/food/${food._id}`:`/restaurant/${food._id}`}>
        <img
          src={
            food.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='food cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-slate-700'>
            {food.name}
          </p>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {food.description}
          </p>
          {type==="food"? <p className='text-slate-500 mt-2 font-semibold flex gap-2 '>
          <del>${food.regularPrice.toLocaleString('en-US')}</del>
            $
            {food.offer
              ? food.discountPrice.toLocaleString('en-US')
              : food.regularPrice.toLocaleString('en-US')}
              
          </p>:""}
        </div>
      </Link>
    </div>
  );
}