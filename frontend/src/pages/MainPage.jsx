import AddNewTask from "../components/AddNewTask";
import Header from "../components/Header";
import TaskHeader from "../components/TaskHeader";
import { taskHeaders } from "../utils/helpers";

const MainPage = () => {
  return (
    <div className="font-custom max-w-lg mx-auto my-10">
      <Header />
      <main className="mt-5 flex flex-col gap-5">
        {taskHeaders.map((taskHeader) => (
          <TaskHeader
            icon={taskHeader.emoji}
            key={taskHeader.id}
            title={taskHeader.title}
            taskLogo={taskHeader.icon}
            bgColor={taskHeader.bgColor}
            iconBgColor={taskHeader.iconBgColor}
          />
        ))}
        <AddNewTask />
      </main>
    </div>
  );
};

export default MainPage;
