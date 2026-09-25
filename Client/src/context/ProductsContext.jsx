import { useState, createContext, useEffect, useContext } from "react"
import { useOrders } from "./OrdersContext"

const ProductsContext = createContext()

export const ProductsProvider = ({ children }) => {

  const API_URL = import.meta.env.VITE_API_URL
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { getReviews } = useOrders()

  const getItems = async () => {

    if (!navigator.onLine) {
      setError('No internet Connection !')
      setLoading(false)
      return
    }

    try {

      const res = await fetch(API_URL + '/api/products')
      const data = await res.json()

      setItems(data || [])
      setError(null)

    } catch (err) {
      console.log(err.message)
      setError("Unable to fetch !")
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    getItems()
  }, [])

  return (
    <ProductsContext.Provider value={{
      items,
      loading,
      setLoading,
      error,
      getItems
    }}>
      {children}
    </ProductsContext.Provider>
  )

}

export const useProducts = () => {
  return useContext(ProductsContext)
}

// https://corebe.up.railway.app/api/products
// https://69eb2c9497482ad5c5273fa1.mockapi.io/api/products
// http://localhost:3000/api/products
// http://localhost:3000/products
