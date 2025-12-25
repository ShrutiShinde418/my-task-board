import Task from "./Task.jsx";

const TaskHeader = ({ icon, title, taskLogo, bgColor, iconBgColor, tasks }) => {
  return (
    <div className={`flex flex-col ${bgColor} p-4 rounded-xl`}>
      <button className={`flex justify-between items-center`}>
        <div className="flex items-center gap-5">
          <span className="text-xl p-2 bg-white rounded-xl">{icon}</span>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <div>
          {taskLogo && (
            <img
              src={taskLogo}
              alt={title}
              className={`p-2 ${iconBgColor} rounded-xl`}
            />
          )}
        </div>
      </button>
      {tasks?.length > 0 && (
        <ul className={`flex flex-col gap-1 mt-4 ml-3`}>
          {tasks?.map((task) => (
            <Task key={task._id} task={task} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskHeader;
