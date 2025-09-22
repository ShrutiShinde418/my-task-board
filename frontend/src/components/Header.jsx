import logo from "../assets/Logo.svg";
import EditIcon from "../assets/Edit_duotone.svg";
import { useState } from "react";

const Header = () => {
  const [editTaskBoard, setEditTaskBoard] = useState(false);
  const [taskBoardName, setTaskBoardName] = useState("");

  return (
    <>
      <header className="flex items-center gap-3">
        <img src={logo} alt="Task Board Logo" />
        {editTaskBoard ? (
          <input
            type="text"
            className="text-4xl font-normal w-1/2"
            placeholder="My Task Board"
            onChange={(e) => setTaskBoardName(e.target.value)}
            value={taskBoardName}
          />
        ) : (
          <h1 className="text-4xl font-normal">
            {taskBoardName || "My Task Board"}
          </h1>
        )}
        <button type="button" onClick={() => setEditTaskBoard(!editTaskBoard)}>
          <img src={EditIcon} alt="Edit" />
        </button>
      </header>
      <div className="ml-14 mt-4">
        <h2 className="font-normal">Tasks to keep organised</h2>
      </div>
    </>
  );
};

export default Header;
