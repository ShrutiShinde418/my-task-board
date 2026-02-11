import { useEffect, useId } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useFetch } from "../hooks/useFetch";
import { getUserDetails, handleMutation } from "../utils/http";
import { useUser } from "../hooks/useUser";
import { useTaskSlice } from "../hooks/useTaskSlice.js";
import { useMutationHandler } from "../hooks/useMutationHandler.js";
import { POST } from "../utils/helpers.js";
import { toast } from "react-toastify";

const ProtectedRoute = () => {
  const client = useQueryClient();
  const id = useId();

  const { data: userData, error } = useFetch(
    ["getUserDetails"],
    () => getUserDetails(),
    {
      retry: false,
    },
  );

  const {
    mutate: createBoardMutation,
    isSuccess: createBoardMutationSuccess,
    data: createBoardMutationData,
    error: createBoardError,
  } = useMutationHandler(
    () => handleMutation(POST, "/boards", null, undefined),
    "createBoard",
    () => {
      client.invalidateQueries(["getUserDetails"]);
    },
    (error) => {
      return error?.response?.data?.error?.message ?? "Failed to create board";
    },
  );

  const { setUserState, setActiveBoardHandler } = useUser();
  const { updateTaskStoreHandler } = useTaskSlice();

  useEffect(() => {
    if (userData?.status === 200) {
      if (userData?.data?.boards?.length === 0) {
        createBoardMutation();
      }

      let activeBoard = userData?.data?.boards?.find(
        (board) => board._id === userData?.data?.lastVisitedBoard,
      );

      if (!activeBoard && userData?.data?.boards?.length > 0) {
        activeBoard = userData.data.boards[0];
      }
      setActiveBoardHandler(activeBoard);
      setUserState(userData.data);
      updateTaskStoreHandler(activeBoard?.tasks);
    }
  }, [userData, createBoardMutation]);

  useEffect(() => {
    if (createBoardMutationSuccess && createBoardMutationData?.data?.success) {
      toast.success("Board successfully created", {
        toastId: id,
      });

      setActiveBoardHandler(createBoardMutationData?.data?.boardId);
      updateTaskStoreHandler([]);
    }

    if (createBoardError) {
      toast.error(createBoardError, {
        toastId: id,
      });
    }
  }, [
    createBoardError,
    createBoardMutationData?.data?.boardId,
    createBoardMutationData?.data?.success,
    createBoardMutationSuccess,
    id,
    setActiveBoardHandler,
    setUserState,
    updateTaskStoreHandler,
  ]);

  if (error) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
