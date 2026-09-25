import { createContext, useContext, useEffect, useState } from "react"
import { toast } from 'sonner'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const API_URL = import.meta.env.VITE_API_URL
    const [authCheckLoading, setAuthCheckLoading] = useState(true)
    const [loginLoading, setLoginLoading] = useState(false)
    const [registerLoading, setRegisterLoading] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(API_URL + '/api/auth/check', {
                    credentials: 'include'
                })

                const data = await res.json()
                setUser(data.user ?? null)

            } catch (err) {
                setUser(null)
            } finally {
                setAuthCheckLoading(false)
            }
        }
        checkAuth()
    }, [])

    const registerUser = async (formData) => {
        try {
            setRegisterLoading(true)
            const res = await fetch(API_URL + '/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData
                })
            })

            const data = await res.json()

            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

        } catch (err) {
            toast.error('Something went wrong !')
        } finally {
            setRegisterLoading(false)
        }
    }

    const loginUser = async (formData) => {
        try {
            setLoginLoading(true)
            const res = await fetch(API_URL + '/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData
                })
            })

            const data = await res.json()

            if (data.success) {
                setUser(data.user)
                // toast.success(data.message)
            } else {
                setUser(null)
                toast.error(data.message)
            }

        } catch (err) {
            toast.error('Something went wrong !')
        } finally {
            setLoginLoading(false)
        }
    }

    const logoutUser = async () => {
        try {
            const res = await fetch(API_URL + '/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            })

            if (res.ok) {
                setUser(null)
            }

        } catch (err) {
            toast.error('Something went wrong !')
        }
    }


    return (
        <AuthContext.Provider value={{ user, setUser, authCheckLoading, registerUser, loginUser, logoutUser, loginLoading, registerLoading }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    return useContext(AuthContext)
}