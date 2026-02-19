import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, token } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // If user is authenticated but doesn't have the right role, 
        // redirect to their appropriate dashboard or home
        if (user?.role === 'voter') return <Navigate to="/dashboard" replace />;
        if (user?.role === 'admin') return <Navigate to="/admin" replace />;
        if (user?.role === 'main_admin') return <Navigate to="/main-admin" replace />;

        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
