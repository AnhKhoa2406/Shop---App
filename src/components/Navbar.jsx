import React from 'react'
import { assets } from '../assets/assets'
const Navbar = ({ setToken }) => {
  return (
    <nav className='flex items-center justify-between px-4 py-2 sm:px-[5%]'>
      <img className='w-[max(10%,80px)]' src={assets.logo} alt='Logo' />
      <button
        type='button'
        onClick={() => setToken('')}
        className='bg-gray-600 hover:bg-gray-700 transition-colors text-white px-5 py-2 sm:px-7 rounded-full text-xs sm:text-sm cursor-pointer'
      >
        Logout
      </button>
    </nav>
  )
}

export default Navbar