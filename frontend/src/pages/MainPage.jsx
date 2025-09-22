import AddNewTask from "../components/AddNewTask";
import Header from "../components/Header";
import TaskHeader from "../components/TaskHeader";
import { taskHeaders } from "../utils/helpers";
import { useSelector } from "react-redux";
import Modal from "../components/Modal.jsx";
import NewTaskOffCanvas from "../components/NewTaskOffCanvas.jsx";

const MainPage = () => {
  const tasksState = useSelector((state) => state.tasks);

  return (
    <div className="font-custom lg:max-w-lg md:max-w-xl md:mx-auto mx-10 my-10">
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
      <Modal open={tasksState.showOffCanvas} onClose={() => {}}>
        <NewTaskOffCanvas />
      </Modal>
    </div>
  );
};

export default MainPage;
