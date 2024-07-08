import { useState } from 'react'
import Header from './components/Header'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import PrivateComponent from './components/PrivateComponent'
import Profile from './components/Profile'
import CreateListing from './pages/CreateListing'
import Listing from './pages/Listing'
import UpdateListing from './pages/UpdateListing'
import Search from './pages/Search'
import About from './pages/About'


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
          <Route path='/create-listing' element={<CreateListing/>}/>
          <Route path='update-listing/:listingId' element={<UpdateListing/>}/>
        </Route>
        <Route path='/listing/:listingId' element={<Listing/>}/>
      </Routes>
      </div>
  )
}

export default App
