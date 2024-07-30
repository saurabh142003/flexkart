import React from 'react';
import { useDispatch ,useSelector} from 'react-redux';
import { MdDelete } from "react-icons/md";


function CartItem({ product }) {
    const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  async function removeItem(){
    try {
        setLoading(true)
        const response = await fetch('/api/cart/remove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId:currentUser._id, foodId:product.foodId._id})
        });
       
        const data = await response.json();
        setLoading(false)

        if (data.success === false) {
            setError(data.message);
          }
          setAddToCart(true)
        console.log('Cart updated:', data);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
  }

  return (
    <div className="w-full md:w-1/3 p-4 flex gap-5 border-b border-gray-300 h-auto">
      <div className="w-[80px] h-[80px] flex-shrink-0 overflow-hidden rounded-lg shadow-md">
        <img className="w-full h-full object-cover" src={product.foodId.imageUrl[0]} alt={product.foodId.name} />
      </div>
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <h6 className="text-lg font-semibold max-h-[3.5em] overflow-hidden line-clamp-2">
            {product.foodId.name}
          </h6>
          <p className="text-sm text-gray-600">{product.foodId.description.substring(0, 40)}...</p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <h6 className="text-xl font-bold text-green-600">${product.foodId.regularPrice-product.foodId.discountPrice}</h6>
          <button onClick={removeItem} className="text-red-600 hover:text-red-800">
            <MdDelete size={24} />
          </button>

        </div>
      </div>
    </div>
  );
}

export default CartItem;