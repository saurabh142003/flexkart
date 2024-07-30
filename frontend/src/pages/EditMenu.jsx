import React from 'react'
import { useParams } from 'react-router-dom'
import { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useRef } from 'react'
import { app } from '../Firebase'
import {
  uploadBytesResumable, getDownloadURL, getStorage,
  ref,
} from 'firebase/storage'
import { failure, setLoading, success } from '../redux/UserSlice'
import{ userDelete } from '../redux/UserSlice'
import { userSignOut } from '../redux/UserSlice'
import { NavLink, useNavigate } from 'react-router-dom'



function EditMenu() {
    const params = useParams()
    const [resFoods, setResFoods] = useState([]);
    const [restaurant,setRestaurant] = useState(null)
const [loading, setLoading] = useState(false);
const [error, setError] = useState(false);
const { currentUser } = useSelector((state) => state.user);
useEffect(() => {
    const fetchResFoods = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/restaurant/foods/${params.restaurantId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setResFoods(data);
        const restaurantRes = await fetch(`/api/restaurant/get/${params.restaurantId}`);
        const resData = await restaurantRes.json();
        if (resData.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setRestaurant(resData);
        if(resData){
            console.log(resData.userRef,"restaurant user Ref")
            console.log(currentUser._id,"current user ref")
        }
       
       
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchResFoods();
  }, [params.restaurantId]);
  const handleFoodDelete = async (foodId) => {
    try {
      const res = await fetch(`/api/food/delete/${foodId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
  
      setResFoods((prev) =>
        prev.filter((food) => food._id !== foodId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
         <h1 className='text-3xl font-semibold text-center my-7'>
         Edit & View Menu 
      </h1>

        {resFoods.map((food) => (
            <div
              key={food._id}
              className={`border rounded-lg p-3 flex justify-between items-center gap-4 disp`}
            >
              <NavLink to={`/food/${food._id}`}>
                <img
                  src={food.imageUrls[0]}
                  alt='food cover'
                  className='h-16 w-16 object-contain'
                />
              </NavLink>
              <NavLink
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/food/${food._id}`}
              >
                <p>{food.name}</p>
              </NavLink>

           {currentUser && restaurant && currentUser._id===restaurant.userRef && <div className='flex flex-col item-center'>
                <div className='flex items-center gap-3'>
                  <button
                    onClick={() => handleFoodDelete(food._id)}
                    className='text-red-700 uppercase'
                  >
                    Delete
                  </button>
                </div>
              </div>}
            </div>
          ))}
    </div>
  )
}

export default EditMenu