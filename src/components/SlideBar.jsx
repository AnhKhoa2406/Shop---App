import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const menuItems = [
  { to: '/add', icon: assets.add_icon, label: 'Add Items' },
  { to: '/list', icon: assets.order_icon, label: 'List Items' },
  { to: '/orders', icon: assets.order_icon, label: 'Orders' },
]

const Sidebar = () => {
  return (
    <aside className='sticky top-0 h-screen w-[72px] md:w-[240px] shrink-0 bg-white border-r border-gray-200 shadow-sm'>
      <nav className='flex flex-col gap-2 p-3 md:p-4'>
        <p className='hidden md:block px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400'>
          Quản lý
        </p>

        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.label}
            className={({ isActive }) =>
              `group relative flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:translate-x-1'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Thanh nhấn bên trái khi active */}
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-orange-500 transition-opacity duration-200 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-white shadow'
                      : 'bg-gray-100 group-hover:bg-white'
                  }`}
                >
                  <img className='h-5 w-5' src={item.icon} alt='' />
                </span>

                <span className='hidden md:block'>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar