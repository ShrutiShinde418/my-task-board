import addNewTaskIcon from "../assets/Add_round_duotone.svg";

const AddNewTask = () => {
  return (
    <button
      className={`flex justify-between items-center bg-cream p-4 rounded-xl`}
    >
      <div className="flex items-center gap-5">
        <span className="text-xl p-2 bg-orange rounded-xl">
          <img src={addNewTaskIcon} alt="Add new task" />
        </span>
        <h3 className="font-semibold text-base">Add new task</h3>
      </div>
    </button>
  );
};

export default AddNewTask;
