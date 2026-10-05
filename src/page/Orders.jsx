import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='#f3f4f6'/><circle cx='30' cy='30' r='6' fill='#d1d5db'/><path d='M14 66l18-24 12 15 9-10 13 19z' fill='#d1d5db'/></svg>"
  )

// Hàm tạo màu sắc huy hiệu trạng thái chuyên nghiệp
const statusBadgeStyle = (status) => {
  switch (status) {
    case 'Delivered':
      return 'text-emerald-700 bg-emerald-50 border-emerald-200'
    case 'Shipped':
    case 'Out for delivery':
      return 'text-sky-700 bg-sky-50 border-sky-200'
    case 'Packing':
      return 'text-amber-700 bg-amber-50 border-amber-200'
    default:
      return 'text-orange-700 bg-orange-50 border-orange-200'
  }
}

// Nhãn trạng thái hiển thị tiếng Việt. Value gửi backend giữ nguyên tiếng Anh
// để không phá vỡ logic/API đã lưu trong database.
const STATUS_OPTIONS = [
  { value: 'Order Placed', label: 'Đã đặt hàng' },
  { value: 'Packing', label: 'Đang đóng gói' },
  { value: 'Shipped', label: 'Đã giao vận chuyển' },
  { value: 'Out for delivery', label: 'Đang giao hàng' },
  { value: 'Delivered', label: 'Đã giao thành công' },
]

const formatVND = (value) => {
  const num = Number(value)
  if (isNaN(num)) return value
  return num.toLocaleString('vi-VN') + ' ₫'
}

const Orders = ({ token, backendUrl }) => {
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(false)

  const rawUrl = backendUrl || import.meta.env.VITE_BACKEND_URL || ''
  const baseUrl = typeof rawUrl === 'string' ? rawUrl.replace(/\/$/, '') : ''

  const loadOrderData = async () => {
    if (!token) return null
    if (!baseUrl) return null

    try {
      setLoading(true)
      const response = await axios.post(
        `${baseUrl}/api/order/list`,
        {},
        { headers: { token } }
      )

      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            item['orderId'] = order._id
            allOrdersItem.push(item)
          })
        })
        setOrderItems(allOrdersItem.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log('Lỗi gọi API đơn hàng:', error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const statusHandler = async (event, orderId) => {
    if (!baseUrl) return

    try {
      const response = await axios.post(
        `${baseUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { token } }
      )
      if (response.data.success) {
        await loadOrderData()
        toast.success('Đã cập nhật trạng thái đơn hàng thành công!')
      }
    } catch (error) {
      console.log('Lỗi cập nhật trạng thái:', error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token, backendUrl])

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Tiêu đề trang & Thống kê số lượng */}
      <div className='flex items-center justify-between mb-8 pb-4 border-b border-gray-100'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-gray-900'>
            Quản Lý Đơn Hàng
          </h1>
          <p className='text-sm text-gray-500 mt-1'>
            Theo dõi, cập nhật trạng thái và quản lý toàn bộ đơn hàng hệ thống.
          </p>
        </div>
        {orderItems.length > 0 && (
          <span className='px-4 py-1.5 text-sm font-semibold text-orange-700 bg-orange-50 border border-orange-200 rounded-full shadow-sm'>
            📦 {orderItems.length} sản phẩm
          </span>
        )}
      </div>

      {!token ? (
        <div className='py-24 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white shadow-sm'>
          <p className='text-4xl mb-3'>🔐</p>
          <p className='text-gray-600 font-medium'>Vui lòng đăng nhập tài khoản quản trị.</p>
        </div>
      ) : loading ? (
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='h-32 bg-gray-100 rounded-3xl animate-pulse' />
          ))}
        </div>
      ) : orderItems.length === 0 ? (
        <div className='py-24 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white shadow-sm'>
          <p className='text-4xl mb-3'>🛒</p>
          <p className='text-gray-500 font-medium'>Hiện tại chưa có đơn hàng nào trong hệ thống.</p>
        </div>
      ) : (
        <div className='space-y-5'>
          {orderItems.map((item, index) => (
            <div
              key={index}
              className='group relative bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-xl shadow-gray-100/80 hover:shadow-2xl hover:border-orange-200 transition-all duration-300'
            >
              <div className='grid grid-cols-1 lg:grid-cols-[auto_1fr_1fr_auto_auto] gap-5 lg:gap-8 items-center'>
                
                {/* 1. Hình ảnh sản phẩm */}
                <div className='relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shrink-0 w-20 h-24 sm:w-24 sm:h-28 mx-auto lg:mx-0'>
                  <img
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                    src={item.image?.[0] || PLACEHOLDER}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = PLACEHOLDER
                    }}
                  />
                </div>

                {/* 2. Thông tin chi tiết sản phẩm & ngày đặt */}
                <div className='space-y-2 min-w-0 text-center lg:text-left'>
                  <h3 className='font-semibold text-gray-900 text-base sm:text-lg truncate'>
                    {item.name}
                  </h3>
                  <div className='flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs'>
                    <span className='px-3 py-1 font-medium bg-gray-100 text-gray-700 rounded-full'>
                      Số lượng: <strong className='text-gray-900'>{item.quantity}</strong>
                    </span>
                    <span className='px-3 py-1 font-medium bg-gray-100 text-gray-700 rounded-full'>
                      Size: <strong className='text-gray-900'>{item.size}</strong>
                    </span>
                  </div>
                  <p className='text-xs text-gray-400 pt-1'>
                    🕒 Ngày đặt: {new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </p>
                </div>

                {/* 3. Giá tiền & Thanh toán */}
                <div className='text-center lg:text-left space-y-1 bg-gray-50/70 lg:bg-transparent p-3 lg:p-0 rounded-2xl'>
                  <p className='text-lg font-bold text-orange-600'>
                    {formatVND(item.price * item.quantity)}
                  </p>
                  <p className='text-xs text-gray-600'>
                    PTTT: <span className='font-medium text-gray-800'>{item.paymentMethod}</span>
                  </p>
                  <p className='text-xs'>
                    Trạng thái:{' '}
                    <span
                      className={`inline-block font-semibold px-2 py-0.5 rounded-md ${
                        item.payment ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'
                      }`}
                    >
                      {item.payment ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </p>
                </div>

                {/* 4. Dropdown đổi trạng thái đơn hàng */}
                <div className='flex flex-col items-center lg:items-end justify-center'>
                  <label className='block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5'>
                    Cập nhật trạng thái
                  </label>
                  <div className='relative'>
                    <select
                      onChange={(event) => statusHandler(event, item.orderId)}
                      value={item.status}
                      className={`w-full sm:w-48 p-2.5 text-xs sm:text-sm font-semibold border rounded-xl shadow-sm outline-none cursor-pointer transition-all duration-200 focus:ring-2 focus:ring-orange-500 ${statusBadgeStyle(
                        item.status
                      )}`}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 5. Nút làm mới */}
                <div className='flex items-center justify-center pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100'>
                  <button
                    onClick={loadOrderData}
                    className='w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 shadow-sm'
                    title='Làm mới dữ liệu'
                  >
                    <span>🔄</span> Làm mới
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders