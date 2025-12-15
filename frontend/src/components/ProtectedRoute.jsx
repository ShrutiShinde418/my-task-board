import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { getUserDetails } from "../utils/http";
import { useUser } from "../hooks/useUser";
import { useTaskSlice } from "../hooks/useTaskSlice.js";

const ProtectedRoute = () => {
  const { data: userData, error } = useFetch(
    ["getUserDetails"],
    () => getUserDetails(),
    {
      retry: false,
    },
  );

  const { setUserState } = useUser();
  const { updateTaskStoreHandler } = useTaskSlice();

  useEffect(() => {
    if (userData?.status === 200) {
      setUserState(userData.data);
      updateTaskStoreHandler(userData?.data?.boards[0]?.tasks);
    }
  }, [userData]);

  if (error) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
