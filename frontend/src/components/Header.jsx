import { useEffect, useId, useState } from "react";
import { toast } from "react-toastify";
import { useUser } from "../hooks/useUser.js";
import { useMutationHandler } from "../hooks/useMutationHandler.js";
import { handleMutation } from "../utils/http.js";
import { useQueryClient } from "@tanstack/react-query";
import { PUT } from "../utils/helpers.js";
import logo from "../assets/Logo.svg";
import EditIcon from "../assets/Edit_duotone.svg";

const Header = () => {
  const id = useId();
  const { user, activeBoard } = useUser();
  const client = useQueryClient();

  const [editTaskBoard, setEditTaskBoard] = useState(false);
  const [taskBoardName, setTaskBoardName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(
    activeBoard?.description || ""
  );

  const { mutate, error, isPending } = useMutationHandler(
    (variables) =>
      handleMutation(PUT, "/boards", activeBoard?._id, {
        [variables.property]: variables.propertyValue,
      }),
    "updateBoardName",
    () => {
      client.invalidateQueries(["getUserDetails"]);
    }
  );

  const handleSave = () => {
    if (description !== activeBoard?.description) {
      mutate({ property: "description", propertyValue: description });
      setIsEditing(false);
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setDescription(activeBoard?.description || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const editTaskBoardHandler = () => {
    setEditTaskBoard((prevState) => {
      const newState = !prevState;

      if (!newState && taskBoardName.trim() !== "") {
        mutate({ property: "name", propertyValue: taskBoardName });
      }

      return newState;
    });
  };

  useEffect(() => {
    if (error?.response?.data?.error?.message) {
      toast.error(error?.response?.data?.error?.message, {
        toastId: id,
      });
    }
  }, [error?.response?.data?.error?.message, id]);

  return (
    <>
      <header className="flex items-center gap-3">
        <img src={logo} alt="Task Board Logo" />
        {editTaskBoard ? (
          <input
            type="text"
            className="text-4xl font-normal w-1/2"
            placeholder={activeBoard?.name}
            onChange={(e) => setTaskBoardName(e.target.value)}
            value={taskBoardName}
          />
        ) : (
          <h1 className="text-4xl font-normal">
            {taskBoardName || activeBoard?.name}
          </h1>
        )}
        <button type="button" onClick={editTaskBoardHandler}>
          <img src={EditIcon} alt="Edit" />
        </button>
      </header>
      <div className="ml-14 mt-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={activeBoard?.description || ""}
              className="p-2"
              autoFocus
              disabled={isPending}
            />
            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-5 py-2 bg-blue text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              disabled={isPending}
              className="px-4 py-2 bg-gray text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        ) : (
          <h2
            className="font-normal cursor-pointer hover:bg-gray-100 rounded px-1 -ml-1"
            onClick={() => setIsEditing(true)}
          >
            {activeBoard?.description || "Click to add description"}
          </h2>
        )}
      </div>
    </>
  );
};

export default Header;
