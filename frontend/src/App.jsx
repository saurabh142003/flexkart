import { useState } from 'react'
import Header from './components/Header'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import PrivateComponent from './components/PrivateComponent'
import Profile from './components/Profile'
import Restaurant from './pages/Restaurant'

import Search from './pages/Search'
import About from './pages/About'
import RegisterRes from './pages/RegisterRes'
import AddFood from './pages/AddFood'
import UpdateRestaurant from './pages/UpdateRestaurant'
import Food from './pages/Food'
import EditMenu from './pages/EditMenu'
import CartItems from './pages/CartItems'
import Success from './components/Success'
import Cancel from './components/Cancel'
// import CartPage from './pages/CartPage'


function App() {
  

  return (
    <div>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/search' element={<Search />} />
        <Route path='/about' element={<About/>} />
        <Route element={<PrivateComponent/>}>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/register-res' element={<RegisterRes/>}/>
          <Route path='/add-food' element={<AddFood/>}/>
          <Route path='/edit-menu/:restaurantId' element={<EditMenu/>}/>
          
          <Route path='/update-product/:productId' element={<UpdateRestaurant/>}/>
        </Route>
        <Route path='/restaurant/:restaurantId' element={<Restaurant/>}/>
        <Route path='/food/:foodId' element={<Food/>}/>
        <Route path='/cart' element={<CartItems/>}/>
        <Route path='/success' element={<Success/>}/>
        <Route path='/cancel' element={<Cancel/>}/>
      </Routes>
      </div>
  )
}

export default App
