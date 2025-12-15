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
  const { user: data } = useUser();
  const client = useQueryClient();

  const [editTaskBoard, setEditTaskBoard] = useState(false);
  const [taskBoardName, setTaskBoardName] = useState("");

  const { mutate, error } = useMutationHandler(
    (variables) =>
      handleMutation(PUT, "/boards", data?.user?.boards[0]?._id, {
        name: variables.name,
      }),
    "updateBoardName",
    () => {
      client.invalidateQueries(["getUserDetails"]);
    },
  );

  const editTaskBoardHandler = () => {
    setEditTaskBoard((prevState) => {
      const newState = !prevState;

      if (!newState && taskBoardName.trim() !== "") {
        mutate({ name: taskBoardName });
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
            placeholder={data?.user?.boards[0]?.name}
            onChange={(e) => setTaskBoardName(e.target.value)}
            value={taskBoardName}
          />
        ) : (
          <h1 className="text-4xl font-normal">
            {taskBoardName || data?.user?.boards[0]?.name}
          </h1>
        )}
        <button type="button" onClick={editTaskBoardHandler}>
          <img src={EditIcon} alt="Edit" />
        </button>
      </header>
      <div className="ml-14 mt-4">
        <h2 className="font-normal">{data?.user?.boards[0]?.description}</h2>
      </div>
    </>
  );
};

export default Header;
