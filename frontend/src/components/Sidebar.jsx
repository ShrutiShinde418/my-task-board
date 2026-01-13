import { useEffect, useId, useState } from "react";
import { IoGrid, IoCloseCircle } from "react-icons/io5";
import { FaCirclePlus } from "react-icons/fa6";
import { LuMenu } from "react-icons/lu";
import { useUser } from "../hooks/useUser.js";
import { useMutationHandler } from "../hooks/useMutationHandler.js";
import { handleMutation } from "../utils/http.js";
import { POST } from "../utils/helpers.js";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTaskSlice } from "../hooks/useTaskSlice.js";

const MultiBoardTaskManager = () => {
  const {
    user: userData,
    activeBoard: selectedBoard,
    setActiveBoardHandler,
  } = useUser();
  const client = useQueryClient();
  const { updateTaskStoreHandler } = useTaskSlice();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const id = useId();

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

  const { mutate: updateBoardMutation } = useMutationHandler(
    (requestBody) =>
      handleMutation(POST, "/update/user", null, {
        boardId: requestBody.boardId,
      }),
    "updateUser",
    () => {
      client.invalidateQueries(["getUserDetails"]);
    },
    (error) => {
      return error?.response?.data?.error?.message ?? "Something went wrong";
    },
  );

  const updateActiveBoardHandler = (boardId) => {
    updateBoardMutation({ boardId });
    const newActiveBoard = userData?.boards?.find(
      (board) => board._id === boardId,
    );
    setActiveBoardHandler(newActiveBoard);
    updateTaskStoreHandler(newActiveBoard?.tasks);
    setSidebarOpen(false);
  };

  const createNewBoardHandler = () => {
    createBoardMutation();
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (createBoardMutationSuccess && createBoardMutationData?.data?.success) {
      toast.success("Board successfully created", {
        toastId: id,
      });

      updateActiveBoardHandler(createBoardMutationData?.data?.boardId);
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
  ]);

  return (
    <>
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200"
        aria-label="Open menu"
      >
        <LuMenu className="w-6 h-6 text-gray-700" />
      </button>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <IoCloseCircle className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center">
              <IoGrid className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">TaskFlow</h1>
              <p className="text-xs text-gray-500">Multi-board manager</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
              Your Boards
            </p>
            {userData?.boards.map((board) => {
              return (
                <button
                  key={board._id}
                  onClick={() => {
                    updateActiveBoardHandler(board._id);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    selectedBoard?._id === board._id
                      ? "border-2"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`font-medium ${
                      selectedBoard?._id === board._id
                        ? "text-gray-900"
                        : "text-gray-600"
                    }`}
                  >
                    {board.name}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            className="w-full mt-4 flex items-center gap-3 px-3 py-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all"
            onClick={createNewBoardHandler}
          >
            <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center">
              <FaCirclePlus className="w-5 h-5 text-gray-600" />
            </div>
            <span className="font-medium text-gray-600">Create New Board</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MultiBoardTaskManager;
