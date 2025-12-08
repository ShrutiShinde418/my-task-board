const Task = ({ taskTitle }) => {
  return (
    <li className={`flex items-center gap-3`}>
      <input
        type="checkbox"
        name="task"
        id="task"
        className={`border-gray w-3.5 h-3.5`}
      />
      <p>{taskTitle}</p>
    </li>
  );
};

export default Task;
