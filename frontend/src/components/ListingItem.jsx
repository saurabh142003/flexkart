import React from 'react';
import { Link } from 'react-router-dom';

export default function ListingItem({ food, type }) {
  return (
    <div key={food._id} className="flex border border-black flex-col items-center gap-3 p-7 w-52">
      <Link className='' to={type === "food" ? `/food/${food._id}` : `/restaurant/${food._id}`}>
        <div>
          <h6 className="font-bold h-20 w-full text-sm" style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
            {food.name}
          </h6>
        </div>

        <div className="h-10 w-full">
          <p className="text-sm text-gray-600">{food.description.substring(0, 30)}...</p>
        </div>
        <div className='w-full h-[160px] flex items-center justify-center '>
          <div className="h-[150px] w-[110px] overflow-hidden mt-6 mb-6">
            <img
              src={
                food.imageUrls[0] ||
                'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
              }
              alt="food cover"
              className="w-full h-full object-cover"
            />
          </div>

        </div>

        <div className="flex justify-between w-full">
          <h5 className="w-20">
            {type === "food" && (
              <span>
                {food.offer ? `$${food.discountPrice.toLocaleString('en-US')}` : `$${food.regularPrice.toLocaleString('en-US')}`}
              </span>
            )}
          </h5>
          <button>Add to cart</button>
        </div>
      </Link>
    </div>
  );
}
