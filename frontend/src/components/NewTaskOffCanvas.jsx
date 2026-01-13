import { useState, useEffect, useId } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTaskSlice } from "../hooks/useTaskSlice.js";
import {
  DELETE,
  iconData,
  POST,
  PUT,
  statusButtons,
} from "../utils/helpers.js";
import { useMutationHandler } from "../hooks/useMutationHandler.js";
import { handleMutation } from "../utils/http.js";
import { useUser } from "../hooks/useUser.js";
import IconChip from "./IconChip.jsx";
import StatusButton from "./StatusButton.jsx";
import saveIcon from "../assets/Done_round_duotone.svg";
import deleteIcon from "../assets/Trash.svg";
import close from "../assets/close_ring_duotone-1.svg";

const NewTaskOffCanvas = () => {
  const id = useId();
  const { closeOffCanvasHandler, tasks } = useTaskSlice();
  const { user, activeBoard } = useUser();
  const client = useQueryClient();

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState();
  const [selectedId, setSelectedId] = useState("btn-inProgress");

  const {
    mutate: createTaskMutation,
    isSuccess: createTaskMutationSuccess,
    error: createTaskError,
  } = useMutationHandler(
    (requestBody) =>
      handleMutation(POST, "/tasks/create", null, {
        name: requestBody.taskTitle,
        description: requestBody.taskDescription,
        status: requestBody.selectedId,
        boardId: requestBody.boardId,
      }),
    "createTask",
    () => {
      client.invalidateQueries(["getUserDetails"]);
    },
    (error) => {
      return error?.response?.data?.error?.message ?? "Failed to create task";
    }
  );

  const {
    mutate: deleteTaskMutation,
    isSuccess: deleteTaskMutationSuccess,
    error: deleteTaskError,
  } = useMutationHandler(
    () => handleMutation(DELETE, "/tasks", tasks?.taskToUpdate?._id),
    "deleteTask",
    () => {
      client.invalidateQueries(["getUserDetails"]);
    },
    (error) => {
      return error?.response?.data?.error?.message ?? "Failed to delete task";
    }
  );

  const {
    mutate: updateTaskMutation,
    isSuccess: updateTaskMutationSuccess,
    error: updateTaskError,
  } = useMutationHandler(
    (requestBody) =>
      handleMutation(PUT, "/tasks", tasks?.taskToUpdate?._id, {
        name: requestBody.taskTitle,
        description: requestBody.taskDescription,
        status: requestBody.selectedId,
        boardId: requestBody.boardId,
      }),
    "updateTask",
    () => {
      client.invalidateQueries(["getUserDetails"]);
    },
    (error) => {
      return error?.response?.data?.error?.message ?? "Failed to update task";
    }
  );

  const submitHandler = (e) => {
    e.preventDefault();

    const payload = {
      taskTitle,
      taskDescription,
      selectedId: selectedId.split("-")[1],
      ...(tasks.taskToUpdate ? {} : { boardId: activeBoard?._id }),
    };

    (tasks.taskToUpdate ? updateTaskMutation : createTaskMutation)(payload);

    closeOffCanvasHandler();
  };

  const deleteTaskHandler = () => {
    if (tasks.taskToUpdate) {
      deleteTaskMutation();
    }
    closeOffCanvasHandler();
  };

  useEffect(() => {
    if (createTaskMutationSuccess) {
      toast.success("Task successfully created", {
        toastId: id,
      });
    }

    if (deleteTaskMutationSuccess) {
      toast.success("Task successfully deleted", {
        toastId: id,
      });
    }

    if (updateTaskMutationSuccess) {
      toast.success("Task successfully updated", {
        toastId: id,
      });
    }

    if (createTaskError || deleteTaskError || updateTaskError) {
      toast.error(createTaskError, {
        toastId: id,
      });
    }
  }, [
    createTaskError,
    id,
    createTaskMutationSuccess,
    deleteTaskMutationSuccess,
  ]);

  useEffect(() => {
    if (tasks.taskToUpdate) {
      setTaskTitle(tasks?.taskToUpdate?.name);
      setTaskDescription(tasks?.taskToUpdate?.description);
      setSelectedId(`btn-${tasks?.taskToUpdate?.status}`);
    }
  }, [tasks, tasks.taskToUpdate]);

  return (
    <div className="p-6 flex flex-col font-custom">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-medium text-2xl">Task Details</h3>
        <button
          type="button"
          className="border border-lightGray rounded-md p-2"
          onClick={closeOffCanvasHandler}
        >
          <img src={close} alt="Close" />
        </button>
      </div>
      <form className="flex flex-col gap-5" onSubmit={submitHandler}>
        <div className="flex flex-col gap-1">
          <label htmlFor="taskName" className="text-gray text-sm">
            Task name
          </label>
          <input
            type="text"
            id="taskName"
            name="taskName"
            placeholder="Enter your task name"
            className="py-2 px-4 border border-gray rounded-md"
            onChange={(e) => setTaskTitle(e.target.value)}
            required={true}
            value={taskTitle}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="taskDescription" className="text-gray text-sm">
            Description
          </label>
          <textarea
            name="taskDescription"
            id="taskDescription"
            cols="30"
            rows="10"
            placeholder="Enter a short description"
            className="py-2 px-4 border border-gray rounded-md resize-none"
            onChange={(e) => setTaskDescription(e.target.value)}
            value={taskDescription}
          ></textarea>
        </div>
        <div>
          <p className="text-gray text-sm">Icon</p>
          <div className="flex gap-3">
            {iconData.map((icon) => (
              <IconChip id={icon.id} key={icon.id} labelContent={icon.emoji} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-gray text-sm">Status</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 w-full">
            {statusButtons.map((btn) => (
              <StatusButton
                id={btn.id}
                key={btn.id}
                title={btn.title}
                imgURL={btn.image}
                bgColor={btn.bgColor}
                setSelectedId={setSelectedId}
                selectedId={selectedId}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-3 items-center text-sm self-end">
          <button
            className="flex gap-1 bg-gray text-white px-6 py-2 rounded-3xl"
            onClick={deleteTaskHandler}
          >
            Delete
            <img src={deleteIcon} alt="Delete" />
          </button>
          <button
            className="flex gap-1 bg-blue text-white px-6 py-2 rounded-3xl"
            type={"submit"}
          >
            Save
            <img src={saveIcon} alt="Save" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskOffCanvas;
