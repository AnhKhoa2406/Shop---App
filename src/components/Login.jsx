import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../config'

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await axios.post(`${backendUrl}/api/user/admin`, { email, password })
      if (response.data.success) {
        setToken(response.data.token)
        toast.success('Đăng nhập thành công')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100'

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-gray-100 px-4'>
      <div className='w-full max-w-md rounded-2xl border border-gray-200 bg-white px-8 py-10 shadow-xl'>
        <div className='mb-8 text-center'>
          <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-xl'>
            🔐
          </div>
          <h1 className='text-2xl font-bold text-gray-800'>Admin Panel</h1>
          <p className='mt-1 text-sm text-gray-500'>Đăng nhập để quản lý cửa hàng</p>
        </div>

        <form onSubmit={onSubmitHandler} className='space-y-5'>
          <div>
            <label htmlFor='email' className='mb-1.5 block text-sm font-medium text-gray-700'>
              Email Address
            </label>
            <input
              id='email'
              type='email'
              required
              autoComplete='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='youremail@gmail.com'
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor='password' className='mb-1.5 block text-sm font-medium text-gray-700'>
              Password
            </label>
            <div className='relative'>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete='current-password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Nhập mật khẩu'
                className={`${inputClass} pr-16`}
              />
              <button
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
                className='absolute inset-y-0 right-0 px-3 text-xs font-medium text-gray-500 hover:text-orange-600 cursor-pointer'
              >
                {showPassword ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-lg bg-gray-800 py-2.5 text-sm font-medium text-white transition hover:bg-gray-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer'
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login