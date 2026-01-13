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
    }
  );

  const { setUserState, setActiveBoardHandler } = useUser();
  const { updateTaskStoreHandler } = useTaskSlice();

  useEffect(() => {
    if (userData?.status === 200) {
      const activeBoard = userData?.data?.boards?.find(
        (board) => board._id === userData?.data?.lastVisitedBoard
      );
      setActiveBoardHandler(activeBoard);
      setUserState(userData.data);
      updateTaskStoreHandler(activeBoard?.tasks);
    }
  }, [userData]);

  if (error) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
