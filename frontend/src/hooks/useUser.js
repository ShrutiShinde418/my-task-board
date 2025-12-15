import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice.js";

export const useUser = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const setUserState = (user) => {
    dispatch(setUser(user));
  };

  return {
    user,
    setUserState,
  };
};
