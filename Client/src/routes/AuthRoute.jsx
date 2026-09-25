import { Navigate } from "react-router-dom"
import { Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Loader from "../components/Loader"

function AuthRoute({ children }) {

    const { user, authCheckLoading } = useAuth()

    if (authCheckLoading) {
        return <div className="grid h-[70vh] place-content-center"><Loader /></div>
    }

    if (user) {
        return <Navigate to="/profile" replace />
    }

    return <Outlet />

}

export default AuthRoute