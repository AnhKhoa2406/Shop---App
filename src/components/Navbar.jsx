import React from 'react'

const Navbar = ({ onLogout }) => {
  return (
    <nav className='sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md'>
      <div className='flex h-20 items-center justify-between px-6 md:px-10'>
        <div className='flex items-center gap-3'>
          <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 shadow-md'>
            <span className='text-lg font-bold text-white'>
              A
            </span>
          </div>

          <div>
            <h1 className='text-lg font-bold tracking-tight text-gray-900'>
              ADMIN
            </h1>
            <p className='text-xs text-gray-500'>
              Quản lý hệ thống
            </p>
          </div>
        </div>

        <button
          type='button'
          onClick={onLogout}
          className='group flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-md active:scale-95'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.8}
            stroke='currentColor'
            className='h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-6l3 3m0 0l-3 3m3-3h-9'
            />
          </svg>

          <span>Thoát</span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar