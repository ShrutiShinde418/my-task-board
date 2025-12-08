import { useSelector, useDispatch } from "react-redux";
import {
  openOffCanvas,
  closeOffCanvas,
  addTask,
} from "../store/newTaskSlice.js";

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

  return {
    tasks,
    closeOffCanvasHandler,
    openOffCanvasHandler,
    addNewTaskHandler,
  };
};
