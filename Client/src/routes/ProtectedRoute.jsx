import { Navigate, useLocation } from "react-router-dom"
import { Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Loader from "../components/Loader"

function ProtectedRoute() {

    const { user, authCheckLoading } = useAuth()
    const location = useLocation()

    if (authCheckLoading) {
        return <div className="grid h-[70vh] place-content-center"><Loader /></div>
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <Outlet />

}

export default ProtectedRoute