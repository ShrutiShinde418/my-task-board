import { useSelector, useDispatch } from "react-redux";
import { openOffCanvas, closeOffCanvas } from "../store/newTaskSlice.js";

export const useTaskSlice = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);

  const closeOffCanvasHandler = () => {
    dispatch(closeOffCanvas());
  };

  const openOffCanvasHandler = () => {
    dispatch(openOffCanvas());
  };

  return {
    tasks,
    closeOffCanvasHandler,
    openOffCanvasHandler,
  };
};
