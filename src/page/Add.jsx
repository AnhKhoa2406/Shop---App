import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { backendUrl } from '../App'

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL']

const inputClass =
  'w-full px-4 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 placeholder:text-gray-400'

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Nam')
  const [subCategory, setSubCategory] = useState('Áo')
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!image1) return toast.error('Vui lòng chọn ít nhất 1 ảnh')
    if (sizes.length === 0) return toast.error('Vui lòng chọn ít nhất 1 size')

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('bestseller', bestseller)
      formData.append('sizes', JSON.stringify(sizes))

      image1 && formData.append('image1', image1)
      image2 && formData.append('image2', image2)
      image3 && formData.append('image3', image3)
      image4 && formData.append('image4', image4)

      const response = await axios.post(backendUrl + '/api/product/add', formData, {
        headers: { token },
      })

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setPrice('')
        setSizes([])
        setBestseller(false)
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleSize = (size) =>
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
    )

  const images = [
    { id: 'image1', file: image1, set: setImage1 },
    { id: 'image2', file: image2, set: setImage2 },
    { id: 'image3', file: image3, set: setImage3 },
    { id: 'image4', file: image4, set: setImage4 },
  ]

  return (
    <form onSubmit={onSubmitHandler} className='w-full max-w-3xl mx-auto'>
      {/* Tiêu đề trang */}
      <div className='mb-5'>
        <h2 className='text-2xl font-semibold text-gray-800'>Thêm sản phẩm</h2>
        <p className='text-sm text-gray-500 mt-0.5'>Thêm sản phẩm mới vào cửa hàng</p>
      </div>

      <div className='bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100'>
        {/* Upload ảnh */}
        <div className='p-6'>
          <div className='flex items-baseline justify-between mb-3'>
            <p className='text-sm font-semibold text-gray-700'>Hình ảnh sản phẩm</p>
            <span className='text-xs text-gray-400'>Ảnh đầu tiên là ảnh chính (bắt buộc)</span>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
            {images.map(({ id, file, set }, index) => (
              <label
                key={id}
                htmlFor={id}
                className={`group relative aspect-square overflow-hidden rounded-2xl border-2 border-dashed cursor-pointer transition ${
                  file
                    ? 'border-transparent shadow-sm'
                    : 'border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/50'
                }`}
              >
                {file ? (
                  <>
                    <img
                      className='w-full h-full object-cover'
                      src={URL.createObjectURL(file)}
                      alt=''
                    />
                    <button
                      type='button'
                      title='Xóa ảnh'
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        set(false)
                      }}
                      className='absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 text-white text-sm opacity-0 group-hover:opacity-100 hover:bg-red-500 transition'
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <div className='w-full h-full flex flex-col items-center justify-center gap-1'>
                    <img className='w-8 opacity-50' src={assets.upload_area} alt='' />
                    <span className='text-xs text-gray-400'>
                      {index === 0 ? 'Ảnh chính' : `Ảnh ${index + 1}`}
                    </span>
                  </div>
                )}

                {index === 0 && file && (
                  <span className='absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-medium text-white bg-orange-500 rounded-full'>
                    Chính
                  </span>
                )}

                <input
                  onChange={(e) => {
                    set(e.target.files[0] || false)
                    e.target.value = ''
                  }}
                  type='file'
                  id={id}
                  accept='image/*'
                  hidden
                />
              </label>
            ))}
          </div>
        </div>

        {/* Thông tin cơ bản */}
        <div className='p-6 space-y-5'>
          <div>
            <p className='mb-2 text-sm font-semibold text-gray-700'>Tên sản phẩm</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className={inputClass}
              type='text'
              placeholder='Ví dụ: Áo thun cotton basic'
              required
            />
          </div>

          <div>
            <p className='mb-2 text-sm font-semibold text-gray-700'>Mô tả sản phẩm</p>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder='Mô tả chất liệu, kiểu dáng, cách bảo quản...'
              required
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div>
              <p className='mb-2 text-sm font-semibold text-gray-700'>Danh mục</p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                className={`${inputClass} cursor-pointer`}
              >
                <option value='Nam'>Nam</option>
                <option value='Nữ'>Nữ</option>
                <option value='Trẻ em'>Trẻ em</option>
              </select>
            </div>

            <div>
              <p className='mb-2 text-sm font-semibold text-gray-700'>Danh mục phụ</p>
              <select
                onChange={(e) => setSubCategory(e.target.value)}
                value={subCategory}
                className={`${inputClass} cursor-pointer`}
              >
                <option value='Áo'>Áo</option>
                <option value='Quần'>Quần</option>
                <option value='Đồ mùa đông'>Đồ mùa đông</option>
              </select>
            </div>

            <div>
              <p className='mb-2 text-sm font-semibold text-gray-700'>Giá</p>
              <div className='relative'>
                <span className='absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400'>
                  ₫
                </span>
                <input
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  className={`${inputClass} pl-8`}
                  type='number'
                  min='0'
                  step='1000'
                  placeholder='250000'
                  required
                />
              </div>
              {price !== '' && !isNaN(price) && (
                <p className='mt-1 text-xs text-gray-400'>
                  {Number(price).toLocaleString('vi-VN')} ₫
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sizes + bestseller */}
        <div className='p-6 space-y-5'>
          <div>
            <p className='mb-3 text-sm font-semibold text-gray-700'>Kích cỡ sản phẩm</p>
            <div className='flex flex-wrap gap-3'>
              {SIZE_OPTIONS.map((size) => {
                const active = sizes.includes(size)
                return (
                  <button
                    key={size}
                    type='button'
                    onClick={() => toggleSize(size)}
                    className={`min-w-[52px] px-4 py-2 text-sm font-medium rounded-xl border transition active:scale-95 ${
                      active
                        ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </div>

          <label
            htmlFor='bestseller'
            className='flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-orange-50/50 transition select-none'
          >
            <input
              onChange={() => setBestseller((prev) => !prev)}
              checked={bestseller}
              type='checkbox'
              id='bestseller'
              className='w-4 h-4 accent-orange-500 cursor-pointer'
            />
            <div>
              <p className='text-sm font-medium text-gray-800'>Thêm vào bán chạy</p>
              <p className='text-xs text-gray-400'>Sản phẩm sẽ xuất hiện ở mục bán chạy</p>
            </div>
          </label>
        </div>

        {/* Nút submit */}
        <div className='p-6 flex justify-end'>
          <button
            type='submit'
            disabled={loading}
            className='w-full sm:w-auto sm:min-w-[160px] px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg shadow-orange-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0'
          >
            {loading ? 'Đang thêm...' : 'THÊM SẢN PHẨM'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default Add