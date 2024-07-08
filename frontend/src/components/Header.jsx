import React from 'react';
import { useSelector } from 'react-redux';
import { useState,useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

function Header() {
  const {currentUser} = useSelector((state)=>state.user)
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    setSearchTerm("")
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 md:flex-row md:justify-between md:p-6">
      <NavLink>
      <div className="flex items-center space-x-2 mb-4 md:mb-0">
        <span className="text-2xl font-bold text-slate-500">Real</span>
        <span className="text-2xl font-bold text-slate-700">Estate</span>
      </div>
      </NavLink>
      <form
          onSubmit={handleSubmit}
          className='bg-white p-3 rounded-lg flex items-center'
        >
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className='text-slate-600' />
          </button>
        </form>
      <div className="flex space-x-4">
        <NavLink to="/" className="text-blue-500 hover:text-blue-700">Home</NavLink>
        <NavLink to="/about" className="text-blue-500 hover:text-blue-700">About</NavLink>
             {currentUser?<NavLink to="/profile"><img className='object-cover rounded-full w-10 h-10 flex justify-center items-center' src={currentUser.avatar} alt="" /></NavLink>: <NavLink to="/signin" className="text-blue-500 hover:text-blue-700">Sign in</NavLink>}
      </div>
    </div>
  );
}

export default Header;
