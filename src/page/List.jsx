import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../config'

// Ảnh dự phòng dạng SVG nhúng sẵn, không cần file placeholder.png
const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' fill='#f3f4f6'/><circle cx='24' cy='24' r='4' fill='#d1d5db'/><path d='M12 52l14-18 10 12 7-8 9 14z' fill='#d1d5db'/></svg>"
  )

const formatVND = (value) => {
  const num = Number(value)
  if (isNaN(num)) return value
  return num.toLocaleString('vi-VN') + ' ₫'
}

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchList = async () => {
    setLoading(true)
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Tiêu đề trang */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Tất cả sản phẩm</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Quản lý toàn bộ sản phẩm trong cửa hàng
          </p>
        </div>
        <span className="px-3 py-1 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-100 rounded-full">
          {list.length} sản phẩm
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header bảng */}
        <div className="hidden md:grid grid-cols-[90px_3fr_1fr_1fr_80px] items-center gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <span>Hình ảnh</span>
          <span>Tên sản phẩm</span>
          <span>Danh mục</span>
          <span>Giá</span>
          <span className="text-center">Thao tác</span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trống */}
        {!loading && list.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <p className="text-4xl mb-2">📦</p>
            <p className="text-sm">Chưa có sản phẩm nào</p>
          </div>
        )}

        {/* Danh sách */}
        {!loading && (
          <div className="divide-y divide-gray-100">
            {list.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-[64px_1fr_auto] md:grid-cols-[90px_3fr_1fr_1fr_80px] items-center gap-4 px-5 py-3 hover:bg-orange-50/40 transition-colors"
              >
                <img
                  className="w-16 h-16 object-cover rounded-xl border border-gray-100 bg-gray-50"
                  src={item.image?.[0] || PLACEHOLDER}
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = PLACEHOLDER
                  }}
                />

                <div className="min-w-0">
                  <p className="font-medium text-gray-800 truncate">{item.name}</p>
                  {/* Hiện trên mobile */}
                  <p className="md:hidden text-xs text-gray-500 mt-1">
                    {item.category} · {formatVND(item.price)}
                  </p>
                </div>

                <span className="hidden md:inline-block w-fit px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                  {item.category}
                </span>

                <p className="hidden md:block font-semibold text-gray-800">
                  {formatVND(item.price)}
                </p>

                <div className="flex justify-center">
                  <button
                    onClick={() => removeProduct(item._id)}
                    title="Xóa sản phẩm"
                    className="p-2 text-gray-400 rounded-lg hover:text-red-600 hover:bg-red-50 active:scale-90 transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.35 9m-4.78 0L9.26 9m9.97-3.21c.34.05.68.1 1.02.17m-1.02-.17L18.16 19.67a2.25 2.25 0 01-2.24 2.08H8.08a2.25 2.25 0 01-2.24-2.08L4.77 5.79m14.46 0a48.1 48.1 0 00-3.48-.4m-12 .57c.34-.06.68-.12 1.02-.17m0 0a48.1 48.1 0 013.48-.4m7.5 0v-.92c0-1.18-.91-2.16-2.09-2.2a51.96 51.96 0 00-3.32 0c-1.18.04-2.09 1.02-2.09 2.2v.92m7.5 0a48.67 48.67 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default List