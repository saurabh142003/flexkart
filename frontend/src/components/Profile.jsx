import React, { useEffect, useState } from 'react'
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


function Profile() {
  const { currentUser, loading } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePer, setFilePer] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccessText, setUpdateSuccessText] = useState("")
  const [userRestaurants,setUserRestaurants] = useState([])
  const [showRestaurantsError, setShowRestaurantsError] = useState(false);
  
  const navigate = useNavigate()
  console.log(formData)
  console.log(filePer)

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  function handleFileUpload(file) {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePer(Math.round(progress))
      },
      (error) => {
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl })
        })
      }
    )


  }
  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  console.log(formData)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      // dispatch(setLoading(true))
      const result = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      })
      const data = await result.json()
      if (data.success === false) {
        dispatch(failure(data.message));
        return;
      }
     
      dispatch(success(data))
      setUserUpdateSuccess(true)
      setUpdateSuccessText("User Updated Successfully..");
      setTimeout(() => {
        setUpdateSuccessText("");
      }, 4000); // Display for 2 seconds, then clear after another 2 seconds


    } catch (err) {
      dispatch(setLoading(false))
      console.log(err)
      dispatch(failure("Failed to update usertry again.."))
    }



  }
  async function handleDeleteUser(){
    try{
      dispatch(setLoading(true))
      console.log("before call"+currentUser._id)
      const result = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      })
      const data = await result.json()
      console.log("after call"+currentUser._id)
      
    
      dispatch(userDelete())
      console.log("after delete current user"+currentUser)
      navigate("/signin")


    }catch(err){
      dispatch(setLoading(false))
      dispatch(failure(err.message))
    }
}
async function handleSignOut(){
  try{
    dispatch(setLoading(true))
    const result = await fetch('/api/auth/signout');
    const data = await result.json();
    if(data.success===false){
      dispatch(failure(data.message))
      return
    }
    dispatch(userSignOut())

  }catch(err){
    dispatch(failure(err.message))
  }
}
async function handleShowRestaurants(){
    try{
      const res = await fetch(`/api/user/restaurants/${currentUser._id}`)
      const data = await res.json()
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserRestaurants(data)
    }catch(err){

      setShowRestaurantsError(true)
    }
}
const handleRestaurantDelete = async (resId) => {
  try {
    const res = await fetch(`/api/restaurant/delete/${resId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success === false) {
      console.log(data.message);
      return;
    }

    setUserRestaurants((prev) =>
      prev.filter((res) => res._id !== resId)
    );
  } catch (error) {
    console.log(error.message);
  }
};

  


  return (
    <div className='mt-2 p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg'>
      <h1 className="text-2xl uppercase text-center font-semibold text-gray-800">Profile</h1>
      <div className='w-full flex justify-center mt-5'>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" hidden ref={fileRef} accept='image/*' />
        <img onClick={() => fileRef.current.click()}
          className='object-cover cursor-pointer self-center rounded-full h-20 w-20'
          src={formData.avatar || currentUser.avatar}
          alt="User Avatar"
        />
    
      </div>
      <p className='text-sm mt-1 text-center'>
        {fileUploadError ? (
          <span className="text-red-600 font-semibold">Error while uploading</span>
        ) : filePer > 0 && filePer < 100 ? (
          <span className="text-blue-600">{`Uploading.. ${filePer}%`}</span>
        ) : filePer === 100 ? (
          <span className="text-green-600 font-semibold">Uploaded Successfully</span>
        ) : (
          ""
        )}
      </p>

      <form onSubmit={handleSubmit} className='flex mt-4 flex-col gap-4'>
        <input
          className='border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500'
          type="text"
          placeholder='Username'
          id='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          className='border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500'
          type="email"
          placeholder='Email'
          id='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          className='border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500'
          type="password"
          placeholder='Password'
          id='password'
          onChange={handleChange}
        />
        <button disabled={loading}
          className="uppercase rounded-lg p-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <NavLink className="uppercase rounded-lg w-full text-center p-3 bg-green-600 text-white font-semibold hover:bg-green-700 transition duration-300" to="/register-res">
          Register Restaurant
        </NavLink>
      </form>
      
      <div className='flex justify-between mt-4'>
        <button onClick={handleDeleteUser} className='text-red-600 hover:text-red-800 transition duration-300'>Delete Account</button>
        <button onClick={handleSignOut} className='text-blue-600 hover:text-blue-800 transition duration-300'>Sign Out</button>
      </div>
      <button onClick={handleShowRestaurants} className='text-green-700 w-full border-none'>
        Show Restaurants
      </button>
      <p className='text-red-700 mt-5'>
        {showRestaurantsError ? 'Error showing listings' : ''}
      </p>
      <p className="text-green-600 font-semibold text-center">{updateSuccessText}</p>
      {userRestaurants && userRestaurants.length > 0 && (
        <div className={`flex flex-col gap-4`}>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Restaurants
          </h1>
          {userRestaurants.map((res) => (
            <div
              key={res._id}
              className={`border rounded-lg p-3 flex justify-between items-center gap-4 disp`}
            >
              <NavLink to={`/restaurant/${res._id}`}>
                <img
                  src={res.imageUrls[0]}
                  alt='restaurant cover'
                  className='h-16 w-16 object-contain'
                />
              </NavLink>
              <NavLink
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/restaurant/${res._id}`}
              >
                <p>{res.name}</p>
              </NavLink>

              <div className='flex flex-col item-center'>
                <div className='flex items-center gap-3'>
                  <button
                    onClick={() => handleRestaurantDelete(res._id)}
                    className='text-red-700 uppercase'
                  >
                    Delete
                  </button>
                  <NavLink to={`/update-restaurant/${res._id}`}>
                    <button className='text-green-700 uppercase'>Edit</button>
                  </NavLink>
                </div>
                <div className='flex flex-col gap-2 mt-2'>
                  <NavLink className='text-blue-700 uppercase text-xs' to={`/add-food/${res._id}`}>
                    Add food
                  </NavLink>
                  <NavLink className='text-yellow-500 uppercase text-xs' to={`/edit-menu/${res._id}`}>
                    Edit & View Menu
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  
  )
}

export default Profile
