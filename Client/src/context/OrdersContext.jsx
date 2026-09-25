import { useState, createContext, useEffect, useContext } from "react"
import { useAuth } from "./AuthContext"

import { toast } from "sonner"

export const OrdersContext = createContext()

export const OrdersProvider = ({ children }) => {

  const API_URL = import.meta.env.VITE_API_URL
  const [orders, setOrders] = useState([])
  const [reviews, setReviews] = useState([])
  const [orderStatus, setOrderStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orderStatusLoading, setOrderStatusLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewStatus, setReviewStatus] = useState({})
  const [reviewStatusLoading, setReviewStatusLoading] = useState(true)
  const { user } = useAuth()


  const getOrders = async () => {
    try {
      const res = await fetch(API_URL + '/api/orders', {
        credentials: 'include'
      })
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (err) {
      console.log(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getOrderStatus = async (orderId) => {
    try {
      const res = await fetch(API_URL + `/api/orders/${orderId}`, {
        credentials: 'include'
      })

      const data = await res.json()

      if (data.success) {
        setOrderStatus(data.order)
      } else {
        setOrderStatus(null)
      }

    } catch (err) {
      console.error(err.message)
      toast.error('Somthing went wrong !')
    } finally {
      setOrderStatusLoading(false)
    }
  }

  const cancelOrder = async (orderId, product) => {
    try {
      setOrders(prev =>
        prev.map(order => {
          if (order.orderId === orderId) {
            let reductAmount
            let total = order.totalAmount
            return {
              ...order,
              items: order.items.map(item => {
                if (item.product._id === product && item.orderStatus === 'processing') {
                  reductAmount = (item.price * item.quantity)
                  return { ...item, orderStatus: 'cancelled' }
                }
                return item
              }),
              totalAmount: total - reductAmount
            }
          }
          return order
        })
      )


      const res = await fetch(API_URL + `/api/orders/${orderId}/cancel/${product}`, {
        method: 'PATCH',
        credentials: 'include'
      })

      const data = await res.json()

      if (data.success) {
        toast.success(data.message)

      } else {
        toast.error(data.message)
      }

    } catch (err) {
      console.error(err.message)
      toast.error('Somthing went wrong !')
    } finally {
      setLoading(false)
    }
  }

  // const returnOrder = async (orderId, product) => {
  //   try {
  //     setOrders(prev =>
  //       prev.map(order => {
  //         if (order.orderId === orderId) {
  //           return {
  //             ...order,
  //             items: order.items.map(item => {
  //               if (item.product._id === product && item.orderStatus === 'delivered') {
  //                 return { ...item, orderStatus: 'return requested' }
  //               }
  //               return item
  //             })
  //           }
  //         }
  //         return order
  //       })
  //     )


  //     const res = await fetch(API_URL + `/api/orders/${orderId}/return/${product}`, {
  //       method: 'PATCH',
  //       credentials: 'include'
  //     })

  //     const data = await res.json()

  //     if (data.success) {
  //       toast.success(data.message)

  //     } else {
  //       toast.error(data.message)
  //     }

  //   } catch (err) {
  //     console.error(err.message)
  //     toast.error('Somthing went wrong !')
  //   } finally {
  //     setLoading(false)
  //   }
  // }


  const returnOrder = async (orderId, product) => {
    try {
      setOrders(prev =>
        prev.map(order => {
          if (order.orderId === orderId) {
            return {
              ...order,
              items: order.items.map(item => {
                if (item.product._id === product && item.orderStatus === 'delivered') {
                  return { ...item, returnStatus: 'requested' }
                }
                return item
              })
            }
          }
          return order
        })
      )

      const res = await fetch(API_URL + `/api/orders/${orderId}/return/${product}`, {
        method: 'PATCH',
        credentials: 'include'
      })

      const data = await res.json()

      if (data.success) {
        toast.success(data.message)

      } else {
        toast.error(data.message)
      }

    } catch (err) {
      console.error(err.message)
      toast.error('Somthing went wrong !')
    } finally {
      setLoading(false)
    }
  }


  const getReviews = async (product) => {
    try {
      const res = await fetch(API_URL + `/api/reviews/${product}`)
      const data = await res.json()
      setReviews(data.reviews || [])
    } catch (err) {
      console.log(err.message)
    } finally {
      setReviewsLoading(false)
    }
  }


  const review = async (details) => {
    try {
      const res = await fetch(API_URL + `/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...details
        })
      })

      const data = await res.json()

      if (res.status === 409) {
        toast.info(data.message)
      }

      if (data.success) {
        toast.success(data.message)
        isReviewed()
      }

    } catch (err) {
      console.log(err.message)
      toast.error('Somthing went wrong !')
    }
  }


  const isReviewed = async () => {
    try {
      const res = await fetch(API_URL + `/api/review/check`, {
        credentials: 'include'
      })
      const data = await res.json()

      if (res.ok) {
        setReviewStatus(data.status)
      }

    } catch (err) {
      console.error(err.message)
    } finally {
      setReviewStatusLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    isReviewed()
  }, [orders])

  useEffect(() => {
    if (!user) return
    getOrders()
  }, [user])

  return (
    <OrdersContext.Provider value={{ orders, loading, getOrders, getOrderStatus, orderStatus, orderStatusLoading, cancelOrder, review, reviews, getReviews, reviewsLoading, reviewStatus, reviewStatusLoading, returnOrder }}>
      {children}
    </OrdersContext.Provider>
  )

}

export const useOrders = () => {
  return useContext(OrdersContext);
}

// https://69eb2c9497482ad5c5273fa1.mockapi.io/api/products