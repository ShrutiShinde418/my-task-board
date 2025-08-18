const TaskHeader = ({ icon, title, taskLogo, bgColor, iconBgColor }) => {
  return (
    <button
      className={`flex justify-between items-center ${bgColor} p-4 rounded-xl`}
    >
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
  );
};

export default TaskHeader;
