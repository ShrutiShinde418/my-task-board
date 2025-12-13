import { Navigate, Outlet } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.js";
import { getUserDetails } from "../utils/http.js";

const ProtectedRoute = () => {
  const { data, error } = useFetch(["getUserDetails"], () => getUserDetails(), {
    retry: false,
  });

  return error ? <Navigate to={"/"} replace={true} /> : <Outlet />;
};

export default ProtectedRoute;
