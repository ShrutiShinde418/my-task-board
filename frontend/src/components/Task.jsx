import { useEffect, useId, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMutationHandler } from "../hooks/useMutationHandler.js";
import { handleMutation } from "../utils/http.js";
import { PUT } from "../utils/helpers.js";
import { toast } from "react-toastify";
import { useTaskSlice } from "../hooks/useTaskSlice.js";

const Task = ({ task }) => {
  const id = useId();
  const client = useQueryClient();
  const [isChecked, setIsChecked] = useState(false);
  const { openOffCanvasHandler, setTaskToUpdateHandler } = useTaskSlice();

  const updateTaskHandler = (task) => {
    setTaskToUpdateHandler(task);
    openOffCanvasHandler();
  };

  const { mutate, error } = useMutationHandler(
    () =>
      handleMutation(PUT, "/tasks", task._id, {
        status: isChecked ? "completed" : task.status,
      }),
    "updateTask",
    () => {
      client.invalidateQueries(["getUserDetails"]);
    },
    (error) => {
      return error?.response?.data?.error?.message ?? "Failed to update task";
    },
  );

  const updateTaskState = () => {
    setIsChecked((prevState) => {
      const newState = !prevState;

      if (
        newState &&
        (task.status !== "wontDo" || task.status === "completed")
      ) {
        mutate();
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
    <li className={`flex items-center gap-3`}>
      <input
        type="checkbox"
        name="task"
        id="task"
        className={`border-gray w-3.5 h-3.5`}
        onChange={updateTaskState}
        checked={isChecked || task.status === "completed"}
      />
      <button type="button" onClick={() => updateTaskHandler(task)}>
        <p>{task.name}</p>
      </button>
    </li>
  );
};

export default Task;
