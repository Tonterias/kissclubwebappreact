import type {ReactNode} from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import Loader from "./loader.tsx";

type ProtectedRouteProps = {
    children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const auth = useAuth();

    if (!auth) {
        return <Loader loading={true} color="red" />;
    }

    const { user, loading } = auth;

    if (loading) {
        return <Loader loading={loading} color="red" />;
    }

    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    return <>{children}</>;
};


export default ProtectedRoute;
