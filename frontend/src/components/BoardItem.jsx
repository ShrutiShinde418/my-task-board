import { useQueryClient } from "@tanstack/react-query";
import { MdDeleteOutline } from "react-icons/md";
import { useMutationHandler } from "../hooks/useMutationHandler.js";
import { handleMutation } from "../utils/http.js";
import { DELETE, POST } from "../utils/helpers.js"; // Assuming you might need DELETE or a specific POST route
import { useUser } from "../hooks/useUser.js";
import { useTaskSlice } from "../hooks/useTaskSlice.js";

const BoardItem = ({ board, setSidebarOpen }) => {
  const client = useQueryClient();

  const {
    user: userData,
    activeBoard: selectedBoard,
    setActiveBoardHandler,
  } = useUser();

  const { updateTaskStoreHandler } = useTaskSlice();

  const { mutate: updateBoardMutation } = useMutationHandler(
    (requestBody) =>
      handleMutation(POST, "/update/user", null, {
        boardId: requestBody.boardId,
      }),
    "updateUser",
    () => client.invalidateQueries(["getUserDetails"]),
    (error) => error?.response?.data?.error?.message ?? "Something went wrong",
  );

  const { mutate: deleteBoardMutation } = useMutationHandler(
    (boardId) => handleMutation(DELETE, "/boards", boardId, undefined),
    "deleteBoard",
    () => {
      client.invalidateQueries(["getUserDetails"]);
    },
    (error) => error?.response?.data?.error?.message ?? "Board deletion failed",
  );

  const updateActiveBoardHandler = (boardId) => {
    updateBoardMutation({ boardId });
    const newActiveBoard = userData?.boards?.find((b) => b._id === boardId);
    setActiveBoardHandler(newActiveBoard);
    updateTaskStoreHandler(newActiveBoard?.tasks);
    setSidebarOpen(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${board.name}"?`)) {
      deleteBoardMutation(board._id);
      setSidebarOpen(false);
    }
  };

  return (
    <button
      onClick={() => updateActiveBoardHandler(board._id)}
      className={`w-full flex items-center justify-between group px-3 py-3 rounded-lg transition-all ${
        selectedBoard?._id === board._id
          ? "border-2 border-black"
          : "hover:bg-gray-50 border-2 border-transparent"
      }`}
    >
      <span
        className={`font-medium truncate ${
          selectedBoard?._id === board._id ? "text-gray-900" : "text-gray-600"
        }`}
      >
        {board.name}
      </span>
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-opacity"
      >
        <MdDeleteOutline className="size-6" />
      </button>
    </button>
  );
};

export default BoardItem;
