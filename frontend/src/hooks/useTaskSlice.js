import { useSelector, useDispatch } from "react-redux";
import {
  openOffCanvas,
  closeOffCanvas,
  addTask,
  updateTaskStore,
  setTaskToUpdate,
} from "../store/tasksSlice.js";

export const useTaskSlice = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);

  const closeOffCanvasHandler = () => {
    dispatch(closeOffCanvas());
  };

  const openOffCanvasHandler = () => {
    dispatch(openOffCanvas());
  };

  const addNewTaskHandler = (type, task) => {
    dispatch(addTask({ type, task }));
  };

  const updateTaskStoreHandler = (tasks) => {
    dispatch(updateTaskStore(tasks));
  };

  const setTaskToUpdateHandler = (task) => {
    dispatch(setTaskToUpdate(task));
  };

  return {
    tasks,
    closeOffCanvasHandler,
    openOffCanvasHandler,
    addNewTaskHandler,
    updateTaskStoreHandler,
    setTaskToUpdateHandler,
  };
};
