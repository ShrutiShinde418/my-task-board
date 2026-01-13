import { useDispatch, useSelector } from "react-redux";
import { setUser, setActiveBoard } from "../store/userSlice.js";

export const useUser = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const activeBoard = useSelector((state) => state.user.activeBoard);

  const setUserState = (user) => {
    dispatch(setUser(user));
  };

  const setActiveBoardHandler = (board) => {
    dispatch(setActiveBoard(board));
  };

  return {
    user,
    activeBoard,
    setUserState,
    setActiveBoardHandler,
  };
};
